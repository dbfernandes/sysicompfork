import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailRecoveryProps {
  email: string;
  url: string;
}

export function sendEmailRecoveryPasswordUser({
  email,
  userName,
  url,
}: EmailRecoveryProps & { userName: string }) {
  sgMail.send({
    to: email, // Change to your recipient
    from: {
      email: process.env.SENDGRID_EMAIL_SEND,
      name: 'Syscomp IComp UFAM',
    }, // Change to your verified sender
    subject: '[Syscomp] Troca de senha',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
    <div>
      Prezado(a) ${userName},
      <br>
      Por favor, clique no link abaixo para criar uma nova senha:
      <br>
      <p><a href="${url}">${url}</a></p>
      <p>Este link irá expira em 1 hora.</p>
      <br>
      Atenciosamente,
      <br>
      Coordenação do Icomp
      <br>
      Instituto de Computação (IComp)
      <br>
      Universidade Federal do Amazonas (UFAM)
    </div>`,
  });
}

export function sendEmailRecoveryPasswordCandidate({
  email,
  url,
}: EmailRecoveryProps) {
  sgMail.send({
    to: email, // Change to your recipient
    from: {
      email: process.env.SENDGRID_EMAIL_SEND,
      name: 'Coordenação do PPGI',
    }, // Change to your verified sender
    subject: '[PPGI] Troca de senha',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
          <div>
          Prezado(a) candidato
          <br>
          Por favor, clique no link abaixo para criar uma nova senha:
          <br>
          <p><a href="${url}">${url}</a></p>
          <p>Este link irá expira em 1 hora.</p>
          <br>
          Atenciosamente,
          <br>
          Coordenação do Icomp
          <br>
          Instituto de Computação (IComp)
          <br>
          Universidade Federal do Amazonas (UFAM)
        </div>`,
  });
}

export default sgMail;
