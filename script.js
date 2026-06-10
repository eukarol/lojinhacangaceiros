const API_URL = "https://script.google.com/macros/s/AKfycby-1tHUo0orer2sBrm2aVYnqPb7ktOshVVwhv-5kNNsyJoyw2avCWke0vqYE7Qbydel1Q/exec";

let ocupados = [];
let carrinho = [];

// Catálogo de produtos (sem Caneca e sem Camisa padrão)
const produtos = [
  { id: "camisa-jogador", nome: "Camisa Jogador", preco: 95, img: "img/camisa-jogador.jpg", desc: "Camisa oficial de jogo" },
  { id: "camisa-goleiro", nome: "Camisa Goleiro", preco: 95, img: "img/camisa-goleiro.jpg", desc: "Camisa exclusiva para goleiros" },
  { id: "bandana-preta", nome: "Bandana Preta", preco: 25, img: "img/bandana-preta.jpg", desc: "Bandana preta oficial" },
  { id: "bandana-laranja", nome: "Bandana Laranja", preco: 25, img: "img/bandana-laranja.jpg", desc: "Bandana laranja oficial" },
  { id: "tirante", nome: "Tirante", preco: 15, img: "img/tirante.jpg", desc: "Tirante elástico" },
  { id: "kit", nome: "Kit", preco: 40, img: "img/kit.jpg", desc: "Kit completo de acessórios" },
  { id: "kit-atleta", nome: "Kit Atleta", preco: 150, img: "img/kit-atleta.jpg", desc: "Kit exclusivo para atletas" },
  { id: "bucket", nome: "Bucket", preco: 45, img: "img/bucket.jpg", desc: "Bucket personalizado" }
];

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", () => {
  renderizarProdutos();
  carregarNumeros();
  atualizarCarrinho();
  document.getElementById("btn").addEventListener("click", enviarPedido);
});

/* ========== TEMA ========== */
function toggleTema() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute("data-theme");
  html.setAttribute("data-theme", temaAtual === "dark" ? "light" : "dark");
}

/* ========== RENDERIZAR PRODUTOS ========== */
function renderizarProdutos() {
  const grid = document.getElementById("produtosGrid");
  grid.innerHTML = "";

  produtos.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.onclick = (e) => {
      if (!e.target.closest("button")) {
        adicionarAoCarrinho(produto.id);
      }
    };

    const itemCarrinho = carrinho.find(c => c.id === produto.id);
    const qtd = itemCarrinho ? itemCarrinho.qtd : 0;

    card.innerHTML = `
      <div class="produto-imagem-wrapper">
        <img src="${produto.img}" alt="${produto.nome}" class="produto-imagem" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"/>
        <div class="produto-imagem-placeholder" style="display:none;">📸</div>
      </div>
      <div class="produto-info">
        <h3 class="produto-nome">${produto.nome}</h3>
        <p class="produto-descricao">${produto.desc}</p>
        <span class="produto-preco">R$ ${produto.preco.toFixed(2)}</span>
        <div class="produto-botoes">
          ${qtd > 0 ? `
            <div class="qtd-controle" onclick="event.stopPropagation()">
              <button class="qtd-btn" onclick="diminuirQtd('${produto.id}')">−</button>
              <span class="qtd-valor">${qtd}</span>
              <button class="qtd-btn" onclick="aumentarQtd('${produto.id}')">+</button>
            </div>
            <button class="btn-adicionar remover" onclick="event.stopPropagation(); removerDoCarrinho('${produto.id}')">🗑</button>
          ` : `
            <button class="btn-adicionar" onclick="event.stopPropagation(); adicionarAoCarrinho('${produto.id}')">
              🛒 Adicionar
            </button>
          `}
        </div>
      </div>
    `;

    if (qtd > 0) card.classList.add("selecionado");
    grid.appendChild(card);
  });
}

/* ========== CARRINHO ========== */
function adicionarAoCarrinho(id) {
  const item = carrinho.find(c => c.id === id);
  if (item) {
    item.qtd++;
  } else {
    const produto = produtos.find(p => p.id === id);
    carrinho.push({ ...produto, qtd: 1 });
  }
  atualizarCarrinho();
  renderizarProdutos();
}

function diminuirQtd(id) {
  const item = carrinho.find(c => c.id === id);
  if (item) {
    item.qtd--;
    if (item.qtd <= 0) {
      removerDoCarrinho(id);
      return;
    }
  }
  atualizarCarrinho();
  renderizarProdutos();
}

function aumentarQtd(id) {
  const item = carrinho.find(c => c.id === id);
  if (item) item.qtd++;
  atualizarCarrinho();
  renderizarProdutos();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(c => c.id !== id);
  atualizarCarrinho();
  renderizarProdutos();
}

function atualizarCarrinho() {
  const badge = document.getElementById("carrinhoBadge");
  const painel = document.getElementById("carrinhoPainel");
  const itensContainer = document.getElementById("carrinhoItens");
  const resumo = document.getElementById("carrinhoResumo");
  const subtotalEl = document.getElementById("subtotal");
  const totalFinalEl = document.getElementById("totalFinal");

  const totalItens = carrinho.reduce((s, c) => s + c.qtd, 0);
  const subtotal = carrinho.reduce((s, c) => s + (c.preco * c.qtd), 0);

  badge.textContent = totalItens;

  if (carrinho.length === 0) {
    painel.classList.remove("ativo");
  } else {
    painel.classList.add("ativo");
  }

  itensContainer.innerHTML = "";
  if (carrinho.length === 0) {
    itensContainer.innerHTML = '<p class="carrinho-vazio">Nenhum item adicionado ainda</p>';
    resumo.style.display = "none";
  } else {
    carrinho.forEach(item => {
      const div = document.createElement("div");
      div.className = "carrinho-item";
      div.innerHTML = `
        <img src="${item.img}" alt="${item.nome}" class="carrinho-item-img" onerror="this.style.display='none'"/>
        <div class="carrinho-item-info">
          <p class="carrinho-item-nome">${item.nome}</p>
          <p class="carrinho-item-preco">R$ ${(item.preco * item.qtd).toFixed(2)}</p>
          <p class="carrinho-item-qtd">Qtd: ${item.qtd}</p>
        </div>
        <button class="carrinho-item-remover" onclick="removerDoCarrinho('${item.id}')">✕</button>
      `;
      itensContainer.appendChild(div);
    });
    resumo.style.display = "block";
    subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    totalFinalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  }
}

function abrirCarrinho() {
  const painel = document.getElementById("carrinhoPainel");
  if (painel.classList.contains("ativo")) {
    painel.scrollIntoView({ behavior: "smooth" });
  }
}

function fecharCarrinho() {
  // Mobile: recolhe
}

/* ========== CHECKOUT ========== */
function irParaCheckout() {
  if (carrinho.length === 0) return;

  const checkoutResumo = document.getElementById("checkoutResumo");
  const subtotal = carrinho.reduce((s, c) => s + (c.preco * c.qtd), 0);

  checkoutResumo.innerHTML = carrinho.map(c => `
    <div class="checkout-item-resumo">
      <span>${c.nome} x${c.qtd}</span>
      <span>R$ ${(c.preco * c.qtd).toFixed(2)}</span>
    </div>
  `).join("") + `
    <div class="checkout-total-resumo">
      <span>Total</span>
      <span>R$ ${subtotal.toFixed(2)}</span>
    </div>
  `;

  document.getElementById("checkoutOverlay").style.display = "block";
  document.getElementById("checkoutOverlay").scrollIntoView({ behavior: "smooth" });
  carregarNumeros();
}

function voltarParaLoja() {
  document.getElementById("checkoutOverlay").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ========== NÚMEROS ========== */
async function carregarNumeros() {
  const select = document.getElementById("numero");
  try {
    const res = await fetch(API_URL);
    ocupados = await res.json();
    const categoria = document.getElementById("categoria").value;
    select.innerHTML = "";
    for (let i = 1; i <= 100; i++) {
      const chave = categoria + "-" + i;
      if (!ocupados.includes(chave)) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        select.appendChild(opt);
      }
    }
  } catch (err) {
    console.error(err);
    select.innerHTML = "<option>Erro ao carregar</option>";
  }
}

/* ========== PAGAMENTO ========== */
function trocarPagamento() {
  const tipo = document.getElementById("pagamento").value;
  document.getElementById("pixBox").style.display = tipo === "pix" ? "block" : "none";
  document.getElementById("cartaoBox").style.display = tipo === "cartao" ? "block" : "none";
}

/* ========== ENVIAR PEDIDO ========== */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

async function enviarPedido() {
  const msg = document.getElementById("msg");
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const categoria = document.getElementById("categoria").value;
  const nomeCamisa = document.getElementById("nomeCamisa").value.trim();
  const numero = Number(document.getElementById("numero").value);
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !telefone) {
    msg.innerText = "❌ Nome e telefone são obrigatórios.";
    return;
  }

  if (carrinho.length === 0) {
    msg.innerText = "❌ Seu carrinho está vazio.";
    return;
  }

  if (pagamento === "cartao") {
    window.open("https://wa.me/5581989413959?text=Quero%20fazer%20um%20pedido%20da%20Atl%C3%A9tica", "_blank");
    return;
  }

  const file = document.getElementById("comprovante").files[0];
  if (pagamento === "pix" && !file) {
    msg.innerText = "❌ Envie o comprovante do PIX.";
    return;
  }

  let comprovante = "";
  if (file) comprovante = await toBase64(file);

  const produtosPedido = carrinho.map(c => `${c.nome} x${c.qtd}`).join(", ");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        nome,
        telefone,
        categoria,
        tipoCamisa: "",
        nomeCamisa,
        produto: produtosPedido,
        tamanho: "Verificar",
        numero,
        tirantesExtras: "0",
        pagamento,
        comprovante
      })
    });

    const data = await res.json();
    if (data.sucesso) {
      msg.innerText = "✅ Pedido realizado com sucesso!";
      carrinho = [];
      atualizarCarrinho();
      renderizarProdutos();
      document.getElementById("nome").value = "";
      document.getElementById("telefone").value = "";
      document.getElementById("nomeCamisa").value = "";
      document.getElementById("comprovante").value = "";
      carregarNumeros();
    } else {
      msg.innerText = data.mensagem || "❌ Erro no pedido";
    }
  } catch (err) {
    console.error(err);
    msg.innerText = "❌ Erro ao enviar pedido";
  }
}