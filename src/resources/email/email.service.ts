import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

import nodemailer from 'nodemailer';
interface Attachment {
  filename: string;
  content: string; // em base64
  content_id?: string; // se quiser usar como imagem inline com <img src="cid:...">
  type?: string; // tipo MIME, ex: "image/png", "application/pdf"
  disposition?: string; // "inline" ou "attachment" (padrão)
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

interface SendEmailProps {
  to: string;
  title: string;
  name?: string;
  template: string;
  data?: object;
  attachments?: Attachment[];
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
  data: object,
): Promise<{ html: string; text: string }> {
  const templatePath = path.join(__dirname, 'views', `${templateName}.hbs`);
  const layoutPath = path.join(__dirname, 'views', 'layout.hbs');
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

// 🚨 Fallback com Nodemailer
async function sendEmailFallback({
  to,
  name = 'Syscomp IComp UFAM',
  title,
  html,
  text,
  attachments = [],
}: {
  to: string;
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
    attachments: attachments.map((att) => ({
      filename: att.filename,
      content: Buffer.from(att.content, 'base64'),
      cid: att.content_id, // para imagens inline
      contentType: att.type,
      encoding: 'base64',
      disposition: att.disposition || 'attachment',
    })),
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
}: SendEmailProps) {
  const { html, text } = await compileTemplate(template, data);
  const attachmentsImgs = await getAttachments();
  const attachmentsSend = [...attachmentsImgs, ...(attachments || [])];

  // const list = await resend.apiKeys.list();
  const { data: dataResend, error } = await resend.emails.send({
    from: 'Acme <no-reply@archiwise.online>',
    to: [to],
    subject: title,
    html,
    // text,
    // attachments: attachmentsSend.map((att) => ({
    //   filename: att.filename,
    //   content: att.content,
    // })),
  });
  console.log('[RESEND] Email enviado com sucesso:', dataResend);
  if (error) {
    console.error(
      '[RESEND] Falha ao enviar, usando fallback com Nodemailer...',
      error,
    );
    await sendEmailFallback({
      to,
      name,
      title,
      html,
      text,
      attachments: attachmentsSend,
    });
  }
}
