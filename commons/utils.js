export function uuid() {
  return Math.random()
    .toString(16)
    .substring(2, 9);
}

export function error(message) {
  throw new Error(message);
}
