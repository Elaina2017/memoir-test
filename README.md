# Memoir - 엄마의 첫 번째 책

## 📖 프로젝트 개요

**Memoir**는 Kinfolk 스타일의 고급스럽고 차분한 랜딩페이지로, 엄마와의 소중한 추억을 기록하는 디지털 서비스입니다.

### 🎯 서비스 컨셉
- **무드**: 조용한 서재에서 차 한 잔을 마시며 엄마를 떠올리는 차분하고 고급스러운 분위기
- **스타일**: Kinfolk 스타일의 미니멀리즘, Editorial 편집 디자인
- **핵심 가치**: 화려한 IT 서비스 느낌을 배제하고, '딸이 기억하는 엄마의 기억'이 담길 그릇으로서의 여백과 품격 유지

### 💫 슬로건
> 잊고 지낸 엄마의 순간들을 모아, 세상에서 가장 따뜻한 보석함을 선물하세요.
> 
> 부담 없이 채팅으로 완성하는 엄마의 첫 번째 책, Memoir

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **Main Background**: `#F9F8F6` (킨포크풍 크림색)
- **Main Text**: `#333333` (부드러운 블랙)
- **Accent Button**: `#A67B71` (로즈 베이지)
- **Sub Text/Line**: `#D1CDC7` (연한 그레이)

### 타이포그래피
- **제목/본문**: Noto Serif KR (이롭게 바탕체 대체)
  - 문학적이고 감성적인 느낌
  - 전자책 전용 폰트의 높은 가독성
  - **기본 본문 크기**: 18px (1.125rem) - 웹 가독성 최적화
  
- **UI 버튼**: Noto Sans KR (프리텐다드 대체)
  - 모던하고 깔끔한 고딕체
  - UI 요소에 적합한 가독성

### 폰트 크기 체계
- **본문 텍스트**: 18-21px (1.15-1.2rem) - 읽기 편한 크기
- **소제목**: 22-25px (1.4rem)
- **챕터 제목**: 35px (2.2rem)
- **히어로 타이틀**: 45px (2.8rem)

### 인터랙션
- **Floating 효과**: 스크롤 시 텍스트가 천천히 떠오르는 효과
- **차분한 속도감**: 편지를 읽어 내려가는 듯한 느낌
- **빠르고 현란한 움직임 지양**: 고요하고 따뜻한 분위기 유지

---

## 🗂 데이터베이스 스키마

### Profiles 테이블 (Supabase)

사용자 프로필 및 권한 관리를 위한 테이블입니다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 유저 ID (auth.users 참조) |
| email | TEXT | 이메일 주소 |
| full_name | TEXT | 전체 이름 |
| avatar_url | TEXT | 프로필 이미지 URL |
| role | ENUM | 유저 권한 (Admin, User, Null) |
| provider | TEXT | OAuth 제공자 (google, kakao) |
| created_at | TIMESTAMPTZ | 생성 시각 |
| updated_at | TIMESTAMPTZ | 수정 시각 |

**설정 방법:** `supabase/README.md` 참고

---

## 📄 페이지 구조

### 1. Hero Section (통합 헤더 포함)
메인 비주얼 섹션
- **크기**: width 1920px, height 800-1000px
- **배경 이미지**: 교체 가능한 배경 이미지 영역
- **오버레이**: 반투명 그라데이션으로 텍스트 가독성 확보
- **상단 네비게이션** (히어로 섹션 내부):
  - 왼쪽: "Memoir" 텍스트 로고 (Noto Serif KR)
  - 오른쪽: "시작하기" 버튼 (로그인/회원가입)
  - 투명 배경으로 히어로 이미지와 자연스럽게 통합
- 중앙 정렬로 메인 카피와 서브 카피 표시
- 충분한 여백으로 고급스러운 느낌 연출

### 2. Context Section - "01. 기억의 재발견"
첫 번째 책 스타일 챕터
- 왼쪽: 큰 숫자 "01" (8rem, 세리프체)
- 오른쪽: 제목, 소제목, 설명
- 엄마와의 추억을 되살리는 공감 섹션

### 3. Solution 1 Section - "02. 나의 시선"
두 번째 책 스타일 챕터
- 서비스의 차별점 강조
- 9가지 인터뷰 테마 소개

### 4. Solution 2 Section - "03. 다정한 인터뷰"
세 번째 책 스타일 챕터
- 인터뷰 프로세스 설명
- 기억을 깨우는 질문, 정돈, 몰입의 3단계

### 5. Solution 3 Section - "04. 소장 가치"
네 번째 책 스타일 챕터
- 최종 결과물의 가치 강조
- 에세이북으로서의 완성도

### 6. Process Section
3단계 여정 안내
- 기억 인터뷰
- 기록의 재발견
- 에세이북 수령
- **CTA 버튼**: "샘플 인터뷰 진행하기"

### 7. Appendix Section - "차례"
9-Block 인터뷰 테마를 책의 목차 스타일로 표현
- 01. 부엌의 온도
- 02. 엄마의 서랍 속 접어둔 꿈
- 03. 나를 부르던 다정한 목소리
- 04. 내가 본 엄마의 가장 든든한 등
- 05. 나에게 남겨준 소중한 유산
- 06. 비 온 뒤 갠 하늘 같은 화해
- 07. 우리 함께 크게 웃던 날
- 08. 조금은 작아진 당신의 모습
- 09. 나의 문장으로 전하는 고백

---

## 🛠 기술 스택

- **Next.js 14**: App Router, Server Components
- **TypeScript**: 타입 안전성
- **Supabase**: 인증 및 데이터베이스
  - Google OAuth
  - Kakao OAuth
  - Row Level Security (RLS)
- **@supabase/ssr**: 서버사이드 인증
- **CSS3**: Kinfolk 스타일 구현, 반응형 디자인
- **Google Fonts**: Noto Serif KR, Noto Sans KR

**설정 방법**: `docs/SUPABASE_OAUTH_SETUP.md` 참고

---

## ✨ 주요 기능

### 현재 구현된 기능
✅ 히어로 섹션 내 통합 네비게이션 (로고 + 시작하기 버튼)  
✅ **Supabase OAuth 로그인 (구글, 카카오)**  
✅ **로그인 후 원래 페이지로 자동 복귀**  
✅ **서버사이드 인증 (Next.js App Router)**  
✅ 로그인/회원가입 모달 팝업  
✅ 배경 이미지가 있는 히어로 섹션 (1920x800-1000px)  
✅ Kinfolk 스타일의 고급스러운 디자인  
✅ 책 스타일의 챕터 레이아웃 (01-04)  
✅ 목차 스타일의 9-Block 인터뷰 테마  
✅ 스크롤 시 Floating 애니메이션 효과  
✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)  
✅ CTA 버튼 인터랙션  
✅ 부드러운 페이지 전환 효과  

### 향후 구현 예정 기능
🔲 관리자 대시보드 (권한별 UI)  
🔲 샘플 인터뷰 기능 (모달 또는 별도 페이지)  
🔲 히어로 섹션 배경 이미지 관리자 기능  
🔲 실제 에세이북 샘플 이미지 추가  
🔲 이메일 구독/문의 폼  
🔲 소셜 미디어 공유 기능  

---

## 📱 반응형 디자인

### 데스크톱 (992px 이상)
- 챕터 레이아웃: 2단 구조 (숫자 | 콘텐츠)
- 프로세스: 3단 그리드

### 태블릿 (768px - 991px)
- 챕터 숫자 크기 축소
- 프로세스: 1단 구조로 변경

### 모바일 (767px 이하)
- 챕터 레이아웃: 1단 구조
- 폰트 크기 조정
- 여백 최적화

---

## 🚀 시작하기

### 1단계: 환경 변수 설정

```bash
cp .env.example .env.local
# .env.local 파일 편집하여 Supabase 정보 입력
```

### 2단계: Supabase 설정

- 자세한 설정 가이드: `docs/SUPABASE_OAUTH_SETUP.md`
- Profiles 테이블 생성: `supabase/profiles_table.sql` 실행
- Google/Kakao OAuth 제공자 설정

### 3단계: 패키지 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3000
```

---

## 📂 파일 구조

```
memoir-landing/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # 메인 페이지 (OAuth 연동)
│   ├── auth/callback/
│   │   └── route.ts          # OAuth callback handler
│   └── api/auth/
│       ├── login/route.ts    # 로그인 API
│       └── logout/route.ts   # 로그아웃 API
├── components/
│   └── LoginModal.tsx        # 로그인 모달 컴포넌트
├── utils/supabase/
│   ├── client.ts            # Client-side Supabase client
│   ├── server.ts            # Server-side Supabase client
│   └── middleware.ts        # Middleware helper
├── styles/
│   └── globals.css          # Global styles (Kinfolk 스타일)
├── supabase/
│   ├── profiles_table.sql   # Profiles 테이블 SQL
│   └── README.md            # Supabase 설정 가이드
├── docs/
│   └── SUPABASE_OAUTH_SETUP.md  # OAuth 설정 가이드
├── middleware.ts            # Next.js middleware
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.example
└── README.md
```

---

## 🎯 디자인 철학

### Kinfolk Style 구현
- **여백의 미학**: 충분한 패딩과 마진으로 숨쉬는 레이아웃
- **중립적 컬러**: 자연에서 온 뉴트럴 톤
- **세리프 타이포그래피**: 문학적이고 감성적인 글꼴
- **미니멀한 인터랙션**: 과하지 않은 부드러운 움직임
- **편집 디자인**: 책과 잡지의 레이아웃 차용

---

## 💡 추천 다음 단계

1. **Supabase OAuth 설정**
   - Google OAuth 클라이언트 ID/Secret 생성
   - Kakao REST API 키 생성
   - OAuth Redirect URI 설정
   
2. **관리자 대시보드 구현**
   - 권한별 UI 분리
   - Admin 전용 페이지 개발
   
3. **실제 인터뷰 기능 개발**
   - 9-Block 인터뷰 시스템
   - 챗봇 인터페이스 구현
   
3. **성능 최적화**
   - 이미지 lazy loading
   - CSS/JS 최소화
   - 웹 폰트 최적화
   
4. **접근성 개선**
   - ARIA 레이블 추가
   - 키보드 내비게이션 강화
   - 색상 대비 검토

---

## 📞 연락처

Memoir 프로젝트에 대한 문의사항이 있으시면 언제든 연락주세요.

---

**© 2026 Memoir. 엄마를 향한 마음을 담는 디지털 아틀리에.**