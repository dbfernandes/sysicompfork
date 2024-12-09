import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';

function dataAtualExtensa() {
  const date = new Date();
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Manaus',
    timeZoneName: 'long',
  });
}

function formatarDataExtensa(date) {
  if (!date) return '';

  console.log(date);
  // Verifique se 'date' é uma instância de Date ou uma string válida
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString('pt-BR', {
    timeZone: 'America/Manaus',
    timeZoneName: 'long',
  });
}

function dataAtualToLocaleString() {
  return new Date().toLocaleString();
}

function dataToLocaleString(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  return dateObj.toLocaleString();
}

Handlebars.registerHelper('dataAtualExtensa', dataAtualExtensa);
Handlebars.registerHelper('formatarDataExtensa', formatarDataExtensa);
Handlebars.registerHelper('dataAtualToLocaleString', dataAtualToLocaleString);
Handlebars.registerHelper('dataToLocaleString', dataToLocaleString);

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface SendEmailProps {
  to: string;
  title: string;
  name?: string;
  template: string;
  data?: object;
}

// Função para compilar templates Handlebars
function compileTemplate(
  templateName: string,
  data: object,
): { html: string; text: string } {
  const templatePath = path.join(__dirname, 'views', `${templateName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Template ${templateName} não encontrado em ${templatePath}`,
    );
  }

  const templateSource = fs.readFileSync(templatePath, 'utf8');

  const template = Handlebars.compile(templateSource);
  const body = template(data);

  // Renderizar com o layout
  //   const finalHtml = layout({ ...data, body, subject: data['subject'] || '' });

  // Converter HTML para texto puro
  const finalText = convert(body, {
    wordwrap: 130,
  });

  return { html: body, text: finalText };
}

/**
 *Envia um email com o template especificado
 * @param to Email destinatário
 * @param title Título do email
 * @param name Nome do remetente
 * @param template Nome do arquivo de template
 * @param data Dados para renderizar o template
 * @returns Promise<void>
 * @throws Error se o template não for encontrado ou se houver erro ao enviar o email
 *
 */
export async function sendEmail({
  to,
  name = 'Syscomp IComp UFAM',
  title,
  template,
  data = {},
}: SendEmailProps) {
  const { html, text } = compileTemplate(template, data);
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_EMAIL_SEND,
        name,
      },
      subject: title,
      text,
      html,
    });

    console.log('Email enviado');
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
}
