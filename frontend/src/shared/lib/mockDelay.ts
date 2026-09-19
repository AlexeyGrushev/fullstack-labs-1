export function withDelay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function withDelayedFailure<T>(
  value: T,
  shouldFail: boolean,
  ms = 600
): Promise<T> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Не удалось загрузить данные. Попробуйте ещё раз."));
      } else {
        resolve(value);
      }
    }, ms)
  );
}
