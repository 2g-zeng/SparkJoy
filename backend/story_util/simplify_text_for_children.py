import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def simplify_text_for_children(text: str, model: str = "gpt-4o") -> str:
    system_msg = (
        "You are an expert in early childhood language development. "
        "Simplify any story text into short, easy sentences suitable for 3–6 year-old children. "
        "Keep it vivid, friendly, and understandable for kids. Use short words and simple grammar."
    )

    user_msg = f"""
Original Story Text:
{text}

Now simplify it for a young child (age 3–6). Keep it short and clear.
Return only the simplified text.
"""

    response = client.chat.completions.create(
        model=model,
        temperature=0.6,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]
    )

    simplified = response.choices[0].message.content.strip()
    return simplified
