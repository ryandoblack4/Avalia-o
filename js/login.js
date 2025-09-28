const form = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    const user = JSON.parse(localStorage.getItem(email));

    if (user && user.senha === senha) {
        window.location.href = "index.html";
    } else {
        mensagem.textContent = "E-mail ou senha inválidos.";
    }
});
