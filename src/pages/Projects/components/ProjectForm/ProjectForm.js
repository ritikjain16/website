import React, { Component } from 'react'
import { Form, Button, Radio, Popconfirm, Popover, message } from 'antd'
import { get, debounce } from 'lodash'
import PropTypes from 'prop-types'
import Main from './ProjectForm.style'
import MainModal from '../../../../components/MainModal'
import validators from '../../../../utils/formValidators'
import Dropzone from '../../../../components/Dropzone'
import getFullPath from '../../../../utils/getFullPath'
import { deleteProjectContent, removeImageFromProjectContent } from '../../../../actions/projects'

let shouldImage
class ProjectForm extends Component {
  state = {
    messageType: 'text',
    imageFile: null,
    shouldSubmit: false,
    imageUrl: null,
    formFields: {
      text: '',
      terminalInput: '',
      terminalOutput: ''
    },
  }

  hasEmulatorLoaded = false
  dropzoneRef = React.createRef(null)

  resetFormValues = () => {
    this.setState({
      formFields: {
        text: '',
        terminalInput: '',
        terminalOutput: ''
      },
      messageType: 'text',
      imageFile: null,
      imageUrl: null,
    })
    this.props.form.setFieldsValue({
      text: '',
      terminalInput: '',
      terminalOutput: ''
    })
  }

  onFormFirstChangeInEdit = () => {
    this.setState({ shouldSubmit: true })
  }

  fillFormValues = () => {
    const { messageType } = this.state
    const {
      text,
      terminalInput,
      terminalOutput
    } = this.state.formFields
    if (messageType === 'text') {
      this.props.form.setFieldsValue({
        text
      })
    } else if (messageType === 'terminal') {
      this.props.form.setFieldsValue({
        terminalInput,
        terminalOutput
      })
    } else if (messageType === 'image') {
      this.dropzoneRef.current.onOpen()
    }
  }

  setDefaultValues = () => {
    const { projectContent } = this.props
    const formFields = {
      text: projectContent.statement || '',
      terminalInput: projectContent.terminalInput,
      terminalOutput: projectContent.terminalOutput,
    }
    this.setState({
      formFields,
      messageType: projectContent.type,
    }, () => {
      setTimeout(() => {
        this.hasEmulatorLoaded = true
        this.setState({ shouldSubmit: false })
      }, 10)
    })
    this.props.form.setFieldsValue(formFields)
  }

  onMessageTypeChange = e => {
    this.setState({ messageType: e.target.value })
    this.onFormFirstChangeInEdit()
  }

  componentDidMount() {
    if (this.props.formType === 'edit') {
      this.setState({ shouldSubmit: true })
      setTimeout(() => {
        this.setDefaultValues()
      }, 0)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedProject, formType } = this.props
    if ((prevProps.selectedProject !== selectedProject) && formType === 'add') {
      this.resetFormValues()
    }
    const { messageType } = this.state
    if ((prevState.messageType !== messageType) && formType === 'edit') {
      this.setDefaultValues()
      this.setState({
        messageType
      })
    }
    if ((prevProps.content !== this.props.content) && formType === 'edit' && selectedProject) {
      this.setDefaultValues()
    }
  }

  onFormFieldsChange = field => value => {
    this.setState(prev => ({
      formFields: {
        text: prev.formFields.text,
        terminalInput: prev.formFields.terminalInput,
        terminalOutput: prev.formFields.terminalOutput,
        [field]: value
      }
    }))
    if (this.props.formType === 'edit' && !this.state.shouldSubmit) {
      this.onFormFirstChangeInEdit()
    }
  }

  popOverContent = () => {
    const emojis = this.props.stickerEmojis.filter(stickerEmoji => stickerEmoji.type === 'emoji')
    return (
      <div onMouseDown={(e) => { e.preventDefault() }} role='button' tabIndex={0}>
        <div style={{ width: 300, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {emojis.map(emoji => (
            <abbr title={get(emoji, 'code')} >
              <Main.EmojiWrapper onClick={() => {
                const textArea = document.querySelector(`.textArea${this.props.i}`)
                const cursorValue = textArea.selectionStart
                const prevFormFields = this.state.formFields
                this.props.form.setFieldsValue({
                  text: prevFormFields.text.slice(0, cursorValue)
                    + emoji.code
                    + this.state.formFields.text.slice(cursorValue)
                })
                setTimeout(() => {
                  textArea.setSelectionRange(
                    cursorValue + emoji.code.length,
                    cursorValue + emoji.code.length
                  )
                }, 0)
                this.setState({
                  formFields: {
                    ...prevFormFields,
                  text: prevFormFields.text.slice(0, cursorValue)
                    + emoji.code
                    + prevFormFields.text.slice(cursorValue)
                  }
                })
              }}
              >
                <img
                  src={getFullPath(get(emoji, 'image.uri'))}
                  width={30}
                  height={30}
                  style={{ margin: 5 }}
                  alt={get(emoji, 'code')}
                />
              </Main.EmojiWrapper>
            </abbr>
          )
          )}
        </div>
      </div>
    )
  }

  rendertext = () => (
    <MainModal.FormItem>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Popover placement='bottom' title='Emojis' content={this.popOverContent()} trigger='click'>
          <Main.EmojiIcon
            type='smile'
            onMouseDown={(e) => { e.preventDefault() }}
            onClick={() => {
              const textArea = document.querySelector(`.textArea${this.props.i}`)
              textArea.focus()
            }}
          />
        </Popover>
        {this.props.form.getFieldDecorator(...validators.select('text'))(
          <MainModal.TextArea placeholder='text'
            className={`textArea${this.props.i}`}
            onChange={e => {
              const { value } = e.nativeEvent.target
              setTimeout(() => {
                debounce(() => {
                    this.onFormFieldsChange('text')(value)
                }, 100)()
              })
            }}
          />
        )}
      </div>
    </MainModal.FormItem>
  )

  renderTerminal = () => (
    <React.Fragment>
      <MainModal.FormItem marginBottom='15px'>
        {this.props.form.getFieldDecorator(...validators.select('terminalInput'))(
          <MainModal.TextArea
            placeholder='Terminal Input'
            name='terminal-input'
            onChange={e => {
              const { value } = e.nativeEvent.target
              setTimeout(() => {
                debounce(() => {
                    this.onFormFieldsChange('terminalInput')(value)
                }, 100)()
              })
            }}
          />
        )}
      </MainModal.FormItem>
      <MainModal.FormItem marginBottom='15px'>
        {this.props.form.getFieldDecorator('terminalOutput')(
          <MainModal.TextArea
            placeholder='Terminal Output'
            name='terminal-output'
            onChange={e => {
              const { value } = e.nativeEvent.target
              setTimeout(() => {
                debounce(() => {
                    this.onFormFieldsChange('terminalOutput')(value)
                }, 100)()
              })
            }}
          />
        )}
      </MainModal.FormItem>
    </React.Fragment>
  )

  onDropFile = (file, shouldImageArg) => {
    this.setState({ imageFile: file })
    if (!(file === null && shouldImageArg)) {
      this.onFormFirstChangeInEdit()
    }
  }

  onDropzoneClose = () => {
    this.onFormFirstChangeInEdit()
  }

  renderImage = () => (
    <div>
      <Dropzone
        width='50%'
        height='166px'
        id={this.props.formId}
        getDropzoneFile={this.onDropFile}
        ref={this.dropzoneRef}
        onClose={this.onDropzoneClose}
        defaultImage={
          getFullPath(get(this.props, 'projectContent.image.uri')) ||
          this.state.imageUrl
        }
        defaultFile={this.state.imageFile}
        onImageUrl={imageUrl => this.setState({ imageUrl })}
        onShouldImage={shouldImageProp => {
          shouldImage = shouldImageProp
        }}
      >Click or drag to attach
      </Dropzone>
    </div>
  )

  renderBody = () => {
    const render = {
      text: this.rendertext,
      terminal: this.renderTerminal,
      image: this.renderImage,
    }
    const renderFunction = render[this.state.messageType]
      ? render[this.state.messageType]
      : render.text
    return renderFunction()
  }

  getEmojis = text => {
    const emojis = this.props.stickerEmojis.filter(stickerEmoji => stickerEmoji.type === 'emoji')
    const foundEmojis = []
    const emojisId = []
    const re = /::([^ :]+)::/g
    let match
    while (match = re.exec(text)) { // eslint-disable-line no-cond-assign
      foundEmojis.push(match[0])
    }
    foundEmojis.forEach(foundEmoji => {
      const searchInEmojiList = emojis.find(emoji => emoji.code === foundEmoji)
      if (searchInEmojiList) {
        emojisId.push(searchInEmojiList.id)
      }
    })
    return emojisId
  }

  handleProjectContent = async (args) => {
    const { projectContent, projectContentId, formType,
      addProjectContentToContents, addProjectContent, editProjectContentFromContents,
      editProjectContent } = this.props
    if (formType === 'add') {
      const data = await addProjectContent({ ...args })
      if (data && data.id) {
        this.resetFormValues()
        addProjectContentToContents(data)
      }
    } else {
      if (!shouldImage && projectContent.image && projectContent.image.uri) {
        await removeImageFromProjectContent(projectContentId, projectContent.image.id)
      }
      const data = await editProjectContent({ id: projectContentId, ...args })
      if (data && data.id) {
        editProjectContentFromContents(data)
        this.setDefaultValues()
        this.setState({ shouldSubmit: false })
      }
    }
  }
  onSubmit = ({ text, ...values }) => {
    const { selectedProject, order } = this.props
    const emojis = this.getEmojis(text)
    const { messageType, imageFile } = this.state
    const args = {
      ...values,
      emojiConnectIds: emojis,
      statement: text,
      type: messageType,
      file: imageFile,
      order,
      ProjectConnectId: selectedProject
    }
    if (messageType === 'image') {
      if (imageFile) {
        this.handleProjectContent(args)
        this.setState({ imageFile: null })
      } else {
        message.error('Please Add Image', 4)
      }
    } else if (messageType !== 'image') {
      this.handleProjectContent(args)
    }
  }

  checkValidations = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.onSubmit(values)
      }
    })
  }
  deleteprojectContents = async (id) => {
    const { deleteProjectContent: data } = await deleteProjectContent(id)
    const { deleteProjectContentFromContents } = this.props
    if (data && data.id) {
      deleteProjectContentFromContents(data)
      message.success('Content deleted successfully...')
    }
  }
  render() {
    const { formId, formType, i, projectContentId } = this.props
    const { messageType, formFields, shouldSubmit } = this.state
    return (
      <Main.FormModal id={formId}>
        <Main.FormHeading>
          {formType === 'edit'
            ? 'Edit Project Content'
            : 'Add Project Content'
          }
        </Main.FormHeading>
        <Main.FormWrapper>
          <Form id={formId} onSubmit={this.checkValidations}>
            <MainModal.FormItem marginBottom='5px'>
              <MainModal.RadioGroup
                defaultValue={messageType}
                value={messageType}
                onChange={this.onMessageTypeChange}
              >
                <Radio.Button value='text'>Text</Radio.Button>
                <Radio.Button value='terminal'>Terminal</Radio.Button>
                <Radio.Button value='image'>Image</Radio.Button>
              </MainModal.RadioGroup>
            </MainModal.FormItem>
            {
              messageType === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Main.EmojiIcon
                    type='bold'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => {
                    const textArea = document.querySelector(`.textArea${i}`)
                    const { selectionStart, selectionEnd } = textArea
                    const { text: prevText } = formFields
                    const nextTextValue =
                    `${prevText.slice(0, selectionStart)}<bold>${prevText.slice(selectionStart, selectionEnd)}</bold>${prevText.slice(selectionEnd)}`
                    const newCusorValue = selectionEnd + '<bold></bold>'.length
                    this.props.form.setFieldsValue({
                        text: nextTextValue
                    })
                    setTimeout(() => {
                        textArea.setSelectionRange(
                        newCusorValue,
                        newCusorValue
                        )
                    }, 0)
                    this.setState(prev => ({
                        formFields: {
                        ...prev.formFields,
                        text: nextTextValue
                        }
                        }))
                    }}
                    style={{ marginTop: 0, alignItems: 'center' }}
                  />
                  <Main.EmojiIcon
                    type='link'
                    onMouseDown={(e) => { e.preventDefault() }}
                    onClick={() => {
                    const textArea = document.querySelector(`.textArea${i}`)
                    const { selectionStart, selectionEnd } = textArea
                    const { text: prevText } = formFields
                    const nextTextValue =
                        `${prevText.slice(0, selectionStart)}<a href="">${prevText.slice(selectionStart, selectionEnd)}</a>${prevText.slice(selectionEnd)}`
                    const newCusorValue = selectionStart + '<a href="'.length
                    this.props.form.setFieldsValue({
                        text: nextTextValue
                    })
                    setTimeout(() => {
                        textArea.setSelectionRange(
                        newCusorValue,
                        newCusorValue
                    )
                    }, 0)
                    this.setState(prev => ({
                        formFields: {
                        ...prev.formFields,
                        text: nextTextValue
                        }
                    }))
                    }}
                    style={{ marginTop: 0, alignItems: 'center' }}
                  />
                </div>
              )
            }
            {this.renderBody()}
          </Form>
        </Main.FormWrapper>
        <Main.FormFooter>
          {formType === 'edit' &&
            <Popconfirm
              title='Do you want to delete?'
              placement='topRight'
              onConfirm={() => this.deleteprojectContents(projectContentId)}
              okText='Yes'
              cancelText='Cancel'
              key={projectContentId}
              overlayClassName='popconfirm-overlay-primary'
            >
              <Main.DeleteButton >Delete
              </Main.DeleteButton>
            </Popconfirm>
          }
          <Button
            type='primary'
            htmlType='submit'
            form={formId}
            onClick={this.checkValidations}
            disabled={formType === 'edit' && !shouldSubmit}
          >Save
          </Button>
        </Main.FormFooter>
      </Main.FormModal>
    )
  }
}


ProjectForm.propTypes = {
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired
  }).isRequired,
  projectContent: PropTypes.arrayOf([]).isRequired,
  formType: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  stickerEmojis: PropTypes.arrayOf([]).isRequired,
  selectedProject: PropTypes.string.isRequired
}
export default Form.create()(ProjectForm)
