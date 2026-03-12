import { Request, Response, Router } from 'express';

// Ajuste para o domínio real de produção
const BASE_URL =
  process.env.HOST_ICOMP_NUMEROS ?? 'https://numeros.icomp.ufam.edu.br';
type SitemapUrlItem = {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toIsoDate(value?: Date | string | null) {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString();
}

function withLng(path: string, lng: 'ptBR' | 'en') {
  const separator = path.includes('?') ? '&' : '?';
  return `${BASE_URL}${path}${separator}lng=${lng}`;
}

function buildSitemapXml(urls: SitemapUrlItem[]) {
  const body = urls
    .map((url) => {
      return `
  <url>
    <loc>${escapeXml(url.loc)}</loc>${
      url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''
    }${
      url.changefreq
        ? `\n    <changefreq>${escapeXml(url.changefreq)}</changefreq>`
        : ''
    }${
      typeof url.priority === 'number'
        ? `\n    <priority>${url.priority.toFixed(1)}</priority>`
        : ''
    }
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`;
}

export function createSeoRoutes(deps: {
  professorService: {
    listarPublicos: () => Promise<
      Array<{
        id: number | string;
        updatedAt?: Date | string | null;
        ultimaAtualizacao?: Date | string | null;
      }>
    >;
  };
}) {
  const router = Router();

  router.get('/robots.txt', async (_req: Request, res: Response) => {
    const content = `
User-agent: *
Disallow: /admin/
Disallow: /login/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml
`.trim();

    res.type('text/plain; charset=utf-8');
    return res.send(content);
  });

  router.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const professores = await deps.professorService.listarPublicos();

      const urls: SitemapUrlItem[] = [];

      // Páginas principais
      const staticPaths = [
        { path: '/', changefreq: 'weekly' as const, priority: 1.0 },
        { path: '/docentes', changefreq: 'weekly' as const, priority: 0.9 },
        { path: '/projetos', changefreq: 'weekly' as const, priority: 0.9 },
        { path: '/publicacoes', changefreq: 'weekly' as const, priority: 0.9 },

        // páginas de alunos/egressos por curso
        {
          path: '/alunos/processamento-de-dados',
          changefreq: 'monthly' as const,
          priority: 0.8,
        },
        {
          path: '/alunos/ciencia-computacao',
          changefreq: 'monthly' as const,
          priority: 0.8,
        },
        {
          path: '/alunos/engenharia-de-software',
          changefreq: 'monthly' as const,
          priority: 0.8,
        },
        {
          path: '/alunos/mestrado',
          changefreq: 'monthly' as const,
          priority: 0.8,
        },
        {
          path: '/alunos/doutorado',
          changefreq: 'monthly' as const,
          priority: 0.8,
        },
      ];

      for (const item of staticPaths) {
        urls.push({
          loc: withLng(item.path, 'ptBR'),
          changefreq: item.changefreq,
          priority: item.priority,
        });

        urls.push({
          loc: withLng(item.path, 'en'),
          changefreq: item.changefreq,
          priority: item.priority,
        });
      }

      // Páginas dinâmicas de docentes
      for (const professor of professores) {
        const lastmod = toIsoDate(
          professor.ultimaAtualizacao ?? professor.updatedAt ?? null,
        );

        const professorPaths = [
          {
            path: `/docentes/${professor.id}`,
            changefreq: 'monthly' as const,
            priority: 0.8,
          },
          {
            path: `/docentes/${professor.id}/publicacoes`,
            changefreq: 'monthly' as const,
            priority: 0.7,
          },
          {
            path: `/docentes/${professor.id}/projetos`,
            changefreq: 'monthly' as const,
            priority: 0.7,
          },
          {
            path: `/docentes/${professor.id}/premios`,
            changefreq: 'monthly' as const,
            priority: 0.6,
          },
          {
            path: `/docentes/${professor.id}/orientacoes/graduacao`,
            changefreq: 'monthly' as const,
            priority: 0.6,
          },
          {
            path: `/docentes/${professor.id}/orientacoes/mestrado`,
            changefreq: 'monthly' as const,
            priority: 0.6,
          },
          {
            path: `/docentes/${professor.id}/orientacoes/doutorado`,
            changefreq: 'monthly' as const,
            priority: 0.6,
          },
        ];

        for (const item of professorPaths) {
          urls.push({
            loc: withLng(item.path, 'ptBR'),
            lastmod,
            changefreq: item.changefreq,
            priority: item.priority,
          });

          urls.push({
            loc: withLng(item.path, 'en'),
            lastmod,
            changefreq: item.changefreq,
            priority: item.priority,
          });
        }
      }

      const xml = buildSitemapXml(urls);

      res.header('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(xml);
    } catch (error) {
      console.error('Erro ao gerar sitemap.xml:', error);
      return res.status(500).send('Erro ao gerar sitemap.xml');
    }
  });

  return router;
}
