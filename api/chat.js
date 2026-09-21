const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Apenas método POST é permitido' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Mensagem ausente' });
    }

    // Configura os cabeçalhos HTTP para streaming de texto (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Gera a resposta em fluxo (stream)
        const result = await model.generateContentStream(message);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error(error);
        res.write(`data: ${JSON.stringify({ error: 'Erro ao processar mensagem na Vercel' })}\n\n`);
        res.end();
    }
}
