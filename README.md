# Insta AI Comment Helper

**Insta AI Comment Helper**는 사용자가 인스타그램 게시물 URL을 입력하면, 해당 게시물의 내용을 분석하여 AI가 자연스러운 댓글 후보를 생성해주는 웹 도구입니다.

## 🚀 프로젝트 목적

이 도구는 **"댓글 아이디어를 제공하는 도우미"** 역할을 수행합니다.
사용자는 생성된 댓글 중 마음에 드는 것을 복사하여 인스타그램에 직접 등록할 수 있습니다.

> **중요:** 이 프로젝트는 인스타그램의 정책을 준수하며, **자동 로그인, 자동 좋아요, 자동 댓글 등록 기능을 포함하지 않습니다.**

## ✨ 주요 기능

1.  **URL 기반 댓글 추천**: 인스타그램 게시물 URL을 입력하면 AI가 3~5개의 댓글 후보를 제안합니다.
2.  **간편한 복사**: 각 댓글 옆에 있는 "복사" 버튼을 통해 쉽게 사용할 수 있습니다.
3.  **안전한 사용**: 사용자의 계정 정보를 요구하지 않으며, 모든 액션은 사용자가 직접 수행합니다.

## 🛠️ 기술 스택

-   **Frontend**: HTML5, CSS3, JavaScript
-   **Backend**: Node.js, Express
-   **AI**: OpenAI API
-   **Data**: Instagram oEmbed / Graph API

## 📦 설치 및 실행 방법

1.  **저장소 클론**
    ```bash
    git clone https://github.com/shinta0809/Insta-AI-Comment-Helper.git
    cd Insta-AI-Comment-Helper
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요.
    ```env
    PORT=4000
    OPENAI_API_KEY=your_openai_api_key
    # FB_ACCESS_TOKEN=your_facebook_token (선택 사항)
    ```

4.  **서버 실행**
    ```bash
    node server/server.js
    ```

5.  **사용하기**
    브라우저에서 `http://localhost:4000` (또는 설정한 포트)으로 접속하세요.

## 📝 라이선스

이 프로젝트는 ISC 라이선스를 따릅니다.

