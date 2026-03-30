import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
  // Lida com a requisição de preflight do navegador (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imc, classificacao, idade, genero } = await req.json()

    // Validação básica para garantir que os dados chegaram do frontend
    if (!imc || !classificacao || !idade || !genero) {
        throw new Error("Faltam parâmetros na requisição (imc, classificacao, idade ou genero).");
    }

    const prompt = `
      Aja como um consultor de saúde empático e encorajador. 
      O usuário tem ${idade} anos, do gênero ${genero}, com um IMC de ${imc} (Classificação: ${classificacao}).
      Escreva um parágrafo curto e gentil explicando o que esse número significa para o contexto dele.
      Depois, forneça 2 dicas muito práticas: uma sobre alimentação básica e outra sobre movimento leve/exercício.
      Finalize com um aviso claro e educado de que esta é uma dica gerada por IA e que a consulta a um médico ou nutricionista é essencial.
      Utilize Markdown (negrito em partes importantes e listas de marcadores para as dicas).
    `;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error("Atenção: A variável GEMINI_API_KEY não está configurada nos Secrets do Supabase.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
        console.error("Erro da API do Google:", data.error);
        throw new Error(`Erro do Google Gemini: ${data.error.message}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("A API do Gemini não retornou nenhum texto.");
    }
    
    const texto_gerado = data.candidates[0].content.parts[0].text;

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