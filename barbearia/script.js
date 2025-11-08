// Carrega carrinho salvo (ou cria novo)
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const contador = document.getElementById('contador-carrinho');
  
  // Novos elementos do menu responsivo
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.getElementById('menu-links');

  // Adiciona lógica do menu hamburguer para abrir/fechar no mobile
  if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', () => {
      menuLinks.classList.toggle('open');
    });
  }

  function atualizarContador() {
    // Apenas verifica se o elemento existe antes de tentar manipulá-lo
    if (contador) {
        contador.textContent = carrinho.length;
        // Mostra o contador se houver itens
        contador.style.display = carrinho.length ? 'inline-block' : 'none'; 
    }
  }

  // Adiciona serviço ao carrinho
  document.querySelectorAll('.servico').forEach(servico => {
    servico.addEventListener('click', () => {
      // Pega o nome
      const nome = servico.querySelector('h3').textContent;
      // Pega o preço
      const precoTexto = servico.querySelector('p').textContent.replace('R$', '').trim();
      const preco = parseFloat(precoTexto.replace(',', '.'));

      carrinho.push({ nome, preco });
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      atualizarContador();

      // Feedback visual
      servico.style.transform = 'scale(1.05)';
      servico.style.transition = 'transform 0.2s';
      setTimeout(() => servico.style.transform = 'scale(1)', 200);
      
    });
  });

  atualizarContador();