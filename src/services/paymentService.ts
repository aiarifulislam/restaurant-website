export interface CardInfo {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export async function processPayment(_cardInfo: CardInfo, _amount: number): Promise<{ success: boolean; transactionId: string }> {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    success: true,
    transactionId: `txn-${Date.now()}`,
  };
}

export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
}

export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
}

export function getCardType(number: string): string {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'Amex';
  return 'Card';
}