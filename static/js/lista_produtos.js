document.addEventListener('DOMContentLoaded', ()=>{
  const tbody = document.querySelector('#tabela tbody');
  const busca = document.getElementById('busca');

  async function carregar(filtro=''){
    try{
      const res = await fetch('/api/produtos');
      const list = await res.json();
      tbody.innerHTML = '';
      list.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${p.nome}</td><td>${p.descricao}</td><td>R$ ${Number(p.preco).toFixed(2)}</td><td>${p.quantidade}</td>
            <td>
              <button data-id="${p.id}" class="edit">Editar</button>
              <button data-id="${p.id}" class="del">Excluir</button>
            </td>`;
          tbody.appendChild(tr);
        });
        
      tbody.querySelectorAll('.edit').forEach(btn=> btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.dataset.id;
        window.location.href = '/templates/cadastro_produtos.html?id=' + id;
      }));
      tbody.querySelectorAll('.del').forEach(btn=> btn.addEventListener('click', async (e)=>{
        const id = e.currentTarget.dataset.id;
        if(!confirm('Excluir?')) return;
        const r = await fetch('/api/produtos/' + id, { method:'DELETE' });
        if(r.ok) carregar(busca.value);
        else alert('Erro ao excluir');
      }));
    }catch(err){ console.error(err); tbody.innerHTML='<tr><td colspan="5">Erro ao carregar</td></tr>'; }
  }

  busca.addEventListener('input',(e)=> carregar(e.target.value));
  carregar();
});
