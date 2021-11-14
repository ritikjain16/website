import React from 'react'
import { notification, Icon } from 'antd'

const key = 'loadingMessage'
const toastrMessage = (
  currentValue,
  PreviousValue,
  type,
  messageText,
  stopError
) => {
  if (currentValue != null && currentValue !== '' && currentValue !== PreviousValue) {
    if (type === 'success') {
      notification.close(key)
      notification.success({
        message: messageText
      })
    } else if (type === 'loading') {
      notification.open({
        key,
        message: messageText,
        icon: <Icon type='loading' />,
        duration: 0
      })
    } else {
      notification.close(key)
      if (!stopError) {
        notification.error({
          message: messageText
        })
      }
    }
  }
}

export default toastrMessage
