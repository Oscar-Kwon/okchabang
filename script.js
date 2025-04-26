document.addEventListener('DOMContentLoaded', function() {
    // 1. 프리로더 관리
    function handlePreloader() {
        if (document.readyState === 'complete') {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        } else {
            window.addEventListener('load', () => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
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
                hamburger.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.classList.toggle('menu-active');
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

    // 모든 기능 초기화
    function initializeAll() {
        handlePreloader();
        initAOS();
        initNavigation();
        initHeroSlider();
        initMobileMenu();
        initScrollSpy();
    }

    // 실행
    initializeAll();

    const section = document.querySelector('.brand-story');
    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    const image3 = document.getElementById('image3');
    const text = document.querySelector('.brand-text');
    
    let ticking = false;

    function updateImagesOnScroll(scrollProgress) {
        // 이미지 2 애니메이션
        if (scrollProgress > 0.15) {
            const progress2 = Math.min(1, (scrollProgress - 0.15) / 0.3);
            const translateY2 = 100 * (1 - progress2);
            const translateX2 = progress2 * -10; // 좌우 오프셋 추가
            image2.style.transform = `translate(calc(-50% + ${translateX2}%), calc(-50% + ${translateY2}vh))`;
            image2.style.opacity = progress2;
        } else {
            image2.style.transform = 'translate(-50%, calc(-50% + 100vh))';
            image2.style.opacity = 0;
        }

        // 이미지 3 애니메이션
        if (scrollProgress > 0.45) {
            const progress3 = Math.min(1, (scrollProgress - 0.45) / 0.3);
            const translateY3 = 200 * (1 - progress3);
            const translateX3 = progress3 * 10; // 좌우 오프셋 추가
            image3.style.transform = `translate(calc(-50% + ${translateX3}%), calc(-50% + ${translateY3}vh))`;
            image3.style.opacity = progress3;
        } else {
            image3.style.transform = 'translate(-50%, calc(-50% + 200vh))';
            image3.style.opacity = 0;
        }

        // 스택 효과 적용
        if (scrollProgress > 0.8) {
            image1.style.transform = 'translate(-60%, -50%)';
            image2.style.transform = 'translate(-40%, -50%)';
            image3.style.transform = 'translate(-50%, -50%)';
        }

        // 텍스트 애니메이션
        if (scrollProgress > 0.5) {
            text.style.opacity = 1;
            text.style.transform = 'translateY(0)';
        } else {
            text.style.opacity = 0;
            text.style.transform = 'translateY(20px)';
        }
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const rect = section.getBoundingClientRect();
                const scrollProgress = Math.max(0, Math.min(1, 
                    -rect.top / (rect.height - window.innerHeight)
                ));
                
                updateImagesOnScroll(scrollProgress);
                ticking = false;
            });

            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 초기 상태 설정

    const categoryChips = document.querySelectorAll('.category-chip');
    const menuCategories = document.querySelectorAll('.menu-category');

    // 카테고리 변경 함수
    function changeCategory(categoryName) {
        // 모든 칩 비활성화
        categoryChips.forEach(chip => {
            chip.classList.remove('active');
        });

        // 선택된 칩 활성화
        const activeChip = document.querySelector(`[data-category="${categoryName}"]`);
        activeChip.classList.add('active');

        // 모든 메뉴 카테고리 숨기기
        menuCategories.forEach(category => {
            category.classList.remove('active');
        });

        // 선택된 카테고리 표시
        const activeCategory = document.querySelector(`.menu-category[data-category="${categoryName}"]`);
        activeCategory.classList.add('active');
    }

    // 칩 클릭 이벤트 리스너
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const category = chip.dataset.category;
            changeCategory(category);
        });
    });

    // 메뉴 데이터 (실제 데이터로 교체 필요)
    const menuData = {
        icecream: [
            {
                image: 'image/marble-latte.png',
                title: '말차 마블 라떼',
                description: '마블 아이스크림과 프리미엄 말차의 달콤한 조화'
            },
            // 추가 아이스크림 메뉴...
        ],
        coffee: [
            {
                image: 'image/coffee1.png',
                title: '시그니처 커피',
                description: '깊은 풍미가 느껴지는 프리미엄 블렌드'
            },
            // 추가 커피 메뉴...
        ],
        // 다른 카테고리 메뉴...
    };

    // 메뉴 렌더링 함수
    function renderMenuItems(category) {
        const menuContainer = document.querySelector(`.menu-category[data-category="${category}"]`);
        const items = menuData[category];

        menuContainer.innerHTML = items.map(item => `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    // 초기 메뉴 렌더링
    Object.keys(menuData).forEach(category => {
        renderMenuItems(category);
    });

    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    function toggleMenuCategory(category) {
        // 모든 버튼 비활성화
        categoryButtons.forEach(btn => btn.classList.remove('active'));

        // 선택된 버튼 활성화
        const activeBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // 메뉴 아이템 필터링
        menuItems.forEach(item => {
            if (item.dataset.category === category) {
                item.style.display = 'flex'; // flex로 표시하여 내부 요소들 중앙 정렬
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 카테고리 버튼 클릭 이벤트
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedCategory = btn.dataset.category;
            toggleMenuCategory(selectedCategory);
        });
    });

    // 초기 카테고리 설정
    toggleMenuCategory('icecream');

    // 네이버 지도 초기화
    function initMap() {
        var mapOptions = {
            center: new naver.maps.LatLng(35.0987, 129.0403), // 부산 중구 롯데백화점 기준
            zoom: 15
        };

        var map = new naver.maps.Map('map', mapOptions);

        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(35.0987, 129.0403),
            map: map,
            title: '옥차방 부산점'
        });
    }

    // 페이지 로드 시 지도 초기화
    window.addEventListener('load', initMap);

    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideCount = slides.length - 1; // 복제된 마지막 제외

    function moveSlide() {
        currentSlide++;

        // 이동 직전 - gap 20px 추가
        sliderTrack.style.gap = '20px';
        sliderTrack.style.transition = 'transform 0.8s ease, gap 0.8s ease';
        sliderTrack.style.transform = `translateX(-${(100 * currentSlide)}vw)`;

        // 이동 완료 후 - gap 다시 0px로 줄이기
        setTimeout(() => {
            sliderTrack.style.gap = '0px';

            // 마지막 복제 슬라이드 도달 시
            if (currentSlide === slideCount) {
                setTimeout(() => {
                    sliderTrack.style.transition = 'none';
                    sliderTrack.style.transform = 'translateX(0)';
                    currentSlide = 0;
                }, 300); // 자연스럽게
            }
        }, 800); // transform 끝나고 gap 닫기
    }

    // 5초마다 이동
    setInterval(moveSlide, 5000);
});