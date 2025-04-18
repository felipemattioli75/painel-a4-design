export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Só aceito POST.' });
  }

  const { mensagem } = req.body;

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
    const resposta = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.4
      })
    });

    const data = await resposta.json();
    const texto = data.choices[0].text.trim();
    const tarefa = JSON.parse(texto);

    res.status(200).json(tarefa);
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro ao falar com o GPT' });
  }
}
