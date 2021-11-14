// Horizontal Scale
function hs($width) {
  const value = ($width / 1920) * 100
  return `${value}vw`
}

function vsValue($width) {
  const { innerWidth } = window
  const value = (innerWidth / 1920) * $width
  return value
}

export {
  vsValue
}

export default hs
