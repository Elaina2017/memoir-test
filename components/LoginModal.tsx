'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsLoading(true)
    
    try {
      // Get current page URL to return after login
      const currentUrl = window.location.href
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          provider,
          origin: currentUrl
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to OAuth provider
        window.location.href = data.url
      } else if (data.error) {
        console.error('Login error:', data.error)
        alert(`로그인 중 오류가 발생했습니다: ${data.error}`)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button 
          className="modal-close" 
          onClick={onClose}
          disabled={isLoading}
        >
          &times;
        </button>
        <h2 className="modal-title">로그인/회원가입</h2>
        <div className="modal-buttons">
          <button 
            className="social-login-btn google-btn"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="social-logo"
            />
            <span className="social-text">
              {isLoading ? '로그인 중...' : '구글로 계속하기'}
            </span>
          </button>
          <button 
            className="social-login-btn kakao-btn"
            onClick={() => handleSocialLogin('kakao')}
            disabled={isLoading}
          >
            <svg className="social-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M12 3C6.477 3 2 6.418 2 10.637c0 2.672 1.739 5.011 4.362 6.333l-.924 3.387a.249.249 0 0 0 .378.277l4.265-2.812a13.28 13.28 0 0 0 1.919.138c5.523 0 10-3.418 10-7.637C22 6.418 17.523 3 12 3z"/>
            </svg>
            <span className="social-text">
              {isLoading ? '로그인 중...' : '카카오로 계속하기'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
