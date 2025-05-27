// Alternar menu mobile
document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('active');
});

// Cache para páginas já carregadas
const pageCache = {};

// Função para carregar páginas dinamicamente com transição e loader
function loadPage(page, event = null) {
    const content = document.getElementById('content');
    const loader = document.getElementById('loader');
    const links = document.querySelectorAll('.navbar a');

    // Remover "active" de todos os links
    links.forEach(link => link.classList.remove('active'));

    // Adicionar "active" ao link clicado, se houver evento
    if (event && event.target) event.target.classList.add('active');

    // Normalizar o nome da página para minúsculas
    page = page.toLowerCase();
    const url = `pages/${page}.html`;

    // Mostrar loader e aplicar fade-out
    loader.classList.remove('hidden');
    content.classList.add('fade-out');

    // Aguarda o fim da transição
    setTimeout(() => {
        if (pageCache[page]) {
            content.innerHTML = pageCache[page];
            finalizeLoad();
        } else {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Página ${page} não encontrada`);
                    return response.text();
                })
                .then(html => {
                    content.innerHTML = html;
                    pageCache[page] = html;
                    finalizeLoad();
                })
                .catch(error => {
                    console.error('Erro ao carregar a página:', error);
                    content.innerHTML = '<div class="content-section"><p>Erro: Não foi possível carregar a página. Verifique os arquivos ou a conexão.</p></div>';
                    finalizeLoad();
                });
        }
    }, 300); // Duração da transição

    // Finaliza o carregamento
    function finalizeLoad() {
        content.classList.remove('fade-out');
        content.classList.add('active');
        loader.classList.add('hidden');
    }
}

// Pré-carregamento das páginas
function preloadPages() {
    const pages = ['home', 'about', 'skills', 'projects', 'education', 'contact'];

    pages.forEach(page => {
        const url = `pages/${page}.html`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Erro ao pré-carregar ${page}`);
                return response.text();
            })
            .then(html => {
                pageCache[page] = html;
            })
            .catch(err => {
                console.warn(`Pré-carregamento falhou para ${page}:`, err.message);
            });
    });
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Carrega home por padrão
    loadPage('home');

    // Pré-carrega páginas
    preloadPages();

    // Ativar link da home
    const defaultLink = document.querySelector('.navbar a[data-page="home"]');
    if (defaultLink) defaultLink.classList.add('active');

    // Adicionar evento de clique nos links da navbar
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) loadPage(page, e);
        });
    });

    // Adicionar evento de clique no logo
    document.querySelector('.logo').addEventListener('click', (e) => {
        e.preventDefault();
        loadPage('home', e);
    });

});