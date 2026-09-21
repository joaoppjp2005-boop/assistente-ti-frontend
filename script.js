export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Apenas método POST é permitido' });
    }

    const { message } = req.body || {};
    if (!message) {
        return res.status(400).json({ error: 'Mensagem ausente' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY não configurada na Vercel' });
    }

    // Lista de modelos suportados para fallback
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro'
    ];

    for (const model of models) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });

            const data = await response.json();

            // Se o modelo responder com sucesso, devolve a resposta imediatamente
            if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                const reply = data.candidates[0].content.parts[0].text;
                return res.status(200).json({ text: reply });
            }
        } catch (err) {
            // Continua para o próximo modelo se ocorrer alguma falha de rede ou timeout
            console.error(`Erro ao chamar modelo ${model}:`, err);
        }
    }

    // Se nenhum modelo da lista conseguir responder
    return res.status(503).json({ 
        error: 'O serviço do Gemini está temporariamente indisponível. Por favor, tenta novamente dentro de alguns segundos.' 
    });
}
