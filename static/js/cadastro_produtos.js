document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('produtoForm');
  const editingIdInput = document.getElementById('editingId');
 
  const params = new URLSearchParams(window.location.search);
  const idToEdit = params.get('id');
  if(idToEdit){

    fetch('/api/produtos').then(r=>r.json()).then(list=>{
      const p = list.find(x => String(x.id)===String(idToEdit));
      if(p){
        document.getElementById('nome').value = p.nome;
        document.getElementById('descricao').value = p.descricao;
        document.getElementById('preco').value = p.preco;
        document.getElementById('quantidade').value = p.quantidade;
        editingIdInput.value = idToEdit;
      }
    });
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      nome: document.getElementById('nome').value.trim(),
      descricao: document.getElementById('descricao').value.trim(),
      preco: parseFloat(document.getElementById('preco').value),
      quantidade: parseInt(document.getElementById('quantidade').value)
    };
    const editId = editingIdInput.value;
    try{
      if(editId){
        const res = await fetch('/api/produtos/' + editId, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        if(res.ok){ alert('Produto atualizado'); window.location.href='/templates/lista_produtos.html'; return; }
        throw new Error('Erro atualizar');
      } else {
        const res = await fetch('/api/produtos', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        if(res.ok){ alert('Produto criado'); window.location.href='/templates/lista_produtos.html'; return; }
        throw new Error('Erro criar');
      }
    }catch(err){ alert(err.message); }
  });
});
