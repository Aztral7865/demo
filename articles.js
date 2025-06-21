// articles.js

document.addEventListener('DOMContentLoaded', () => {
    const articlesSection = document.getElementById('articles-section');
    const articlesGrid = articlesSection ? articlesSection.querySelector('.grid') : null;

    if (!articlesGrid) {
        console.error('Elemento .grid dentro de #articles-section não encontrado.');
        return;
    }

    const loadArticles = async () => {
        try {
            // Caminho para o seu arquivo JSON (ajuste se a estrutura mudar)
            const response = await fetch('data/articles.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar os artigos: ${response.statusText}`);
            }
            const articles = await response.json();

            articlesGrid.innerHTML = ''; // Limpa qualquer conteúdo existente

            articles.forEach((article, index) => {
                // Limita a exibição a, por exemplo, 6 artigos
                if (index >= 6) {
                    return;
                }

                const articleCard = document.createElement('div');
                articleCard.classList.add('article-card', 'fade-in-up', `delay-${index + 1}`);

                articleCard.innerHTML = `
                    <div class="article-card-image-container">
                        <img src="${article.image}" alt="${article.title}" class="article-card-image">
                    </div>
                    <div class="article-card-content">
                        <span class="article-card-date">${article.date}</span>
                        <h4 class="article-card-title">${article.title}</h4>
                        <p class="article-card-description">
                            ${article.description}
                        </p>
                        <a href="#" class="read-more-button" data-article-id="${article.id}">Leia Mais</a>
                    </div>
                `;
                articlesGrid.appendChild(articleCard);
            });

            // Re-criar ícones Lucide após adicionar novos elementos
            lucide.createIcons();

            // Adiciona listeners para os botões "Leia Mais"
            articlesGrid.querySelectorAll('.read-more-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Evita que o link # recarregue a página
                    const articleId = event.target.dataset.articleId;
                    console.log(`Clicou para ler mais do artigo: ${articleId}`);
                    // Futuramente, você pode adicionar lógica para exibir o fullContent
                    // Por exemplo, abrir um modal ou navegar para uma página de artigo individual
                    alert(`Funcionalidade "Leia Mais" para "${articleId}" será implementada futuramente.`);
                });
            });

        } catch (error) {
            console.error('Erro ao carregar ou processar os artigos:', error);
            articlesGrid.innerHTML = '<p>Não foi possível carregar os artigos no momento. Tente novamente mais tarde.</p>';
        }
    };

    // Chama a função para carregar os artigos
    loadArticles();
});
