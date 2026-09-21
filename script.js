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

    // Lista de modelos ordenada por preferência
    const models = [
        'gemini-3.6-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro'
    ];

    let lastError = null;

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

            // Se o modelo estiver com alta procura (status 429/503), tenta o próximo modelo da lista
            if (!response.ok) {
                lastError = data.error?.message || `Erro no modelo ${model}`;
                if (response.status === 429 || response.status === 503 || data.error?.code === 429) {
                    continue; 
                }
                return res.status(500).json({ error: lastError });
            }

            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do modelo.';
            return res.status(200).json({ text: reply });

        } catch (err) {
            lastError = err.message;
        }
    }

    return res.status(503).json({ 
        error: 'Servidores da Google temporariamente ocupados. Por favor, tenta novamente em instantes.' 
    });
}
