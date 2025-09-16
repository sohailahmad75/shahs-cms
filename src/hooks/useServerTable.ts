import { useMemo, useState, useCallback } from "react";
import type { SortDir } from "../components/DynamicTable";

type AnyFilters = Record<string, any>;

export function useServerTable<
  TFilters extends AnyFilters = AnyFilters,
>(opts?: {
  perPage?: number;
  defaultSort?: { key: string; direction: Exclude<SortDir, null> };
}) {
  const [query, _setQuery] = useState("");
  const [filters, _setFilters] = useState<TFilters>({} as TFilters);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(opts?.perPage ?? 10);
  const [sort, _setSort] = useState<{ key: string | null; direction: SortDir }>(
    opts?.defaultSort ?? { key: null, direction: null },
  );

  const setQuery = useCallback((val: string) => {
    _setQuery(val);
    setPage(1);
  }, []);

  const setFilters = useCallback((val: TFilters) => {
    _setFilters(val);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    _setFilters({} as TFilters);
    setPage(1);
  }, []);

  const setSort = useCallback(
    (next: { key: string | null; direction: SortDir }) => {
      _setSort(next);
      setPage(1);
    },
    [],
  );

  const onPerPageChange = useCallback((pp: number) => {
    setPerPage(pp);
    setPage(1);
  }, []);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, perPage };
    if (query) params.query = query;
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params[k] = v;
    });
    if (sort.key && sort.direction) {
      params.sort = sort.key;
      params.sortDir = sort.direction.toUpperCase();
    }
    return params;
  }, [page, perPage, query, filters, sort]);

  return {
    // state
    query,
    filters,
    page,
    perPage,
    sort,
    // setters
    setQuery,
    setFilters,
    clearFilters,
    setPage,
    setPerPage,
    setSort,
    onPerPageChange,
    // derived
    queryParams,
  };
}
