export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Só aceito POST.' });
  }

  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: 'Mensagem não fornecida.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada.' });
  }

  const prompt = `
Você é um assistente de tarefas. Abaixo está uma frase de um usuário. 
Sua missão é extrair o título da tarefa, a data (formato yyyy-mm-dd), e o status (sempre "Pendente").

Exemplo:
Entrada: "Enviar relatório final dia 25 de abril"
Saída:
{
  "titulo": "Enviar relatório final",
  "data": "2025-04-25",
  "status": "Pendente"
}

Entrada: "${mensagem}"
Saída:
`;

  try {
    const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 100
      })
    });

    const data = await resposta.json();

    // Logs úteis para depuração
    console.log('STATUS da OpenAI:', resposta.status);
    console.log('BODY da resposta:', data);

    if (!resposta.ok) {
      return res.status(500).json({ error: 'Erro da OpenAI', detalhes: data });
    }

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: 'Resposta vazia da OpenAI' });
    }

    let texto = data.choices
