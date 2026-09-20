import { useCallback, useEffect, useState } from "react";

interface AsyncResourceState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useAsyncResource<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<AsyncResourceState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(() => {
    setState({ data: null, isLoading: true, error: null });
    loader()
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((error: Error) =>
        setState({ data: null, isLoading: false, error: error.message })
      );
  }, [loader]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
