export default async function handler(req, res) {
    // Permite apenas requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Apenas método POST é permitido' });
    }

    const { message } = req.body || {};
    if (!message) {
        return res.status(400).json({ error: 'Mensagem ausente' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY não configurada nas variáveis da Vercel' });
    }

    try {
        // Chamada direta à REST API do Gemini via fetch (sem bibliotecas externas)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro na API do Gemini:', data);
            return res.status(500).json({ error: data.error?.message || 'Erro ao chamar a API do Gemini' });
        }

        // Extrai o texto da resposta
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do modelo.';
        return res.status(200).json({ text: reply });

    } catch (error) {
        console.error('Erro no servidor:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
