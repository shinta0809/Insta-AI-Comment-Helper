# AGENTS.md

## 프로젝트 개요

- 이름: **Insta AI Comment Helper**
- 목적:  
  사용자가 **인스타그램 게시물 URL**을 입력하면  
  → 게시물 정보를 가져와  
  → **AI가 자연스러운 댓글 후보를 생성**해주고  
  → 사용자는 마음에 드는 댓글을 **복사해서 인스타에 직접 등록**할 수 있게 해주는 웹 도구.

- 중요한 전제:
  - 인스타그램에 **자동으로 로그인/좋아요/댓글 등록을 수행하지 않는다.**
  - 이 도구는 **“댓글 아이디어를 제공하는 도우미”** 역할만 한다.

---

## 목표(Goals)

1. **URL 기반 댓글 추천 기능**
   - 사용자가 인스타 게시물 URL을 입력하면, 해당 게시물의 캡션/텍스트를 기반으로 AI가 댓글을 3~5개 생성.

2. **반자동(사람이 마지막 클릭) UX**
   - 각 댓글 옆에 “복사” 버튼을 제공하여, 사용자가 인스타 앱/웹에 직접 붙여넣을 수 있게 함.

3. **간단한 UI & 빠른 피드백**
   - HTML + CSS + jQuery 기반으로 빠르게 구현.
   - 나중에 원하면 React/Vue로 마이그레이션 가능.

4. **확장 가능 구조**
   - 추후 댓글 톤(친근/공손/밈), 길이, 개수 등 옵션을 쉽게 추가할 수 있도록 API와 프론트 구조를 설계.

---

## 제약(Constraints)

1. **정책/윤리적 제약**
   - 인스타그램의 이용약관 및 정책을 침해하는 기능(자동 로그인, 자동 좋아요/댓글 등록, 대량 자동화 등)은 **구현 대상이 아니다.**
   - 이 프로젝트는 **“게시물 정보 분석 + 댓글 문구 추천”까지만** 담당한다.

2. **기술적 제약**
   - Instagram 데이터 접근은 **공식 API(oEmbed/Graph API 등)** 또는 허용된 방식만 고려.
   - AI 호출은 OpenAI 등 외부 API에 의존.

3. **운영 범위**
   - 초기 버전은 **개인 사용 + 테스트 환경**을 우선으로 한다.
   - 사용자 관리/요금제/대규모 트래픽은 초기 스코프에서 제외.

---

## 전반 아키텍처

### 구성 요소

1. **Frontend Agent (웹 클라이언트)**
2. **Backend Agent (API 서버)**
3. **AI Agent (댓글 생성 로직; 외부 AI API 활용)**
4. **Instagram Data Agent (게시물 정보 가져오기)**

전반 플로우:

1. 사용자가 프론트에서 인스타 게시물 URL 입력 → “댓글 추천 받기” 버튼 클릭  
2. 프론트가 백엔드 `/api/generate-comments`에 URL 전달  
3. 백엔드가 Instagram Data Agent를 통해 게시물 캡션/메타 정보 획득  
4. 백엔드가 AI Agent를 호출하여 댓글 후보 생성  
5. 백엔드가 프론트에 `{ caption, comments[] }` 응답  
6. 프론트가 이를 화면에 렌더링 + 복사 버튼 제공

---

## AGENT 정의

### 1. Product Agent

**역할**

- 전체 기능 스코프 정의
- UX 흐름 설계
- 정책/제약을 고려해 “어디까지 자동화할지” 결정

**주요 책임**

- 다음을 만족하는 UX를 설계:
  - 인풋: 인스타 게시물 URL
  - 아웃풋: 자연스러운 댓글 후보 리스트
  - 사용자는 복사 후 직접 인스타에 입력
- “자동 좋아요/댓글 등록”은 스코프에서 제외

---

### 2. Frontend Agent

**스택**

- HTML5, CSS3
- jQuery (초기 버전)
- 나중에 React/Vue로 리팩터링 가능

**책임**

1. **URL 입력 및 검증**
   - 인풋 필드: `https://www.instagram.com/p/XXXX/` 형태의 URL
   - 기본적인 유효성 체크 (비어 있는지, instagram.com 포함 여부 등)

2. **API 호출**
   - `POST http://localhost:4000/api/generate-comments`
   - Body: `{ url: string, tone?: string, length?: string }` (향후 확장)

3. **결과 렌더링**
   - 게시물 캡션 표시 영역
   - 추천 댓글 리스트 출력
   - 각 댓글마다 “복사” 버튼 제공
   - 에러 메시지 / 로딩 상태 표시

4. **UI/UX 요소**
   - 반응형으로 심플한 카드형 레이아웃
   - 최소한의 스타일: 입력 영역, 결과 영역 분리
   - 로딩 중 스피너/텍스트 표시

---

### 3. Backend Agent

**스택**

- Node.js
- Express
- axios (외부 API 호출)
- dotenv (환경 변수 관리)

**엔드포인트**

1. `POST /api/generate-comments`
   - 요청:
     ```json
     {
       "url": "https://www.instagram.com/p/XXXX/",
       "tone": "friendly",
       "length": "short"
     }
     ```
   - 응답 (예시):
     ```json
     {
       "success": true,
       "url": "https://www.instagram.com/p/XXXX/",
       "caption": "오늘 날씨가 너무 좋아서 산책 나왔어요 🌤️",
       "comments": [
         "와 날씨 너무 좋네요! 산책하기 딱이에요 😄",
         "사진만 봐도 힐링된다… 좋은 하루 보내세요 ☺️",
         "이 코스 어디에요? 분위기 너무 좋네요 👀"
       ]
     }
     ```

**책임**

1. 요청 검증
   - URL 필수 여부 체크
   - 기본적인 URL 형식 검증

2. Instagram Data Agent 호출
   - URL을 넘겨 캡션/메타 정보를 받아옴
   - 실패 시 에러 메시지 반환

3. AI Agent 호출
   - Caption + 옵션(tone, length)을 인자로 전달
   - 댓글 후보 배열을 받아옴

4. 에러 처리
   - 외부 API 실패, 토큰 오류 등의 경우 `success: false` 형식으로 응답

---

### 4. Instagram Data Agent

**역할**

- 인스타 게시물 URL → 게시물 캡션/메타 정보를 가져오는 역할

**가능한 접근 방식 (정책 준수 범위 내)**

- Instagram oEmbed API  
- Instagram Graph API (정식 앱 + 토큰 필요, 향후 확장)

**책임**

1. URL 파라미터를 받아 Instagram oEmbed/Graph API 호출
2. 응답에서 캡션/텍스트를 추출
3. Backend Agent에 캡션 문자열 전달
4. API 호출 실패 시 적절한 에러 반환

---

### 5. AI Agent

**역할**

- 게시물 캡션을 입력으로 받아 댓글 후보 문장을 생성

**입력**

- `caption: string`
- `tone: "friendly" | "formal" | "funny" | ...`
- `length: "short" | "medium" | "long"`

**출력**

- `comments: string[]` (3~5개 댓글)

**프롬프트 설계 기본 아이디어**

- 지시사항:
  - 한국어로 작성
  - 과한 광고/영업 느낌 금지
  - 이모지 사용은 자연스럽게, 과하지 않게
  - 1~2문장 길이
  - 선택된 톤과 길이에 맞도록 생성
- 캡션 내용 삽입:
  - `[캡션] ...` 형태로 그대로 전달
- 출력 포맷:
  - 파싱하기 쉽게 `1. ...`, `2. ...`, `3. ...` 형식 또는 JSON 스타일 텍스트로 생성 요청

---

## 데이터 흐름 요약

1. **사용자**  
   인스타 URL 입력 → “댓글 추천 받기” 버튼 클릭

2. **Frontend Agent**
   - `/api/generate-comments`로 URL 전송
   - 응답의 `caption`, `comments[]`를 렌더링

3. **Backend Agent**
   - URL 검증
   - Instagram Data Agent 호출 → 캡션 획득
   - AI Agent 호출 → 댓글 후보 생성
   - 결과 JSON으로 프론트에 반환

4. **사용자**
   - 마음에 드는 댓글을 선택 → “복사” 버튼 클릭  
   - 인스타에 직접 붙여넣고 등록

---

## 개발 단계 (Milestones)

### M1. 기본 스켈레톤

- [ ] Node + Express 서버 기동
- [ ] `/api/generate-comments` 라우트에서 더미 데이터 반환
- [ ] 프론트에서 URL 입력 → 더미 댓글 리스트 표시 → 복사 버튼 동작

### M2. Instagram 데이터 연동

- [ ] Instagram oEmbed/Graph API 조사 및 테스트 토큰 준비
- [ ] Instagram Data Agent 구현 (URL → 캡션)
- [ ] `/api/generate-comments`에서 실제 캡션 사용

### M3. AI 연동

- [ ] OpenAI API 키 세팅
- [ ] AI Agent 함수 구현 (캡션 → 댓글 배열)
- [ ] tone/length 옵션에 따라 프롬프트 다르게 구성
- [ ] 백엔드 엔드포인트에 tone/length 옵션 연결

### M4. UX 개선

- [ ] 로딩 상태 표시
- [ ] 에러 메시지 UI 정리
- [ ] 반응형 레이아웃/기본 디자인 정리

### M5. 확장(선택)

- [ ] 사용자 말투 프리셋 기능
- [ ] URL 히스토리 관리 (로컬스토리지 or 간단한 DB)
- [ ] 간단한 인증(토큰 기반) 추가

---

## 비목표 (Non-goals)

- 인스타그램에 **자동으로 좋아요/댓글을 실제로 등록하는 기능**
- 인스타 계정 자동 로그인/세션/쿠키 관리
- 대량 계정/대량 게시물에 대한 자동 처리
- 상용 서비스 수준의 결제/요금제/멀티테넌트 구조

---

## 환경 변수 예시 (.env)

```env
PORT=4000

# Instagram / Meta 관련
FB_ACCESS_TOKEN=YOUR_FACEBOOK_GRAPH_ACCESS_TOKEN

# OpenAI 관련
OPENAI_API_KEY=sk-xxx
