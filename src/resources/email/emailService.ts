import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import { AttachmentData } from '@sendgrid/helpers/classes/attachment';

function dataAtualExtensa() {
  const date = new Date();
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Manaus',
    timeZoneName: 'long',
  });
}

function formatarDataExtensa(date) {
  if (!date) return '';

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
  attachments?: AttachmentData[];
}

/**
 * Verifica se um arquivo existe de forma assíncrona.
 * @param {string} path - Caminho para o arquivo.
 * @returns {Promise<boolean>} - Retorna true se o arquivo existir, false caso contrário.
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

// Função para compilar templates Handlebars
async function compileTemplate(
  templateName: string,
  data: object,
): Promise<{ html: string; text: string }> {
  const templatePath = path.join(__dirname, 'views', `${templateName}.hbs`);
  const layoutPath = path.join(__dirname, 'views', 'layout.hbs');
  const templateSource = await fs.readFile(templatePath, 'utf8');

  // Compilar o template específico do email
  const template = Handlebars.compile(templateSource);
  const body = template({ ...data });

  // Compilar o layout com o corpo do email
  const layoutSource = await fs.readFile(layoutPath, 'utf8');
  const layout = Handlebars.compile(layoutSource);
  const currentYear = new Date().getFullYear();

  const finalHtml = layout({ ...data, body, year: currentYear.toString() });
  // Renderizar com o layout
  //   const finalHtml = layout({ ...data, body, subject: data['subject'] || '' });

  // Converter HTML para texto puro
  const finalText = convert(finalHtml, {
    wordwrap: 130,
  });

  return { html: finalHtml, text: finalText };
}

async function getAttachments() {
  // Caminho para as imagens a serem incorporadas
  const imagesFolder = path.join(__dirname, '..', '..', '..', 'public', 'img');

  // Lista de imagens a serem incorporadas
  const images = [
    { path: path.join(imagesFolder, 'logo-ufam.png'), cid: 'logo_ufam' },
  ];

  // Verificar se todas as imagens existem
  for (const img of images) {
    if (!(await fileExists(img.path))) {
      console.error(`Imagem ${img.path} não encontrada`);
      return [];
    }
  }

  // Configurar os anexos com CID
  return await Promise.all(
    images.map(async (img) => ({
      filename: path.basename(img.path),
      cid: img.cid,
      content_id: img.cid,
      content: await fs.readFile(img.path, 'base64'),
      disposition: 'inline',
      type: 'image/png',
    })),
  );
}

/**
 *Envia um email com o template especificado
 * @param to Email destinatário
 * @param title Título do email
 * @param name Nome do remetente
 * @param template Nome do arquivo de template
 * @param data Dados para renderizar o template
 * @param attachments Anexos para o email
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
  attachments,
}: SendEmailProps) {
  const { html, text } = await compileTemplate(template, data);
  const attachmentsImgs = await getAttachments();
  const attachmentsSend = [];
  attachmentsSend.push(...attachmentsImgs);
  attachments && attachmentsSend.push(...attachments);

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
      attachments: attachmentsSend,
    });
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
}
