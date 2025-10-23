document.addEventListener('DOMContentLoaded', () => {
  function placeholder() { return '/static/img/sem-foto.png'; }

  function atualizarCarrinhoVisual() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const total = carrinho.reduce((t, p) => t + (p.quantidade || 0), 0);
    const link = document.getElementById('carrinhoLink');
    if (link) link.textContent = `🛒 Seu Carrinho (${total})`;
  }

  function atualizarFavoritosVisual() {
    const fav = JSON.parse(localStorage.getItem('favoritos')) || [];
    const link = document.getElementById('listaDesejosLink');
    if (link) link.textContent = `❤️ Lista de Desejos (${fav.length})`;
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
          atualizarFavoritosVisual();
          console.log('Produto adicionado aos favoritos:', prod.nome); // Debug
          alert(`${prod.nome} adicionado aos favoritos!`);
          window.location.href = '/templates/lista_desejos.html';
      } else {
          console.log('Produto já está nos favoritos:', prod.nome); // Debug
      }
  }

  const produtosMasculinos = [
    { id: 1, nome: "Camisa Polo", preco: 99.9, tamanho: "M", cor: "Azul", categoria: "masculino", imagem: "https://www.lojamirante.com.br/uploads/produtos/camisa-polo-pa-azul-royal-617cb70f9d839.jpg" },
    { id: 2, nome: "Camiseta", preco: 49.9, tamanho: "G", cor: "Branco", categoria: "masculino", imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" },
    { id: 4, nome: "Jaqueta", preco: 199.9, tamanho: "G", cor: "Preto", categoria: "masculino", imagem: "https://cdn.awsli.com.br/1274/1274265/produto/257909785/15999-jaqueta-black-jeans-preta-frente1-wwk0o7023k.png" },
    { id: 5, nome: "Camiseta", preco: 59.9, tamanho: "P", cor: "Cinza", categoria: "masculino", imagem: "https://static.riachuelo.com.br/RCHLO/KIT800488/portrait/a965f8fc74db3dc29e07619053b5707f5eb2c189.jpg?imwidth=700" },
    { id: 6, nome: "Camisa Social", preco: 149.9, tamanho: "M", cor: "Branco", categoria: "masculino", imagem: "https://static.dafiti.com.br/p/Olimpo-Camisaria-Camisa-Social-Slim-Masculina-Olimpo-Lisa-Manga-Longa-Branca-3621-7700956-1-zoom.jpg" }
  ];

  const produtosFemininos = [
    { id: 7, nome: "Vestido Floral Verão", preco: 89.9, tamanho: "M", cor: "Azul", categoria: "feminino", imagem: "https://s.emporionm.com.br/import/zip.zip/NM003311_1.jpg?format=webp" },
    { id: 8, nome: "Blusa Manga Longa", preco: 69.9, tamanho: "P", cor: "Rosa", categoria: "feminino", imagem: "https://acdn-us.mitiendanube.com/stores/874/674/products/blusa_bata_feminina_laise_rosa-e8b4fa50ff91d46c5c17135614308574-1024-1024.jpg" },
    { id: 9, nome: "Calça Jeans Skinny", preco: 119.9, tamanho: "G", cor: "Azul", categoria: "feminino", imagem: "https://adaptive-images.uooucdn.com.br/tr:w-1100,h-1594,c-at_max,pr-true,q-90/a22469-ogxytnlhdz0/pv/3d/b4/5e/184de1bee731a6ee7fc8e420c6.jpg" },
    { id: 10, nome: "Saia Midi", preco: 79.9, tamanho: "M", cor: "Branco", categoria: "feminino", imagem: "https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22305-ogxys3ptqt0/pv/df/1c/f8/2a4c0756ebd7abe033a9c360d6/saia-midi-viscolinho-vitoria-bege-large-4.jpg" },
    { id: 11, nome: "Vestido Elegante", preco: 149.9, tamanho: "GG", cor: "Vermelho", categoria: "feminino", imagem: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop" },
    { id: 12, nome: "Blusa Casual", preco: 59.9, tamanho: "GG", cor: "Preto", categoria: "feminino", imagem: "https://static.ecosweb.com.br/public/produtos/plus-size-feminino/blusa-manga-curta/blusa-preta-em-viscose-plana_380697_301_1.webp" }
  ];

  const produtosInfantis = [
    { id: 13, nome: "Conjunto Esportivo Menino", preco: 59.9, idade: "3-6 anos", genero: "Menino", categoria: "infantil", imagem: "https://static.ecosweb.com.br/public/produtos/roupa-para-menino/conjunto-inverno/conjunto-esportivo-basquete-menino-marrom_790742_600_1.webp" },
    { id: 14, nome: "Vestido Infantil Florido", preco: 49.9, idade: "3-6 anos", genero: "Menina", categoria: "infantil", imagem: "https://images.tcdn.com.br/img/img_prod/754301/vestido_infantil_festa_floral_rosas_797_1_c1cf011adbc6d831f3772288d7bce660.jpg" },
    { id: 15, nome: "Body Manga Longa Bebê", preco: 29.9, idade: "0-2 anos", genero: "Unissex", categoria: "infantil", imagem: "https://images.tcdn.com.br/img/img_prod/670007/kit_bebe_com_3_body_manga_longa_suedine_prata_verde_e_branco_comfort_14121_1_33865a4b0fd76cfeb1e46f5a58f31781_20251006100527.png" },
    { id: 16, nome: "Pijama", preco: 79.9, idade: "7-12 anos", genero: "Unissex", categoria: "infantil", imagem: "https://images.tcdn.com.br/img/img_prod/639673/pijama_infantil_unissex_estampa_estrela_1805_1_0445df0c5071be1c06fbb1b8ee6e5b3b.png" },
    { id: 17, nome: "Camiseta", preco: 39.9, idade: "3-6 anos", genero: "Menino", categoria: "infantil", imagem: "https://www.hering.com.br/_next/image?url=https%3A%2F%2Fhering.vtexassets.com%2Farquivos%2Fids%2F4576168%2F5G5J-AXTEN-C1.jpg%3Fv%3D638931970794830000&w=1440&q=100" },
    { id: 18, nome: "Calça Jeans", preco: 69.9, idade: "7-10 anos", genero: "Menina", categoria: "infantil", imagem: "https://modamix.vteximg.com.br/arquivos/ids/187363-0-0/Modamix_24_janeiro_117.png?v=638103596032830000" }
  ];

  async function carregarGrid(gridEl) {
    try {
      const categoria = gridEl.dataset.categoria || '';
      let list = [];
      if (categoria.toLowerCase() === 'masculino') {
        list = produtosMasculinos;
      } else if (categoria.toLowerCase() === 'feminino') {
        list = produtosFemininos;
      } else if (categoria.toLowerCase() === 'infantil') {
        list = produtosInfantis;
      } else {
        try {
          const res = await fetch('/api/produtos');
          list = await res.json();
        } catch(e) {
          console.warn("API não respondeu, usando produtos fictícios.");
          list = [];
        }
      }

      let idadeFilter = 'Todas', generoFilter = 'Todos', tamanhoFilter = 'Todos', corFilter = 'Todas';
      if (categoria.toLowerCase() === 'infantil') {
        idadeFilter = document.getElementById('idadeSelect')?.value || 'Todas';
        generoFilter = document.getElementById('generoSelect')?.value || 'Todos';
      } else {
        tamanhoFilter = document.getElementById('tamanhoSelect')?.value || 'Todos';
        corFilter = document.getElementById('corSelect')?.value || 'Todas';
      }
      const ordenar = document.getElementById('ordenarSelect')?.value || 'Mais vendidos';

      console.log('Aplicando filtros:', { idadeFilter, generoFilter, tamanhoFilter, corFilter, ordenar });

      let produtos = list.filter(p => {
        const passaCategoria = categoria ? (p.categoria || '').toLowerCase().includes(categoria.toLowerCase()) : true;
        let passaFiltros = true;
        if (categoria.toLowerCase() === 'infantil') {
          passaFiltros = (idadeFilter === 'Todas' || p.idade === idadeFilter) && (generoFilter === 'Todos' || p.genero === generoFilter);
        } else {
          passaFiltros = (tamanhoFilter === 'Todos' || p.tamanho === tamanhoFilter) && (corFilter === 'Todas' || p.cor === corFilter);
        }
        console.log(`Produto ${p.nome}: Categoria ${passaCategoria}, Filtros ${passaFiltros}`);
        return passaCategoria && passaFiltros;
      });

      console.log('Produtos após filtro:', produtos.map(p => p.nome));

   
      if (ordenar === 'Menor preço') produtos.sort((a, b) => a.preco - b.preco);
      else if (ordenar === 'Maior preço') produtos.sort((a, b) => b.preco - a.preco);
      else if (ordenar === 'Mais vendidos') produtos.sort((a, b) => a.id - b.id);
      else if (ordenar === 'Lançamentos') produtos.sort((a, b) => b.id - a.id);

      gridEl.innerHTML = '';

      if (produtos.length === 0) {
        gridEl.innerHTML = '<p>Nenhum produto encontrado com esses filtros.</p>';
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
            ${categoria.toLowerCase() === 'infantil' ? `<p class="produto-idade">Idade: ${p.idade}</p><p class="produto-genero">Gênero: ${p.genero}</p>` : `<p class="produto-tamanho">Tamanho: ${p.tamanho}</p><p class="produto-cor">Cor: ${p.cor}</p>`}
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
      atualizarFavoritosVisual();
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

  const idadeSelect = document.getElementById('idadeSelect');
  const generoSelect = document.getElementById('generoSelect');
  const tamanhoSelect = document.getElementById('tamanhoSelect');
  const corSelect = document.getElementById('corSelect');
  const ordenarSelect = document.getElementById('ordenarSelect');

  console.log('Selects encontrados:', { idadeSelect, generoSelect, tamanhoSelect, corSelect, ordenarSelect });

  [idadeSelect, generoSelect, tamanhoSelect, corSelect, ordenarSelect].forEach(select => {
    if (select) {
      select.addEventListener('change', (event) => {
        console.log('Evento change disparado para:', event.target.id, 'Valor:', event.target.value);

        grids.forEach(g => {
          if (g && g.classList && g.classList.contains('produtos-grid')) {
            carregarGrid(g);
          }
        });
      });
    } else {
      console.error('Select não encontrado:', select);
    }
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const termo = searchInput.value.trim().toLowerCase();
        grids.forEach(grid => {
          const cards = grid.querySelectorAll('.produto-card');
          cards.forEach(card => {
            const nome = card.querySelector('.produto-titulo')?.textContent.toLowerCase() || '';
            card.style.display = nome.includes(termo) ? 'block' : 'none';
          });
        });
        if (!termo) grids.forEach(g => carregarGrid(g));
      }
    });
  }
});