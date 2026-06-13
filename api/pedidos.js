export default async function handler(req, res) {
  const url = process.env.API_CANGACEIROS;

  if (!url) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "API_CANGACEIROS não configurada"
    });
  }

  try {
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (req.method === "POST") {
      options.body = JSON.stringify(req.body);
    }

    const resposta = await fetch(url, options);
    const texto = await resposta.text();

    // Log para debug
    console.log("URL Apps Script:", url);
    console.log("Método:", req.method);
    console.log("Body enviado:", JSON.stringify(req.body));
    console.log("Resposta:", texto);

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(texto);

  } catch (erro) {
    console.error("Erro no proxy:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message
    });
  }
}