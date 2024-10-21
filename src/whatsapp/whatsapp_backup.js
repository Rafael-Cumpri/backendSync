import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { CronJob } from 'cron';

const { Client, LocalAuth } = pkg;
const client = new Client({
    authStrategy: new LocalAuth(),
});

export async function sendMessage(groupName, message) {
    try{
        const chats = await client.getChats();
        let groupId = null;

        chats.forEach((chat) => {
            if(
                chat.name === groupName ||
                chat.id_serialized === groupName
            ){
                groupId = chat.id_serialized;
            }
        })
        if(groupId){
            await client.sendMessage(groupId, message);
            console.log(`\nMensagem enviada para ${groupName}:\n${message}`);
        }else{
            console.log(`\nGrupo ou contato não encontrado: ${groupName}`)
        }
    }catch(err){
           console.error("\nErro ao enviar mensagem", err)
    }
}

export const startCronJob = (groupName, message) => {
    const job = new CronJob(
        "* * * * * *",
        async function () {
            await sendMessage(groupName, message);
        },
        null, //onComplete
        true, //start imediatamente
        "America/Sao_Paulo" //timezone

    );
    job.start();
}

client.on("qr", (qr)=> {
    qrcode.generate(qr, {small: true})
});

client.on("ready", async()=>{
    console.log("\nwhatsapp esta pronto\n");
    console.log("grupos disponiveis");

    try{
        const chats = await client.getChats();
        chats.forEach((chat)=>{
            if(chat.isGroup){
                console.log(`${chat.name}, ID: ${chat.id._serialized}`);
            }
        })
    } catch(err){
        console.error("erro ao obter chats", err)
    }

    const groupName = "Sync";
    const message= "messagem TESTE no grupo para projeto tcc";

    startCronJob(groupName, message)
});

client.initialize();