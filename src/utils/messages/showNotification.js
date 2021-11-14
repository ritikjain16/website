import toastrMessage from './toastrMessage'

const showNotification = (
  currentStatus,
  previousStatus,
  loadingMessage,
  failureMessage,
  successMessage,
  shouldCloseModal,
  form,
  closeModalFunc,
  stopError = false
) => {
  let notifyType = ''
  let message = ''
  if (currentStatus.loading) {
    notifyType = 'loading'
    message = loadingMessage
  } else if (currentStatus.failure !== previousStatus.failure && currentStatus.failure) {
    notifyType = 'failure'
    message = failureMessage
  } else if (currentStatus.success !== previousStatus.success && currentStatus.success) {
    notifyType = 'success'
    message = successMessage
  }

  if (notifyType.length > 0) {
    toastrMessage(
      currentStatus[notifyType],
      previousStatus[notifyType],
      notifyType,
      message, stopError
    )
    if (shouldCloseModal && notifyType === 'success') {
      form.resetFields()
      closeModalFunc()
    }
  }
}

export default showNotification
