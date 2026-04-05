🧮 Calculadora de IMC com IA
Uma aplicação web moderna que calcula o Índice de Massa Corporal (IMC), permite criação de conta e login, salva o histórico de resultados e ainda gera dicas personalizadas com Inteligência Artificial com base no perfil do usuário.
🌐 Demonstração
<img width="1347" height="617" alt="image (6)" src="https://github.com/user-attachments/assets/109fa6c3-144e-4dec-a6ca-0f62632c9196" />
🔗 Acesse o projeto online:
👉 https://calculadora-imc-rouge-theta.vercel.app
📌 Sobre o projeto
A Calculadora de IMC com IA foi desenvolvida para ir além de um cálculo simples, transformando a experiência em algo interativo e útil no dia a dia.
O usuário pode criar conta ou fazer login (inclusive com Google), informar idade, gênero, peso, altura e peso meta, calcular automaticamente o IMC, visualizar a classificação do resultado, receber dicas personalizadas com IA, acompanhar sua evolução em gráfico e armazenar todo o histórico no banco de dados.
O objetivo do projeto é unir saúde, tecnologia e experiência do usuário em uma aplicação prática, inteligente e moderna.
✨ Funcionalidades
✔️ Cálculo automático do IMC
✔️ Classificação do resultado (abaixo do peso, normal, etc.)
✔️ Definição de peso meta
✔️ Autenticação com e-mail e senha
✔️ Login com Google
✔️ Armazenamento de histórico no Supabase
✔️ Gráfico de evolução do IMC
✔️ Geração de dicas personalizadas com IA
✔️ Estrutura moderna com Vite
✔️ Deploy online na Vercel
✔️ Suporte inicial a PWA (manifest + service worker)
🛠️ Tecnologias utilizadas
HTML
CSS
JavaScript
Vite
Supabase (Auth, Database e Edge Functions)
Google Gemini API
Chart.js
Vercel
🧠 Como funciona a IA
Após o cálculo do IMC, o sistema coleta informações como idade, gênero, valor do IMC e classificação. Esses dados são enviados para uma Edge Function no Supabase, que faz a integração com a API do Google Gemini.
A IA retorna uma resposta personalizada contendo explicação simples do resultado, sugestões básicas de alimentação, recomendações leves de atividade física e um aviso sobre a importância de acompanhamento profissional.
📂 Estrutura do projeto
calculadora-imc/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── counter.js
│   ├── estilo.css
│   └── main.js
├── supabase/
│   ├── config.toml
│   └── functions/
│       └── gerar-dicas-saude/
│           ├── deno.json
│           └── index.ts
├── index.html
├── package.json
└── README.md
▶️ Como executar o projeto localmente
Clone o repositório:
git clone https://github.com/Jaosuzart/calculadora-imc.git
Entre na pasta:
cd calculadora-imc
Instale as dependências:
npm install
Crie um arquivo .env na raiz do projeto com:
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
Execute o projeto:
npm run dev
🔐 Configurações necessárias
Para o projeto funcionar corretamente, é necessário configurar o Supabase:
criar um projeto no Supabase
habilitar autenticação (email/senha e Google)
criar a tabela de histórico de IMC
publicar a Edge Function gerar-dicas-saude
Além disso, configure a chave da API do Gemini nas secrets da função:
GEMINI_API_KEY=sua_chave_da_api
📈 Histórico do usuário
Todos os resultados calculados são armazenados no banco de dados e exibidos em forma de gráfico, permitindo que o usuário acompanhe sua evolução ao longo do tempo. Isso transforma a aplicação em uma ferramenta mais completa de acompanhamento pessoal.
📱 PWA (Progressive Web App)
O projeto possui suporte inicial para PWA, com arquivos como manifest.json e sw.js, permitindo futura evolução para instalação no dispositivo do usuário.                                                                                  👨‍💻 Autor
Desenvolvido por João Suzart
