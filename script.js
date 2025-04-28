document.addEventListener('DOMContentLoaded', function() {
    // 1. 프리로더 관리
    function handlePreloader() {
        if (document.readyState === 'complete') {
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, 1300); // 1.3초 대기
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    document.body.classList.add('loaded');
                }, 1300); // 1.3초 대기
            });
        }
    }

    // 2. AOS 초기화
    function initAOS() {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    // 3. 네비게이션 스크롤 효과
    function initNavigation() {
        const mainNav = document.querySelector('.main-nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainNav.classList.add('compact');
            } else {
                mainNav.classList.remove('compact');
            }
            lastScrollY = window.scrollY;
        });
    }

    // 4. 히어로 슬라이더
    function initHeroSlider() {
        const slider = document.querySelector('.hero-slider');
        const slides = document.querySelectorAll('.hero-slide');
        
        if (!slider || slides.length === 0) return;

        let currentSlide = 1;
        slider.style.transform = `translateX(-${currentSlide * 100}vw)`;

        function moveSlide() {
            currentSlide++;
            slider.style.transition = 'transform 0.8s ease';
            slider.style.transform = `translateX(-${currentSlide * 100}vw)`;

            if (currentSlide === slides.length - 1) {
                setTimeout(() => {
                    slider.style.transition = 'none';
                    currentSlide = 1;
                    slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
                }, 800);
            }
        }

        setTimeout(() => {
            setInterval(moveSlide, 3000);
        }, 1500);
    }

    // 5. 모바일 메뉴
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');

        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', () => {
                const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
                hamburger.setAttribute('aria-expanded', !isExpanded);
                hamburger.setAttribute('aria-label', isExpanded ? '메뉴 열기' : '메뉴 닫기');
                mobileNav.classList.toggle('active');
            });

            // 모바일 메뉴 링크 클릭 시
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('menu-active');
                    
                    // 모든 링크에서 active 클래스 제거
                    mobileNavLinks.forEach(l => l.classList.remove('active'));
                    // 클릭된 링크에 active 클래스 추가
                    link.classList.add('active');
                });
            });
        }
    }

    // 6. 스크롤 스파이
    function initScrollSpy() {
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');
        
        function updateActiveSection() {
            const sections = ['home', 'story', 'menu', 'explore', 'franchise'];
            const currentSection = sections.find(section => {
                if (section === 'home') {
                    return window.scrollY < 100;
                }
                const element = document.querySelector(`#${section}-section`) || 
                              document.querySelector(`#${section}`);
                if (!element) return false;
                
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
            });

            if (currentSection) {
                // 데스크톱 메뉴 업데이트
                navLinks.forEach(link => {
                    link.classList.toggle('active', 
                        link.getAttribute('data-section') === currentSection);
                });
                
                // 모바일 메뉴 업데이트
                mobileNavLinks.forEach(link => {
                    link.classList.toggle('active', 
                        link.getAttribute('data-section') === currentSection);
                });
            }
        }

        // 스크롤 이벤트에 throttle 적용
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // 초기 로드 시 실행
        updateActiveSection();
    }

    // 7. 메뉴 카테고리 필터링
    function initMenuFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const menuItems = document.querySelectorAll('.menu-item');

        function showCategory(category) {
            // 버튼 active 상태 관리
            categoryButtons.forEach(button => {
                button.classList.toggle('active', button.dataset.category === category);
            });

            // 메뉴 아이템 active 상태 관리
            menuItems.forEach(item => {
                item.classList.toggle('active', item.dataset.category === category);
            });
        }

        // 기본: IceCream 카테고리 보여주기
        showCategory('icecream');

        // 버튼 클릭 이벤트
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedCategory = button.getAttribute('data-category');
                showCategory(selectedCategory);
            });
        });
    }

    // 8. 주소 복사 버튼 접근성
    function initCopyAddressButton() {
        document.querySelectorAll('.copy-address-btn').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(button.dataset.address);
                    button.setAttribute('aria-label', '주소가 복사되었습니다');
                    setTimeout(() => {
                        button.setAttribute('aria-label', button.dataset.originalLabel);
                    }, 2000);
                } catch (err) {
                    button.setAttribute('aria-label', '주소 복사에 실패했습니다');
                }
            });
        });
    }

    // FAQ 기능 초기화
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // 다른 모든 FAQ 항목 닫기
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.maxHeight = '0px';
                            }
                        }
                    });
                    
                    // 현재 항목 토글
                    item.classList.toggle('active');
                    if (!isActive) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = '0px';
                    }
                });
            }
        });
    }

    // 모든 기능 초기화
    function initializeAll() {
        handlePreloader();
        initAOS();
        initNavigation();
        initHeroSlider();
        initMobileMenu();
        initScrollSpy();
        initMenuFilter();
        initCopyAddressButton();
        initFAQ();
    }

    // 실행
    initializeAll();

    const scrollTrack = document.querySelector('.scroll-track');
    
    // 터치 디바이스 대응
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollTrack.style.animationPlayState = 'paused';
        startX = e.pageX - scrollTrack.offsetLeft;
        scrollLeft = scrollTrack.scrollLeft;
    });

    scrollTrack.addEventListener('mouseleave', () => {
        isDown = false;
        scrollTrack.style.animationPlayState = 'running';
    });

    scrollTrack.addEventListener('mouseup', () => {
        isDown = false;
        scrollTrack.style.animationPlayState = 'running';
    });

    scrollTrack.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollTrack.offsetLeft;
        const walk = (x - startX) * 2;
        scrollTrack.scrollLeft = scrollLeft - walk;
    });
});