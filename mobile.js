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
    const currentYearSpan = document.getElementById('current-year'); // Adicionado
    let autoSlideInterval; // Variável global para o intervalo do carrossel
    let carouselTransitioning = false; // Flag para evitar múltiplos saltos durante transições rápidas


    // Função para parar o carrossel
    const stopCarousel = () => {
        clearInterval(autoSlideInterval);
    };

    // Função para inicializar/reinicializar o carrossel
    const initializeCarousel = () => {
        stopCarousel(); // Garante que qualquer intervalo anterior seja limpo

        const carouselContainer = document.querySelector('#about-section .carousel-container');
        if (carouselContainer) {
            const slides = carouselContainer.querySelector('.carousel-slides');
            const originalImages = Array.from(slides.querySelectorAll('.carousel-image'));

            // Remove clones existentes antes de adicionar novos para evitar duplicação
            slides.querySelectorAll('.clone').forEach(clone => clone.remove());


            if (originalImages.length > 1) {
                const prevBtn = carouselContainer.querySelector('.carousel-arrow.prev');
                const nextBtn = carouselContainer.querySelector('.carousel-arrow.next');

                // Clonagem dos slides para o loop infinito
                const firstClone = originalImages[0].cloneNode(true);
                const lastClone = originalImages[originalImages.length - 1].cloneNode(true);
                firstClone.classList.add('clone'); // Marca como clone
                lastClone.classList.add('clone'); // Marca como clone

                slides.appendChild(firstClone);
                slides.insertBefore(lastClone, originalImages[0]);

                const allImages = slides.querySelectorAll('.carousel-image');
                const totalSlidesIncludingClones = allImages.length;

                let currentIndex = 1; // Começa no primeiro slide REAL (após o clone do último)

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
                    if (carouselTransitioning) return;
                    carouselTransitioning = true;

                    if (currentIndex === 0) { // Chegou ao clone do último (navegando para a esquerda)
                        currentIndex = totalSlidesIncludingClones - 2; // Salta para o último slide real
                        updateCarouselPosition(false);
                    } else if (currentIndex === totalSlidesIncludingClones - 1) { // Chegou ao clone do primeiro (navegando para a direita)
                        currentIndex = 1; // Salta para o primeiro slide real
                        updateCarouselPosition(false);
                    }
                    setTimeout(() => { carouselTransitioning = false; }, 50); // Pequeno delay para resetar o flag
                };

                // Remove o event listener antigo antes de adicionar um novo
                slides.removeEventListener('transitionend', handleTransitionEnd);
                slides.addEventListener('transitionend', handleTransitionEnd);

                const nextImage = () => {
                    if (carouselTransitioning) return;
                    currentIndex++;
                    updateCarouselPosition();
                    resetAutoSlide();
                };

                const prevImage = () => {
                    if (carouselTransitioning) return;
                    currentIndex--;
                    updateCarouselPosition();
                    resetAutoSlide();
                };

                const startAutoSlide = () => {
                    stopCarousel(); // Garante que o intervalo anterior é parado antes de iniciar um novo
                    autoSlideInterval = setInterval(nextImage, 6000); // Muda para a direita
                };

                const resetAutoSlide = () => {
                    clearInterval(autoSlideInterval);
                    startAutoSlide();
                };

                // Remove listeners antigos antes de adicionar novos para evitar duplicação
                if (nextBtn) nextBtn.removeEventListener('click', nextImage);
                if (prevBtn) prevBtn.removeEventListener('click', prevImage);
                if (nextBtn) nextBtn.addEventListener('click', nextImage);
                if (prevBtn) prevBtn.addEventListener('click', prevImage);

                let touchStartX = 0;
                slides.removeEventListener('touchstart', (e) => {
                    if (carouselTransitioning) return;
                    touchStartX = e.touches[0].clientX;
                    clearInterval(autoSlideInterval);
                }, { passive: true });
                slides.addEventListener('touchstart', (e) => {
                    if (carouselTransitioning) return;
                    touchStartX = e.touches[0].clientX;
                    clearInterval(autoSlideInterval);
                }, { passive: true });

                slides.removeEventListener('touchend', (e) => {
                    if (carouselTransitioning) return;
                    const touchEndX = e.changedTouches[0].clientX;
                    const deltaX = touchEndX - touchStartX;

                    if (deltaX < -50) { // Swipe para a esquerda (próximo)
                        nextImage();
                    } else if (deltaX > 50) { // Swipe para a direita (anterior)
                        prevImage();
                    }
                    startAutoSlide(); // Reinicia após swipe
                });
                slides.addEventListener('touchend', (e) => {
                    if (carouselTransitioning) return;
                    const touchEndX = e.changedTouches[0].clientX;
                    const deltaX = touchEndX - touchStartX;

                    if (deltaX < -50) { // Swipe para a esquerda (próximo)
                        nextImage();
                    } else if (deltaX > 50) { // Swipe para a direita (anterior)
                        prevImage();
                    }
                    startAutoSlide(); // Reinicia após swipe
                });

                // Inicia o carrossel automaticamente apenas se a aba estiver ativa
                if (document.getElementById('about-section').classList.contains('active')) {
                    startAutoSlide();
                }


                carouselContainer.removeEventListener('mouseenter', () => {
                    if (prevBtn) prevBtn.style.opacity = '1';
                    if (nextBtn) nextBtn.style.opacity = '1';
                });
                carouselContainer.addEventListener('mouseenter', () => {
                    if (prevBtn) prevBtn.style.opacity = '1';
                    if (nextBtn) nextBtn.style.opacity = '1';
                });

                carouselContainer.removeEventListener('mouseleave', () => {
                    if (prevBtn) prevBtn.style.opacity = '0';
                    if (nextBtn) nextBtn.style.opacity = '0';
                });
                carouselContainer.addEventListener('mouseleave', () => {
                    if (prevBtn) prevBtn.style.opacity = '0';
                    if (nextBtn) nextBtn.style.opacity = '0';
                });

            } else if (originalImages.length === 1 && prevBtn && nextBtn) {
                // Se houver apenas uma imagem, esconde os botões de navegação
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                stopCarousel(); // Garante que não há intervalo para uma única imagem
            }
        }
    };


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

        contentSections.forEach(section => {
            if (section.id === `${tabId}-section`) {
                section.classList.add('active');
                // Inicializa o carrossel APENAS quando a seção 'about' está ativa
                if (tabId === 'about') {
                    initializeCarousel();
                }
            } else {
                section.classList.remove('active');
                // Para o carrossel se a seção 'about' NÃO está ativa
                if (section.id === 'about-section') {
                    stopCarousel();
                }
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

    // Inicializa a aba correta no carregamento com base no hash da URL ou padroniza para 'about'
    const initialTab = window.location.hash ? window.location.hash.substring(1).replace('-section', '') : 'about';
    setActiveTab(initialTab, true);

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    lucide.createIcons();

    // --- LÓGICA: Formulário de Contato para WhatsApp ---
    const initializeContactForm = () => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (event) {
                event.preventDefault();

                const nameField = contactForm.querySelector('#name') || contactForm.querySelector('#name-mobile');
                const emailField = contactForm.querySelector('#email') || contactForm.querySelector('#email-mobile');
                const phoneField = contactForm.querySelector('#phone') || contactForm.querySelector('#phone-mobile');
                const messageField = contactForm.querySelector('#message') || contactForm.querySelector('#message-mobile');

                const name = nameField ? nameField.value : 'Não informado';
                const email = emailField ? emailField.value : 'Não informado';
                const phone = phoneField && phoneField.value ? `Telefone: ${phoneField.value}\n` : '';
                const message = messageField ? messageField.value : 'Nenhuma mensagem.';

                const numeroWhatsApp = '5548991140848';

                const mensagemTemplate = `Olá, Dr. Fernando! Meu nome é *${name}*.\n\nEntro em contato através do seu site.\n\n*E-mail para retorno:* ${email}\n${phone}\n*Mensagem:*\n${message}`;

                const mensagemCodificada = encodeURIComponent(mensagemTemplate);
                const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

                window.open(linkWhatsApp, '_blank');
                contactForm.reset();
            });
        }
    };

    initializeContactForm();
});
