document.addEventListener('DOMContentLoaded', ()=>{
  const u = localStorage.getItem('usuarioLogado');
  if(!u){ alert('Faça login'); window.location.href='/templates/tela_login.html'; }
});
