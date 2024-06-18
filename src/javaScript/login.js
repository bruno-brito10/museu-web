(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Validação básica do formulário
        var loginForm = document.getElementById('loginForm');
        var registerForm = document.getElementById('registerForm');
        var toggleFormLink = document.getElementById('toggleForm');
        var toggleLoginLink = document.getElementById('toggleLogin');
        var formTitle = document.getElementById('formTitle');
        var formButton = document.getElementById('formButton');
        var messageDiv = document.getElementById('message');
        var registerMessageDiv = document.getElementById('registerMessage');

        // Alternar para o formulário de criação de conta
        toggleFormLink.addEventListener('click', function(event) {
            event.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            formTitle.textContent = 'Criar Conta';
        });

        // Alternar para o formulário de login
        toggleLoginLink.addEventListener('click', function(event) {
            event.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            formTitle.textContent = 'Login';
        });

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir submissão padrão do formulário
            event.stopPropagation();

            if (!loginForm.checkValidity()) {
                loginForm.classList.add('was-validated');
                return;
            }

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Enviar dados via fetch
            async function login() {
                try {
                    const response = await fetch('http://localhost:3000/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, senha: password })
                    });

                    const data = await response.json();
                    if (data?.error) {
                        messageDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                    } else if (data?.papeis === "admin") {
                        const dataString = JSON.stringify(data);
                        localStorage.setItem("usuario", dataString);
                        window.location.href = '../html/admin-pagina.html';
                    } else if (data?.papeis === "usuario" && data.liberado === true) {
                        const dataString = JSON.stringify(data);
                        localStorage.setItem("usuario", dataString);
                        window.location.href = '../html/usuario.html';
                    } else {
                        messageDiv.innerHTML = `<div class="alert alert-danger">Usuário inválido</div>`;
                    }

                } catch (error) {
                    console.error(error);
                    messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao realizar login</div>`;
                }
            }

            login();
        }, false);

        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir submissão padrão do formulário
            event.stopPropagation();

            if (!registerForm.checkValidity()) {
                registerForm.classList.add('was-validated');
                return;
            }

            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Enviar dados via fetch
            async function register() {
                try {
                    const response = await fetch('http://localhost:3000/usuarios/novo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nome: name, email, senha: password })
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.message || 'Erro ao criar conta');
                    }

                    registerMessageDiv.innerHTML = '<div class="alert alert-success">Conta criada com sucesso! Faça o login.</div>';
                    registerForm.reset();
                    toggleLoginLink.click();

                } catch (error) {
                    console.error('Erro:', error.message);
                    registerMessageDiv.innerHTML = `<div class="alert alert-danger">Erro ao criar conta: ${error.message}</div>`;
                }
            }

            register();
        }, false);
    }, false);
})();