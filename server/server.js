require("dotenv").config();

const express = require("express");
const cors = require("cors");

const Anthropic = require("@anthropic-ai/sdk");

const app = express();

app.use(cors());

app.use(express.json({limit:"20mb"}));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/chat", async (req, res) => {

  try {

    const {
      messages,
      system,
      max_tokens = 2000
    } = req.body;

    console.log("Recebendo mensagem...");
console.log(messages);

console.log("MODEL TESTE");
console.log(process.cwd());
console.log("API KEY:", process.env.ANTHROPIC_API_KEY ? "OK" : "MISSING");
console.log("MESSAGES:", JSON.stringify(messages,null,2));
console.log("SYSTEM:", system);
const response =
  await anthropic.messages.create({

    model: "claude-sonnet-4-6",

    max_tokens,

    system,

    messages

  });

    res.json({
      reply:
        response.content
          ?.map(c => c.text || "")
          .join("") || ""
    });

  } catch (error) {

    console.error("ERRO COMPLETO:");
    console.error(error.status);
    console.error(error.message);
    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});