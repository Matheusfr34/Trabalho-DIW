document.addEventListener('DOMContentLoaded', function () {
    fetchGitHubUser();
    initializeCarousel();
    loadDestaques();
    loadColegasDeTrabalho();
    loadRepositorios();

    const params = new URLSearchParams(window.location.search);
    const repoId = params.get('id');

    if (repoId) {
        loadRepository(repoId);
    }
});

function fetchGitHubUser() {
    const apiUrl = 'https://api.github.com/users/Matheusfr34';
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados do GitHub');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('avatar').src = data.avatar_url;
            document.getElementById('nome').textContent = data.name || 'Nome não disponível';
            document.getElementById('bio').textContent = data.bio || 'Biografia não disponível';
            document.getElementById('localizacao').textContent = `Localização: ${data.location || 'Não informada'}`;
            document.getElementById('email').href = `mailto:${data.email || ''}`;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do GitHub:', error);
        });
}

function loadRepository(repoId) {
    fetch('http://localhost:3000/db/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(data => {
            const repo = data.albuns.find(item => item.id === repoId);

            if (!repo) {
                console.error(`Repositório com ID ${repoId} não encontrado.`);
                return;
            }

            // Preenchendo os dados do repositório usando a API do GitHub
            fetch(repo.link) // repo.link contém o link da API do GitHub
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do GitHub');
                    }
                    return response.json();
                })
                .then(data => {
                    document.getElementById('repo-title').textContent = `Repositório: ${data.name}`;
                    document.getElementById('repo-description').textContent = data.description || 'Descrição não disponível';
                    document.getElementById('repo-created-at').textContent = `Data de Criação: ${new Date(data.created_at).toLocaleDateString()}`;
                    document.getElementById('repo-language').textContent = `Linguagem: ${data.language || 'Não informada'}`;
                    document.getElementById('repo-url').href = data.html_url;
                    document.getElementById('repo-url').textContent = data.html_url;

                    const topicsContainer = document.getElementById('repo-topics');
                    topicsContainer.innerHTML = '';
                    data.topics.forEach(topic => {
                        const topicElement = document.createElement('a');
                        topicElement.href = `https://github.com/topics/${topic}`;
                        topicElement.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'me-2');
                        topicElement.textContent = topic;
                        topicsContainer.appendChild(topicElement);
                    });

                    document.getElementById('repo-stars').textContent = `Estrelas: ${data.stargazers_count}`;
                    document.getElementById('repo-watchers').textContent = `Observadores: ${data.watchers_count}`;
                    document.getElementById('repo-forks').textContent = `Forks: ${data.forks_count}`;
                    document.getElementById('repo-license').textContent = `Licença: ${data.license ? data.license.name : 'Não especificada'}`;
                })
                .catch(error => console.error('Erro ao buscar dados do GitHub:', error));
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}


function initializeCarousel() {
    var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExampleCaptions'), {
        interval: false,
    });
}

function loadDestaques() {
    fetch('http://localhost:3000/db/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(data => {
            const destaques = data.destaques;
            const carouselIndicators = document.querySelector('.carousel-indicators');
            const carouselInner = document.querySelector('.carousel-inner');

            destaques.forEach((destaque, index) => {
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.dataset.bsTarget = '#carouselExampleCaptions';
                indicator.dataset.bsSlideTo = index;
                indicator.ariaLabel = `Slide ${index + 1}`;
                if (index === 0) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-current', 'true');
                }

                carouselIndicators.appendChild(indicator);

                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                const iframe = document.createElement('iframe');
                iframe.width = '640';
                iframe.height = '360';
                iframe.src = destaque.conteudo;
                iframe.title = destaque.titulo;
                iframe.allowFullscreen = true;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

                const carouselCaption = document.createElement('div');
                carouselCaption.classList.add('carousel-caption', 'd-none', 'd-md-block');

                carouselItem.appendChild(iframe);
                carouselItem.appendChild(carouselCaption);
                carouselInner.appendChild(carouselItem);
            });

            const firstItem = document.querySelector('.carousel-item');
            if (firstItem) {
                firstItem.classList.add('active');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo JSON', error);
        });
}

function loadColegasDeTrabalho() {
    fetch('http://localhost:3000/db/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(data => {
            const colegasDeTrabalho = data.fotos;
            const colegasContainer = document.getElementById('colegas-de-trabalho');

            colegasDeTrabalho.forEach(colega => {
                const col = document.createElement('div');
                col.classList.add('col-md-4', 'mb-4', 'text-center');

                const img = document.createElement('img');
                img.src = colega.foto;
                img.classList.add('img-fluid', 'rounded-square');
                img.alt = `Foto de ${colega.nome}`;

                const nome = document.createElement('h5');
                nome.classList.add('colleague-name');
                nome.textContent = colega.nome;

                const link = document.createElement('a');
                link.href = colega.perfil;
                link.appendChild(img);
                link.appendChild(nome);

                col.appendChild(link);
                colegasContainer.appendChild(col);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados do JSON:', error);
        });
}

function loadRepositorios() {
    fetch('http://localhost:3000/db/db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(data => {
            const reposContainer = document.getElementById('repositorios-container');
            data.albuns.forEach(repo => {
                let repoCard = document.createElement('div');
                repoCard.classList.add('col-md-4', 'mb-4');
                repoCard.innerHTML = `
                    <a href="repo.html?id=${repo.id}" class="card h-100">
                        <img src="${repo.imagem}" class="card-img-top img-fluid" alt="Imagem do Repositório">
                        <div class="card-body">
                            <h5 class="card-title">${repo.titulo}</h5>
                        </div>
                    </a>
                `;
                reposContainer.appendChild(repoCard);
            });
        })
        .catch(error => console.error('Erro ao carregar os repositórios:', error));
}
