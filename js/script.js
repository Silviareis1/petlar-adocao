
const formulario = document.querySelector("#form-contato");
const resposta = document.querySelector("#resposta-formulario");

formulario.addEventListener("submit", function (evento) {
   evento.preventDefault();

   const nome = document.querySelector("#nome").value.trim();
   const email = document.querySelector("#email").value.trim();
   const mensagem = document.querySelector("#mensagem").value.trim();

   if (!nome || !email || !mensagem) {
      resposta.textContent = "Preencha todos os campos.";
      return;
   }

   resposta.textContent =
      `Obrigada, ${nome}! Sua mensagem foi registrada nesta demonstração.`;

   formulario.reset();
});



/* ===== CURIOSIDADES SOBRE GATOS — FETCH E TRADUÇÃO ===== */

const botaoCuriosidade = document.querySelector("#btn-curiosidade");
const fatoGato = document.querySelector("#fato-gato");

// Traduz uma curiosidade do inglês para português brasileiro
async function traduzirCuriosidade(texto) {
   const parametros = new URLSearchParams({
      q: texto,
      langpair: "en|pt-BR"
   });

   const resposta = await fetch(
      `https://api.mymemory.translated.net/get?${parametros}`
   );

   if (!resposta.ok) {
      throw new Error("Erro ao consultar o tradutor.");
   }

   const dados = await resposta.json();
   const traducao = dados.responseData?.translatedText;

   if (
      dados.responseStatus !== 200 ||
      !traducao ||
      dados.quotaFinished
   ) {
      throw new Error("Tradução indisponível.");
   }

   return traducao;
}

// Busca uma curiosidade e apresenta em português
async function buscarCuriosidade() {
   botaoCuriosidade.disabled = true;
   fatoGato.textContent = "Buscando curiosidade...";

   try {
      const respostaAPI = await fetch(
         "https://catfact.ninja/fact?max_length=350"
      );

      if (!respostaAPI.ok) {
         throw new Error("Erro ao consultar a API de gatos.");
      }

      const dados = await respostaAPI.json();

      fatoGato.textContent = "Traduzindo curiosidade...";

      try {
         const textoTraduzido = await traduzirCuriosidade(dados.fact);
         fatoGato.textContent = textoTraduzido;
      } catch (erroTraducao) {
         console.error("Erro na tradução:", erroTraducao);
         fatoGato.textContent =
            "A tradução está indisponível no momento. " +
            "Clique novamente para tentar outra curiosidade.";
      }

   } catch (erro) {
      console.error("Erro ao buscar curiosidade:", erro);
      fatoGato.textContent =
         "Não foi possível carregar a curiosidade. Tente novamente.";

   } finally {
      botaoCuriosidade.disabled = false;
   }
}

botaoCuriosidade.addEventListener("click", buscarCuriosidade);


// ===== BOTÃO VOLTAR AO TOPO =====

const botaoTopo = document.querySelector("#voltar-topo");

if (botaoTopo) {
   function verificarRolagem() {
      if (window.scrollY > 300) {
         botaoTopo.classList.add("visivel");
      } else {
         botaoTopo.classList.remove("visivel");
      }
   }

   window.addEventListener("scroll", verificarRolagem, { passive: true });

   botaoTopo.addEventListener("click", () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth"
      });
   });

   verificarRolagem();
}

/* ===== CARD GIRATÓRIO DA MIMI ===== */

const cardMimi = document.querySelector("#card-mimi");

if (cardMimi) {
   const botaoVirar = cardMimi.querySelector(".btn-virar");
   const botaoVoltar = cardMimi.querySelector(".btn-voltar-card");
   const frente = cardMimi.querySelector(".pet-frente");
   const verso = cardMimi.querySelector(".pet-verso");

   botaoVirar.addEventListener("click", () => {
      verso.removeAttribute("inert");
      frente.setAttribute("inert", "");
      verso.setAttribute("aria-hidden", "false");

      cardMimi.classList.add("virado");
      botaoVirar.setAttribute("aria-expanded", "true");

      botaoVoltar.focus();
   });

   botaoVoltar.addEventListener("click", () => {
      frente.removeAttribute("inert");
      verso.setAttribute("inert", "");
      verso.setAttribute("aria-hidden", "true");

      cardMimi.classList.remove("virado");
      botaoVirar.setAttribute("aria-expanded", "false");

      botaoVirar.focus();
   });
}


/* ===== INDICADOR DE NAVEGAÇÃO ATIVA ===== */

const linksNavegacao = document.querySelectorAll(
   'header nav a[href^="#"]'
);

const secoesNavegacao = [...linksNavegacao]
   .map(link => document.querySelector(link.getAttribute("href")))
   .filter(Boolean);

function atualizarLinkAtivo() {
   const alturaCabecalho =
      document.querySelector("header")?.offsetHeight || 0;

   const pontoReferencia = window.scrollY + alturaCabecalho + 20;

   let secaoAtiva = secoesNavegacao[0];

   for (const secao of secoesNavegacao) {
      if (secao.offsetTop <= pontoReferencia) {
         secaoAtiva = secao;
      }
   }

   if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
   ) {
      secaoAtiva = secoesNavegacao[secoesNavegacao.length - 1];
   }

   linksNavegacao.forEach(link => {
      const ativo =
         link.getAttribute("href") === `#${secaoAtiva?.id}`;

      link.classList.toggle("ativo", ativo);

      if (ativo) {
         link.setAttribute("aria-current", "location");
      } else {
         link.removeAttribute("aria-current");
      }
   });
}

if (secoesNavegacao.length > 0) {
   window.addEventListener(
      "scroll",
      atualizarLinkAtivo,
      { passive: true }
   );

   window.addEventListener("resize", atualizarLinkAtivo);

   atualizarLinkAtivo();
}
