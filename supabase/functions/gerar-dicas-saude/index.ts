const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { imc, classificacao, idade, genero, persona = "amigavel" } = await req.json()

        if (!imc || !classificacao || !idade || !genero) {
            return new Response(
                JSON.stringify({ error: "Faltam parâmetros na requisição (imc, classificacao, idade ou genero)." }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
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

        const groqApiKey = Deno.env.get('GROQ_API_KEY');

        if (!groqApiKey) {
            console.error("Variável GROQ_API_KEY ausente.");
            return new Response(
                JSON.stringify({ error: "Erro de configuração no servidor." }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Modelo corrigido para um modelo válido da Groq
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("Erro da API da Groq:", data.error || data);
            return new Response(
                JSON.stringify({ error: "Falha ao comunicar com o serviço de IA." }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
            )
        }

        if (!data.choices || data.choices.length === 0) {
            return new Response(
                JSON.stringify({ error: "A API da Groq não retornou nenhum texto." }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
            )
        }

        const texto_gerado = data.choices[0].message.content;

        return new Response(
            JSON.stringify({ texto_gerado }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
        )
    } catch (error: unknown) {
        console.error("Erro na Edge Function:", error);

        const isJsonError = error instanceof SyntaxError;

        return new Response(JSON.stringify({ error: isJsonError ? "JSON inválido." : "Erro interno no servidor." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: isJsonError ? 400 : 500,
        })
    }
})
