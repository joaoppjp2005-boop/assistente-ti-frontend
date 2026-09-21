const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Apenas método POST é permitido' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Mensagem ausente' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY não configurada na Vercel' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text: text });
    } catch (error) {
        console.error('Erro no backend:', error);
        return res.status(500).json({ error: 'Erro ao processar mensagem com a API do Gemini' });
    }
}
