document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://api.github.com/users/Matheusfr34';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados do GitHub');
            }
            return response.json();
        })
        .then(data => {
            // Atualizar os elementos HTML com os dados recebidos
            document.getElementById('avatar').src = data.avatar_url;
            document.getElementById('nome').textContent = data.name || 'Nome não disponível';
            document.getElementById('bio').textContent = data.bio || 'Biografia não disponível';
            document.getElementById('localizacao').textContent = `Localização: ${data.location || 'Não informada'}`;
            document.getElementById('email').href = `mailto:${data.email || ''}`;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do GitHub:', error);
        });
});

document.addEventListener('DOMContentLoaded', function() {
    var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExampleCaptions'), {
        interval: false, // Defina o intervalo para false se não quiser que o carousel mude automaticamente
    });
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:5500/db/db.json') // Ajuste aqui para o caminho absoluto conforme necessário
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
});


document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:5500/db/db.json') // Ajuste aqui para o caminho absoluto conforme necessário
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
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:5500/db/db.json') // Ajuste aqui para o caminho absoluto conforme necessário
        .then(response => response.json())
        .then(data => {
            const reposContainer = document.getElementById('repositorios-container');
            data.albuns.forEach(repo => {
                let repoCard = document.createElement('div');
                repoCard.classList.add('col-md-4', 'mb-4');
                repoCard.innerHTML = `
                    <a href="${repo.link}" class="card h-100">
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
});
