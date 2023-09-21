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

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function parseCurrency(value: string): number {
  const cleanedValue = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  const parsedValue = parseFloat(cleanedValue)
  return isNaN(parsedValue) ? 0 : parsedValue;
}
