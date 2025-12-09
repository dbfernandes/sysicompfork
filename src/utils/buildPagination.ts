type Args = {
  page: number;
  perPage: number;
  total: number;
  baseUrl: string;
  extraParams?: Record<string, any>;
};

export function buildPagination({
  page,
  perPage,
  total,
  baseUrl,
  extraParams = {},
}: Args) {
  const pages = Math.max(Math.ceil(total / perPage), 1);
  const clamp = (n: number) => Math.min(Math.max(n, 1), pages);

  const makeUrl = (n: number) => {
    const params = new URLSearchParams({
      page: String(n),
      perPage: String(perPage),
    });
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return {
    page,
    perPage,
    total,
    isFirst: page <= 1,
    isLast: page >= pages,
    firstUrl: makeUrl(1),
    prevUrl: makeUrl(clamp(page - 1)),
    nextUrl: makeUrl(clamp(page + 1)),
    lastUrl: makeUrl(pages),
    pages: Array.from({ length: pages }, (_, i) => {
      const n = i + 1;
      return { number: n, url: makeUrl(n), active: n === page };
    }),
  };
}
