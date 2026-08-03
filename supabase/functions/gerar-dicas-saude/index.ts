import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imc, classificacao, idade, genero, persona = "amigavel" } = await req.json()

    if (!imc || !classificacao || !idade || !genero) {
        throw new Error("Faltam parâmetros na requisição (imc, classificacao, idade ou genero).");
    }

let tom = "um consultor de saúde empático e encorajador";
    if (persona === "treinador") tom = "um treinador motivacional e enérgico";
    if (persona === "medico") tom = "um médico, com tom científico, sério e técnico";

    const prompt = `
      Aja como ${tom}. 
      O usuário tem ${idade} anos, do gênero ${genero}, com um IMC de ${imc} (Classificação: ${classificacao}).
      Escreva um parágrafo curto e gentil explicando o que esse número significa para o contexto dele.
      Depois, forneça 2 dicas muito práticas: uma sobre alimentação básica e outra sobre movimento leve/exercício.
      Finalize com um aviso claro e educado de que esta é uma dica gerada por IA e que a consulta a um médico ou nutricionista é essencial.
      Utilize Markdown (negrito em partes importantes e listas de marcadores para as dicas).
    `;

    // Pega a chave da Groq nos Secrets do Supabase
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    if (!groqApiKey) {
      throw new Error("Atenção: A variável GROQ_API_KEY não está configurada nos Secrets do Supabase.");
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}` 
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
            { role: 'user', content: prompt }
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    
    if (data.error) {
        console.error("Erro da API da Groq:", data.error);
        throw new Error(`Erro da Groq: ${data.error.message}`);
    }

    if (!data.choices || data.choices.length === 0) {
        throw new Error("A API da Groq não retornou nenhum texto.");
    }
    
    const texto_gerado = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ texto_gerado }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (error: any) {
    console.error("Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, 
    })
  }
})