document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const formAdicionarObra = document.getElementById('formAdicionarObra');
    const tabelaObras = document.getElementById('tabelaObras');
    const adicionarObraForm = document.getElementById('adicionarObraForm');
    const obraTableBody = document.getElementById('obraTableBody');
    const adicionarObraMessage = document.getElementById('adicionarObraMessage');
    
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
        const usuario = JSON.parse(localStorage.getItem('usuario'));
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
                    <button class="btn btn-danger btn-sm remover-obra" data-id="${obra.id}">Remover</button>
                </td>
            `;
            obraTableBody.appendChild(tr);

            const btnRemover = tr.querySelector('.remover-obra');

            btnRemover.addEventListener('click', async function() {
                // Implemente a lógica para remover a obra com ID this.dataset.id
                if (confirm('Tem certeza que deseja remover esta obra?')) {
                    try {
                        console.log({usuario, id: this.dataset.id})
                        const response = await fetch(`http://localhost:3000/usuario/${usuario.id}/obra/${this.dataset.id}`, {
                            method: 'DELETE',
                        });

                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(data.message || 'Erro ao remover obra');
                        }

                        adicionarObraMessage.innerHTML = '<div class="alert alert-success">Obra removida com sucesso!</div>';
                        listarObras(); // Atualiza a lista após remover uma obra
                    } catch (error) {
                        console.error('Erro:', error.message);
                        adicionarObraMessage.innerHTML = `<div class="alert alert-danger">Erro ao remover obra: ${error.message}</div>`;
                    }
                }
            });
        });

        
    }
});