/* const smtpTransport = require('../config/email');

module.exports = (email, nome, mensagem, anexo) => {
    const mail = {
        from: "Livia <liviabelao.564@gmail.com>",
        to: email,
        subject: `${nome} te enviou uma mensagem`,
        text: mensagem,
    };

    if (anexo) {
        mail.attachments = [{
            filename: anexo.originalname,
            content: anexo.buffer
        }];
    }

    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mail)
            .then(response => {
                smtpTransport.close();
                return resolve(response);
            })
            .catch(error => {
                smtpTransport.close();
                return reject(error);
            });
    });
}; */