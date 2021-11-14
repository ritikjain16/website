import React, { Component } from 'react'
import { Form, Button, Radio, Popconfirm, Icon, Modal, Popover, Select } from 'antd'
import { get, isEqual, debounce } from 'lodash'
import PropTypes from 'prop-types'
import Main from './TechTalkForm.style'
import MainModal from '../../../../components/MainModal'
import validators from '../../../../utils/formValidators'
import Dropzone from '../../../../components/Dropzone'
import getFullPath from '../../../../utils/getFullPath'

class TechTalkForm extends Component {
  state = {
    messageType: 'text',
    alignmentType: 'left',
    imageFile: null,
    shouldSubmit: false,
    imageUrl: null,
    shouldModalVisible: false,
    stickerCode: null,
    formFields: {
      text: '',
      terminalInput: '',
      terminalOutput: ''
    },
    selectedQuestion: '',
    searchTerm: '',
    questions: [],
    questionsLoading: false,
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
      alignmentType: 'left',
      messageType: 'text',
      imageFile: null,
      imageUrl: null,
      stickerCode: null
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
    const { message } = this.props
    const formFields = {
      text: message.statement,
      terminalInput: message.terminalInput,
      terminalOutput: message.terminalOutput || '',
    }
    this.setState({
      formFields,
      alignmentType: message.alignment,
      messageType: message.type,
      stickerCode: get(message, 'sticker.code', ''),
      selectedQuestion: get(message, 'question.id', '')
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

  onAlignmentTypeChange = value => {
    this.setState({ alignmentType: value })
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
    if (this.state.messageType !== prevState.messageType) {
      this.fillFormValues()
      if (!this.state.stickerCode && this.state.messageType === 'sticker') {
        this.setState({ shouldModalVisible: true })
      }
    }

    if (this.props.learningObjectiveId !== prevProps.learningObjectiveId) {
      if (this.props.formType === 'add') {
        this.resetFormValues()
      }
    }

    if (this.props.hasAddedMessage !== prevProps.hasAddedMessage) {
      if (this.props.formType === 'add') {
        this.resetFormValues()
      }

      if (this.props.hasAddedMessage) {
        if (this.props.message && this.props.message.type === 'image') {
          this.setState({ imageFile: null })
        }
      }
    }

    if (this.props.hasEditedMessage !== prevProps.hasEditedMessage) {
      if (this.props.hasEditedMessage) {
        if (this.props.message && this.props.message.type === 'image') {
          this.setState({ imageFile: null })
        }
      }

      if (this.props.message) {
        if (this.props.hasEditedMessage &&
          this.props.editedMessageId === this.props.message.id) {
          this.setState({ shouldSubmit: false })
        }
      }
    }

    if (this.props.hasDeletedMessage !== prevProps.hasDeletedMessage) {
      try {
        if (this.props.hasDeletedMessage) {
          if (this.props.deletedMessageId !== this.props.formId) {
            this.setDefaultValues()
          }
        }
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    }

    if (!isEqual(this.props.message, prevProps.message)) {
      if (this.props.message && this.props.message.id) {
        this.setDefaultValues()
      }
    }

    if ((
      this.state.formFields.text !== prevState.formFields.text ||
      this.state.formFields.terminalInput !== prevState.formFields.terminalInput ||
      this.state.formFields.terminalOutput !== prevState.formFields.terminalOutput)
      && this.hasEmulatorLoaded
    ) {
      debounce(this.addMessageInRedux, 100)()
    }

    if (!isEqual(this.state.alignmentType, prevState.alignmentType) && this.hasEmulatorLoaded) {
      debounce(this.addMessageInRedux, 100)()
    }

    if (!isEqual(this.state.messageType, prevState.messageType) && this.hasEmulatorLoaded) {
      debounce(this.addMessageInRedux, 100)()
    }

    if (!isEqual(this.state.imageUrl, prevState.imageUrl) && this.hasEmulatorLoaded) {
      debounce(this.addMessageInRedux, 100)()
    }

    if (!isEqual(this.state.stickerCode, prevState.stickerCode) && this.hasEmulatorLoaded) {
      debounce(this.addMessageInRedux, 100)()
    }
  }

  addMessageInRedux = () => {
    const { alignmentType, messageType } = this.state
    const initialMessage = {
      statement: null,
      alignmentType: null,
      terminalInput: null,
      terminalOutput: null,
      messageType: null,
      imageURI: null
    }
    const commonRes = {
      id: this.props.formId,
      alignmentType,
      messageType,
      order: (this.props.message && this.props.message.order) || 'add',
      learningObjectiveId: this.props.learningObjectiveId
    }
    if (messageType === 'text') {
      this.props.addMessageUI({
        ...initialMessage,
        ...commonRes,
        statement: this.state.formFields.text
      })
    } else if (messageType === 'terminal') {
      this.props.addMessageUI({
        ...initialMessage,
        ...commonRes,
        terminalInput: this.state.formFields.terminalInput,
        terminalOutput: this.state.formFields.terminalOutput,
      })
    } else if (messageType === 'image') {
      this.props.addMessageUI({
        ...initialMessage,
        ...commonRes,
        imageURI: this.state.imageUrl
      })
    } else if (messageType === 'sticker') {
      this.props.addMessageUI({
        ...initialMessage,
        ...commonRes,
        stickerCode: this.state.stickerCode
      })
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
        {this.props.form.getFieldDecorator('terminalInput')(
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
          getFullPath(get(this.props, 'message.image.uri')) ||
          this.state.imageUrl
        }
        defaultFile={this.state.imageFile}
        onImageUrl={imageUrl => this.setState({ imageUrl })}
      >Click or drag to attach
      </Dropzone>
    </div>
  )

  renderSticker = () => (
    <div>
      {this.state.stickerCode ? (
        <Main.SelectedStickerContainer
          onClick={() => {
            this.setState({
              shouldModalVisible: true
            })
          }}
        >
          <img
            src={getFullPath(get(
              this.props.stickerEmojis.find(stickerEmoji =>
                stickerEmoji.code === this.state.stickerCode
              ), 'image.uri')
            )}
            alt='Alt prop'
          />
          <Main.SelectedStickerOverlay>
            <Main.EditIcon
              type='edit'
            />
          </Main.SelectedStickerOverlay>
        </Main.SelectedStickerContainer>
      ) : (
        <Main.StickerContainer
          onClick={() => {
            this.setState({
              shouldModalVisible: true
            })
          }}
        >
          <Main.StickerPlaceholderWrapper>
            <Icon style={{
              fontSize: '40px',
              fontWeight: 800
            }}
              type='smile'
            />
            <div>Click here to add sticker</div>
          </Main.StickerPlaceholderWrapper>
        </Main.StickerContainer>
      )}
    </div>
  )

  renderBody = () => {
    const render = {
      text: this.rendertext,
      terminal: this.renderTerminal,
      image: this.renderImage,
      sticker: this.renderSticker,
      question: this.renderQuestion
    }
    const renderFunction = render[this.state.messageType]
      ? render[this.state.messageType]
      : render.text
    return renderFunction()
  }

  renderQuestion = () => {
    const questions = this.state.searchTerm.length > 0
      ? this.state.questions
      : this.props.questionBank

    return (
      <Select
        showSearch
        loading={this.state.questionsLoading || this.props.isFetchingQuestionBank}
        placeholder='Select a question'
        filterOption={() => true}
        onSearch={debounce(async (input) => {
          if (input && input.length > 0) {
            this.setState({ questionsLoading: true, searchTerm: input })
            this.props.fetchQuestions(this.props.learningObjectiveId, input, (questionBank) => {
              this.setState({ questions: questionBank, questionsLoading: false })
            })
          } else {
            this.setState({ questionsLoading: false, questions: [], searchTerm: '' })
          }
        }, 10)}
        value={this.state.selectedQuestion}
        defaultValue={this.state.selectedQuestion}
        onChange={(value) => {
          if (this.props.formType === 'edit' && !this.state.shouldSubmit) {
            this.onFormFirstChangeInEdit()
          }
          this.setState({ selectedQuestion: value })
        }}
        style={{ width: '100%', margin: '10px 0' }}
      >
        {
          questions.map(question =>
            <Select.Option
              value={question.id}
              label={question.id}
            >
              <span>{question.statement}</span>
            </Select.Option>
          )
        }
      </Select>

    )
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

  onSubmit = ({ text, ...values }) => {
    const { message } = this.props
    const emojis = this.getEmojis(text)
    const args = {
      ...values,
      emojiConnectIds: emojis,
      statement: text,
      type: this.state.messageType,
      order: this.props.order,
      alignment: this.state.alignmentType,
      file: this.state.imageFile,
    }
    if (this.props.formType === 'add') {
      if (this.state.messageType === 'sticker') {
        if (this.state.stickerCode) {
          const stickerConnectId = get(this.props.stickerEmojis.find(
            stickerEmoji => stickerEmoji.code === this.state.stickerCode
          ), 'id')
          this.props.addMessage({
            learningObjectiveId: this.props.learningObjectiveId,
            ...args,
            stickerConnectId
          })
        }
      } else if (this.state.messageType === 'question') {
        if (this.state.selectedQuestion) {
          this.props.addMessage({
            learningObjectiveId: this.props.learningObjectiveId,
            ...args,
            questionConnectId: this.state.selectedQuestion
          })
        }
      } else {
        this.props.addMessage({ ...args, learningObjectiveId: this.props.learningObjectiveId })
      }
    } else if (this.state.messageType === 'sticker') {
      if (this.state.stickerCode) {
        const stickerConnectId = get(this.props.stickerEmojis.find(
          stickerEmoji => stickerEmoji.code === this.state.stickerCode
        ), 'id')
        this.props.editMessage({ id: message.id, ...args, stickerConnectId })
      }
    } else if (this.state.messageType === 'question') {
      if (this.state.selectedQuestion) {
        this.props.editMessage({
          id: message.id,
          ...args,
          questionConnectId: this.state.selectedQuestion
        })
      }
    } else {
      this.props.editMessage({ id: message.id, ...args })
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

  render() {
    const { props } = this
    return (
      <Main.FormModal id={props.formId}>
        <Main.FormHeading>
          {props.formType === 'edit'
            ? 'Edit Tek Talk'
            : 'Add Tek Talk'
          }
        </Main.FormHeading>
        <Main.FormWrapper>
          <Form id={props.formId} onSubmit={this.checkValidations}>
            <MainModal.FormItem marginBottom='5px'>
              <MainModal.RadioGroup
                defaultValue={this.state.messageType}
                value={this.state.messageType}
                onChange={this.onMessageTypeChange}
              >
                <Radio.Button value='text'>Text</Radio.Button>
                <Radio.Button value='terminal'>Terminal</Radio.Button>
                <Radio.Button value='image'>Image</Radio.Button>
                <Radio.Button value='sticker'>Sticker</Radio.Button>
                <Radio.Button value='question'>Question</Radio.Button>
              </MainModal.RadioGroup>
            </MainModal.FormItem>
            <Main.FormItemFlex marginBottom='5px'>
              <MainModal.RadioGroup
                defaultValue={this.state.alignmentType}
                value={this.state.alignmentType}
                onChange={e => {
                  const { value } = e.target
                  setTimeout(() => {
                    this.onAlignmentTypeChange(value)
                  }, 0)
                }}
              >
                <Radio.Button value='left'>Left</Radio.Button>
                <Radio.Button value='right'>Right</Radio.Button>
              </MainModal.RadioGroup>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Main.EmojiIcon
                  type='bold'
                  onMouseDown={(e) => { e.preventDefault() }}
                  onClick={() => {
                    const textArea = document.querySelector(`.textArea${props.i}`)
                    const { selectionStart, selectionEnd } = textArea
                    const { text: prevText } = this.state.formFields
                    const nextTextValue =
                      `${prevText.slice(0, selectionStart)}<bold>${prevText.slice(selectionStart, selectionEnd)}</bold>${prevText.slice(selectionEnd)}`
                    const newCusorValue = selectionEnd + '<bold></bold>'.length
                    props.form.setFieldsValue({
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
                    const textArea = document.querySelector(`.textArea${props.i}`)
                    const { selectionStart, selectionEnd } = textArea
                    const { text: prevText } = this.state.formFields
                    const nextTextValue =
                      `${prevText.slice(0, selectionStart)}<a href="">${prevText.slice(selectionStart, selectionEnd)}</a>${prevText.slice(selectionEnd)}`
                    const newCusorValue = selectionStart + '<a href="'.length
                    props.form.setFieldsValue({
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
            </Main.FormItemFlex>
            {this.renderBody()}
          </Form>
        </Main.FormWrapper>
        <Main.FormFooter>
          {props.formType === 'edit' &&
            <Popconfirm
              title='Do you want to delete?'
              placement='topRight'
              onConfirm={() => {
                props.deleteMessage(props.message.id)
              }}
              okText='Yes'
              cancelText='Cancel'
              key={props.message.id}
              overlayClassName='popconfirm-overlay-primary'
            >
              <Main.DeleteButton >Delete
              </Main.DeleteButton>
            </Popconfirm>
          }
          <Button
            type='primary'
            htmlType='submit'
            form={props.formId}
            onClick={this.checkValidations}
            disabled={props.formType === 'edit' && !this.state.shouldSubmit}
          >Save
          </Button>
        </Main.FormFooter>
        <Modal
          visible={this.state.shouldModalVisible}
          width='568px'
          title='Stickers'
          onCancel={() => {
            this.setState({ shouldModalVisible: false })
          }}
          onOk={() => {
            this.setState({ shouldModalVisible: false })
          }}
        >
          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
            {props.stickerEmojis.filter(stickerEmoji => stickerEmoji.type === 'sticker').map(sticker => (
              <Main.StickerWrapper
                onClick={() => {
                  if (!this.state.shouldSubmit) this.onFormFirstChangeInEdit()
                  this.setState({ stickerCode: sticker.code })
                }}
                active={this.state.stickerCode === sticker.code}
              >
                <img src={getFullPath(get(sticker, 'image.uri'))} alt={sticker.code} />
                <div style={{ textAlign: 'center' }}>{sticker.code}</div>
              </Main.StickerWrapper>
            ))}
          </div>
        </Modal>
      </Main.FormModal>
    )
  }
}


TechTalkForm.propTypes = {
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired
  }).isRequired,
  addMessage: PropTypes.func.isRequired,
  addMessageUI: PropTypes.func.isRequired,
  editMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  removeImageMessage: PropTypes.func.isRequired,
  learningObjectives: PropTypes.arrayOf([]).isRequired,
  message: PropTypes.arrayOf([]).isRequired,
  formType: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
  learningObjectiveId: PropTypes.string.isRequired,
  deletedMessageId: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  hasAddedMessage: PropTypes.bool.isRequired,
  hasEditedMessage: PropTypes.bool.isRequired,
  hasDeletedMessage: PropTypes.bool.isRequired,
  editedMessageId: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  stickerEmojis: PropTypes.arrayOf([]).isRequired,
}
export default Form.create()(TechTalkForm)
