import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabase_Anon_Key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabase_Anon_Key,{
  auth: {
  flowType: "pkce", // Use PKCE flow for better security
  },
});

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

async function verificarSessao() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    if (telaLanding) telaLanding.classList.replace("d-flex", "d-none");
    telaAutenticacao.classList.replace("d-flex", "d-none");
    telaCalculadora.classList.replace("d-none", "d-flex");
    window.carregarHistorico(); // Chama o gráfico

    if(window.location.href.includes("#")){
      window.history.replaceState(null, "", window.location.pathname);
    }
  } else {
    telaCalculadora.classList.replace("d-flex", "d-none");
    telaAutenticacao.classList.replace("d-flex", "d-none");
    if (telaLanding) telaLanding.classList.replace("d-none", "d-flex");
  }
}
verificarSessao();

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
      btnGoogle.textContent = "";
      const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgIcon.setAttribute("viewBox", "0 0 48 48");
      svgIcon.setAttribute("width", "20");
      svgIcon.setAttribute("height", "20");
      svgIcon.setAttribute("class", "me-2 bg-white rounded-circle p-1");

      const pathVermelho = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathVermelho.setAttribute("fill", "#EA4335");
      pathVermelho.setAttribute("d", "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z");

      const pathAzul = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathAzul.setAttribute("fill", "#4285F4");
      pathAzul.setAttribute("d", "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z");

      const pathAmarelo = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathAmarelo.setAttribute("fill", "#FBBC05");
      pathAmarelo.setAttribute("d", "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z");

      const pathVerde = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathVerde.setAttribute("fill", "#34A853");
      pathVerde.setAttribute("d", "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z");

      svgIcon.append(pathVermelho, pathAzul, pathAmarelo, pathVerde); 
      btnGoogle.append(svgIcon, "Entrar com Google");
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
  try{
    if (modoLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;
      telaAutenticacao.classList.replace("d-flex", "d-none");
      telaCalculadora.classList.replace("d-none", "d-flex");
      formAuth.reset();
      window.carregarHistorico(); // Carrega o gráfico
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) throw error;
      alert("Conta criada com sucesso! Faça login.");
      modoLogin = true;
      atualizarTextosAuth();
    }
  }catch(err){
    console.error("Erro na autenticação: ", err);
    alert("Ocorreu um problema: " + (err.message || "Erro desconhecido"));
  } finally{
    btnAcao.textContent = textoOriginal;
    btnAcao.disabled = false;
  }
});

document.getElementById("btnSair").addEventListener("click", async () => {
  await supabase.auth.signOut();
  telaCalculadora.classList.replace("d-flex", "d-none");
  if (telaLanding) telaLanding.classList.replace("d-none", "d-flex");
  window.limparIMC();
});

function injetarHTMLSeguro(elementoDestino, stringHtml) {
  const parseador = new DOMParser();
  const documento = parseador.parseFromString(stringHtml, 'text/html');
  elementoDestino.replaceChildren(...documento.body.childNodes);
}

// 5. CÁLCULO DO IMC E SALVAMENTO
window.calcularIMC = async function () {
  const peso = parseFloat(document.getElementById("peso").value.replace(',',  '.'));
  const btnCalcular = document.getElementById("btnCalcularIMC");
  if(btnCalcular) { btnCalcular.disabled = true; btnCalcular.textContent = "Aguarde..."; }
  const altura = parseFloat(document.getElementById("altura").value.replace(',',  '.'));
  const idade = document.getElementById("idade")
    ? document.getElementById("idade").value
    : null;
  const genero = document.getElementById("genero")
    ? document.getElementById("genero").value
    : null;
  const metaPesoElement = document.getElementById("metaPeso");
  const metaPeso =
    metaPesoElement && metaPesoElement.value
      ? parseFloat(metaPesoElement.value.replace(',', '.'))
      : 0;

  const resultadoDiv = document.getElementById("resultadoImc");
  const containerEscala = document.getElementById("containerEscalaImc");
  const marcador = document.getElementById("marcadorImc");

  if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0 || !idade) {
    alert("Por favor, preencha todos os campos obrigatórios corretamente.");
    if(btnCalcular) { btnCalcular.disabled = false; btnCalcular.innerText = "Calcular IMC"; }
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

  resultadoDiv.className = `alert ${classeCorBootstrap} text-center fw-bold mt-3`;
  resultadoDiv.textContent = "";
  
  const strongImc = document.createElement("strong");
  strongImc.textContent = imcArredondado;
  resultadoDiv.append("Seu IMC: ", strongImc, document.createElement("br"), "Classificação: ", classificacao);

  if (metaPeso > 0) {
    const diferenca = Math.abs(peso - metaPeso).toFixed(1);
    resultadoDiv.append(document.createElement("hr"));
    
    const tagSmall = document.createElement("small");
    const strongDiferenca = document.createElement("strong");
    strongDiferenca.textContent = `${diferenca}kg`;

    if (peso > metaPeso) {
      tagSmall.className = "text-dark";
      tagSmall.append("Faltam ", strongDiferenca, " para sua meta.");
    } else if (peso < metaPeso) {
      tagSmall.className = "text-dark";
      tagSmall.append("Você precisa ganhar ", strongDiferenca, " para sua meta.");
    } else {
      tagSmall.className = "text-success fw-bold";
      tagSmall.textContent = "Parabéns! Meta atingida! 🎉";
    }
    resultadoDiv.append(tagSmall);
  }
  
  resultadoDiv.classList.remove("d-none");

  if (marcador && containerEscala) {
    let porcentagem = ((imc - 15) / (40 - 15)) * 100;
    marcador.style.left = `${Math.max(0, Math.min(100, porcentagem))}%`;
    marcador.textContent = imcArredondado;
    containerEscala.classList.remove("d-none");
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("historico_imc")
        .insert([
          { user_id: user.id, peso: peso, altura: altura, imc: parseFloat(imcArredondado) },
        ]);
      window.carregarHistorico();
    }
  } catch (err) {
    console.error("Erro ao salvar histórico:", err);
  }

  gerarFeedbackPersonalizado(imcArredondado, classificacao, idade, genero);
};

async function gerarFeedbackPersonalizado(imc, classificacao, idade, genero) {
  feedbackIA.classList.remove("d-none");
  
  const templateLoading = `
        <main class="card border-primary shadow-sm mt-3 area-ia">
            <section class="card-body p-4">
                <h1 class="text-primary fw-bold mb-4 d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div> A IA está formulando suas dicas...
                </h1>
                <div class="skeleton-box" style="width: 100%;"></div>
                <div class="skeleton-box" style="width: 90%;"></div>
            </section>
        </main>`;
  injetarHTMLSeguro(feedbackIA, templateLoading);

  try {
    const personaSelect = document.getElementById("personaIA");
    const persona = personaSelect ? personaSelect.value : "amigavel";

    // Usando o cliente do Supabase para chamar a Edge Function,
    // assim não precisamos expor ou fixar 'localhost' e funciona automaticamente em produção.
    const { data, error } = await supabase.functions.invoke('gerar-dicas-saude', {
      body: { imc, classificacao, idade, genero, persona }
    });
    
    if (error) throw new Error(error.message || "Erro na Edge Function");

    const htmlBruto = window.marked.parse(data.texto_gerado);
    const htmlSeguro = window.DOMPurify.sanitize(htmlBruto);

    const templateResultado = `
            <div class="card border-primary bg-white shadow-sm mt-3 area-ia">
                <div class="card-body p-4">
                    <h6 class="card-title text-primary fw-bold mb-3">✨ Análise Personalizada</h6>
                    <div class="card-text conteudo-markdown">${htmlSeguro}</div>
                </div>
            </div>`;
    injetarHTMLSeguro(feedbackIA, templateResultado);

  } catch (err) {
    console.error("Erro da IA:", err);
    
    feedbackIA.textContent = ""; 
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-danger small mt-3";
    const alertStrong = document.createElement("strong");
    alertStrong.textContent = "Aviso: ";
    alertDiv.append(alertStrong, err.message || "Erro na IA");
    feedbackIA.append(alertDiv);

  } finally{
    const btnCalcular = document.getElementById("btnCalcularIMC");
    if(btnCalcular) { 
        btnCalcular.disabled = false; 
        btnCalcular.innerText = "Calcular IMC"; }
  }
}

let meuGrafico = null;
function carregarDependenciaGrafico(){
  return new Promise((resolve,reject)=>{
    if(window.Chart){
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  })

}
window.carregarHistorico = async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("historico_imc")
    .select("imc, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(7);

  if (error || !data || data.length === 0) return;
  const dadosOrnenados = data.reverse();  
  const areaHistorico = document.getElementById("areaHistorico");
  if (areaHistorico) areaHistorico.classList.remove("d-none");

    await carregarDependenciaGrafico();

  const ctx = document.getElementById("graficoHistorico").getContext("2d");
  const labelsEixoX = data.map((item) =>
    new Date(item.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const valoresEixoY = dadosOrnenados.map((item) => item.imc);

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
    feedbackIA.textContent = "";
  }
};

const btnCalcularIMC = document.getElementById("btnCalcularIMC");
if (btnCalcularIMC) {
  btnCalcularIMC.addEventListener("click", window.calcularIMC);
}

const btnLimparIMC = document.getElementById("btnLimparIMC");
if (btnLimparIMC) {
  btnLimparIMC.addEventListener("click", window.limparIMC);
}