import { message } from 'antd'
/* eslint-disable no-console */
const copyToClipboard = (value) => {
  if (value) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(value)
        .then(() => message.info('Link copied to clipboard'))
        .catch((err) => console.log(err))
    } else {
      const textField = document.createElement('textarea')
      textField.innerText = `${value}`
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      message.info('Link copied to clipboard')
      textField.remove()
    }
  }
}

export default copyToClipboard
