import React, { Component } from 'react'
import { Input, Tooltip, Button, List } from 'antd'
import { PropTypes } from 'prop-types'
import { getDataById } from '../../../../utils/data-utils'

class BulletPoints extends Component {
  static propTypes = {
    episodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      userInput: '',
      list: []
    }
  }
  componentDidMount() {
    const list = [...this.state.list]
    const topicId = this.props.match.params.id
    const topic = getDataById(this.props.episodes, topicId)
    if (topic.bulletPoints && topic.bulletPoints.length) {
      topic.bulletPoints.map(item => {
        const userInput = {
          id: Math.random(),
          value: item.statement
        }
        list.push(userInput)
      })
      this.setState({
        list,
        userInput: ''
      })
    }
  }
  componentDidUpdate() {
    if (this.state.list.length === 0) {
      const list = [...this.state.list]
      const topicId = this.props.match.params.id
      const topic = getDataById(this.props.episodes, topicId)
      if (topic.bulletPoints && topic.bulletPoints.length) {
        topic.bulletPoints.map(item => {
          const userInput = {
            id: Math.random(),
            value: item.statement
          }
          list.push(userInput)
        })
        this.setState({
          list,
          userInput: ''
        })
      }
    }
  }
  updateInput(value) {
    this.setState({
      userInput: value,
    })
  }
  addItem() {
    if (this.state.userInput !== '') {
      const userInput = {
        id: Math.random(),
        value: this.state.userInput
      }
      const list = [...this.state.list]
      list.push(userInput)
      this.setState({
        list,
        userInput: ''
      })
    }
  }
  deleteItem(key) {
    const list = [...this.state.list]
    const updateList = list.filter(item => item.id !== key)
    this.setState({
      list: updateList,
    })
  }
  handleSave = async () => {
    const req = {}
    const { list } = this.state
    const values = []
    list.map(item => {
      const tempObj = {
        statement: item.value,
        order: list.indexOf(item) + 1
      }
      values.push(tempObj)
    })
    const topicId = this.props.match.params.id
    const input = {
      bulletPoints: {
        replace: values
      }
    }
    req.topicId = topicId
    req.input = input
    await this.props.updateBulletPoints(req)
  }
  editItem = (key, newValue) => {
    const updateList = [...this.state.list]
    const targetIndex = this.state.list.findIndex(item => item.id === key)
    const userInput = {
      id: key,
      value: newValue
    }
    updateList[targetIndex] = userInput
    this.setState({
      list: updateList,
    })
  }
  render() {
    return (
      <div>
        {
          this.state.list.length === 0
            ? ''
            :
            <List
              style={{ width: '1000px' }}
              dataSource={this.state.list}
              renderItem={item => (
                <div style={{ marginBottom: '5px' }}>
                  <Input
                    placeholder={item.value}
                    style={{ width: '1000px', height: '50px' }}
                    value={item.value}
                    onChange={e => this.editItem(item.id, e.target.value)}
                    suffix={
                      <Tooltip title='Delete Item'>
                        <Button
                          type='primary'
                          danger
                          size='small'
                          onClick={() => this.deleteItem(item.id)}
                          style={{ backgroundColor: '#e99a54', borderColor: 'white' }}
                        >
                          x
                        </Button>
                      </Tooltip>
                    }
                  />
                </div>
              )}
            />
        }
        <Input
          placeholder='Enter bullet point'
          style={{ width: '1000px', height: '50px' }}
          value={this.state.userInput}
          onChange={e => this.setState({ userInput: e.target.value })}
          suffix={
            <Tooltip title='Add Item'>
              <Button
                type='primary'
                size='small'
                onClick={() => this.addItem()}
                style={{ width: '45px', backgroundColor: '#e99a54', borderColor: 'white' }}
              >
                +
              </Button>
            </Tooltip>
          }
        />
        <br />
        <br />
        <div style={{ width: '1000px' }}>
          <p style={{ fontSize: '20px', display: 'inline' }}>Bullet Points</p>
          <Button
            type='primary'
            size='small'
            style={{
              width: '8em',
              backgroundColor: '#e99a54',
              borderColor: '#E8E8E8',
              float: 'right',
              minHeight: '40px'
            }}
            onClick={() => this.handleSave()}
          >
            SAVE
          </Button>
        </div>
      </div >
    )
  }
}

export default BulletPoints
