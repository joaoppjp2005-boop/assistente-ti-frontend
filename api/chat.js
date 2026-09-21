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

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data.error?.message || 'Erro na API do Gemini' });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do modelo.';
        return res.status(200).json({ text: reply });

    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
