// article.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const articleTitleElement = document.getElementById('article-title');
    const articleDateElement = document.getElementById('article-date');
    const articleImageElement = document.getElementById('article-image');
    const articleContentElement = document.getElementById('article-content');
    const backButton = document.getElementById('back-button');

    // Função para buscar e exibir o artigo
    const displayArticle = async (id) => {
        if (!id) {
            if (articleTitleElement) articleTitleElement.textContent = 'Artigo Não Encontrado';
            if (articleContentElement) articleContentElement.innerHTML = '<p>Nenhum ID de artigo foi fornecido na URL.</p>';
            if (articleImageElement) articleImageElement.style.display = 'none'; // Esconde a imagem se não houver artigo
            console.error('Nenhum ID de artigo fornecido.');
            return;
        }

        try {
            const response = await fetch('data/articles.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar artigos: ${response.statusText}`);
            }
            const articles = await response.json();
            const article = articles.find(a => a.id === id);

            if (article) {
                if (articleTitleElement) articleTitleElement.textContent = article.title;
                if (articleDateElement) articleDateElement.textContent = article.date;
                if (articleImageElement) {
                    articleImageElement.src = article.image;
                    articleImageElement.alt = article.title;
                    articleImageElement.style.display = 'block'; // Mostra a imagem
                }
                if (articleContentElement) articleContentElement.innerHTML = article.fullContent;

                // Atualizar o título da página para o título do artigo
                document.title = `${article.title} - Dr. Fernando Topanotti Tarabay`;

            } else {
                if (articleTitleElement) articleTitleElement.textContent = 'Artigo Não Encontrado';
                if (articleContentElement) articleContentElement.innerHTML = '<p>O artigo solicitado não foi encontrado.</p>';
                if (articleImageElement) articleImageElement.style.display = 'none';
                console.warn(`Artigo com ID "${id}" não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao buscar ou exibir o artigo:', error);
            if (articleTitleElement) articleTitleElement.textContent = 'Erro ao Carregar Artigo';
            if (articleContentElement) articleContentElement.innerHTML = '<p>Ocorreu um erro ao carregar o conteúdo do artigo.</p>';
            if (articleImageElement) articleImageElement.style.display = 'none';
        }
    };

    // Chama a função para exibir o artigo com base no ID da URL
    displayArticle(articleId);

    // Lógica do botão Voltar
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Tenta voltar para a página anterior no histórico do navegador
            // Se não houver histórico, redireciona para a seção de artigos na página principal
            if (document.referrer.includes(window.location.origin)) { // Verifica se a página anterior é do mesmo site
                 window.history.back();
            } else {
                 window.location.href = 'desktop.html#articles-section'; // Redireciona para a seção de artigos
            }
        });
    }
    // Criar ícones Lucide (importante para esta página também)
    lucide.createIcons();
});
