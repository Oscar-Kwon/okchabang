document.addEventListener('DOMContentLoaded', () => {
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

  // 메뉴 카테고리 전환 함수
  function toggleMenuCategory(category) {
    // 모든 버튼의 active 클래스 제거
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 선택된 카테고리 버튼에 active 클래스 추가
    document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
    
    // 모든 메뉴 아이템 숨기기
    document.querySelectorAll('.menu-item').forEach(item => {
      item.style.display = 'none';
      item.classList.remove('active');
    });
    
    // 선택된 카테고리의 메뉴 아이템만 보이기
    document.querySelectorAll(`.menu-item[data-category="${category}"]`).forEach(item => {
      item.style.display = 'flex';
      item.classList.add('active');
    });
  }

  // 초기 카테고리 설정
  toggleMenuCategory('icecream');

  // 카테고리 버튼 클릭 이벤트 리스너
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      toggleMenuCategory(category);
    });
  });

  // 햄버거 메뉴 관련 요소들
  const menuToggle = document.querySelector('.menu-toggle');
  const body = document.body;
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // 햄버거 메뉴 토글
  menuToggle.addEventListener('click', () => {
    body.classList.toggle('menu-active');
  });

  // 오버레이 클릭시 메뉴 닫기
  mobileMenuOverlay.addEventListener('click', () => {
    body.classList.remove('menu-active');
  });

  // 모바일 메뉴 링크 클릭시 메뉴 닫기
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      body.classList.remove('menu-active');
    });
  });

  // 스크롤시 메뉴 닫기
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (Math.abs(currentScroll - lastScroll) > 50) {
      body.classList.remove('menu-active');
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
});