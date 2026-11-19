// [ Sprint 05 ] Recebebimento de dados por POST
import { text } from "express";

// Recebe JSON d o navegador ou de um cliente HTTP
app.use(express.json());

//Serializa gravações dentro deste único prpcesso Node.js
let fila = Promise.resolve();
app.post("/mensagens", (req, res) => {
    const { usuario, texto } = req.body ?? {};
    if (typeof usuario !== "string" || !usuario.trim() ||
        typeof texto !== "string" || !texto.trim()) {
        return res.status(400).json({ erro: "Informe usuário e mensagem." });
    }
    if (usuario.trim().length > 40 || texto.trim().length > 500) {
        return res.status(400).json({ erro: "Nome ou mensagem muito longos." });
    }
    const tarefa = fila.then(async () => {
        const lista = await lerMensagens();
        const id = lista.reduce((maior, m) => Math.max(maior, Number(m.id) || 0), 0) + 1;
        const nova = { id, usuario: usuario.trim(), texto: texto.trim(), data: new Date().toISOString() };
        await salvarMensagens([...lista, nova]);
        return nova;
    });
    fila = tarefa.catch(() => { });
    tarefa.then(nova => res.status(201).json(nova)).catch(erro => {
        console.error(erro);
        res.status(500).json({ erro: "Não foi possível salvar a mensagem." });
    });
});

//SPRINT 06 - NOVO: interface web e arquivos estáticos
//A rota GET / agora entrega public/index.html em vez da mensagem fixa.

app.use(express.static("public"));