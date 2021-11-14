/**
 * Encode a string of text as base64
 *
 * @param data The string of text.
 * @returns The base64 encoded string.
 */
function encodeBase64(data) {
  if (typeof btoa === 'function') {
    return btoa(data)
  } else if (typeof Buffer === 'function') {
    return Buffer.from(data, 'utf-8').toString('base64')
  }
  throw new Error('Failed to determine the platform specific encoder')
}

/**
 * Decode a string of base64 as text
 *
 * @param data The string of base64 encoded text
 * @returns The decoded text.
 */
function decodeBase64(data) {
  if (typeof atob === 'function') {
    return atob(data)
  } else if (typeof Buffer === 'function') {
    return Buffer.from(data, 'base64').toString('utf-8')
  }
  throw new Error('Failed to determine the platform specific decoder')
}

export { encodeBase64, decodeBase64 }
