import { createClient } from '@supabase/supabase-js';

// 1. CHAVES DO SUPABASE (Não mexa aqui, já estão as suas chaves)
const supabaseUrl = 'https://uzijrunggkwwjdoxujww.supabase.co'; 
const supabaseKey = 'sb_publishable_ySfVjyFt28Ab5LLRBsE7Yg_GGubs_qW';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. PEGANDO OS ELEMENTOS DA TELA
const telaAutenticacao = document.getElementById('telaAutenticacao');
const telaCalculadora = document.getElementById('telaCalculadora');
const formAuth = document.getElementById('formAuth');
const tituloAutenticacao = document.getElementById('tituloAutenticacao');
const btnAcao = document.getElementById('btnAcao');
const linkTrocarModo = document.getElementById('linkTrocarModo');
const inputSenha = document.getElementById('senha');
const btnOlhinho = document.getElementById('btnOlhinho');

let modoLogin = true;

// 3. LÓGICA DO OLHINHO DA SENHA
btnOlhinho.addEventListener('click', () => {
    if (inputSenha.type === 'password') {
        inputSenha.type = 'text';
        btnOlhinho.textContent = '🙈';
    } else {
        inputSenha.type = 'password';
        btnOlhinho.textContent = '👁️';
    }
});

// 4. TROCAR ENTRE TELA DE LOGIN E CADASTRO
linkTrocarModo.addEventListener('click', (e) => {
    e.preventDefault();
    modoLogin = !modoLogin;
    if (modoLogin) {
        tituloAutenticacao.textContent = "Fazer Login";
        btnAcao.textContent = "Entrar";
        linkTrocarModo.textContent = "Não tem conta? Cadastre-se";
    } else {
        tituloAutenticacao.textContent = "Criar Conta";
        btnAcao.textContent = "Cadastrar";
        linkTrocarModo.textContent = "Já tem conta? Faça Login";
    }
});

// 5. ENVIAR OS DADOS PARA O SUPABASE
formAuth.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (modoLogin) {
        // Tenta fazer o Login
        const { error } = await supabase.auth.signInWithPassword({ email: email, password: senha });
        
        if (error) {
            alert("Erro ao entrar: " + error.message);
        } else {
            // Se deu certo, esconde o login e mostra a calculadora
            telaAutenticacao.classList.replace('d-flex', 'd-none');
            telaCalculadora.classList.replace('d-none', 'd-flex');
            formAuth.reset();
        }
    } else {
        // Tenta fazer o Cadastro
        const { error } = await supabase.auth.signUp({ email: email, password: senha });
        
        if (error) {
            alert("Erro ao cadastrar: " + error.message);
        } else {
            alert("Conta criada com sucesso! Agora você pode fazer o login.");
            linkTrocarModo.click(); // Volta a tela para o modo "Entrar" automaticamente
        }
    }
});

// 6. BOTÃO DE SAIR DA CONTA (LOGOUT)
document.getElementById('btnSair').addEventListener('click', async () => {
    await supabase.auth.signOut();
    telaCalculadora.classList.replace('d-flex', 'd-none');
    telaAutenticacao.classList.replace('d-none', 'd-flex');
    limparIMC(); // Limpa os dados de quem estava usando
});

// 7. A MATEMÁTICA E CLASSIFICAÇÃO DO IMC
window.calcularIMC = function() {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const resultadoDiv = document.getElementById('resultadoImc');

    if(isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        alert("Por favor, digite valores válidos para peso e altura.");
        return;
    }

    const imc = peso / (altura * altura);
    const imcArredondado = imc.toFixed(1); 

    let classificacao = "";
    let classeCorBootstrap = "";

    if (imc < 18.5) {
        classificacao = "Abaixo do peso";
        classeCorBootstrap = "alert-warning"; 
    } else if (imc >= 18.5 && imc <= 24.9) {
        classificacao = "Peso normal";
        classeCorBootstrap = "alert-success"; 
    } else if (imc >= 25 && imc <= 29.9) {
        classificacao = "Sobrepeso";
        classeCorBootstrap = "alert-warning"; 
    } else if (imc >= 30 && imc <= 34.9) {
        classificacao = "Obesidade Grau I";
        classeCorBootstrap = "alert-danger"; 
    } else if (imc >= 35 && imc <= 39.9) {
        classificacao = "Obesidade Grau II";
        classeCorBootstrap = "alert-danger"; 
    } else {
        classificacao = "Obesidade Grau III (Mórbida)";
        classeCorBootstrap = "alert-dark"; 
    }

    resultadoDiv.className = `alert ${classeCorBootstrap} text-center fw-bold mt-3`;
    resultadoDiv.innerHTML = `Seu IMC: <strong>${imcArredondado}</strong><br>Classificação: ${classificacao}`;
    resultadoDiv.classList.remove("d-none"); 
}  

// 8. BOTÃO DE LIMPAR A CALCULADORA
window.limparIMC = function() {
    document.getElementById("peso").value = "";
    document.getElementById("altura").value = "";
    const resultadoDiv = document.getElementById("resultadoImc");
    resultadoDiv.classList.add("d-none"); 
    resultadoDiv.innerHTML = "";
}