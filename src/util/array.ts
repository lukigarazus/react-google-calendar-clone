export const range = (start: number, end: number) =>
  Array(end - start)
    .fill(undefined)
    .map((_, i) => start + i);
