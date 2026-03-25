export function persisted(key, defaultValue) {
  const stored = localStorage.getItem(key);
  return stored !== null ? JSON.parse(stored) : defaultValue;
}

export function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}