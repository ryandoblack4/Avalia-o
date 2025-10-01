document.addEventListener('DOMContentLoaded', ()=>{
  const u = localStorage.getItem('usuarioLogado');
  const role = localStorage.getItem('userRole');
  if(!u || role !== 'admin'){ alert('Acesso negado'); window.location.href='/templates/index.html'; }
});
