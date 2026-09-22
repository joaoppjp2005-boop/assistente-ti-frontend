
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Mensagem em falta' });
    }

    const API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KDnKsAK9ezPtZH_ZTIlViu6HTerx-WR72GHhjTiKN7rQ";

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'Erro na API do Gemini' });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta da IA.';
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ error: 'Erro interno no servidor: ' + error.message });
    }
}
