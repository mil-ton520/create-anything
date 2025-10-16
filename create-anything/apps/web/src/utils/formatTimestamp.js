export function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `há ${diffInMinutes}min`;
  if (diffInMinutes < 1440) return `há ${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `há ${Math.floor(diffInMinutes / 1440)}d`;
  return date.toLocaleDateString("pt-PT");
}