import { DEFAULT_PAGE, DEFAULT_SIZE } from "../constants/paging";

export const formatPaging = (
  page: string | number = DEFAULT_PAGE,
  size: string | number = DEFAULT_SIZE,
  sort?: string
) => {
  const _page = parseInt(page as string);
  const _size = parseInt(size as string);

  let query = {
    take: _size,
    skip: _size * (_page - 1),
    sort: "DESC",
  };

  const _sort = sort;

  if (_sort && +_sort == 1) {
    query.sort = "ASC";
  }

  return {
    pageable: {
      page: _page,
      size: _size,
    },
    query,
  };
};
