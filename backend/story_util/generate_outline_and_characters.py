import os
import json
from typing import List, Dict
from fastapi import UploadFile
from openai import OpenAI
import ast

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_outline_and_characters(
    prompt: str,
    images: List[UploadFile],
    model: str = "gpt-4o"
) -> Dict:
    """
    调用 GPT 模型，根据用户的 prompt 和可选图片，生成故事大纲和角色设定。
    返回格式为字典，包含 'outline'（list[str]）和 'characters'（list[dict]）。
    """

    image_names = [img.filename for img in images if img.filename]
    image_hint = f"\nImage hints: {', '.join(image_names)}" if image_names else ""

    system_msg = (
        "You are a creative assistant that generates children's story outlines and characters.\n"
        "You will take a story idea and optional image hints, and return structured JSON with:\n"
        "- 'outline': a list of 3–5 short sentences covering the beginning, middle, and end of the story.\n"
        "- 'characters': a list of character dictionaries. Each dictionary must contain:\n"
        "  * name (e.g., 'Luna')\n"
        "  * species (e.g., 'bunny')\n"
        "  * traits (a list of 3 adjectives)\n"
        "  * appearance (describe fur/hair color, eye color, clothing style and color)\n"
        "  * goal (what the character wants to achieve in the story)\n"
        "Only return valid JSON. Do not add any explanation."
    )

    user_msg = f"""
Story prompt:
{prompt}
{image_hint}

Please output valid JSON with the structure above.
"""

    response = client.chat.completions.create(
        model=model,
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]
    )

    raw = response.choices[0].message.content.strip()

    # 🧹 清洗 Markdown 格式
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    raw = raw.strip()

    print("\n🔍 GPT raw output:\n", raw)

    # 尝试解析 JSON（容错）
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        try:
            data = ast.literal_eval(raw)
        except Exception as e:
            print("❗ 无法解析 GPT 输出为 JSON：", raw)
            raise e

    # characters 修复为 list[dict]
    characters = data.get("characters")
    if isinstance(characters, str):
        try:
            characters = json.loads(characters)
        except:
            characters = ast.literal_eval(characters)

    if isinstance(characters, list) and all(isinstance(c, str) for c in characters):
        try:
            characters = [json.loads(c) if isinstance(c, str) else c for c in characters]
        except:
            characters = [ast.literal_eval(c) for c in characters]

    if not (isinstance(characters, list) and all(isinstance(c, dict) for c in characters)):
        raise ValueError("Parsed 'characters' is not a list of dicts.")

    # outline 修复为 list[str]
    outline = data.get("outline")
    if isinstance(outline, str):
        outline = [outline]
    if not isinstance(outline, list):
        raise ValueError("'outline' is not a list.")

    return {
        "outline": outline,
        "characters": characters
    }
