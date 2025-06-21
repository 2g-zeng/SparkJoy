import json
from datetime import datetime
import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
stories_table = dynamodb.Table('SparkJoyStories')

def get_stories(username, token):
    """
    Retrieve stories from DynamoDB where username and token match
    
    Parameters:
    - username: The username associated with the stories
    - token: User authentication token
    
    Returns:
    - List of stories belonging to the user
    """
    try:
        # Query the table for stories with matching username and token
        response = stories_table.scan(
            FilterExpression=Attr('username').eq(username) & Attr('user_token').eq(token)
        )
        
        stories = []
        if 'Items' in response:
            for item in response['Items']:
                # Parse the stored story content (which is a JSON string)
                story_content = json.loads(item['story_content'])
                stories.append(story_content)
        
        # If no stories found, return empty list
        if not stories:
            print(f"No stories found for username: {username}")
            
        return stories
        
    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        raise e
    except Exception as e:
        print(f"Error retrieving stories: {str(e)}")
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

        username = body.get('username')
        token = body.get('token')
        
        # Validate required fields
        if not username:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': 'Username is required'
                })
            }
            
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

        # Get stories from DynamoDB
        stories = get_stories(username, token)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': True,
                'stories': stories
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
