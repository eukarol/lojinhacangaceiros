export default async function handler(req, res) {
  const url = process.env.API_CANGACEIROS;

  try {
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (req.method !== "GET") {
      options.body = JSON.stringify(req.body);
    }

    const resposta = await fetch(url, options);

    const texto = await resposta.text();

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(texto);

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
}