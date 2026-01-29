# Supabase OAuth 구현 가이드 (Google & Kakao)

## 📋 개요

Next.js App Router와 Supabase를 사용한 서버사이드 OAuth 인증 구현입니다.
로그인 성공 시 사용자가 로그인을 시도한 페이지로 자동 리다이렉트됩니다.

**참고 문서:**
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/social-login/auth-kakao

---

## 🚀 프로젝트 구조

```
memoir-landing/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Home page (메인 랜딩)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts       # OAuth callback handler
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts   # Login API endpoint
│           └── logout/
│               └── route.ts   # Logout API endpoint
├── components/
│   └── LoginModal.tsx         # 로그인 모달 컴포넌트
├── utils/
│   └── supabase/
│       ├── client.ts          # Client-side Supabase client
│       ├── server.ts          # Server-side Supabase client
│       └── middleware.ts      # Middleware helper
├── styles/
│   └── globals.css            # Global styles (기존 style.css)
├── middleware.ts              # Next.js middleware
├── .env.example               # Environment variables example
├── .env.local                 # Environment variables (create this)
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## 🔧 설정 단계

### 1단계: Supabase 프로젝트 설정

1. **프로젝트 생성**
   - https://app.supabase.com 접속
   - "New Project" 클릭
   - 프로젝트 이름: `memoir`
   - Database Password 설정
   - Region: Seoul 선택

2. **Profiles 테이블 생성**
   ```bash
   # SQL Editor에서 실행
   # supabase/profiles_table.sql 파일 내용 실행
   ```

### 2단계: Google OAuth 설정

1. **Google Cloud Console**
   - https://console.cloud.google.com 접속
   - 프로젝트 생성 또는 선택
   - "APIs & Services" → "Credentials"

2. **OAuth 2.0 클라이언트 ID 생성**
   - "CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: Web application
   - Name: Memoir
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://your-domain.com
     ```
   - Authorized redirect URIs:
     ```
     https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```

3. **Supabase에 Google OAuth 설정**
   - Supabase Dashboard → Authentication → Providers
   - Google 선택 및 활성화
   - Client ID와 Client Secret 입력
   - "Save" 클릭

### 3단계: Kakao OAuth 설정

1. **Kakao Developers**
   - https://developers.kakao.com 접속
   - "내 애플리케이션" → "애플리케이션 추가하기"
   - 앱 이름: Memoir

2. **카카오 로그인 설정**
   - 앱 선택 → "제품 설정" → "카카오 로그인"
   - "카카오 로그인 활성화" ON
   - Redirect URI 설정:
     ```
     https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - "동의 항목" 설정:
     - 닉네임 (선택)
     - 프로필 사진 (선택)
     - 카카오계정(이메일) (필수)

3. **앱 키 확인**
   - "앱 설정" → "앱 키"
   - REST API 키 복사

4. **Supabase에 Kakao OAuth 설정**
   - Supabase Dashboard → Authentication → Providers
   - Kakao 선택 및 활성화
   - Client ID: REST API 키 입력
   - "Save" 클릭

### 4단계: 환경 변수 설정

`.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**API Keys 찾기:**
- Supabase Dashboard → Project Settings → API
- URL, anon key, service_role key 복사

### 5단계: 패키지 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

---

## 🔑 인증 흐름

### 로그인 프로세스

```
1. 사용자가 "시작하기" 버튼 클릭
   ↓
2. 로그인 모달 열림
   ↓
3. "구글로 계속하기" 또는 "카카오로 계속하기" 클릭
   ↓
4. API 호출: POST /api/auth/login
   - 현재 페이지 URL 저장 (window.location.href)
   - Supabase OAuth URL 생성
   ↓
5. OAuth 제공자 페이지로 리다이렉트
   - Google 또는 Kakao 로그인 페이지
   ↓
6. 사용자 인증 및 권한 승인
   ↓
7. Callback URL로 리다이렉트: /auth/callback?code=xxx&next=/
   ↓
8. 서버에서 인증 코드를 세션으로 교환
   ↓
9. 자동으로 profiles 테이블에 사용자 정보 저장 (Trigger)
   ↓
10. 원래 페이지로 리다이렉트 (next 파라미터 사용)
    ↓
11. 로그인 완료! "시작하기" 버튼이 "로그아웃"으로 변경
```

### 페이지 복귀 메커니즘

```javascript
// 1. 로그인 시작 - 현재 URL 저장
const currentUrl = window.location.href // "http://localhost:3000/some-page"

// 2. OAuth URL 생성 - next 파라미터로 전달
redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(currentUrl)}`

// 3. Callback에서 처리 - next 파라미터 읽기
const next = searchParams.get('next') ?? '/'

// 4. 원래 페이지로 리다이렉트
return NextResponse.redirect(`${origin}${next}`)
```

---

## 💻 코드 설명

### 1. Supabase Client (Client-side)

`utils/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. Supabase Client (Server-side)

`utils/supabase/server.ts`
- Server Components와 Route Handlers에서 사용
- 쿠키 기반 세션 관리

### 3. Middleware

`middleware.ts`
- 모든 요청에서 세션 갱신
- 인증 상태 유지

### 4. Login API

`app/api/auth/login/route.ts`
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: provider as 'google' | 'kakao',
  options: {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(origin)}`,
  },
})
```

**핵심 포인트:**
- `redirectTo`: OAuth 후 돌아올 URL
- `next` 파라미터: 원래 페이지 URL 저장

### 5. Callback Handler

`app/auth/callback/route.ts`
```typescript
const next = searchParams.get('next') ?? '/'
const { error } = await supabase.auth.exchangeCodeForSession(code)

if (!error) {
  return NextResponse.redirect(`${origin}${next}`)
}
```

**핵심 포인트:**
- OAuth 코드를 세션으로 교환
- `next` 파라미터로 원래 페이지로 리다이렉트

### 6. Login Modal

`components/LoginModal.tsx`
```typescript
const handleSocialLogin = async (provider: 'google' | 'kakao') => {
  const currentUrl = window.location.href // 현재 페이지 저장
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ provider, origin: currentUrl }),
  })
  
  const data = await response.json()
  if (data.url) {
    window.location.href = data.url // OAuth URL로 이동
  }
}
```

---

## 🔒 보안 체크리스트

- ✅ Server-side 인증 (SSR)
- ✅ 쿠키 기반 세션 관리
- ✅ Middleware에서 세션 자동 갱신
- ✅ CSRF 보호 (Supabase 내장)
- ✅ Row Level Security (RLS) 활성화
- ✅ Service Role Key는 서버 전용
- ✅ Anon Key는 클라이언트 노출 가능
- ✅ HTTPS 강제 (프로덕션)

---

## 🧪 테스트 방법

### 로컬 테스트

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **로그인 테스트**
   - http://localhost:3000 접속
   - "시작하기" 버튼 클릭
   - "구글로 계속하기" 클릭
   - Google 계정으로 로그인
   - 메인 페이지로 자동 리다이렉트 확인
   - "시작하기" → "로그아웃" 변경 확인

3. **페이지 복귀 테스트**
   - 특정 섹션으로 스크롤
   - "시작하기" 버튼 클릭하여 로그인
   - 로그인 후 동일한 위치로 복귀 확인

4. **카카오 로그인 테스트**
   - "카카오로 계속하기" 클릭
   - 카카오 계정으로 로그인
   - 동일한 프로세스 확인

### Profiles 테이블 확인

```sql
-- Supabase SQL Editor에서 실행
SELECT * FROM public.profiles ORDER BY created_at DESC;
```

확인 항목:
- ✅ id: 유저 UUID
- ✅ email: 이메일 주소
- ✅ full_name: Google/Kakao에서 가져온 이름
- ✅ avatar_url: 프로필 사진 URL
- ✅ role: 'User' (기본값)
- ✅ provider: 'google' 또는 'kakao'
- ✅ created_at: 생성 시각

---

## 🐛 문제 해결

### 1. "Invalid Redirect URI" 오류

**원인:** OAuth 제공자에 Redirect URI가 등록되지 않음

**해결:**
```
Google Cloud Console / Kakao Developers에서 확인:
✅ https://[PROJECT_REF].supabase.co/auth/v1/callback
✅ http://localhost:3000/auth/callback (개발용)
```

### 2. 로그인 후 리다이렉트 안 됨

**원인:** `next` 파라미터가 전달되지 않음

**해결:**
```typescript
// LoginModal.tsx에서 확인
const currentUrl = window.location.href
body: JSON.stringify({ provider, origin: currentUrl })
```

### 3. 세션이 유지되지 않음

**원인:** Middleware 설정 누락

**해결:**
```typescript
// middleware.ts 파일 확인
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

### 4. Profiles 테이블에 데이터가 없음

**원인:** 트리거가 실행되지 않음

**해결:**
```sql
-- 트리거 확인
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 수동으로 프로필 생성
INSERT INTO public.profiles (id, email, role)
VALUES ('[USER_ID]', 'user@example.com', 'User');
```

---

## 📚 추가 기능

### 사용자 정보 가져오기

```typescript
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }

    loadUser()
  }, [])

  return (
    <div>
      <p>이메일: {user?.email}</p>
      <p>이름: {profile?.full_name}</p>
      <p>권한: {profile?.role}</p>
    </div>
  )
}
```

### 권한 기반 UI

```typescript
const isAdmin = profile?.role === 'Admin'

return (
  <>
    {isAdmin && (
      <button>관리자 기능</button>
    )}
  </>
)
```

---

## 🚀 프로덕션 배포

### Vercel 배포

1. **환경 변수 설정**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - `.env.local`의 모든 변수 추가

2. **Redirect URI 업데이트**
   ```
   Google Cloud Console / Kakao Developers:
   ✅ https://your-domain.vercel.app/auth/callback
   ```

3. **NEXT_PUBLIC_SITE_URL 업데이트**
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **배포**
   ```bash
   git push origin main
   # Vercel이 자동으로 배포
   ```

---

## ✅ 완료!

이제 Memoir 랜딩페이지에서 Google/Kakao 로그인이 완벽하게 작동하며, 로그인 후 사용자가 원래 보고 있던 페이지로 자동 복귀합니다! 🎉

**다음 단계:**
- 관리자 대시보드 구현
- 실제 인터뷰 기능 개발
- 권한별 UI 분리
