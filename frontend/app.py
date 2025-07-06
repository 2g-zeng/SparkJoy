import streamlit as st
import requests

# 页面配置
st.set_page_config(page_title="Yoyo Story Generator", layout="centered")

# 初始化状态
if "view_mode" not in st.session_state:
    st.session_state.view_mode = "input"
if "storybook" not in st.session_state:
    st.session_state.storybook = None
if "page_index" not in st.session_state:
    st.session_state.page_index = 0

# -------------------------------
# 🎯 输入界面
# -------------------------------
def input_mode():
    st.title("✨ Yoyo Story Generator")
    st.markdown("Write a magical idea and upload up to 5 images to create your own storybook.")

    text = st.text_area("Story Prompt", placeholder="Once upon a time...", height=150)
    images = st.file_uploader("Upload Images (Max 5)", type=["jpg", "jpeg", "png"], accept_multiple_files=True)

    if images and len(images) > 5:
        st.warning("You can upload up to 5 images only.")
        images = images[:5]

    if st.button("🚀 Generate Storybook") and text.strip():
        with st.spinner("Generating your story..."):
            try:
                data = {"text": text}
                files = [("images", (img.name, img, img.type)) for img in images]
                res = requests.post("http://localhost:8000/generate", data=data, files=files)
                res.raise_for_status()

                # 保存到 session
                st.session_state.storybook = res.json()
                st.session_state.page_index = 0
                st.session_state.view_mode = "viewer"
                st.rerun() # 👈 强制刷新，立即跳转到绘本页面

            except Exception as e:
                st.error("Failed to generate story.")
                st.exception(e)

# -------------------------------
# 📖 阅读界面
# -------------------------------
def viewer_mode():
    storybook = st.session_state.storybook
    page_index = st.session_state.page_index
    pages = storybook["pages"]
    page = pages[page_index]

    st.title(f"📘 {storybook['title']}")
    st.caption(f"Page {page['pageNumber']} of {len(pages)} — Created at {storybook['createdAt']}")

    # 翻页布局
    left, center, right = st.columns([1, 6, 1])
    with left:
        if st.button("⬅️", key="prev", disabled=page_index == 0):
            st.session_state.page_index -= 1
            st.rerun()
    with center:
        st.image(page["illustration"], use_container_width=True)
        st.write(page["text"])
    with right:
        if st.button("➡️", key="next", disabled=page_index == len(pages) - 1):
            st.session_state.page_index += 1
            st.rerun()

    st.markdown("---")
    if st.button("🔁 Start Over"):
        st.session_state.view_mode = "input"
        st.session_state.storybook = None
        st.session_state.page_index = 0
        st.rerun()


# -------------------------------
# 👇 页面路由控制
# -------------------------------
if st.session_state.view_mode == "input":
    input_mode()
elif st.session_state.view_mode == "viewer":
    viewer_mode()
