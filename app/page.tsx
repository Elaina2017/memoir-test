'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import LoginModal from '@/components/LoginModal'
import '../styles/globals.css'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, 100)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const fadeElements = document.querySelectorAll('.fade-in-scroll')
    fadeElements.forEach(element => observer.observe(element))

    // TOC hover effects
    const tocItems = document.querySelectorAll('.toc-item')
    tocItems.forEach(item => {
      const element = item as HTMLElement
      element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)'
      })
      element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)'
      })
    })

    // Hero parallax
    const hero = document.querySelector('.hero')
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (hero && scrollY < window.innerHeight) {
        const heroContent = hero.querySelector('.hero-content') as HTMLElement
        if (heroContent) {
          heroContent.style.transform = `translateY(${scrollY * 0.3}px)`
          heroContent.style.opacity = String(1 - (scrollY / window.innerHeight) * 0.5)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin: window.location.href }),
      })

      const data = await response.json()
      
      if (data.success) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  const handleCTAClick = () => {
    if (user) {
      alert('샘플 인터뷰가 곧 시작됩니다. Memoir와 함께 엄마의 이야기를 기록해보세요.')
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        
        {/* Navigation Header Inside Hero */}
        <header className="header">
          <div className="header-container">
            <h1 className="logo">Memoir</h1>
            {user ? (
              <button className="start-button" onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <button className="start-button" onClick={() => setIsModalOpen(true)}>
                시작하기
              </button>
            )}
          </div>
        </header>
        
        <div className="hero-content fade-in">
          <h1 className="hero-title">
            잊고 지낸 엄마의 순간들을 모아,<br />
            세상에서 가장 따뜻한 보석함을<br />
            선물하세요.
          </h1>
          <p className="hero-subtitle">부담 없이 채팅으로 완성하는 엄마의 첫 번째 책, Memoir</p>
        </div>
      </section>

      {/* Context Section - 01. 기억의 재발견 */}
      <section className="chapter-section fade-in-scroll">
        <div className="container">
          <div className="chapter-layout">
            <div className="chapter-number">01</div>
            <div className="chapter-content">
              <h2 className="chapter-title">기억의 재발견</h2>
              <h3 className="chapter-subtitle">&quot;엄마와 함께한 수많은 시간, 그 소중한 조각들을 어디에 두고 오셨나요?&quot;</h3>
              <div className="chapter-description">
                <p>문득 떠오르는 엄마의 부엌 냄새, 나를 부르던 목소리.</p>
                <p>희미해져 가는 기억들을 붙잡아, 내가 사랑한 엄마의 모습을 기록하고 싶을 때.</p>
                <p>Memoir는 당신의 기억 속에 잠들어 있는 엄마를 다시 마주하게 합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution 1 Section - 02. 나의 시선 */}
      <section className="chapter-section fade-in-scroll">
        <div className="container">
          <div className="chapter-layout">
            <div className="chapter-number">02</div>
            <div className="chapter-content">
              <h2 className="chapter-title">나의 시선</h2>
              <h3 className="chapter-subtitle">세상에 하나뿐인 &apos;나의 시선&apos;으로 쓴 엄마의 이야기</h3>
              <div className="chapter-description">
                <p>엄마의 객관적인 업적을 나열하는 책이 아닙니다.</p>
                <p>어린 시절 내가 본 엄마의 뒷모습부터, 지금 내 곁의 엄마까지.</p>
                <p>당신만이 기억하는 엄마의 소중한 9가지 순간을 인터뷰 형식으로 이끌어내어 그 안의 진정한 의미를 찾아드립니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution 2 Section - 03. 다정한 인터뷰 */}
      <section className="chapter-section fade-in-scroll">
        <div className="container">
          <div className="chapter-layout">
            <div className="chapter-number">03</div>
            <div className="chapter-content">
              <h2 className="chapter-title">다정한 인터뷰</h2>
              <h3 className="chapter-subtitle">대화는 가볍게, 기록은 깊이 있게.</h3>
              <div className="chapter-description">
                <p><strong>기억을 깨우는 질문:</strong> &quot;엄마 하면 떠오르는 가장 따뜻한 풍경은 무엇인가요?&quot; Memoir의 섬세한 인터뷰 질문에 답하기만 하세요.</p>
                <p><strong>생생한 문장으로 정돈:</strong> 당신이 툭 던진 기억의 조각들을 Memoir가 정갈한 문장으로 다듬어 드립니다.</p>
                <p><strong>온전한 몰입:</strong> 글쓰기의 기술적인 고민 없이, 오직 엄마와의 추억을 되돌아보는 따뜻한 시간에만 집중하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution 3 Section - 04. 소장 가치 */}
      <section className="chapter-section fade-in-scroll">
        <div className="container">
          <div className="chapter-layout">
            <div className="chapter-number">04</div>
            <div className="chapter-content">
              <h2 className="chapter-title">소장 가치</h2>
              <h3 className="chapter-subtitle">당신이 기억하는 엄마는, 그 자체로 한 권의 문학입니다.</h3>
              <div className="chapter-description">
                <p>단편적인 채팅 메시지가 아닌, 딸의 시선과 감정이 담긴 완성도 높은 에세이북.</p>
                <p>시간이 흐를수록 가치가 더해지는, 당신과 엄마를 잇는 가장 단단한 기록의 결과물입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section fade-in-scroll">
        <div className="container">
          <h2 className="process-title">기억을 되짚는 3단계 여정</h2>
          <div className="process-grid">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3 className="step-title">기억 인터뷰</h3>
              <p className="step-description">9가지 테마를 따라 내 기억 속 엄마의 모습을 들려주세요.</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3 className="step-title">기록의 재발견</h3>
              <p className="step-description">대화 내용이 한 편의 에세이로 정리되는 과정을 확인하며 사진을 더해 보세요.</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3 className="step-title">에세이북 수령</h3>
              <p className="step-description">내가 사랑한 엄마의 모습이 담긴 세상에 단 하나뿐인 책을 선물 받으세요.</p>
            </div>
          </div>
          <div className="cta-container">
            <button className="cta-button" onClick={handleCTAClick}>
              샘플 인터뷰 진행하기
            </button>
          </div>
        </div>
      </section>

      {/* Appendix Section - 9-Block 인터뷰 테마 */}
      <section className="toc-section fade-in-scroll">
        <div className="container-narrow">
          <div className="toc-header">
            <div className="toc-line"></div>
            <h2 className="toc-title">차례</h2>
          </div>
          <div className="toc-content">
            {[
              { num: '01', title: '부엌의 온도', page: '_11' },
              { num: '02', title: '엄마의 서랍 속 접어둔 꿈', page: '_23' },
              { num: '03', title: '나를 부르던 다정한 목소리', page: '_37' },
              { num: '04', title: '내가 본 엄마의 가장 든든한 등', page: '_51' },
              { num: '05', title: '나에게 남겨준 소중한 유산', page: '_67' },
              { num: '06', title: '비 온 뒤 갠 하늘 같은 화해', page: '_83' },
              { num: '07', title: '우리 함께 크게 웃던 날', page: '_97' },
              { num: '08', title: '조금은 작아진 당신의 모습', page: '_111' },
              { num: '09', title: '나의 문장으로 전하는 고백', page: '_125' },
            ].map((item) => (
              <div key={item.num} className="toc-item">
                <span className="toc-chapter">{item.num}</span>
                <span className="toc-text">{item.title}</span>
                <span className="toc-page">{item.page}</span>
              </div>
            ))}
          </div>
          <div className="toc-decoration">
            <svg width="100%" height="60" viewBox="0 0 800 60" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M50 40 L100 30 L150 35 L200 25 L250 30 L300 20 L350 25 L400 30 L450 25 L500 30 L550 35 L600 30 L650 35 L700 30 L750 40" 
                stroke="#D1CDC7" 
                strokeWidth="1" 
                fill="none" 
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">© 2026 Memoir. 엄마를 향한 마음을 담는 디지털 아틀리에.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
