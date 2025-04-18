export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Só aceito POST.' });
  }

  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: 'Mensagem não fornecida.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('🔒 Variável de ambiente OPENAI_API_KEY não configurada.');
    return res.status(500).json({ error: 'Chave da API não configurada no servidor.' });
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

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      console.error('❌ Erro da API OpenAI:', erroTexto);
      return res.status(resposta.status).json({ error: 'Erro da API OpenAI', detalhe: erroTexto });
    }

    const data = await resposta.json();

    if (!data.choices || !data.choices[0]?.text) {
      return res.status(500).json({ error: 'Resposta inesperada da OpenAI.' });
    }

    let tarefa;

    try {
      tarefa = JSON.parse(data.choices[0].text.trim());
    } catch (parseError) {
      console.error('🚫 Erro ao fazer parse do JSON:', parseError);
      console.error('Texto retornado:', data.choices[0].text.trim());
      return res.status(500).json({
        error: 'Erro ao interpretar resposta da IA',
        textoOriginal: data.choices[0].text.trim()
      });
    }

    res.status(200).json(tarefa);
  } catch (err) {
    console.error('💥 Erro geral no servidor:', err);
    res.status(500).json({ error: 'Erro ao falar com o GPT' });
  }
}
