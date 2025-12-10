export default function formatPrice(value: number | string | null | undefined): string {
  const n = Number(value ?? 0) || 0
  // Use comma as decimal separator and append a space before the euro sign
  return n.toFixed(2).replace('.', ',') + ' €'
}
