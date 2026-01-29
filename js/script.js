// Memoir Landing Page - Interactive Script

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Configure Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    // Callback function for observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with slight delay for smoother effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
                
                // Optional: Stop observing after animation triggers
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create observer instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with fade-in-scroll class
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Start button (Login/Signup)
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', function() {
            console.log('시작하기 clicked - Login/Signup');
            alert('로그인/회원가입 페이지로 이동합니다.');
            // Future: window.location.href = '/login';
        });
    }

    // Smooth scroll for CTA button (if needed for future anchor links)
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Placeholder for future functionality
            // Could link to a form, modal, or external page
            console.log('샘플 인터뷰 진행하기 clicked');
            alert('샘플 인터뷰가 곧 시작됩니다. Memoir와 함께 엄마의 이야기를 기록해보세요.');
        });
    }

    // Optional: Add hover effects for TOC items
    const tocItems = document.querySelectorAll('.toc-item');
    tocItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Parallax effect for hero section (subtle)
    let lastScrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Subtle parallax for hero content
        if (hero && scrollY < window.innerHeight) {
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.5;
            }
        }
        
        lastScrollY = scrollY;
    });

    // Add subtle fade-in on page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);

});

// Optional: Add reading progress indicator (subtle)
window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = (window.scrollY / documentHeight) * 100;
    
    // Could add a progress bar if desired
    // For now, just log for debugging
    // console.log(`Reading progress: ${scrolled.toFixed(0)}%`);
});