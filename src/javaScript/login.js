// JavaScript para validação personalizada e envio assíncrono do formulário
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Validação básica do formulário
      var form = document.getElementById('loginForm');
      form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir submissão padrão do formulário
        event.stopPropagation();
  
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value; // Corrigido para "password"

  
        // Verificação adicional dos campos
        if (!email || !password) {
          document.getElementById('message').innerHTML = '<div class="alert alert-danger">Por favor, preencha todos os campos.</div>';
          return;
        }

  
        // Enviar dados via fetch
        async function getContent() {
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha: password }) // Corrigido para "password"
                })

                const data = await response.json()
                if(data?.error) {
                    document.getElementById('message').innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                }

                if(data?.papeis === "admin") {
                    const dataString = JSON.stringify(data);
                    localStorage.setItem("usuario", dataString)

                    window.location.href = '../html/admin-pagina.html';
                }

                else if(data?.papeis === "usuario") {
                    window.location.href = '../html/usuario.html'
                }
                
                else {
                    document.getElementById('message').innerHTML = `<div class="alert alert-danger">Usuario inválido</div>`;
                }
                

            }catch(error) {
                console.log(error) 
            }
            
        }

        getContent()

      }, false);
    }, false);
  })();