export default async function handler(req, res) {
  const url = process.env.API_CANGACEIROS;

  const resposta = await fetch(url);
  const dados = await resposta.json();

  res.status(200).json(dados);
}