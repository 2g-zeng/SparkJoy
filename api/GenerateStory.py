import json
import uuid
from datetime import datetime

def get_demo_story():
    """Returns the demo story about Luna the Bunny"""
    return {
        "id": str(uuid.uuid4()),
        "title": "Luna the Bunny's Rainbow Garden",
        "pages": [
            {"pageNumber": 1, "text": "Once upon a time, in a cozy burrow at the edge of a meadow, lived a little white bunny named Luna. She had the softest fur and the biggest, brightest eyes.", "illustration": "https://picsum.photos/seed/luna1/800/600"},
            {"pageNumber": 2, "text": "Luna loved to hop around her garden, but she noticed something sad. All the flowers were the same color - just green leaves everywhere!", "illustration": "https://picsum.photos/seed/luna2/800/600"},
            {"pageNumber": 3, "text": "\"I wish my garden could be as colorful as the rainbow,\" Luna sighed, wiggling her pink nose. That night, she made a special wish upon a twinkling star.", "illustration": "https://picsum.photos/seed/luna3/800/600"},
            {"pageNumber": 4, "text": "The next morning, Luna found a magical seed packet on her doorstep! It sparkled with all the colors of the rainbow and had a note: \"Plant with love.\"", "illustration": "https://picsum.photos/seed/luna4/800/600"},
            {"pageNumber": 5, "text": "Luna carefully planted the seeds in seven neat rows. She watered them with her little blue watering can and sang them a happy song.", "illustration": "https://picsum.photos/seed/luna5/800/600"},
            {"pageNumber": 6, "text": "On the first day, tiny red shoots popped up! \"How wonderful!\" Luna exclaimed, clapping her little paws together with joy.", "illustration": "https://picsum.photos/seed/luna6/800/600"},
            {"pageNumber": 7, "text": "On the second day, orange buds appeared next to the red ones. Luna danced around them, her fluffy tail bouncing with each hop.", "illustration": "https://picsum.photos/seed/luna7/800/600"},
            {"pageNumber": 8, "text": "By the third day, sunny yellow flowers bloomed! They smelled like honey and sunshine. Luna invited her friend Bella the Butterfly to see.", "illustration": "https://picsum.photos/seed/luna8/800/600"},
            {"pageNumber": 9, "text": "\"Your garden is becoming magical!\" said Bella, fluttering her colorful wings. On the fourth day, green leaves unfurled like tiny umbrellas.", "illustration": "https://picsum.photos/seed/luna9/800/600"},
            {"pageNumber": 10, "text": "The fifth day brought beautiful blue blossoms that looked like the sky. Luna's friend Oliver the Owl hooted with delight when he saw them.", "illustration": "https://picsum.photos/seed/luna10/800/600"},
            {"pageNumber": 11, "text": "On the sixth day, purple petals opened wide. They sparkled in the sunlight like tiny amethysts. More friends came to admire Luna's garden.", "illustration": "https://picsum.photos/seed/luna11/800/600"},
            {"pageNumber": 12, "text": "Finally, on the seventh day, violet flowers completed the rainbow! Luna's garden was now the most colorful place in the whole meadow.", "illustration": "https://picsum.photos/seed/luna12/800/600"},
            {"pageNumber": 13, "text": "News of the rainbow garden spread quickly. Soon, animals from all around came to visit. There was Freddy the Fox, Rosie the Robin, and Sam the Squirrel.", "illustration": "https://picsum.photos/seed/luna13/800/600"},
            {"pageNumber": 14, "text": "\"Welcome to my rainbow garden!\" Luna said proudly. \"There's enough beauty for everyone to enjoy!\" The animals gasped at the colorful sight.", "illustration": "https://picsum.photos/seed/luna14/800/600"},
            {"pageNumber": 15, "text": "Luna decided to have a garden party. She set up tiny tables with acorn cups and clover sandwiches. Everyone was invited!", "illustration": "https://picsum.photos/seed/luna15/800/600"},
            {"pageNumber": 16, "text": "Bella the Butterfly brought dewdrop lemonade. Oliver the Owl shared his moonberry muffins. It was the best party ever!", "illustration": "https://picsum.photos/seed/luna16/800/600"},
            {"pageNumber": 17, "text": "As they ate, Luna noticed something special. Each friend matched a color in her garden! Freddy's fur was orange like the marigolds.", "illustration": "https://picsum.photos/seed/luna17/800/600"},
            {"pageNumber": 18, "text": "Rosie's red breast matched the roses. Sam's brown fur looked lovely next to the tree trunks. \"We're all part of the rainbow!\" Luna realized.", "illustration": "https://picsum.photos/seed/luna18/800/600"},
            {"pageNumber": 19, "text": "The friends decided to help Luna care for the garden. They took turns watering, weeding, and singing to the flowers.", "illustration": "https://picsum.photos/seed/luna19/800/600"},
            {"pageNumber": 20, "text": "Every morning, Luna would hop through her garden paths. She loved how the dewdrops on the petals looked like tiny diamonds.", "illustration": "https://picsum.photos/seed/luna20/800/600"},
            {"pageNumber": 21, "text": "One day, a sad little mouse named Milly came by. \"I'm too small and gray,\" she squeaked. \"I don't fit in anywhere.\"", "illustration": "https://picsum.photos/seed/luna21/800/600"},
            {"pageNumber": 22, "text": "Luna hugged Milly gently. \"Every color is special, even gray! You're like the soft morning mist that makes the rainbow appear!\"", "illustration": "https://picsum.photos/seed/luna22/800/600"},
            {"pageNumber": 23, "text": "Luna showed Milly the silver moonflowers that only bloomed at night. \"See? You're magical too!\" Milly's eyes sparkled with happiness.", "illustration": "https://picsum.photos/seed/luna23/800/600"},
            {"pageNumber": 24, "text": "From that day on, Milly helped tend the night garden. She discovered that being different made her special, not strange.", "illustration": "https://picsum.photos/seed/luna24/800/600"},
            {"pageNumber": 25, "text": "As the seasons changed, so did the garden. But the rainbow colors always remained, reminding everyone of the magic of diversity.", "illustration": "https://picsum.photos/seed/luna25/800/600"},
            {"pageNumber": 26, "text": "Luna learned to save seeds from each color. She shared them with other animals who wanted to start their own rainbow gardens.", "illustration": "https://picsum.photos/seed/luna26/800/600"},
            {"pageNumber": 27, "text": "Soon, the whole meadow was dotted with colorful gardens. Each one was unique, just like the animal who tended it.", "illustration": "https://picsum.photos/seed/luna27/800/600"},
            {"pageNumber": 28, "text": "On quiet evenings, Luna would sit in her garden and remember her wish upon the star. She felt grateful for the magic it brought.", "illustration": "https://picsum.photos/seed/luna28/800/600"},
            {"pageNumber": 29, "text": "\"The real magic,\" Luna thought, \"wasn't just the colorful flowers. It was bringing friends together and celebrating our differences.\"", "illustration": "https://picsum.photos/seed/luna29/800/600"},
            {"pageNumber": 30, "text": "And so Luna's rainbow garden grew more beautiful each day, filled with laughter, friendship, and love. The end. 🌈", "illustration": "https://picsum.photos/seed/luna30/800/600"}
        ],
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }

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
        # Extract token
        token = body.get('token')
        username = body.get('username')
        
        # Token validation could be added here
        if not token and username != 'Guest':
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
        
        # Get the demo story
        story = get_demo_story()
        
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
                'story': story
            })
        }

    except Exception as e:
        print(f"Error generating story: {str(e)}")  # This will show in CloudWatch
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