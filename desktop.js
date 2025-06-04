document.addEventListener('DOMContentLoaded', () => {
    const allTabButtons = document.querySelectorAll('[data-tab]');
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const navUnderline = document.querySelector('.nav-underline');
    const mainNav = document.getElementById('main-nav');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    const updateUnderline = (activeButton) => {
        if (activeButton && window.innerWidth >= 768) {
            navUnderline.style.width = `${activeButton.offsetWidth}px`;
            navUnderline.style.left = `${activeButton.offsetLeft}px`;
            navUnderline.style.opacity = '1';
        } else {
            navUnderline.style.opacity = '0';
        }
    };

    const setActiveTab = (tabId, initialLoad = false) => {
        allTabButtons.forEach(button => {
            button.classList.remove('active');
        });

        const clickedButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }

        const activeButtonForUnderline = document.querySelector(`.nav-button[data-tab="${tabId}"]`);
        updateUnderline(activeButtonForUnderline);

        contentSections.forEach(section => {
            if (section.id === `${tabId}-section`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        if (!initialLoad && mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            mobileMenuButton.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    };

    const carousel = () => {
        const carouselContainer = document.querySelector('.carousel-container');
        const slides = document.querySelector('.carousel-slides');
        const images = document.querySelectorAll('.carousel-image');
        const prevBtn = document.querySelector('.carousel-arrow.prev');
        const nextBtn = document.querySelector('.carousel-arrow.next');

        let currentIndex = 0;
        const totalImages = images.length;
        let intervalId;

        const firstClone = images[0].cloneNode(true);
        const lastClone = images[totalImages - 1].cloneNode(true);

        slides.appendChild(firstClone);
        slides.insertBefore(lastClone, images[0]);

        slides.style.transform = `translateX(-100%)`;

        const updateCarousel = (direction) => {
            slides.style.transition = 'transform 0.5s ease-in-out';

            if (direction === 'next') {
                currentIndex++;
                slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            } else if (direction === 'prev') {
                currentIndex--;
                slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            }

            if (currentIndex >= totalImages) {
                setTimeout(() => {
                    slides.style.transition = 'none';
                    currentIndex = 0;
                    slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
                }, 500);
            } else if (currentIndex < 0) {
                setTimeout(() => {
                    slides.style.transition = 'none';
                    currentIndex = totalImages - 1;
                    slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
                }, 500);
            }
        };

        const nextSlide = () => {
            updateCarousel('next');
            resetInterval();
        };

        const prevSlide = () => {
            updateCarousel('prev');
            resetInterval();
        };

        const startInterval = () => {
            intervalId = setInterval(nextSlide, 6000);
        };

        const resetInterval = () => {
            clearInterval(intervalId);
            startInterval();
        };

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        startInterval();

        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            startInterval();
        });

        slides.addEventListener('transitionend', () => {
            if (currentIndex >= totalImages) {
                slides.style.transition = 'none';
                currentIndex = 0;
                slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            } else if (currentIndex < 0) {
                slides.style.transition = 'none';
                currentIndex = totalImages - 1;
                slides.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            }
        });
    };

    allTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveTab(button.dataset.tab);
        });
    });

    mobileMenuButton.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        const icon = mobileMenuButton.querySelector('i');
        if (mainNav.classList.contains('open')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    window.addEventListener('resize', () => {
        const activeNavButton = document.querySelector('.nav-button.active');
        updateUnderline(activeNavButton);
    });

    if (window.innerWidth < 768) {
        navUnderline.style.opacity = '0';
    }

    setActiveTab('about', true);

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    carousel();
    lucide.createIcons();
});
