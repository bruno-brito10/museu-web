document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const formAdicionarObra = document.getElementById('formAdicionarObra');
    const tabelaObras = document.getElementById('tabelaObras');
    const adicionarObraForm = document.getElementById('adicionarObraForm');
    const obraTableBody = document.getElementById('obraTableBody');
    const adicionarObraMessage = document.getElementById('adicionarObraMessage');
    const verObraModal = new bootstrap.Modal(document.getElementById('verObraModal'));

    // Navegação
    document.getElementById('adicionarObra').addEventListener('click', function(event) {
        event.preventDefault();
        formAdicionarObra.style.display = 'block';
        tabelaObras.style.display = 'none';
    });

    document.getElementById('listarObra').addEventListener('click', function(event) {
        event.preventDefault();
        formAdicionarObra.style.display = 'none';
        tabelaObras.style.display = 'block';
        listarObras();
    });

    // Evento de logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('usuario');
        window.location.href = './login.html';
    });

    // Adicionar obra
    adicionarObraForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(adicionarObraForm);
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        formData.append('dono', usuario.id); // Adiciona o id do usuário como dono

        async function adicionarObra() {
            try {
                const response = await fetch('http://localhost:3000/criar-obras', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao adicionar obra');
                }

                adicionarObraMessage.innerHTML = '<div class="alert alert-success">Obra adicionada com sucesso!</div>';
                adicionarObraForm.reset();
            } catch (error) {
                console.error('Erro:', error.message);
                adicionarObraMessage.innerHTML = `<div class="alert alert-danger">Erro ao adicionar obra: ${error.message}</div>`;
            }
        }

        adicionarObra();
    });

    // Listar obras
    async function listarObras() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        try {
            const response = await fetch(`http://localhost:3000/listar-obras/${usuario.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao listar obras');
            }

            const data = await response.json();
            renderObraTable(data);

        } catch (error) {
            console.error('Erro:', error.message);
            obraTableBody.innerHTML = `<tr><td colspan="6" class="text-center">${error.message}</td></tr>`;
        }
    }

    // Renderizar tabela de obras
    function renderObraTable(obras) {
        obraTableBody.innerHTML = '';
        obras.forEach(obra => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${obra.id}</td>
                <td>${obra.nome}</td>
                <td>${obra.autor}</td>
                <td>${obra.dono}</td>
                <td>${obra.descricao}</td>
                <td>
                    <button class="btn btn-info btn-sm ver-obra" data-id="${obra.id}">Ver</button>
                    <button class="btn btn-danger btn-sm remover-obra" data-id="${obra.id}">Remover</button>
                </td>
            `;
            obraTableBody.appendChild(tr);

            const btnVer = tr.querySelector('.ver-obra');
            const btnRemover = tr.querySelector('.remover-obra');

            btnVer.addEventListener('click', function() {
                const obraId = this.dataset.id;
                verObra(obraId);
            });

            btnRemover.addEventListener('click', async function() {
                if (confirm('Tem certeza que deseja remover esta obra?')) {
                    const obraId = this.dataset.id;
                    removerObra(obraId);
                }
            });
        });
    }

    // Ver obra
    async function verObra(id) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        try {
            const response = await fetch(`http://localhost:3000/usuario/${usuario.id}/obra/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter detalhes da obra');
            }

            const obra = await response.json();
            obra.url_foto = `http://localhost:3000/${obra.url_foto}`
            
            document.getElementById('modalObraFoto').src = obra.url_foto;
            document.getElementById('modalObraNome').innerText = obra.nome;
            document.getElementById('modalObraAutor').innerText = obra.autor;
            document.getElementById('modalObraDescricao').innerText = obra.descricao;

            const postagens = obra.postagens || [];
            const modalObraPostagens = document.getElementById('modalObraPostagens');
            modalObraPostagens.innerHTML = '';
            postagens.forEach(postagem => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerText = postagem;
                modalObraPostagens.appendChild(li);
            });

            verObraModal.show();

        } catch (error) {
            console.error('Erro:', error.message);
        }
    }

    // Remover obra
    async function removerObra(id) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        try {
            const response = await fetch(`http://localhost:3000/usuario/${usuario.id}/obra/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao remover obra');
            }

            const data = await response.json();
            adicionarObraMessage.innerHTML = '<div class="alert alert-success">Obra removida com sucesso!</div>';
            listarObras();

        } catch (error) {
            console.error('Erro:', error.message);
            adicionarObraMessage.innerHTML = `<div class="alert alert-danger">Erro ao remover obra: ${error.message}</div>`;
        }
    }

    // Inicializar a listagem de obras ao carregar a página
    listarObras();
});
