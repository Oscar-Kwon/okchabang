document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');
  
  // 프리로더 초기화
  function initPreloader() {
    document.body.classList.add('loading');
    mainContent.style.visibility = 'hidden';
  }

  // 프리로더 숨기기
  function hidePreloader() {
    const logo = preloader.querySelector('img');
    
    // 로고 exit 애니메이션 추가
    logo.style.animation = 'logoExit 0.6s cubic-bezier(0.7, 0, 0.3, 1) forwards';

    // 프리로더 제거
    setTimeout(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
      mainContent.style.visibility = 'visible';
        
      // 프리로더 완전히 제거 (위로 슬라이드 애니메이션 완료 후)
        setTimeout(() => {
          preloader.style.display = 'none';
      }, 800); // 슬라이드 애니메이션 시간과 동일하게 설정
    }, 1300); // 로고 애니메이션 시간
  }

  // 페이지 로드 완료 확인
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    initPreloader();
    window.addEventListener('load', hidePreloader);
  }

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

  // 햄버거 메뉴 관련 코드 수정
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('menu-active');
  });

  // 메뉴 링크 클릭하면 메뉴 닫기
  const menuLinks = document.querySelectorAll('.mobile-nav-menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('menu-active');
    });
  });

  // 스크롤시 메뉴 닫기
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (Math.abs(currentScroll - lastScroll) > 50) {
      document.body.classList.remove('menu-active');
      lastScroll = currentScroll;
    }
  });

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
  const slideCount = slides.length / 2; // 실제 슬라이드 개수 (복제 제외)
  let currentSlide = 0;
  
  function moveSlide() {
    currentSlide++;
    sliderTrack.style.transition = 'transform 1s ease-in-out';
    sliderTrack.style.transform = `translateX(-${(currentSlide * 100) / slides.length}%)`;
    
    // 마지막 슬라이드에 도달했을 때
    if (currentSlide === slideCount) {
      // 애니메이션이 끝난 후 첫 번째 슬라이드로 즉시 이동 (트랜지션 없이)
      setTimeout(() => {
        sliderTrack.style.transition = 'none';
        currentSlide = 0;
        sliderTrack.style.transform = `translateX(0)`;
      }, 1000);
    }
  }

  // 5초마다 슬라이드 이동
  setInterval(moveSlide, 5000);

  // 스크롤 시 현재 섹션에 해당하는 메뉴 활성화
  window.addEventListener('scroll', () => {
    const sections = {
        home: { id: '', offset: 0 },
        story: { id: 'story-section', offset: 100 },
        menu: { id: 'featured-menu', offset: 100 },
        explore: { id: 'explore', offset: 100 },
        franchise: { id: 'franchise', offset: 100 }
    };

    const scrollPosition = window.scrollY + 100;
    let currentSection = 'home';

    // home 섹션 체크
    if (scrollPosition < window.innerHeight) {
        currentSection = 'home';
    } else {
        // 다른 섹션들 체크
        Object.entries(sections).forEach(([sectionName, { id, offset }]) => {
            if (!id) return; // home 섹션 스킵
            
            const element = document.getElementById(id);
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const sectionBottom = sectionTop + rect.height;

            if (scrollPosition >= sectionTop - offset && scrollPosition < sectionBottom) {
                currentSection = sectionName;
            }
        });
    }

    // 네비게이션 링크 업데이트
    document.querySelectorAll('.nav-link').forEach(link => {
        const sectionName = link.getAttribute('data-section');
        link.classList.toggle('active', sectionName === currentSection);
    });
  });
});