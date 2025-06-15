import json
import uuid
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SparkJoyUsers')

def create_user_if_not_exists(username, magic_number):
    """Create a new user if they don't exist, or validate magic number if they do"""
    try:
        # Try to get the user
        response = table.get_item(
            Key={
                'username': username
            }
        )
        
        # If user exists, validate magic number
        if 'Item' in response:
            stored_magic_number = response['Item']['magic_number']
            if stored_magic_number != magic_number:
                return False, "Invalid magic number"
            return True, None
              # If user doesn't exist, create new user
        table.put_item(
            Item={
                'username': username,
                'magic_number': magic_number,
                'created_at': datetime.now().isoformat()
            }
        )
        return True, None
        
    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        return False, "Database error"

def lambda_handler(event, context):
    try:
        # API Gateway test endpoint sends JSON directly
        if isinstance(event, dict) and 'username' in event and 'magic_number' in event:
            body = event
        # Regular API Gateway request might send stringified JSON in body
        elif isinstance(event, dict) and 'body' in event and event['body']:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = {}

        username = body.get('username')
        magic_number = body.get('magic_number')
        
        if not username or not magic_number:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': 'Username and magic number are required'
                })
            }

        # Validate or create user
        success, error_message = create_user_if_not_exists(username, magic_number)
        if not success:
            return {
                'statusCode': 401,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps({
                    'ok': False,
                    'error': error_message
                })
            }

        # Generate a random token
        token = str(uuid.uuid4())

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': True,
                'token': token,
                'username': username
            })
        }

    except Exception as e:
        print(f"Error processing login request: {str(e)}")  # This will show in CloudWatch
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
