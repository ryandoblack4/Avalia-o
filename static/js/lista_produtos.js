document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#tabela tbody');
  const busca = document.getElementById('busca');
  const btnAtualizar = document.getElementById('btnAtualizar');

  async function carregar(filtro = '') {
    try {
      const res = await fetch('/api/produtos');
      const list = await res.json();
      tbody.innerHTML = '';
      list
        .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="imgcell"><img src="${p.imagem || '/static/img/sem-foto.png'}" alt="${p.nome}" width="70" height="70"></td>
            <td class="namecell">${p.nome}<div class="cat">${p.categoria || ''}</div></td>
            <td class="desccell">${p.descricao || ''}</td>
            <td class="pricecell">R$ ${Number(p.preco || 0).toFixed(2)}</td>
            <td class="qtdcell">${p.quantidade || 0}</td>
            <td class="actions">
              <button data-id="${p.id}" class="edit btn small">Editar</button>
              <button data-id="${p.id}" class="del btn danger small">Excluir</button>
            </td>`;
          tbody.appendChild(tr);
        });

      tbody.querySelectorAll('.edit').forEach(btn =>
        btn.addEventListener('click', e => {
          const id = e.currentTarget.dataset.id;
          window.location.href = '/templates/cadastro_produtos.html?id=' + id;
        })
      );

      tbody.querySelectorAll('.del').forEach(btn =>
        btn.addEventListener('click', async e => {
          const id = e.currentTarget.dataset.id;
          if (!confirm('Excluir?')) return;
          const r = await fetch('/api/produtos/' + id, { method: 'DELETE', headers: { role: localStorage.getItem('userRole') } });
          if (r.ok) carregar(busca.value);
          else alert('Erro ao excluir');
        })
      );
    } catch (err) {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar</td></tr>';
    }
  }

  busca.addEventListener('input', e => carregar(e.target.value));
  carregar();

  if (btnAtualizar) btnAtualizar.addEventListener('click', () => carregar(busca.value));
});
