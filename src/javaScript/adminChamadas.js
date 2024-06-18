async function listarUsuarios(email, id , tipoTabela) {
    try {
        const response = await fetch(`http://localhost:3000/listar-usuarios/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao listar usuários');
        }

        let data = await response.json();

        if (tipoTabela === 'Aceitar Usuário') {
            data = data.filter(element => element.liberado === false);
        }

        renderUserTable(tipoTabela, data, email, id);

    } catch (error) {
        console.error('Erro:', error.message);
        document.getElementById('userTableBody').innerHTML = `<tr><td colspan="4" class="text-center">${error.message}</td></tr>`;
    }
}

async function deletarUsuario(id, email, idlogado) {
    try {
        const response = await fetch(`http://localhost:3000/remover-usuario/${email}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar usuário');
        }
        
        listarUsuarios(email, idlogado ,'Remover Usuário');

    } catch (error) {
        console.error('Erro:', error.message);
        document.getElementById('userTableBody').innerHTML = `<tr><td colspan="4" class="text-center">${error.message}</td></tr>`;
    }
}

async function liberarUsuario(id, email, idLogado) {
    try {
        const response = await fetch(`http://localhost:3000/liberar-usuario/${idLogado}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao liberar usuario');
        }
        
        listarUsuarios(email, idLogado ,'Aceitar Usuário');

    } catch (error) {
        console.error('Erro:', error.message);
        document.getElementById('userTableBody').innerHTML = `<tr><td colspan="4" class="text-center">${error.message}</td></tr>`;
    }
}

function renderUserTable(tituloTabela, users, email, id) {
    const userTableBody = document.getElementById('userTableBody');
    const acoesHeader = document.getElementById('acoesHeader');

    userTableBody.innerHTML = ''; // Limpa o conteúdo atual da tabela

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${getAcoesHTML(tituloTabela, user.id, email, id)}</td>
        `;
        userTableBody.appendChild(tr);
    });

    // Mostrar ou esconder a coluna de ações dependendo do título da tabela
    if (tituloTabela === 'Remover Usuário' || tituloTabela === 'Aceitar Usuário') {
        acoesHeader.style.display = 'table-cell';
    } else {
        acoesHeader.style.display = 'none';
    }
}

function getAcoesHTML(tituloTabela, userId, email, id) {
    if (tituloTabela === 'Remover Usuário') {
        return `
            <button class="btn btn-sm btn-danger" onclick="deletarUsuario('${userId}','${email}','${id}')">Remover</button>
        `;
    } else if (tituloTabela === 'Aceitar Usuário') {
        return `
            <button class="btn btn-sm btn-success" onclick="liberarUsuario('${userId}','${email}','${id}')">Aceitar</button>
        `;
    } else {
        return ''; // Nenhuma ação para listar usuários
    }
}

// Expor as funções que serão usadas no HTML
window.listarUsuarios = listarUsuarios;
window.deletarUsuario = deletarUsuario;