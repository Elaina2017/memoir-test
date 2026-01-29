# Supabase Profiles 테이블 설정 가이드

## 📋 개요

Memoir 프로젝트를 위한 Supabase Profiles 테이블 설정 가이드입니다.
유저 권한 관리(Admin, User, Null)가 포함되어 있습니다.

**참고 문서:** https://supabase.com/docs/guides/auth/managing-user-data

---

## 🗂️ 테이블 구조

### Profiles 테이블

| 필드명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | UUID | 유저 ID (auth.users 참조) | PRIMARY KEY, FOREIGN KEY |
| `email` | TEXT | 이메일 주소 | UNIQUE |
| `full_name` | TEXT | 전체 이름 | - |
| `avatar_url` | TEXT | 프로필 이미지 URL | - |
| `role` | user_role | 유저 권한 (Admin, User, Null) | DEFAULT 'User' |
| `provider` | TEXT | OAuth 제공자 (google, kakao 등) | - |
| `created_at` | TIMESTAMPTZ | 생성 시각 | DEFAULT now() |
| `updated_at` | TIMESTAMPTZ | 수정 시각 | DEFAULT now() |

### User Role ENUM

```sql
CREATE TYPE user_role AS ENUM ('Admin', 'User', 'Null');
```

- **Admin**: 관리자 권한 (모든 프로필 조회/수정 가능)
- **User**: 일반 사용자 (본인 프로필만 조회/수정 가능)
- **Null**: 권한 없음 (제한된 접근)

---

## 🚀 설정 방법

### 1단계: Supabase 프로젝트 생성

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `memoir`
   - Database Password: 안전한 비밀번호 생성
   - Region: 가까운 지역 선택 (예: Seoul)
4. "Create new project" 클릭

### 2단계: SQL 스크립트 실행

1. Supabase Dashboard에서 **SQL Editor** 탭 이동
2. "New query" 클릭
3. `supabase/profiles_table.sql` 파일 내용 복사
4. SQL Editor에 붙여넣기
5. "Run" 클릭하여 실행

### 3단계: OAuth 제공자 설정

#### Google OAuth 설정

1. Dashboard → Authentication → Providers
2. Google 선택
3. "Enable Google provider" 활성화
4. Google Cloud Console에서:
   - OAuth 2.0 클라이언트 ID 생성
   - Authorized redirect URIs 추가:
     ```
     https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     ```
5. Client ID와 Client Secret을 Supabase에 입력
6. "Save" 클릭

#### Kakao OAuth 설정

1. [Kakao Developers](https://developers.kakao.com) 접속
2. 애플리케이션 생성
3. 제품 설정 → 카카오 로그인 활성화
4. Redirect URI 추가:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
5. Supabase에서 Custom OAuth 설정 (또는 Third-party 사용)

### 4단계: 환경 변수 설정

프로젝트에 `.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

**API Keys 찾기:**
- Dashboard → Project Settings → API

---

## 🔒 Row Level Security (RLS) 정책

### 자동 생성된 정책:

1. **Users can view own profile**
   - 사용자는 본인 프로필만 조회 가능

2. **Users can update own profile**
   - 사용자는 본인 프로필만 수정 가능

3. **Admins can view all profiles**
   - 관리자는 모든 프로필 조회 가능

4. **Admins can update any profile**
   - 관리자는 모든 프로필 수정 가능

---

## 🤖 자동화 기능

### 1. 신규 유저 자동 프로필 생성

사용자가 OAuth 로그인하면 자동으로 profiles 테이블에 레코드 생성:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. 자동 updated_at 갱신

프로필 수정 시 자동으로 `updated_at` 타임스탬프 갱신:

```sql
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 💻 JavaScript/TypeScript 사용 예제

### Supabase 클라이언트 설정

```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Google 로그인

```javascript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

### Kakao 로그인

```javascript
const signInWithKakao = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

### 프로필 조회

```javascript
const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return data
}
```

### 프로필 업데이트

```javascript
const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  
  return data
}
```

### 권한 확인

```javascript
const isAdmin = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return data?.role === 'Admin'
}
```

### 모든 프로필 조회 (Admin만)

```javascript
const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return data
}
```

---

## 🎯 관리자 권한 부여

첫 번째 사용자를 관리자로 만들려면:

```sql
-- Supabase SQL Editor에서 실행
UPDATE public.profiles
SET role = 'Admin'
WHERE email = 'your-email@example.com';
```

또는 Dashboard에서:
1. Table Editor → profiles 테이블
2. 해당 유저 찾기
3. role 컬럼을 'Admin'으로 변경

---

## 📊 데이터 조회 예제

### 테스트 데이터 확인

```sql
-- 모든 프로필 조회
SELECT * FROM public.profiles;

-- 관리자만 조회
SELECT * FROM public.profiles WHERE role = 'Admin';

-- 최근 가입자 조회
SELECT * FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔐 보안 체크리스트

- ✅ RLS (Row Level Security) 활성화됨
- ✅ 사용자는 본인 프로필만 접근 가능
- ✅ 관리자는 모든 프로필 접근 가능
- ✅ 익명 사용자는 SELECT만 가능
- ✅ auth.users와 profiles가 CASCADE로 연결
- ✅ 자동 프로필 생성 트리거 설정
- ✅ updated_at 자동 갱신

---

## 🐛 문제 해결

### 프로필이 자동 생성되지 않을 때

```sql
-- 트리거 확인
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 수동으로 프로필 생성
INSERT INTO public.profiles (id, email, role)
VALUES (
  '[USER_ID]',
  'user@example.com',
  'User'
);
```

### RLS 정책 테스트

```sql
-- 현재 사용자 확인
SELECT auth.uid();

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

## 📚 추가 리소스

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 🎉 완료!

이제 Memoir 프로젝트에서 Supabase를 사용한 유저 인증 및 권한 관리가 준비되었습니다!

**다음 단계:**
1. 프론트엔드에서 Supabase 클라이언트 연동
2. 로그인 모달에 실제 OAuth 로직 적용
3. 관리자 페이지 구현 (권한별 UI 분리)
