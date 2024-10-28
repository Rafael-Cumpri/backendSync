import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { CronJob } from "cron";

const { Client, LocalAuth } = pkg;
const client = new Client({
  authStrategy: new LocalAuth(),
});


// Função para enviar mensagem para um grupo ou contato
export async function sendMessage(groupNameOrId, message) {
  try {
    const chats = await client.getChats();
    let groupId = null;

    // Encontra o ID do grupo pelo nome ou ID
    chats.forEach((chat) => {
      if (
        chat.name === groupNameOrId ||
        chat.id._serialized === groupNameOrId
      ) {
        groupId = chat.id._serialized;
      }
    });

    if (groupId) {
      await client.sendMessage(groupId, message);
      console.log(`\nMensagem enviada para ${groupNameOrId}:\n${message}`);
    } else {
      console.log(`\nGrupo ou contato não encontrado: ${groupNameOrId}`);
    }
  } catch (err) {
    console.error("\nErro ao enviar mensagem:", err);
  }
}

// Função para iniciar o cron job
export const startCronJob = (groupNameOrId, message) => {
  const job = new CronJob(
    "* * * * * *",
    async function () {
      await sendMessage(groupNameOrId, message);
    },
    null, // onComplete
    true, // start imediatamente
    "America/Sao_Paulo" // timezone
  );

  job.start();
};

// Evento para gerar o QR Code
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Evento quando o cliente está pronto
client.on("ready", async () => {
  console.log("\nWhatsApp está pronto!\n");
  console.log("Grupos disponíveis:");

  // Listar grupos disponíveis
  try {
    const chats = await client.getChats();
    chats.forEach((chat) => {
      if (chat.isGroup) {
        console.log(`${chat.name}, ID: ${chat.id._serialized}`);
      }
    });
  } catch (err) {
    console.error("Erro ao obter chats:", err);
  } 

  // Exemplo de uso do cron job
  const groupNameOrId = "Neca"; // Nome do grupo ou ID
  const message =
    "Mensagem TESTE no grupo para projeto Veteranos (npm i whatsapp-web.js)";

  // Iniciar o cron job
  startCronJob(groupNameOrId, message);
});

// Inicializa o cliente
client.initialize();
