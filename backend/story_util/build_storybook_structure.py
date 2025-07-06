import uuid
from datetime import datetime
from typing import List, Dict

def build_storybook_structure(
    outline_data: Dict,
    pages_raw: List[str],
    image_prompts: List[str],
    image_urls: List[str],
    child_texts: List[str]
) -> Dict:
    title = generate_title_from_outline(outline_data["outline"])

    storybook = {
        "id": str(uuid.uuid4()),
        "title": title,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "pages": []
    }

    for i, (text, simplified, image_url) in enumerate(zip(pages_raw, child_texts, image_urls), start=1):
        storybook["pages"].append({
            "pageNumber": i,
            "text": text,
            "simplifiedText": simplified,
            "illustration": image_url
        })

    return storybook

def generate_title_from_outline(outline: List[str]) -> str:
    # 简单提取关键词作为标题（也可以调用 GPT 生成更好）
    for sentence in outline:
        for keyword in ["冒险", "魔法", "森林", "独角兽", "星辰", "花园"]:
            if keyword in sentence:
                return f"神奇的{keyword}之旅"
    return "奇妙故事冒险"
