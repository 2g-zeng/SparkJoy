import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
stories_table = dynamodb.Table('SparkJoyStories')

def get_story_by_id(story_id, token=None):
    """
    Retrieve a specific story from DynamoDB by its ID
    
    Parameters:
    - story_id: The unique identifier of the story to retrieve
    - token: User authentication token (optional, for security validation)
    
    Returns:
    - The story object if found, None otherwise
    """
    try:
        # Query the table for the specific story
        response = stories_table.query(
            KeyConditionExpression=Key('story_id').eq(story_id)
        )
        
        # Check if any items were found
        if 'Items' in response and len(response['Items']) > 0:
            story_item = response['Items'][0]
            
            # If token is provided, validate it matches the story's token
            if token and story_item.get('user_token') != token:
                print(f"Token mismatch for story ID: {story_id}")
                return None
            
            # Parse the stored story content (which is a JSON string)
            story_content = json.loads(story_item['story_content'])
            return story_content
            
        else:
            print(f"No story found with ID: {story_id}")
            return None
            
    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        raise e
    except Exception as e:
        print(f"Error retrieving story: {str(e)}")
        raise e

def lambda_handler(event, context):
    try:
        # Handle CORS preflight requests
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': ''
            }
            
        # Parse the request body
        if isinstance(event, dict) and 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event

        story_id = body.get('storyId')
        token = body.get('token')
        
        # Extract token from Authorization header if present
        if not token and 'headers' in event and event['headers'].get('Authorization'):
            auth_header = event['headers'].get('Authorization')
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]  # Remove 'Bearer ' prefix
        
        # Validate required fields
        if not story_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': 'Story ID is required'
                })
            }

        # Get story from DynamoDB
        story = get_story_by_id(story_id, token)
        
        if not story:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': 'Story not found'
                })
            }

        # Return the story
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': True,
                'story': story
            })
        }

    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': False,
                'error': 'Database error'
            })
        }
    except Exception as e:
        print(f"Error processing request: {str(e)}")  # This will show in CloudWatch
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': False,
                'error': str(e)  # Including actual error for debugging
            })
        }
