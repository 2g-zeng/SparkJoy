import json
import uuid
from datetime import datetime
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SparkJoyStories')

def save_story(token, story, username=None):
    """
    Save a story to DynamoDB with user token and username
    
    Parameters:
    - token: User authentication token
    - story: Story object to be saved
    - username: Username associated with the story (optional)
    
    Returns:
    - story_id: The ID of the saved story
    """
    try:
        # Generate a story ID if not present
        story_id = story.get('id')
        if not story_id:
            story_id = str(uuid.uuid4())
            story['id'] = story_id
        
        # Add timestamps
        current_time = datetime.utcnow().isoformat() + 'Z'
        if 'createdAt' not in story:
            story['createdAt'] = current_time
        story['savedAt'] = current_time
        
        # Prepare the item to save
        item = {
            'story_id': story_id,
            'user_token': token,
            'title': story.get('title', 'Untitled Story'),
            'story_content': json.dumps(story),
            'created_at': story['createdAt'],
            'saved_at': story['savedAt']
        }
        
        # Add username if provided
        if username:
            item['username'] = username
        
        # Save to DynamoDB
        table.put_item(Item=item)
        
        return story_id
    except Exception as e:
        print(f"Error saving story: {str(e)}")
        raise e

def lambda_handler(event, context):
    """
    Lambda handler for SaveStory endpoint
    
    Processes the incoming API Gateway request, saves the story to DynamoDB,
    and returns a response with proper CORS headers.
    """
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
            
        # Extract token, story, and username
        token = body.get('token')
        story = body.get('story')
        username = body.get('username')
        
        # Validate required fields
        if not token:
            return {
                'statusCode': 401,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': 'Authentication token required'
                })
            }
        
        if not story:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': 'Story content required'
                })
            }
            
        # Save the story
        story_id = save_story(token, story, username)
        
        # Return successful response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': True,
                'message': 'Story saved successfully',
                'story_id': story_id
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
        print(f"Error processing save story request: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': False,
                'error': str(e)
            })
        }