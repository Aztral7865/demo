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

                // MUDANÇA AQUI: O href do botão "Leia Mais" agora aponta para article.html com o ID
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
                        <a href="article.html?id=${article.id}" class="read-more-button">Leia Mais</a>
                    </div>
                `;
                articlesGrid.appendChild(articleCard);
            });

            // Re-criar ícones Lucide após adicionar novos elementos
            lucide.createIcons();

            // REMOVEMOS A LÓGICA DO alert() AQUI, POIS AGORA VAMOS PARA A NOVA PÁGINA
            // Não precisamos mais do event listener para o botão "Leia Mais" aqui,
            // pois o link agora aponta diretamente para a nova página.

        } catch (error) {
            console.error('Erro ao carregar ou processar os artigos:', error);
            articlesGrid.innerHTML = '<p>Não foi possível carregar os artigos no momento. Tente novamente mais tarde.</p>';
        }
    };

    // Chama a função para carregar os artigos
    loadArticles();
});
