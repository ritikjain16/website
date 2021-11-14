/* eslint-disable */
/**
 * Blockly's Defauly Workspace Configuration.
 */
export const DEFAULT_WORKSPACE_CONFIG = ({
  readOnly = false,
  horizontalLayout = false,
  trashcan = false,
}) => ({
  readOnly,
  horizontalLayout,
  grid: {
    spacing: 20,
    length: 3,
    colour: '#333',
    snap: true
  },
  move: {
    scrollbars: {
      horizontal: true,
      vertical: true
    },
    drag: true,
    wheel: true
  },
  trashcan,
})

/**
 * Method to convert base64 string to blockly supported toolbox json.
 * @param blocksJSONString - base64encodedString received from backend.
 * @returns toolboxJson - refer https://developers.google.com/blockly/guides/configure/web/toolbox
 */
export const buildCustomToolJSON = (blocksJSONString) => {
  try {
    if (typeof blocksJSONString === 'string') {
      const blocksJSON = JSON.parse(blocksJSONString)
      const toolboxJSON = []
      blocksJSON.forEach(block => {
        toolboxJSON.push({
          name: block.type,
          category: 'Block',
          block: {
            init: function () {
              this.jsonInit(block)
            }
          }
        })
      })
      return toolboxJSON
    }
    return null
  } catch (e) {
    console.warn('INVALID JSON', e)
  }
}

export default { buildCustomToolJSON, DEFAULT_WORKSPACE_CONFIG }
