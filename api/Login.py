import json
import uuid
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SparkJoyUsers')

def create_user_if_not_exists(username, magic_number):
    """Create a new user if they don't exist, or validate magic number if they do.
    Returns (success, error_message, token)"""
    try:
        # Generate a new token
        new_token = str(uuid.uuid4())
        
        # Try to get the user
        response = table.get_item(
            Key={
                'username': username
            }
        )          # If user exists
        if 'Item' in response:
            print(response['Item'])
            stored_magic_number = str(response['Item']['magic_number'])
            if stored_magic_number == str(magic_number):
                # Return existing token if magic number matches
                stored_token = response['Item'].get('token')
                if stored_token:
                    return True, None, stored_token
                
                # Update with new token if none exists
                table.update_item(
                    Key={'username': username},
                    UpdateExpression='SET token = :token',
                    ExpressionAttributeValues={':token': new_token}
                )
                return True, None, new_token
        
        # Create new user entry        
        table.put_item(
            Item={
                'username': username,
                'magic_number': str(magic_number),
                'token': new_token,
                'created_at': datetime.now().isoformat()
            }
        )
        return True, None, new_token
        
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
        
        success, error_message, token = create_user_if_not_exists(username, magic_number)
        
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
