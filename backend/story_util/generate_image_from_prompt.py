import os
from openai import OpenAI

# 初始化 OpenAI 客户端
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_image_from_prompt(prompt: str, model: str = "dall-e-3", size: str = "1024x1024") -> str:
    """
    根据文本 prompt 调用 OpenAI 的图像生成模型（如 DALL·E）生成图像，并返回图像 URL。

    参数:
        prompt: 图像描述文本
        model: 使用的图像生成模型（默认为 "dall-e-3"）
        size: 图像尺寸，如 "1024x1024"

    返回:
        图像的公开 URL 字符串
    """
    try:
        response = client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality="standard",  # 可选: "hd"
            n=1
        )
        image_url = response.data[0].url
        return image_url
    except Exception as e:
        print("❗ Error generating image:", e)
        raise e
