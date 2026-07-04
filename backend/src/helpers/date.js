export function formatDate(date, options = {}) {
  const defaults = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };
  return new Intl.DateTimeFormat("en-US", defaults).format(new Date(date));
}

export function formatISO(date) {
  return new Date(date).toISOString();
}

export function isExpired(date) {
  return new Date(date) < new Date();
}

export function daysBetween(date1, date2 = new Date()) {
  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
