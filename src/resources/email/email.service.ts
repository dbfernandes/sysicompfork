import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';
import { DateTime } from 'luxon';

interface Attachment {
  filename: string;
  content: string | Buffer; // pode ser base64 ou Buffer
  content_id?: string; // se quiser usar como imagem inline com <img src="cid:...">
  type?: string; // tipo MIME, ex: "image/png", "application/pdf"
  disposition?: string; // "inline" ou "attachment" (padrão)
  contentType?: string; // tipo MIME, ex: "image/png", "application/pdf"
}
dotenv.config();

function dataAtualExtensa() {
  const date = new Date();
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Manaus',
    timeZoneName: 'long',
  });
}

Handlebars.registerHelper('dataAtualExtensa', dataAtualExtensa);
// Utilitário: tenta montar um DateTime a partir de vários tipos de entrada
function toManausDateTime(input) {
  if (!input && input !== 0) return null;

  let dt = null;

  if (input instanceof Date) {
    dt = DateTime.fromJSDate(input, { zone: 'utc' });
  } else if (typeof input === 'number') {
    // timestamp em ms
    dt = DateTime.fromMillis(input, { zone: 'utc' });
  } else if (typeof input === 'string') {
    // ISO ex: "2025-08-13T00:00:00.000Z"
    dt = DateTime.fromISO(input, { zone: 'utc' });
    if (!dt.isValid) {
      // fallback: Date.parse
      const ms = Date.parse(input);
      if (!Number.isNaN(ms)) {
        dt = DateTime.fromMillis(ms, { zone: 'utc' });
      }
    }
  }

  if (!dt || !dt.isValid) return null;
  return dt.setZone('America/Manaus'); // GMT-4 (sem DST)
}
// Formata hora no formato HH:mm
Handlebars.registerHelper('formatHora', function (date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  } catch {
    return '';
  }
});

// Formata data no formato dd/MM/yyyy
Handlebars.registerHelper('formatData', function (date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch {
    return '';
  }
});
// dd/MM/yyyy
Handlebars.registerHelper('formatDataManaus', function (date) {
  const dt = toManausDateTime(date);
  return dt ? dt.toFormat('dd/MM/yyyy') : '';
});

// HH:mm
Handlebars.registerHelper('formatHoraManaus', function (date) {
  const dt = toManausDateTime(date);
  return dt ? dt.toFormat('HH:mm') : '';
});

// "d de mês de yyyy" (ex: "13 de agosto de 2025")
Handlebars.registerHelper('formatarDataExtensa', function (date) {
  const dt = toManausDateTime(date);
  return dt ? dt.setLocale('pt-BR').toFormat("d 'de' LLLL 'de' yyyy") : '';
});

// Data atual por extenso em Manaus
Handlebars.registerHelper('dataAtualExtensa', function () {
  const dt = DateTime.now().setZone('America/Manaus').setLocale('pt-BR');
  return dt.toFormat("d 'de' LLLL 'de' yyyy");
});

interface SendEmailProps {
  to: string | string[]; // pode ser um único email ou uma lista de emails
  title: string;
  name?: string;
  template: string;
  data?: object;
  attachments?: Attachment[];
  layout?: 'layout' | 'layoutSyscomp';
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function compileTemplate(
  templateName: string,
  layoutName: string = 'layout',
  data: object,
): Promise<{ html: string; text: string }> {
  const templatePath = path.join(__dirname, 'views', `${templateName}.hbs`);
  const layoutPath = path.join(__dirname, 'views', `${layoutName}.hbs`);
  const templateSource = await fs.readFile(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  const body = template({ ...data });

  const layoutSource = await fs.readFile(layoutPath, 'utf8');
  const layout = Handlebars.compile(layoutSource);
  const currentYear = new Date().getFullYear();

  const finalHtml = layout({ ...data, body, year: currentYear.toString() });
  const finalText = convert(finalHtml, { wordwrap: 130 });

  return { html: finalHtml, text: finalText };
}

async function getAttachments(): Promise<Attachment[]> {
  const imagesFolder = path.resolve(process.cwd(), 'public', 'img');
  const images = [
    { path: path.join(imagesFolder, 'logo-ufam.png'), cid: 'logo_ufam' },
  ];

  for (const img of images) {
    if (!(await fileExists(img.path))) {
      console.error(`Imagem ${img.path} não encontrada`);
      return [];
    }
  }

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

async function sendEmailFallback({
  to,
  name = 'Syscomp IComp UFAM',
  title,
  html,
  text,
  attachments = [],
}: {
  to: string | string[];
  name: string;
  title: string;
  html: string;
  text: string;
  attachments: Attachment[];
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true', // se quiser usar porta 465 + SSL
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const result = await transporter.sendMail({
    from: `"${name}" <${process.env.MAIL_FROM}>`,
    to,
    subject: title,
    text,
    html,
    attachments: attachments.map((att) => {
      let content: Buffer;

      if (Buffer.isBuffer(att.content)) {
        // Já é Buffer, usa direto
        content = att.content;
      } else if (typeof att.content === 'string') {
        // Se for string, assume que está em base64
        content = Buffer.from(att.content, 'base64');
      } else {
        throw new Error(
          `Tipo de content inválido em attachment: ${typeof att.content}`,
        );
      }

      return {
        filename: att.filename,
        content,
        cid: att.content_id, // para imagens inline
        contentType: att.type,
        encoding: 'base64',
        disposition: att.disposition || 'attachment',
      };
    }),
  });
  console.log('[Nodemailer] Email enviado com sucesso via fallback:', result);
}

export async function sendEmail({
  to,
  name = 'Syscomp IComp UFAM',
  title,
  template,
  data = {},
  attachments,
  layout = 'layout',
}: SendEmailProps) {
  const { html, text } = await compileTemplate(template, layout, data);
  const attachmentsImgs = await getAttachments();
  const attachmentsSend = [...attachmentsImgs, ...(attachments || [])];

  await sendEmailFallback({
    to,
    name,
    title,
    html,
    text,
    attachments: attachmentsSend,
  });
}

interface SendEmailWithFileProps {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: {
    filename: string;
    path: string;
    contentType?: string;
  }[];
}

export async function sendEmailWithFile({
  to,
  subject,
  text,
  html,
  attachments = [],
}: SendEmailWithFileProps) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Prepara os anexos usando 'path' para stream direto do disco (alta performance)
  const formattedAttachments = attachments.map(att => ({
    filename: att.filename,
    path: att.path, 
    contentType: att.contentType || 'application/pdf'
  }));


  const result = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || 'PPGI UFAM'}" <${process.env.MAIL_FROM}>`,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'),
    attachments: formattedAttachments,
  });

  console.log('[Nodemailer] Email de divulgação enviado:', result.messageId);
  return result;
}
