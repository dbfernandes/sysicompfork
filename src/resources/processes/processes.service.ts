import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { slugify } from '@utils/slugify';
import { getTemplateXml } from '@resources/processes/processes.template';
import { generateBpmnFromDescription } from '@resources/processes/processes.llm';

const prisma = new PrismaClient();
type CreateFromAIArgs = {
  titulo: string;
  descricao: string; // obrigatório para IA
  criadoPorId: number;
  tags?: number[];
};

type ListArgs = {
  page: number;
  perPage: number;
  q?: string;
  tag?: string; // slug
};

type CreateFromTemplateArgs = {
  titulo: string;
  descricao?: string | null;
  templateKey: string;
  criadoPorId: number;
  tags?: number[];
};

type CreateFromUploadArgs = {
  titulo: string;
  descricao?: string | null;
  xmlPathOnDisk: string;
  criadoPorId: number;
  tags?: number[];
};

const UPLOADS_DIR =
  process.env.BPMN_UPLOAD_DIR || path.resolve(process.cwd(), 'uploads', 'bpmn');
const PUBLIC_PREFIX = '/uploads/bpmn'; // path público estático

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR))
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const processosService = {
  async list({ page, perPage, q, tag }: ListArgs) {
    const where: any = {};

    if (q) {
      where.OR = [
        { titulo: { contains: q, mode: 'insensitive' } },
        { descricao: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } };
    }

    const [total, rows, allTags] = await Promise.all([
      prisma.processo.count({ where }),
      prisma.processo.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          titulo: true,
          descricao: true,
          previewPath: true,
          updatedAt: true,
          criadoPor: { select: { id: true, nomeCompleto: true } },
          tags: {
            select: {
              tag: {
                select: { id: true, nome: true, slug: true, corHex: true },
              },
            },
          },
        },
      }),
      prisma.tag.findMany({
        orderBy: { nome: 'asc' },
        select: { id: true, nome: true, slug: true },
      }),
    ]);

    const normalized = rows.map((p) => ({
      ...p,
      tags: p.tags.map((pt) => pt.tag),
    }));

    return { total, rows: normalized, allTags };
  },

  async remove(id: string) {
    // apaga relações N..N antes
    await prisma.processoTag.deleteMany({ where: { processoId: id } });
    // opcional: remover arquivos associados (xml/preview) consultando o processo
    const proc = await prisma.processo.findUnique({ where: { id } });
    await prisma.processo.delete({ where: { id } });

    // Tente remover arquivos (best effort)
    if (proc?.xmlPath) {
      const fileFsPath = proc.xmlPath.startsWith('/uploads')
        ? path.resolve(process.cwd(), proc.xmlPath.slice(1)) // remove leading /
        : path.resolve(process.cwd(), proc.xmlPath);
      fs.existsSync(fileFsPath) && fs.unlink(fileFsPath, () => {});
    }
    if (proc?.previewPath) {
      const prevFsPath = proc.previewPath.startsWith('/uploads')
        ? path.resolve(process.cwd(), proc.previewPath.slice(1))
        : path.resolve(process.cwd(), proc.previewPath);
      fs.existsSync(prevFsPath) && fs.unlink(prevFsPath, () => {});
    }
  },

  async createFromTemplate({
    titulo,
    descricao,
    templateKey,
    criadoPorId,
    tags = [],
  }: CreateFromTemplateArgs) {
    ensureUploadsDir();

    const slug = slugify(titulo);
    const xml = getTemplateXml(templateKey, titulo);
    const fileName = `${slug}-${Date.now()}.bpmn`;
    const abs = path.join(UPLOADS_DIR, fileName);
    fs.writeFileSync(abs, xml, 'utf8');

    const xmlPath = `${PUBLIC_PREFIX}/${fileName}`;
    const data = await prisma.processo.create({
      data: {
        titulo,
        slug,
        descricao: descricao ?? null,
        xmlPath,
        previewPath: null, // você pode gerar preview depois e atualizar
        criadoPorId,
        tags: tags.length
          ? { createMany: { data: tags.map((tagId) => ({ tagId })) } }
          : undefined,
      },
    });

    return data;
  },

  async createFromUpload({
    titulo,
    descricao,
    xmlPathOnDisk,
    criadoPorId,
    tags = [],
  }: CreateFromUploadArgs) {
    ensureUploadsDir();

    const slug = slugify(titulo);
    // se o multer já deixou em UPLOADS_DIR, apenas derive o caminho público
    const fileName = path.basename(xmlPathOnDisk);
    const xmlPath = `${PUBLIC_PREFIX}/${fileName}`;

    const data = await prisma.processo.create({
      data: {
        titulo,
        slug,
        descricao: descricao ?? null,
        xmlPath,
        previewPath: null,
        criadoPorId,
        tags: tags.length
          ? { createMany: { data: tags.map((tagId) => ({ tagId })) } }
          : undefined,
      },
    });

    return data;
  },
  async createFromAI({
    titulo,
    descricao,
    criadoPorId,
    tags = [],
  }: CreateFromAIArgs) {
    ensureUploadsDir();

    const slug = slugify(titulo);
    // 1) chama IA
    const xml = await generateBpmnFromDescription(descricao, {
      title: titulo,
      language: 'pt',
    });

    // 2) salva no disco
    const fileName = `${slug}-${Date.now()}.bpmn`;
    const abs = path.join(UPLOADS_DIR, fileName);
    fs.writeFileSync(abs, xml, 'utf8');

    // 3) cria registro
    const xmlPath = `${PUBLIC_PREFIX}/${fileName}`;
    const data = await prisma.processo.create({
      data: {
        titulo,
        slug,
        descricao,
        xmlPath,
        previewPath: null,
        criadoPorId,
        tags: tags.length
          ? { createMany: { data: tags.map((tagId) => ({ tagId })) } }
          : undefined,
      },
    });

    return data;
  },
};
