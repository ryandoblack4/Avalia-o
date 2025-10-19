document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('produtoForm');
  const editingIdInput = document.getElementById('editingId');

  const params = new URLSearchParams(window.location.search);
  const idToEdit = params.get('id');

  if (idToEdit) {
    fetch('/api/produtos')
      .then(r => r.json())
      .then(list => {
        const p = list.find(x => String(x.id) === String(idToEdit));
        if (p) {
          document.getElementById('nome').value = p.nome;
          const cat = document.getElementById('categoria');
          if (cat && p.categoria) cat.value = p.categoria;
          document.getElementById('descricao').value = p.descricao;
          document.getElementById('preco').value = p.preco;
          document.getElementById('quantidade').value = p.quantidade;
          editingIdInput.value = idToEdit;
        }
      });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
  formData.append('nome', document.getElementById('nome').value.trim());
  formData.append('categoria', document.getElementById('categoria') ? document.getElementById('categoria').value : '');
    formData.append('descricao', document.getElementById('descricao').value.trim());
    formData.append('preco', parseFloat(document.getElementById('preco').value));
    formData.append('quantidade', parseInt(document.getElementById('quantidade').value));

    const imagem = document.getElementById('imagem').files[0];
    if (imagem) formData.append('imagem', imagem);

    const editId = editingIdInput.value;

    try {
      let res;
      const roleHeader = { role: localStorage.getItem('userRole') };
      if (editId) {
        res = await fetch('/api/produtos/' + editId, { method: 'PUT', body: formData, headers: roleHeader });
      } else {
        res = await fetch('/api/produtos', { method: 'POST', body: formData, headers: roleHeader });
      }

      const resBody = await res.json().catch(() => null);
      if (res.ok) {
        alert(editId ? 'Produto atualizado!' : 'Produto criado!');
        window.location.href = '/templates/lista_produtos.html';
      } else {
        const msg = resBody && (resBody.error || resBody.message) ? (resBody.error || resBody.message) : 'Erro ao salvar produto.';
        throw new Error(msg);
      }
    } catch (err) {
      alert(err.message);
    }
  });
});
