from typing import Dict, List

def generate_image_prompt_for_page(
    page_text: str,
    characters: List[Dict]
) -> str:
    """
    根据故事页内容和角色设定，生成图像提示词（prompt）用于生成插图。
    确保角色外观一致，适合3-6岁儿童图书风格。

    参数：
        page_text: 当前页文字内容
        characters: 角色列表，每个角色是一个字典，包含 name, species, traits, appearance, goal

    返回：
        图像生成 prompt 字符串
    """
    # 构建角色外观说明
    character_summaries = []
    for c in characters:
        summary = (
            f"{c['name']} is a {c['species']} with {c['appearance']}. "
            f"Traits: {', '.join(c['traits'])}. Goal: {c['goal']}."
        )
        character_summaries.append(summary)

    characters_description = " ".join(character_summaries)

    # 生成 prompt
    prompt = (
        f"Children's book illustration, soft and colorful watercolor style. "
        f"The scene: {page_text.strip()} "
        f"Characters: {characters_description} "
        f"Background should be consistent with the story and suitable for age 3–6. "
        f"No text in the image. High detail, storytelling composition."
    )

    return prompt
