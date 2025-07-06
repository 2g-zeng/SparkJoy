import os
import json
from typing import List, Dict, Union
from openai import OpenAI

# 初始化 OpenAI 客户端
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_story_pages_from_outline(
    outline_data: Dict,
    num_pages: int = 3,
    model: str = "gpt-4o"
) -> List[str]:
    # 1. 提取大纲和角色信息
    outline = outline_data.get("outline", [])
    characters = outline_data.get("characters", [])

    # 2. 如果 characters 是字符串（如 GPT 错误加引号），尝试解析
    if isinstance(characters, str):
        try:
            characters = json.loads(characters)
        except Exception as e:
            print("❗ characters 字段格式不正确，无法解析为列表：", characters)
            raise e

    # 3. 如果 outline 是字符串，也转为 list
    if isinstance(outline, str):
        outline = [outline]

    # 4. 拼接角色描述
    character_descriptions = "\n".join([
        f"{c['name']} is a {c['species']} with traits {', '.join(c['traits'])}. "
        f"They have {c['appearance']} and their goal is: {c['goal']}."
        for c in characters
        if isinstance(c, dict)
    ])

    # 5. 构建提示词
    system_msg = (
        "You are a children's book writer. Based on the story outline and characters, "
        "write a story in {num_pages} paragraphs. Each paragraph is one page. "
        "Make it engaging and easy to understand for children age 3–6."
    )

    user_msg = f"""
Story Outline:
{chr(10).join(outline)}

Characters:
{character_descriptions}

Write {num_pages} narrative paragraphs for the story. Each paragraph is a separate page.
Ensure characters are consistent in appearance and behavior.
Return a valid JSON array of strings, each string is one page of the story. Do not include any explanation or markdown.
"""

    # 6. 请求 OpenAI
    response = client.chat.completions.create(
        model=model,
        temperature=0.7,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]
    )

    raw = response.choices[0].message.content.strip()

    # 7. 清理 GPT 的 markdown 输出包裹（如 ```json ... ```）
    if raw.startswith("```"):
        raw = raw.split("```")[1].strip("json").strip()

    print("📖 Raw GPT response (first 300 chars):")
    print(raw[:300] + "\n")

    # 8. 尝试解析为 JSON 数组
    try:
        pages = json.loads(raw)
        if not isinstance(pages, list) or not all(isinstance(p, str) for p in pages):
            raise ValueError("Parsed pages must be a list of strings.")
        return pages
    except Exception as e:
        print("❗ Failed to parse GPT output as valid JSON list of strings.")
        raise e
