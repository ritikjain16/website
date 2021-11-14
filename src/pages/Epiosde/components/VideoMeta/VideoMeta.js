import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Form } from 'antd'
import Main from './VideoMeta.style'
import validators from '../../../../utils/formValidators'
import { getDataById } from '../../../../utils/data-utils'

class VideoMeta extends Component {
  static propTypes={
    editTopicVideoMeta: PropTypes.func.isRequired,
    form: PropTypes.shape({
      resetFields: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    episodes: PropTypes.arrayOf(PropTypes.object).isRequired,
    isVideoMeta: PropTypes.bool.isRequired,
    setIsVideoMeta: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    if (this.props.episodes && this.props.episodes.length) {
      const topicId = this.props.match.params.id
      const topic = getDataById(this.props.episodes, topicId)
      const { videoTitle: title, videoDescription: description } = topic
      const { form } = this.props
      if (this.props.isVideoMeta && !prevProps.isVideoMeta) {
        form.setFieldsValue({
          title,
          description
        })
        this.props.setIsVideoMeta(false)
      }
    }
  }
  checkValidations=e => {
    const { form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSave(values)
      }
    })
  }
  handleSave = async (values) => {
    const req = {}
    const { title: videoTitle, description: videoDescription } = values
    const topicId = this.props.match.params.id
    req.videoTitle = videoTitle
    req.videoDescription = videoDescription
    req.topicId = topicId
    await this.props.editTopicVideoMeta(req)
  }

  render() {
    const { form } = this.props
    return (

      <Main>
        <Main.FormDiv>


          <Form onSubmit={this.checkValidations} id='episodeForm'>

            <Main.FormItem >
              {form.getFieldDecorator(...validators.title)(
                <Main.StyledInput
                  placeholder='Title'
                  id='title'
                />
              )}
            </Main.FormItem >
            <Main.FormItem>
              {form.getFieldDecorator(...validators.descripton)(

                <Main.DescTextArea
                  placeholder='Description'
                  id='description'
                />
              )}
            </Main.FormItem >

          </Form>
        </Main.FormDiv>
        <Main.ButtonsWrapper>
          <Main.TextSpan>
            Video Meta
          </Main.TextSpan>
          <Main.saveButton
            key='save'
            onClick={this.checkValidations}
            id='episodeForm'
          >Save
          </Main.saveButton>
        </Main.ButtonsWrapper>
      </Main>


    )
  }
}

export default Form.create()(VideoMeta)
