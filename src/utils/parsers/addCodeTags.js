const addCodeTags = (ref, text, tag) => {
  const selectStart = ref.selectionStart
  const selectEnd = ref.selectionEnd
  if (text && text.length > 0) {
    text = `${text.substring(0, selectStart)}<${tag}>${text.substring(
      selectStart, selectEnd
    )}</${tag}>${text.substring(selectEnd, text.length)}`
  }
  return text
}

export default addCodeTags
