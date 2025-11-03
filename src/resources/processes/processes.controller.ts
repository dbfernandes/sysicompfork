import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { processosService } from './processes.service';
import {
  createByTemplateSchema,
  createByUploadSchema,
} from './processes.schema';
import { PrismaClient } from '@prisma/client';
import { buildPagination } from '@utils/buildPagination';

const prisma = new PrismaClient();

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const listProcesses = async (req: Request, res: Response) => {
  const page = Math.max(parseInt(String(req.query.page ?? '1'), 10), 1);
  const perPage = Math.min(
    Math.max(parseInt(String(req.query.perPage ?? '12'), 10), 6),
    48,
  );

  const q = String(req.query.q ?? '').trim() || undefined;
  const tag = String(req.query.tag ?? '').trim() || undefined;

  const { rows, total, allTags } = await processosService.list({
    page,
    perPage,
    q,
    tag,
  });

  const pagination = buildPagination({
    page,
    perPage,
    total,
    baseUrl: '/processos',
    extraParams: { q, tag },
  });

  res.render(resolveView('list'), {
    nome: req.session?.nome,
    tipoUsuario: req.session?.tipoUsuario,
    processos: rows,
    allTags,
    q,
    tag,
    pagination,
  });
};

const viewProcess = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const processo = await prisma.processo.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      xmlPath: true,
      previewPath: true,
      criadoPor: { select: { id: true, nomeCompleto: true } },
      updatedAt: true,
      createdAt: true,
      tags: {
        select: {
          tag: { select: { id: true, nome: true, slug: true, corHex: true } },
        },
      },
    },
  });
  if (!processo) return res.status(404).send('Processo não encontrado');

  const tags = processo.tags.map((t) => t.tag);

  res.render(resolveView('view'), {
    nome: req.session?.nome,
    tipoUsuario: req.session?.tipoUsuario,
    processo: { ...processo, tags },
  });
};

const editProcess = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const processo = await prisma.processo.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      xmlPath: true,
      previewPath: true,
      updatedAt: true,
    },
  });
  if (!processo) return res.status(404).send('Processo não encontrado');

  res.render(resolveView('edit'), {
    nome: req.session?.nome,
    tipoUsuario: req.session?.tipoUsuario,
    processo,
  });
};

// Serve o XML bruto (para o viewer/modeler carregarem)
// Serve o XML bruto (para o viewer/modeler carregarem)
const getXml = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  const processo = await prisma.processo.findUnique({
    where: { id },
    select: { xmlPath: true, titulo: true, slug: true },
  });

  if (!processo?.xmlPath) {
    return res.status(404).send('XML não encontrado');
  }

  // Caminho absoluto do arquivo XML
  const abs = processo.xmlPath.startsWith('/uploads')
    ? path.resolve(process.cwd(), processo.xmlPath.slice(1))
    : path.resolve(process.cwd(), processo.xmlPath);

  if (!fs.existsSync(abs)) {
    return res.status(404).send('Arquivo não existe');
  }

  // Lê conteúdo do XML
  const xmlContent = fs.readFileSync(abs, 'utf8');

  // Define nome de arquivo (ex: "processo-fluxo-inscricao-ppgi.bpmn")
  const safeSlug =
    processo.slug ||
    processo.titulo?.toLowerCase().replace(/[^\w]+/g, '-') ||
    id;
  const filename = `${safeSlug}.bpmn`;

  // Headers corretos
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  // Se quiser forçar download, troque "inline" por "attachment"

  res.send(xmlContent);
};

// Salva XML vindo do editor
const saveXml = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  // aceita JSON { xml } ou texto puro
  let xml = '';
  if (req.is('application/json')) xml = String(req.body?.xml || '');
  else xml = String(req.body);

  if (!xml || !xml.includes('<bpmn:definitions')) {
    return res.status(400).json({ error: 'XML BPMN inválido' });
  }

  const processo = await prisma.processo.findUnique({ where: { id } });
  if (!processo?.xmlPath)
    return res.status(404).json({ error: 'Processo não encontrado' });

  const abs = processo.xmlPath.startsWith('/uploads')
    ? path.resolve(process.cwd(), processo.xmlPath.slice(1))
    : path.resolve(process.cwd(), processo.xmlPath);

  fs.writeFileSync(abs, xml, 'utf8');
  await prisma.processo.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  res.json({ ok: true });
};

// Salva preview (PNG ou SVG em base64) e atualiza previewPath
const savePreview = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { dataUrl } = req.body as { dataUrl: string };
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Preview inválido' });
  }

  const processo = await prisma.processo.findUnique({ where: { id } });
  if (!processo)
    return res.status(404).json({ error: 'Processo não encontrado' });

  const dir = path.resolve(process.cwd(), 'uploads', 'bpmn', 'previews');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const ext = dataUrl.startsWith('data:image/svg+xml') ? '.svg' : '.png';
  const fileName = `preview-${id}-${Date.now()}${ext}`;
  const fileAbs = path.join(dir, fileName);

  if (ext === '.svg') {
    const svg = Buffer.from(dataUrl.split(',')[1], 'base64').toString('utf8');
    fs.writeFileSync(fileAbs, svg, 'utf8');
  } else {
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    fs.writeFileSync(fileAbs, buf);
  }

  const publicPath = `/uploads/bpmn/previews/${fileName}`;
  await prisma.processo.update({
    where: { id },
    data: { previewPath: publicPath, updatedAt: new Date() },
  });

  res.json({ ok: true, previewPath: publicPath });
};

// Retorna svg de preview
// Retorna o SVG ou PNG de preview do processo
const getPreview = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  try {
    const processo = await prisma.processo.findUnique({ where: { id } });
    if (!processo?.previewPath) {
      return res.status(404).send('Preview não encontrado.');
    }

    // resolve caminho absoluto
    const abs = processo.previewPath.startsWith('/uploads')
      ? path.resolve(process.cwd(), processo.previewPath.slice(1))
      : path.resolve(process.cwd(), processo.previewPath);

    if (!fs.existsSync(abs)) {
      return res.status(404).send('Arquivo não existe.');
    }

    // Detecta tipo MIME pela extensão
    const ext = path.extname(abs).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.svg') mimeType = 'image/svg+xml; charset=utf-8';
    else if (ext === '.png') mimeType = 'image/png';

    // Define headers apropriados
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache por 1h

    // Retorna como stream (melhor que ler tudo na memória)
    const stream = fs.createReadStream(abs);
    stream.pipe(res);
  } catch (err) {
    console.error('[getPreview]', err);
    res.status(500).send('Erro ao obter preview.');
  }
};

// Já existiam
const deleteProcess = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await processosService.remove(id);
  if (req.xhr) return res.json({ ok: true });
  res.redirect('/processos');
};

const createByTemplate = async (req: Request, res: Response) => {
  // validação com Joi (ver abaixo)
  const body = createByTemplateSchema.validate(req.body, { abortEarly: false });
  if (body.error) return res.status(400).send(body.error.message);

  const criadoPorId = Number(req.session?.uid);
  if (!criadoPorId) return res.status(401).send('Não autenticado');

  const tagsForm =
    (Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : req.body.tags) ??
    [];
  const tagsIds = (Array.isArray(tagsForm) ? tagsForm : [tagsForm])
    .filter(Boolean)
    .map(Number);

  const { titulo, descricao, templateKey, usarIA } = body.value as {
    titulo: string;
    descricao?: string;
    templateKey?: string;
    usarIA?: boolean;
  };

  try {
    if (usarIA) {
      if (!descricao || descricao.trim().length < 10) {
        return res
          .status(400)
          .send('Para geração por IA, informe uma descrição mais detalhada.');
      }
      await processosService.createFromAI({
        titulo,
        descricao: descricao.trim(),
        criadoPorId,
        tags: tagsIds,
      });
    } else {
      await processosService.createFromTemplate({
        titulo,
        descricao,
        templateKey: templateKey || 'padrao',
        criadoPorId,
        tags: tagsIds,
      });
    }
    res.redirect('/processos');
  } catch (e: any) {
    console.error('[createByTemplate]', e);
    // fallback opcional:
    // await processosService.createFromTemplate({ titulo, descricao, templateKey: 'padrao', criadoPorId, tags: tagsIds });
    res.status(500).send('Falha ao criar processo.');
  }
};

const createByUpload = async (req: Request, res: Response) => {
  const base = {
    ...req.body,
    xmlStoredPath: (req.file && req.file.path) || undefined,
    xmlOriginalName: (req.file && req.file.originalname) || undefined,
    xmlMimeType: (req.file && req.file.mimetype) || undefined,
    xmlSize: (req.file && req.file.size) || undefined,
  };
  const val = createByUploadSchema.validate(base, { abortEarly: false });
  if (val.error) return res.status(400).send(val.error.message);

  const criadoPorId = Number(req.session?.uid);
  if (!criadoPorId) return res.status(401).send('Não autenticado');

  const { titulo, descricao, xmlStoredPath } = val.value as {
    titulo: string;
    descricao?: string;
    xmlStoredPath: string;
  };

  const tags =
    (Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : req.body.tags) ??
    [];
  const tagsIds = (Array.isArray(tags) ? tags : [tags])
    .filter(Boolean)
    .map(Number);

  await processosService.createFromUpload({
    titulo,
    descricao,
    xmlPathOnDisk: xmlStoredPath,
    criadoPorId,
    tags: tagsIds,
  });

  res.redirect('/processos');
};

export default {
  listProcesses,
  viewProcess,
  editProcess,
  getXml,
  saveXml,
  savePreview,
  deleteProcess,
  createByTemplate,
  createByUpload,
  getPreview,
};
