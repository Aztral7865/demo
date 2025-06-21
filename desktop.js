// desktop.js

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


    const allTabButtons = document.querySelectorAll('[data-tab]');
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const navUnderline = document.querySelector('.nav-underline');
    const mainNav = document.getElementById('main-nav');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const currentYearSpan = document.getElementById('current-year'); // Adicionado


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
        // AJUSTE SCROLL TO TOP: Rolar para o topo da página sempre que uma aba for trocada
        if (!initialLoad) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }

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