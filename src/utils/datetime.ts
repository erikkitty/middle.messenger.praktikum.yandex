export function formatChatTime(iso: string, now: Date = new Date()): string {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  if (sameDay) return time;

  const day = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
  }).format(date);

  return `${day} ${time}`;
}

