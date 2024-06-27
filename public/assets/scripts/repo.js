document.addEventListener("DOMContentLoaded", function () {
  const ul = document.querySelector('.list-group');

  // Fetch repository ID from db.json
  function getRepoIdFromDbJson() {
    return fetch('http://localhost:3000/db/db.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(data => {
        const params = new URLSearchParams(window.location.search);
        const albumId = params.get('id');
        const album = data.albuns.find(item => item.id === albumId);
        if (album) {
          return album.id;
        } else {
          throw new Error('Album not found in db.json');
        }
      });
  }

  // Fetch repository details from GitHub API using the repository ID
  function getRepoFromGitHub(repoId) {
    return fetch(`https://api.github.com/repositories/${repoId}`)
      .then(async res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      });
  }

  // Render repository details in the HTML
  function renderRepoDetails(repo) {
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `
      <strong>Repositório: ${repo.name.toUpperCase()}</strong>
      <span>Descrição: ${repo.description}</span>
      <span>Data de Criação: ${Intl.DateTimeFormat('pt-BR').format(new Date(repo.created_at))}</span>
      <span>URL: <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></span>
      <span>Linguagem Principal: ${repo.language}</span>
      <span>Tópicos: ${repo.topics ? repo.topics.join(', ') : 'Nenhum tópico'}</span>
      <span>Estrelas: ${repo.stargazers_count}</span>
      <span>Observadores: ${repo.watchers_count}</span>
      <span>Forks: ${repo.forks_count}</span>
      <span>Licença: ${repo.license ? repo.license.name : 'Não especificado'}</span>
    `;
    ul.appendChild(li);
  }

  // Fetch the repository ID and then fetch and render repository details
  function getRepoIdAndFetchData() {
    getRepoIdFromDbJson()
      .then(repoId => {
        return getRepoFromGitHub(repoId);
      })
      .then(repo => {
        renderRepoDetails(repo);
      })
      .catch(e => {
        ul.innerHTML = `<li class="list-group-item">${e.message}</li>`;
      });
  }

  getRepoIdAndFetchData();
});
