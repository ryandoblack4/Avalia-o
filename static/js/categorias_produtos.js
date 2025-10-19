document.addEventListener('DOMContentLoaded', () => {
  function placeholder() { return '/static/img/sem-foto.png'; }

  function atualizarCarrinhoVisual() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const total = carrinho.reduce((t, p) => t + (p.quantidade || 0), 0);
    const link = document.getElementById('carrinhoLink');
    if (link) link.textContent = `🛒 Seu Carrinho (${total})`;
  }

  function adicionarAoCarrinho(prod) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const idx = carrinho.findIndex(p => String(p.id) === String(prod.id));
    if (idx >= 0) carrinho[idx].quantidade = (carrinho[idx].quantidade || 0) + 1;
    else carrinho.push({ ...prod, quantidade: 1 });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinhoVisual();
    alert(`${prod.nome} adicionado ao carrinho!`);
  }

  function adicionarFavorito(prod, btn) {
    let fav = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (!fav.find(p => p.id === prod.id)) {
      fav.push(prod);
      localStorage.setItem('favoritos', JSON.stringify(fav));
      btn.textContent = '❤️';
      alert(`${prod.nome} adicionado aos favoritos!`);
    }
  }

  async function carregarGrid(gridEl) {
    try {
      const categoria = gridEl.dataset.categoria || '';
      const url = categoria ? `/api/produtos?categoria=${encodeURIComponent(categoria)}` : '/api/produtos';
      const res = await fetch(url);
      const list = await res.json();
      gridEl.innerHTML = '';

      const produtos = Array.isArray(list) ? list.filter(p => {
        if (!categoria) return true;
        return (p.categoria || '').toLowerCase().includes(String(categoria).toLowerCase());
      }) : [];

      if (produtos.length === 0) {
        gridEl.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
        return;
      }

      produtos.forEach(p => {
        const card = document.createElement('article');
        card.className = 'produto-card';
        card.innerHTML = `
          ${p.preco ? `<div class="produto-tag"></div>` : ''}
          <img src="${p.imagem || placeholder()}" alt="${p.nome || ''}" class="produto-imagem">
          <div class="produto-info">
            <h3 class="produto-titulo">${p.nome || ''}</h3>
            <p class="produto-preco">R$ ${Number(p.preco || 0).toFixed(2)}</p>
            <div class="produto-acoes">
              <button class="btn-carrinho">Adicionar</button>
              <button class="btn-favorito">🤍</button>
            </div>
          </div>
        `;

        card.querySelector('.btn-carrinho').addEventListener('click', () => adicionarAoCarrinho(p));
        card.querySelector('.btn-favorito').addEventListener('click', (e) => adicionarFavorito(p, e.currentTarget));

        gridEl.appendChild(card);
      });

      atualizarCarrinhoVisual();
    } catch (err) {
      console.error('Erro ao carregar produtos por categoria:', err);
      gridEl.innerHTML = '<p>Erro ao carregar produtos.</p>';
    }
  }

  const grids = document.querySelectorAll('[id$="-grid"], .produtos-grid');
  grids.forEach(g => {
    if (g && g.classList && g.classList.contains('produtos-grid')) {
      carregarGrid(g);
    }
  });
});
