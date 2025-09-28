const form = document.getElementById('cadastroForm');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('password').value;

    const usuario = {
        nome,
        telefone,
        senha
    };

    localStorage.setItem(email, JSON.stringify(usuario));

    mensagem.textContent = "Cadastro realizado com sucesso!";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});
