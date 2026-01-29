import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { provider, origin } = await request.json()

  if (!provider || !['google', 'kakao'].includes(provider)) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    )
  }

  const supabase = createClient()

  // Create OAuth URL with the current page as redirect
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'kakao',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(origin)}`,
    },
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: data.url })
}
