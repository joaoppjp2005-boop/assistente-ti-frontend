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
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ response: text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao processar mensagem na Vercel' });
    }
}

