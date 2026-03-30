import { createClient } from "@supabase/supabase-js";

// 1. CHAVES DO SUPABASE
const supabaseUrl = "https://uzijrunggkwwjdoxujww.supabase.co";
const supabaseKey = "sb_publishable_ySfVjyFt28Ab5LLRBsE7Yg_GGubs_qW";
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. ELEMENTOS DA TELA
const telaLanding = document.getElementById("telaLanding");
const telaAutenticacao = document.getElementById("telaAutenticacao");
const telaCalculadora = document.getElementById("telaCalculadora");
const formAuth = document.getElementById("formAuth");
const tituloAutenticacao = document.getElementById("tituloAutenticacao");
const btnAcao = document.getElementById("btnAcao");
const linkTrocarModo = document.getElementById("linkTrocarModo");
const inputSenha = document.getElementById("senha");
const btnOlhinho = document.getElementById("btnOlhinho");
const feedbackIA = document.getElementById("feedbackIA");

let modoLogin = true;

// 3. VERIFICAR SESSÃO AO ABRIR O SITE
async function verificarSessao() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    if (telaLanding) telaLanding.classList.replace("d-flex", "d-none");
    telaAutenticacao.classList.replace("d-flex", "d-none");
    telaCalculadora.classList.replace("d-none", "d-flex");
    window.carregarHistorico(); // Chama o gráfico
  } else {
    telaCalculadora.classList.replace("d-flex", "d-none");
    telaAutenticacao.classList.replace("d-flex", "d-none");
    if (telaLanding) telaLanding.classList.replace("d-none", "d-flex");
  }
}
verificarSessao();

// 4. LÓGICA DE LOGIN / CADASTRO
function atualizarTextosAuth() {
  if (modoLogin) {
    tituloAutenticacao.textContent = "Fazer Login";
    btnAcao.textContent = "Entrar";
    linkTrocarModo.textContent = "Não tem conta? Cadastre-se";
  } else {
    tituloAutenticacao.textContent = "Criar Conta";
    btnAcao.textContent = "Cadastrar";
    linkTrocarModo.textContent = "Já tem conta? Faça Login";
  }
}

if (document.getElementById("btnIrParaLogin")) {
  document.getElementById("btnIrParaLogin").addEventListener("click", () => {
    telaLanding.classList.replace("d-flex", "d-none");
    telaAutenticacao.classList.replace("d-none", "d-flex");
    modoLogin = true;
    atualizarTextosAuth();
  });
}

if (document.getElementById("btnIrParaCadastro")) {
  document.getElementById("btnIrParaCadastro").addEventListener("click", () => {
    telaLanding.classList.replace("d-flex", "d-none");
    telaAutenticacao.classList.replace("d-none", "d-flex");
    modoLogin = false;
    atualizarTextosAuth();
  });
}

if (document.getElementById("btnVoltarInicio")) {
  document.getElementById("btnVoltarInicio").addEventListener("click", () => {
    telaAutenticacao.classList.replace("d-flex", "d-none");
    telaLanding.classList.replace("d-none", "d-flex");
    formAuth.reset();
  });
}

linkTrocarModo.addEventListener("click", (e) => {
  e.preventDefault();
  modoLogin = !modoLogin;
  atualizarTextosAuth();
});

btnOlhinho.addEventListener("click", () => {
  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlhinho.textContent = "🙈";
  } else {
    inputSenha.type = "password";
    btnOlhinho.textContent = "👁️";
  }
});

const btnGoogle = document.getElementById("btnGoogle");
if (btnGoogle) {
  btnGoogle.addEventListener("click", async () => {
    btnGoogle.innerText = "Aguarde...";
    btnGoogle.disabled = true;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      alert("Erro ao logar com Google: " + error.message);
      btnGoogle.innerHTML =
        '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="20" class="me-2 bg-white rounded-circle p-1"> Entrar com Google';
      btnGoogle.disabled = false;
    }
  });
}

formAuth.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const textoOriginal = btnAcao.textContent;
  btnAcao.textContent = "Aguarde...";
  btnAcao.disabled = true;

  if (modoLogin) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      telaAutenticacao.classList.replace("d-flex", "d-none");
      telaCalculadora.classList.replace("d-none", "d-flex");
      formAuth.reset();
      window.carregarHistorico(); // Carrega o gráfico
    }
  } else {
    const { error } = await supabase.auth.signUp({ email, password: senha });
    if (error) {
      alert("Erro ao cadastrar: " + error.message);
    } else {
      alert("Conta criada com sucesso! Faça login.");
      modoLogin = true;
      atualizarTextosAuth();
    }
  }
  btnAcao.textContent = textoOriginal;
  btnAcao.disabled = false;
});

document.getElementById("btnSair").addEventListener("click", async () => {
  await supabase.auth.signOut();
  telaCalculadora.classList.replace("d-flex", "d-none");
  if (telaLanding) telaLanding.classList.replace("d-none", "d-flex");
  window.limparIMC();
});

// 5. CÁLCULO DO IMC E SALVAMENTO
window.calcularIMC = async function () {
  const peso = parseFloat(document.getElementById("peso").value);
  const btnCalcular = document.querySelector('button[onclick="calcularIMC()"]');
  if(btnCalcular) { btnCalcular.disabled = true; btnCalcular.innerText = "Aguarde..."; }
  const altura = parseFloat(document.getElementById("altura").value);
  const idade = document.getElementById("idade")
    ? document.getElementById("idade").value
    : null;
  const genero = document.getElementById("genero")
    ? document.getElementById("genero").value
    : null;
  const metaPesoElement = document.getElementById("metaPeso");
  const metaPeso =
    metaPesoElement && metaPesoElement.value
      ? parseFloat(metaPesoElement.value)
      : 0;

  const resultadoDiv = document.getElementById("resultadoImc");
  const containerEscala = document.getElementById("containerEscalaImc");
  const marcador = document.getElementById("marcadorImc");

  if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0 || !idade) {
    alert("Por favor, preencha todos os campos obrigatórios corretamente.");
    return;
  }

  const imc = peso / (altura * altura);
  const imcArredondado = imc.toFixed(1);

  let classificacao = "";
  let classeCorBootstrap = "";

  if (imc < 18.5) {
    classificacao = "Abaixo do peso";
    classeCorBootstrap = "alert-info";
  } else if (imc < 25) {
    classificacao = "Peso normal";
    classeCorBootstrap = "alert-success";
  } else if (imc < 30) {
    classificacao = "Sobrepeso";
    classeCorBootstrap = "alert-warning";
  } else if (imc < 35) {
    classificacao = "Obesidade Grau I";
    classeCorBootstrap = "alert-danger";
  } else if (imc < 40) {
    classificacao = "Obesidade Grau II";
    classeCorBootstrap = "alert-danger";
  } else {
    classificacao = "Obesidade Grau III";
    classeCorBootstrap = "alert-dark";
  }

  let mensagemMeta = "";
  if (metaPeso > 0) {
    const diferenca = Math.abs(peso - metaPeso).toFixed(1);
    if (peso > metaPeso)
      mensagemMeta = `<hr><small class="text-dark">Faltam <strong>${diferenca}kg</strong> para sua meta.</small>`;
    else if (peso < metaPeso)
      mensagemMeta = `<hr><small class="text-dark">Você precisa ganhar <strong>${diferenca}kg</strong> para sua meta.</small>`;
    else
      mensagemMeta = `<hr><small class="text-success fw-bold">Parabéns! Meta atingida! 🎉</small>`;
  }

  resultadoDiv.className = `alert ${classeCorBootstrap} text-center fw-bold mt-3`;
  resultadoDiv.innerHTML = `Seu IMC: <strong>${imcArredondado}</strong><br>Classificação: ${classificacao} ${mensagemMeta}`;
  resultadoDiv.classList.remove("d-none");

  if (marcador && containerEscala) {
    let porcentagem = ((imc - 15) / (40 - 15)) * 100;
    marcador.style.left = `${Math.max(0, Math.min(100, porcentagem))}%`;
    marcador.textContent = imcArredondado;
    containerEscala.classList.remove("d-none");
  }

  // Tenta salvar no Banco e atualizar o gráfico
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("historico_imc")
        .insert([
          { user_id: user.id, peso: peso, imc: parseFloat(imcArredondado) },
        ]);
      window.carregarHistorico();
    }
  } catch (err) {
    console.error("Erro ao salvar histórico:", err);
  }

  // Chama a IA
  gerarFeedbackPersonalizado(imcArredondado, classificacao, idade, genero);
};

// 6. COMUNICAÇÃO COM A IA
async function gerarFeedbackPersonalizado(imc, classificacao, idade, genero) {
  feedbackIA.classList.remove("d-none");
  feedbackIA.innerHTML = `
        <div class="card border-primary shadow-sm mt-3 area-ia">
            <div class="card-body p-4">
                <h1 class="text-primary fw-bold mb-4 d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div> A IA está formulando suas dicas...
                </h1>
                <div class="skeleton-box" style="width: 100%;"></div>
                <div class="skeleton-box" style="width: 90%;"></div>
            </div>
        </div>`;

  try {
    const personaSelect = document.getElementById("personaIA");
    const persona = personaSelect ? personaSelect.value : "amigavel";

    const { data, error } = await supabase.functions.invoke(
      "gerar-dicas-saude",
      {
        body: { imc, classificacao, idade, genero, persona },
      },
    );

    if (error) throw error;

    const htmlBruto = window.marked.parse(data.texto_gerado);
    const htmlSeguro = window.DOMPurify.sanitize(htmlBruto);

    feedbackIA.innerHTML = `
            <div class="card border-primary bg-white shadow-sm mt-3 area-ia">
                <div class="card-body p-4">
                    <h6 class="card-title text-primary fw-bold mb-3">✨ Análise Personalizada</h6>
                    <div class="card-text conteudo-markdown">${htmlSeguro}</div>
                </div>
            </div>`;
  } catch (err) {
    console.error("Erro da IA:", err);
    feedbackIA.innerHTML = `<div class="alert alert-danger small mt-3"><strong>Aviso:</strong> ${err.message || "Erro na IA"}</div>`;
  } finally{
    const btnCalcular = document.querySelector('button[onclick="calcularIMC()"]');
    if(btnCalcular) { 
        btnCalcular.disabled = false; 
        btnCalcular.innerText = "Calcular IMC"; }
  }
}

// 7. GRÁFICO (CHART.JS)
let meuGrafico = null;
window.carregarHistorico = async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("historico_imc")
    .select("imc, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(7);

  if (error || !data || data.length === 0) return;

  const areaHistorico = document.getElementById("areaHistorico");
  if (areaHistorico) areaHistorico.classList.remove("d-none");

  const ctx = document.getElementById("graficoHistorico").getContext("2d");
  const labelsEixoX = data.map((item) =>
    new Date(item.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  );
  const valoresEixoY = data.map((item) => item.imc);

  if (meuGrafico) meuGrafico.destroy();

  meuGrafico = new window.Chart(ctx, {
    type: "line",
    data: {
      labels: labelsEixoX,
      datasets: [
        {
          label: "Seu IMC",
          data: valoresEixoY,
          borderColor: "#0d6efd",
          backgroundColor: "rgba(13, 110, 253, 0.2)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#0d6efd",
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { suggestedMin: 15, suggestedMax: 40 } },
    },
  });
};

// 8. LIMPAR DADOS
window.limparIMC = function () {
  document.getElementById("formCalculadora").reset();
  document.getElementById("resultadoImc").classList.add("d-none");
  const containerEscala = document.getElementById("containerEscalaImc");
  const marcador = document.getElementById("marcadorImc");
  if (containerEscala && marcador) {
    containerEscala.classList.add("d-none");
    marcador.style.left = "0%";
    marcador.textContent = "0.0";
  }
  if (feedbackIA) {
    feedbackIA.classList.add("d-none");
    feedbackIA.innerHTML = "";
  }
};
