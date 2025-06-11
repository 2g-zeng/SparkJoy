import json
from datetime import datetime
import uuid

def get_stories(username):
    """Create a sample story for testing purposes"""
    return {
        "id": str(uuid.uuid4()),
        "title": f"Adventure of {username}",
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "pages": [
            {
                "id": str(uuid.uuid4()),
                "content": "Once upon a time in a magical kingdom...",
                "order": 1
            },
            {
                "id": str(uuid.uuid4()),
                "content": "The brave hero encountered a mystical creature...",
                "order": 2
            },
            {
                "id": str(uuid.uuid4()),
                "content": "And they lived happily ever after, sharing tales of their adventures.",
                "order": 3
            }
        ]
    }

def lambda_handler(event, context):
    try:
        # API Gateway test endpoint sends JSON directly
        if isinstance(event, dict) and 'username' in event:
            body = event
        # Regular API Gateway request might send stringified JSON in body
        elif isinstance(event, dict) and 'body' in event and event['body']:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = {}

        username = body.get('username')
        
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

        sample_stories = [get_stories(username)]

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({
                'ok': True,
                'stories': sample_stories
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
