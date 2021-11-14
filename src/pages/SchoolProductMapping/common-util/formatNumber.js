export default function formatNumber(number, decimals = 2) {
  return number ? Number(number).toFixed(decimals) : 0
}
