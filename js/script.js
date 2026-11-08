
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


/* CURIOSIDADES SOBRE GATOS — FETCH API */

const botaoCuriosidade = document.querySelector("#btn-curiosidade");
const fatoGato = document.querySelector("#fato-gato");

async function buscarCuriosidade() {
   botaoCuriosidade.disabled = true;
   fatoGato.textContent = "Carregando curiosidade...";

   try {
      const respostaAPI = await fetch("https://catfact.ninja/fact");

      if (!respostaAPI.ok) {
         throw new Error("Erro ao consultar a API.");
      }

      const dados = await respostaAPI.json();
      fatoGato.textContent = dados.fact;

   } catch (erro) {
      console.error("Erro:", erro);
      fatoGato.textContent =
         "Não foi possível carregar a curiosidade. Tente novamente.";

   } finally {
      botaoCuriosidade.disabled = false;
   }
}

botaoCuriosidade.addEventListener("click", buscarCuriosidade);

