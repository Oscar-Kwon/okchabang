document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const progressElement = document.querySelector('.loading-progress');
    let progress = 0;

    // 로딩 진행률 업데이트 함수
    function updateProgress() {
        const increment = Math.random() * 10;
        progress = Math.min(progress + increment, 100);
        progressElement.textContent = Math.floor(progress) + '%';

        if (progress < 100) {
            setTimeout(updateProgress, 200);
        } else {
            // 로딩 완료 시 처리
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
                
                // 프리로더 완전히 제거 (위로 슬라이드 애니메이션 완료 후)
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, 500);
        }
    }

    // 페이지 로드 상태 확인 및 프리로더 시작
    if (document.readyState === 'complete') {
        updateProgress();
    } else {
        window.addEventListener('load', updateProgress);
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
                const element = document.querySelector(`#${section}`);
                if (!element) return false;
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
            });

            if (currentSection) {
                navLinks.forEach(link => {
                    const linkSection = link.getAttribute('data-section');
                    link.classList.toggle('active', linkSection === currentSection);
                });
                
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

        categoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                // 1. 모든 버튼에서 active 제거
                categoryButtons.forEach(btn => btn.classList.remove("active"));

                // 2. 클릭된 버튼에만 active 추가
                button.classList.add("active");

                // 3. 모든 메뉴 숨기고 해당 카테고리만 표시
                const category = button.dataset.category;
                menuItems.forEach(item => {
                    item.style.display = (item.dataset.category === category) ? "flex" : "none";
                });
            });
        });

        // 페이지 로드 시 기본 카테고리(예: icecream)만 표시
        window.addEventListener("DOMContentLoaded", () => {
            const defaultCategory = "icecream";
            categoryButtons.forEach(btn => {
                btn.classList.toggle("active", btn.dataset.category === defaultCategory);
            });
            menuItems.forEach(item => {
                item.style.display = (item.dataset.category === defaultCategory) ? "flex" : "none";
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

    const categoryButtons = document.querySelector('.category-buttons');
    
    if (categoryButtons) {
        categoryButtons.addEventListener('scroll', function() {
            const isScrollable = this.scrollWidth > this.clientWidth;
            const isScrolledToEnd = Math.abs(this.scrollWidth - this.clientWidth - this.scrollLeft) < 1;
            
            // 스크롤이 끝에 도달하면 그라데이션 제거
            this.style.setProperty('--after-opacity', isScrolledToEnd ? '0' : '1');
            
            // 스크롤이 불가능하면 그라데이션 제거
            if (!isScrollable) {
                this.style.setProperty('--after-opacity', '0');
            }
        });
        
        // 초기 상태 체크
        const isScrollable = categoryButtons.scrollWidth > categoryButtons.clientWidth;
        categoryButtons.style.setProperty('--after-opacity', isScrollable ? '1' : '0');
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbw610uo65uPY2ejgrsttawOZVgvaOGWuYILwb8vY-9zU61PTChtzxP9EI4Y0JDgv4kiDw/exec';
    const form = document.getElementById('franchise-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 버튼 비활성화 및 UX 메시지
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';

        // fetch 요청 설정 개선
        fetch(scriptURL, {
            method: 'POST',
            body: new FormData(form),
            redirect: 'follow',  // 리디렉션 처리
            mode: 'no-cors',     // CORS 정책 우회
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert("문의가 성공적으로 접수되었습니다.");
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '5분 상담 문의';
        });
    });
});