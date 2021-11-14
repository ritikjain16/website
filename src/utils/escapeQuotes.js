/**
 * @param {string} string
 * Replaces quotes in graphql with escape quotes,
 * to not let graphql confuses it with graphql quotes,
 * but quotes as normal character.
 */
const escapeQuotes = string => string
  ? string.replace(new RegExp('"', 'g'), '\\"')
  : ''

export default escapeQuotes
