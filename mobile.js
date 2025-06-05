// mobile.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica da Splash Screen (adaptada de splash.js) ---
    const splashScreen = document.getElementById('splash-screen');
    const mainSiteContent = document.getElementById('main-site-content');
    const heroContentSplash = splashScreen ? splashScreen.querySelector('.hero-content') : null;

    if (mainSiteContent) {
        if (!mainSiteContent.classList.contains('hidden')) {
            mainSiteContent.classList.add('hidden');
        }
    }

    if (splashScreen && heroContentSplash) {
        const animationInDuration = 1000;
        const transitionDelayBeforeOut = 1500;
        const animationOutDuration = 600;

        setTimeout(() => {
            heroContentSplash.style.animation = `slideOutDown ${animationOutDuration / 1000}s ease-in forwards`;
            splashScreen.style.transition = `opacity ${animationOutDuration / 1000}s ease-out`;
            splashScreen.style.opacity = '0';
        }, animationInDuration + transitionDelayBeforeOut);

        setTimeout(() => {
            splashScreen.classList.add('hidden');
            if (mainSiteContent) {
                mainSiteContent.classList.remove('hidden');
            }
            heroContentSplash.classList.add('no-animation');
        }, animationInDuration + transitionDelayBeforeOut + animationOutDuration);

    } else if (mainSiteContent) {
        mainSiteContent.classList.remove('hidden');
    }

    // --- Lógica do Menu Mobile, Abas e Carrossel ---
    const mainNav = document.getElementById('main-nav');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const heroActionButtons = document.querySelectorAll('.hero-buttons .button[data-tab]');

    const setActiveTab = (tabId, isInitialLoad = false) => {
        // AJUSTE SCROLL TO TOP: Rolar para o topo da página sempre que uma aba for trocada
        if (!isInitialLoad) { // Não rolar para o topo no carregamento inicial da página
            window.scrollTo({ top: 0, behavior: 'auto' }); // 'auto' para um scroll instantâneo
        }

        navButtons.forEach(button => {
            if (button.dataset.tab === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        let sectionFound = false;
        contentSections.forEach(section => {
            if (section.id === `${tabId}-section`) {
                section.classList.add('active');
                sectionFound = true;
                // A lógica de scroll para a seção específica pode ser removida se o scroll para o topo for suficiente,
                // ou ajustada se você quiser que após o scroll para o topo, ele role para a seção se ela não estiver visível.
                // Por ora, o scroll para o topo já acontece. Se a seção for muito longa, o usuário terá que rolar manualmente.
                // Se quiser um scroll suave para a seção APÓS o scroll para o topo, adicione aqui:
                // if (!isInitialLoad) {
                //     setTimeout(() => { // Delay para garantir que o scroll para o topo já ocorreu
                //         section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                //     }, 50); // Pequeno delay
                // }

            } else {
                section.classList.remove('active');
            }
        });

        if (mainNav && mainNav.classList.contains('open') && !isInitialLoad) {
            mainNav.classList.remove('open');
            if (mobileMenuButton) {
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        }
    };

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('open')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = event.target.closest('[data-tab]').dataset.tab;
            if (tabId) {
                setActiveTab(tabId);
            }
        });
    });

    heroActionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = event.target.closest('[data-tab]').dataset.tab;
            if (tabId) {
                setActiveTab(tabId);
            }
        });
    });

    // --- AJUSTE CARROSSEL LOOP INFINITO: Lógica do Carrossel da Seção "Sobre Mim" ---
    const carouselContainer = document.querySelector('#about-section .carousel-container');
    if (carouselContainer) {
        const slides = carouselContainer.querySelector('.carousel-slides');
        const originalImages = Array.from(slides.querySelectorAll('.carousel-image')); // Converter para Array
        const prevBtn = carouselContainer.querySelector('.carousel-arrow.prev');
        const nextBtn = carouselContainer.querySelector('.carousel-arrow.next');

        if (originalImages.length > 1) {
            // Clonagem dos slides para o loop infinito
            const firstClone = originalImages[0].cloneNode(true);
            const lastClone = originalImages[originalImages.length - 1].cloneNode(true);

            slides.appendChild(firstClone);
            slides.insertBefore(lastClone, originalImages[0]);

            const allImages = slides.querySelectorAll('.carousel-image'); // Agora inclui os clones
            const totalSlidesIncludingClones = allImages.length;

            let currentIndex = 1; // Começa no primeiro slide REAL (após o clone do último)
            let autoSlideInterval;
            let بالضبطising = false; // Flag para evitar múltiplos saltos durante transições rápidas

            const updateCarouselPosition = (smooth = true) => {
                if (smooth) {
                    slides.style.transition = 'transform 0.5s ease-in-out';
                } else {
                    slides.style.transition = 'none'; // Para saltos instantâneos
                }
                slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            };

            updateCarouselPosition(false); // Posição inicial sem transição

            const handleTransitionEnd = () => {
                if (بالضبطising) return;
                بالضبطising = true;

                if (currentIndex === 0) { // Chegou ao clone do último (navegando para a esquerda)
                    currentIndex = totalSlidesIncludingClones - 2; // Salta para o último slide real
                    updateCarouselPosition(false);
                } else if (currentIndex === totalSlidesIncludingClones - 1) { // Chegou ao clone do primeiro (navegando para a direita)
                    currentIndex = 1; // Salta para o primeiro slide real
                    updateCarouselPosition(false);
                }
                setTimeout(() => { بالضبطising = false; }, 50); // Pequeno delay para resetar o flag
            };

            slides.addEventListener('transitionend', handleTransitionEnd);

            const nextImage = () => {
                if (بالضبطising) return;
                currentIndex++;
                updateCarouselPosition();
                resetAutoSlide();
            };

            const prevImage = () => { // Mantida para funcionalidade completa, embora o pedido seja loop para direita
                if (بالضبطising) return;
                currentIndex--;
                updateCarouselPosition();
                resetAutoSlide();
            };

            const startAutoSlide = () => {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(nextImage, 6000); // Muda para a direita
            };

            const resetAutoSlide = () => {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            };

            if (nextBtn) nextBtn.addEventListener('click', nextImage);
            if (prevBtn) prevBtn.addEventListener('click', prevImage); // Botão prev ainda funcional

            let touchStartX = 0;
            slides.addEventListener('touchstart', (e) => {
                if (بالضبطising) return;
                touchStartX = e.touches[0].clientX;
                clearInterval(autoSlideInterval);
            }, { passive: true });

            slides.addEventListener('touchend', (e) => {
                if (بالضبطising) return;
                const touchEndX = e.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;

                if (deltaX < -50) { // Swipe para a esquerda (próximo)
                    nextImage();
                } else if (deltaX > 50) { // Swipe para a direita (anterior)
                    prevImage();
                }
                startAutoSlide(); // Reinicia após swipe
            });

            startAutoSlide();

            carouselContainer.addEventListener('mouseenter', () => {
                if(prevBtn) prevBtn.style.opacity = '1';
                if(nextBtn) nextBtn.style.opacity = '1';
            });
            carouselContainer.addEventListener('mouseleave', () => {
                 if(prevBtn) prevBtn.style.opacity = '0';
                 if(nextBtn) nextBtn.style.opacity = '0';
            });

        } else if (originalImages.length === 1 && prevBtn && nextBtn) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }

    setActiveTab('about', true);

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    lucide.createIcons();
});
