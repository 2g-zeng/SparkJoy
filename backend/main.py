# backend/main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime
import uuid
import openai
import os
from concurrent.futures import ThreadPoolExecutor

from story_util.generate_outline_and_characters import generate_outline_and_characters
from story_util.generate_story_pages_from_outline import generate_story_pages_from_outline
from story_util.generate_image_prompt_for_page import generate_image_prompt_for_page  
from story_util.generate_image_from_prompt import generate_image_from_prompt
from story_util.simplify_text_for_children import simplify_text_for_children
from story_util.build_storybook_structure import build_storybook_structure

openai.api_key = os.getenv("OPENAI_API_KEY") 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 前端开发阶段先允许所有，部署时应限制域名
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_images_concurrently(prompts: List[str]) -> List[str]:
    with ThreadPoolExecutor() as executor:
        return list(executor.map(generate_image_from_prompt, prompts))

@app.post("/generate")
async def generate_story(text: str = Form(...), images: List[UploadFile] = File(default=[])):
    print("Received text:", text)
    print("Received images:", [img.filename for img in images])

    # 1️⃣ 故事大纲 + 人物设定
    outline_data = generate_outline_and_characters(text, images)
    print("🔍 Outline and characters generated:", outline_data)

    # 2️⃣ 每页小剧情
    pages_raw = generate_story_pages_from_outline(outline_data)
    print("\n📖 Generated Story Pages:")
    for i, page in enumerate(pages_raw, start=1):
        print(f"Page {i}: {page}\n")
    
    # 3️⃣ 插图 prompt
    image_prompts = [
        generate_image_prompt_for_page(page, characters=outline_data["characters"])
        for page in pages_raw
    ]
    for i, prompt in enumerate(image_prompts, 1):
        print(f"\n📘 Image Prompt for Page {i}:\n{prompt}")

    # 4️⃣ 调用图像生成 API（如 OpenAI Image）
    image_urls = generate_images_concurrently(image_prompts)
    print("\n🖼️ Generated Image URLs:", image_urls)
    print("Total images generated:", len(image_urls))

    # 5️⃣ 精简文本为儿童阅读
    child_texts = [simplify_text_for_children(p) for p in pages_raw]
    for i, text in enumerate(child_texts, 1):
        print(f"\n👶 Page {i} Simplified Text:\n{text}")

    # 6️⃣ 整合输出为完整 storybook
    return build_storybook_structure(outline_data, pages_raw, image_prompts, image_urls, child_texts)