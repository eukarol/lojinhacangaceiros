export default async function handler(req, res) {
  try {
    const url = process.env.API_CANGACEIROS;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    res.status(200).json(dados);

  } catch (erro) {
    res.status(500).json({
      erro: "Falha ao buscar dados"
    });
  }
}