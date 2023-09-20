export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'long', year: 'numeric'};
  return new Intl.DateTimeFormat('pt-br', options).format(date)
}

export function formatDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',

  }
  return new Intl.DateTimeFormat('pt-BR', options).format(date)
}