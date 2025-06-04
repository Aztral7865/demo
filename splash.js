// splash.js

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainSiteContent = document.getElementById('main-site-content');
    const heroContent = document.querySelector('.hero-content');

    // Tempos das animações (em milissegundos)
    const animationInDuration = 1000; // Duração da animação de entrada do texto
    const transitionDelayBeforeOut = 1500; // Tempo de espera da splash screen após entrada
    const animationOutDuration = 600; // Duração da animação de saída do texto e da própria splash screen

    // Ocultar o conteúdo principal do site imediatamente ao carregar
    // Para evitar flash de conteúdo antes da splash screen.
    // Isso é importante se o CSS da splash screen não estiver carregado muito rápido.
    if (mainSiteContent) {
        mainSiteContent.classList.add('hidden');
    }

    // Calcular o tempo total até o início das animações de saída
    const totalAnimationInTime = animationInDuration;

    // Tempo total para a transição completa
    const totalTransitionTime = totalAnimationInTime + transitionDelayBeforeOut + animationOutDuration;

    // Step 1: Iniciar as animações de saída dos elementos da splash screen
    setTimeout(() => {
        if (heroContent) {
            heroContent.style.animation = `slideOutDown ${animationOutDuration / 1000}s ease-in forwards`;
        }
        
        // Começa a diminuir a opacidade da tela de splash
        if (splashScreen) {
            splashScreen.style.transition = `opacity ${animationOutDuration / 1000}s ease-out`;
            splashScreen.style.opacity = '0'; 
        }
    }, totalAnimationInTime + transitionDelayBeforeOut);

    // Step 2: Ocultar a splash screen e mostrar o conteúdo principal
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden'); // Oculta completamente a splash screen
        }
        if (mainSiteContent) {
            mainSiteContent.classList.remove('hidden'); // Mostra o conteúdo principal
            // Opcional: Se quiser que o conteúdo principal apareça com uma animação, adicione-a aqui
            // Ex: mainSiteContent.style.animation = 'fadeIn 0.5s ease-out forwards';
        }
        
        // Remover as animações para evitar problemas futuros (opcional)
        if (heroContent) {
            heroContent.classList.add('no-animation');
        }

    }, totalTransitionTime);
});