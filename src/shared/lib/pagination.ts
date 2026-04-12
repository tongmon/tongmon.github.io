const DEFAULT_PAGE = 1;

export const POSTS_PER_PAGE = 6;

export function parsePageParam(pageParam: string | null) {
  const parsedPage = Number(pageParam);

  return Number.isInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : DEFAULT_PAGE;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = POSTS_PER_PAGE,
) {
  const totalPages = Math.max(DEFAULT_PAGE, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(page, DEFAULT_PAGE), totalPages);
  const startIndex = (currentPage - DEFAULT_PAGE) * pageSize;

  return {
    currentPage,
    pageItems: items.slice(startIndex, startIndex + pageSize),
    totalPages,
  };
}

export function buildPageSearchParams(
  searchParams: URLSearchParams,
  page: number,
) {
  const nextSearchParams = new URLSearchParams(searchParams);

  if (page <= DEFAULT_PAGE) {
    nextSearchParams.delete("page");
  } else {
    nextSearchParams.set("page", String(page));
  }

  return nextSearchParams;
}
