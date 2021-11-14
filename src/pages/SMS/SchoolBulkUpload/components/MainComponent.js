/* eslint-disable no-useless-escape */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import React, { Component } from 'react'
import { Button, notification, Popover, Checkbox } from 'antd'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'
import { CSVLink } from 'react-csv'
import { UploadOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { ReactComponent as CloudIcon } from '../assets/cloud.svg'
import validationSchema from '../../../../utils/bulkUploadValidation/yup-validation'

const outerDivStyle = {
  display: 'flex',
  justifyContent: 'center'
}

const innerDivStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}

const topDiv = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '332px',
  height: '246px',
  margin: 'auto',
  marginTop: '15px',
  marginBottom: '15px',
  backgroundColor: '#E6F7FD',
  boxShadow: '0px 0px 9px 1px rgba(0,0,0,0.45)'
}

const middleDiv = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '1300px',
  height: '150px',
  margin: 'auto',
  marginTop: '15px',
  marginBottom: '15px'
}

const m1 = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}

const legend = {
  display: 'flex',
  width: '800px',
  marginBottom: '10px'
}


const circle = {
  height: '20px',
  width: '20px',
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0px 5px'
}

const green = {
  backgroundColor: '#01AA93'
}

const red = {
  backgroundColor: '#EB4132'
}

const yellow = {
  backgroundColor: '#FF7A00'
}

const grey = {
  backgroundColor: '#808080'
}

const tableStyle = {
  height: '50px',
  width: '100%',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  border: '1px solid black'
}

const errorBoxOuter = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '800px',
  height: '45px',
  margin: 'auto',
  marginTop: '15px',
  marginBottom: '15px',
  backgroundColor: '#FFDAD6',
  boxShadow: '0px 0px 9px 1px rgba(0,0,0,0.45)',

}

const validBoxOuter = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '800px',
  height: '45px',
  margin: 'auto',
  marginTop: '15px',
  marginBottom: '15px',
  backgroundColor: '#E6F7FD',
  boxShadow: '0px 0px 9px 1px rgba(0,0,0,0.45)',
}

class ErrorBox extends Component {
  render() {
    const { errors } = this.props
    const optionalHeaders = ['section', 'gender', 'studentEmail', 'rollNo', 'srNo']
    const filteredErrors = errors.filter(item => !optionalHeaders.includes(item))
    const errorsDisplay = filteredErrors.map(err => <div>{err}</div>)
    const content = (
      <div>
        <p>{errorsDisplay}</p>
      </div>
    )
    return (
      <div style={errorBoxOuter}>
        <h3 style={{ marginTop: '5px', color: '#EB4132' }}>Invalid Column Name<Popover title={`Header Errors (${errors.length})`} content={content}><InfoCircleOutlined /></Popover>, <Link to='/files/sample-csv-file.csv' target='_blank' download><u>Download CSV Template</u></Link> to fix the issue</h3>
      </div>
    )
  }
}

class ValidStudentsBox extends Component {
  render() {
    const { valids } = this.props
    const validCsv = []
    if (valids && valids.length > 0) {
      for (const item of valids) {
        delete item.values.errors
        validCsv.push(item.values)
      }
    }
    return (
      <div style={validBoxOuter}>
        <h3 style={{ marginTop: '5px', color: '#00ADE6' }}>{!valids ? 0 : valids.length} users are ready for upload</h3>
        <div>
          <Button type='primary'>
            <UploadOutlined /> Upload Users
          </Button>
          <Button type='primary' style={{ marginLeft: '15px' }}>
            <CSVLink data={validCsv} filename='valid-users.csv'>
              <DownloadOutlined /> Download CSV
            </CSVLink>
          </Button>
        </div>
      </div>
    )
  }
}

class InvalidStudentsBox extends Component {
  render() {
    const { data, errors } = this.props
    const invalidCsv = []
    for (const err of errors) {
      data[err.index].errors = err.values
      invalidCsv.push(data[err.index])
    }
    return (
      <div style={errorBoxOuter}>
        <h3 style={{ marginTop: '5px', color: '#EB4132' }}>We've found errors in {errors.length}  users</h3>
        <div>
          <Button type='danger'>
            <CSVLink data={invalidCsv} filename='invalid-users.csv'>
              <DownloadOutlined /> Download CSV
            </CSVLink>
          </Button>
        </div>
      </div>
    )
  }
}
export default class MainComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      csvfile: undefined,
      errors: undefined,
      validHeaders: undefined,
      headerError: false,
      validStudents: false,
      inValidStudents: false,
      downloadFullCsv: false,
      valids: undefined,
      data: [],
      excludeParentEmail: false,
      excludePhoneNumber: false
    }
    this.fileUpload = React.createRef()
    this.importCSV = this.importCSV.bind(this)
  }

  importCSV() {
    this.setState({
      headerError: false,
      validStudents: false,
      inValidStudents: false,
      downloadFullCsv: false,
      csvfile: undefined,
      errors: undefined,
      validHeaders: undefined,
      valids: undefined
    }, () => this.fileUpload.current.click())
  }

  handleChange = event => {
    if (event.target.files && event.target.files[0]) {
      notification.success({
        message: 'Upload Successful!'
      })
      this.setState({
        csvfile: event.target.files[0]
      }, this.testParse)
    }
    // resetting the value for onChange to work on same name files
    event.target.value = ''
  }

  showBox = (type) => {
    if (type === 'headerErr') {
      this.setState({
        headerError: true
      })
    } else if (type === 'valid') {
      this.setState({
        validStudents: true,
        downloadFullCsv: true
      })
    } else if (type === 'invalid') {
      this.setState({
        inValidStudents: true,
        downloadFullCsv: true
      })
    }
  }

  renderBoxes = () => {
    const { errors } = this.state
    if (!errors) {
      this.showBox('valid')
    } else {
      this.showBox('invalid')
      this.showBox('valid')
    }
  }

  awaitAll = (data) => {
    const promises = []
    const errors = []
    const valids = []
    const { excludeParentEmail, excludePhoneNumber } = this.state
    for (const row of data) {
      promises.push(validationSchema(excludeParentEmail, excludePhoneNumber).validate(row, {
        abortEarly: false
      })
        .then((valid) => {
          valids.push({
            index: data.indexOf(row),
            values: valid
          })
          this.setState({ valids })
        })
        .catch((err) => {
          const set = new Set()
          const filteredErr = []
          for (const e of err.errors) {
            const firstWord = e.split(' ')[0]
            if (!set.has(firstWord)) {
              set.add(firstWord)
              filteredErr.push(e)
            }
          }
          errors.push({
            index: data.indexOf(row),
            values: filteredErr
          })
          this.setState({ errors })
        })
      )
    }
    return Promise.all(promises)
  }

  checkKeys = (obj, arr) => {
    const invalidHeaders = []
    const validHeaders = []

    for (const key of arr) {
      if (key in obj) {
        validHeaders.push(key)
      } else {
        invalidHeaders.push(key)
      }
    }
    return { validHeaders, invalidHeaders }
  }

  checkBoxHandler = (item) => {
    const { excludeParentEmail, excludePhoneNumber } = this.state
    if (excludeParentEmail && excludePhoneNumber) {
      return (item !== 'parentEmail' && item !== 'phoneNumber')
    } else if (excludeParentEmail) {
      return (item !== 'parentEmail')
    } else if (excludePhoneNumber) {
      return (item !== 'phoneNumber')
    }
    return true
  }

  getStyle = (headerName) => {
    const { validHeaders, invalidHeaders, excludeParentEmail, excludePhoneNumber } = this.state
    const optionalHeaders = ['section', 'gender', 'studentEmail', 'rollNo', 'srNo']
    const mandatoryHeaders = ['grade', 'childName', 'parentName', 'parentEmail', 'phoneNumber'].filter(this.checkBoxHandler)
    if (excludePhoneNumber && headerName === 'phoneNumber') {
      return { textAlign: 'center', color: '#808080' }
    }
    if (excludeParentEmail && headerName === 'parentEmail') {
      return { textAlign: 'center', color: '#808080' }
    }
    if (invalidHeaders && invalidHeaders.length > 0 && invalidHeaders.includes(headerName) && mandatoryHeaders.includes(headerName)) {
      return { textAlign: 'center', color: '#EB4132' }
    }
    if (validHeaders && validHeaders.length > 0) {
      if (validHeaders.includes(headerName)) {
        return { textAlign: 'center', color: '#01AA93' }
      } else if (optionalHeaders.includes(headerName)) {
        return { textAlign: 'center', color: '#FF7A00' }
      } else {
        return { textAlign: 'center', color: '#EB4132' }
      }
    }
    return { textAlign: 'center', color: '#808080' }
  }

  style = (key) => {
    const { csvfile } = this.state
    if (!csvfile) {
      return Object.assign({}, circle, grey)
    }
    if (key === 'found') {
      return Object.assign({}, circle, green)
    } else if (key === 'notFoundMandatory') {
      return Object.assign({}, circle, red)
    } else if (key === 'notFoundOptional') {
      return Object.assign({}, circle, yellow)
    }
  }

  getButtonColor = () => {
    const { downloadFullCsv, errors } = this.state
    if (!downloadFullCsv) {
      return { background: '#f5f5f5', color: '#bdbdbd' }
    }
    if (!errors) {
      return { background: '#52c41a', color: 'white' }
    }
    return { background: '#ff4d4f', color: 'white' }
  }


  textStyle = (key) => {
    const { csvfile } = this.state
    if (!csvfile) {
      if (key === 'found') {
        return { display: 'flex', alignItems: 'center', flex: 1, color: '#808080' }
      } else if (key === 'notFoundMandatory') {
        return { display: 'flex', alignItems: 'center', flex: 2, color: '#808080' }
      } else if (key === 'notFoundOptional') {
        return { display: 'flex', alignItems: 'center', flex: 2, color: '#808080' }
      }
    }
    if (key === 'found') {
      return { display: 'flex', alignItems: 'center', flex: 1, color: '#01AA93' }
    } else if (key === 'notFoundMandatory') {
      return { display: 'flex', alignItems: 'center', flex: 2, color: '#EB4132' }
    } else if (key === 'notFoundOptional') {
      return { display: 'flex', alignItems: 'center', flex: 2, color: '#FF7A00' }
    }
  }

  testValidate = (result) => {
    const { data } = result
    this.setState({ data })
    const { excludeParentEmail, excludePhoneNumber } = this.state
    if (data[0].grade === undefined || data[0].childName === undefined || data[0].parentName === undefined || (!excludePhoneNumber && data[0].phoneNumber === undefined) || (!excludeParentEmail && data[0].parentEmail === undefined)) {
      const validKeys = ['childName', 'parentName', 'phoneNumber', 'parentEmail', 'grade', 'section', 'gender', 'studentEmail', 'rollNo', 'srNo'].filter(this.checkBoxHandler)
      const { validHeaders, invalidHeaders } = this.checkKeys(data[0], validKeys)
      this.setState({ errors: invalidHeaders, validHeaders }, () => {
        this.showBox('headerErr')
      })
    } else {
      const validKeys = ['childName', 'parentName', 'phoneNumber', 'parentEmail', 'grade', 'section', 'gender', 'studentEmail', 'rollNo', 'srNo']
      const { validHeaders } = this.checkKeys(data[0], validKeys)
      this.setState({ validHeaders })
      this.awaitAll(data)
        .then(this.renderBoxes)
    }
  }

  testParse = () => {
    const { csvfile } = this.state
    Papa.parse(csvfile, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: this.testValidate
    })
  }

  onChangeParentEmail = (event) => {
    this.setState({
      excludeParentEmail: event.target.checked,
    })
  }

  onChangePhoneNumber = (event) => {
    this.setState({
      excludePhoneNumber: event.target.checked,
    })
  }

  render() {
    const { selectedSchool, redirectedSchool, schools } = this.props
    const { data, valids, errors, headerError, validStudents, inValidStudents, downloadFullCsv } = this.state
    let updatedData = []
    if (downloadFullCsv) {
      updatedData = data
      if (errors && errors.length > 0) {
        for (const err of errors) {
          updatedData[err.index].errors = err.values
        }
      }
    }
    const school = schools.find(({ id }) => id === (selectedSchool || redirectedSchool))
    return (
      <div style={outerDivStyle}>
        <div style={innerDivStyle}>
          <div style={{ flex: 1 }}><h2>Upload users for {school ? school.name : ''}</h2></div>
          <div style={topDiv}>
            <CloudIcon style={{ flex: 1 }} />
            <div style={{ flex: 0.5 }}>
              <input
                id='actual-btn'
                className='csv-input'
                type='file'
                name='file'
                placeholder={null}
                ref={this.fileUpload}
                onChange={this.handleChange}
                hidden
              />
              <Button type='primary' onClick={this.importCSV}>
                <UploadOutlined /> Upload CSV
              </Button>
            </div>
            <div style={{ flex: 0.5 }}>
              <Button style={this.getButtonColor()} disabled={!downloadFullCsv}>
                <CSVLink data={updatedData} filename='updated-csv.csv'>
                  Download Updated CSV <DownloadOutlined />
                </CSVLink>
              </Button>
            </div>
          </div>
          <div style={middleDiv}>
            <div style={m1}>
              <h3>CSV Fields:</h3>
              <div style={legend}>
                <div style={this.textStyle('found')}><div style={this.style('found')} />Found</div>
                <div style={this.textStyle('notFoundMandatory')}><div style={this.style('notFoundMandatory')} />Not Found - Mandatory Fields</div>
                <div style={this.textStyle('notFoundOptional')}><div style={this.style('notFoundOptional')} />Not Found - Optional Fields</div>
              </div>
            </div>

            <table style={tableStyle}>
              <tr style={{ height: '50px', width: '100%' }}>
                <td style={this.getStyle('childName')} id='childName'>childName<sup>*</sup></td>
                <td style={this.getStyle('grade')}>grade<sup>*</sup></td>
                <td style={this.getStyle('parentName')} id='parentName'>parentName<sup>*</sup></td>
                <td style={this.getStyle('parentEmail')} id='parentEmail'>parentEmail<sup>*</sup></td>
                <td style={this.getStyle('phoneNumber')} id='phoneNumber'>phoneNumber<sup>*</sup></td>
                <td style={this.getStyle('rollNo')}>rollNo<sub>(Optional)</sub></td>
                <td style={this.getStyle('section')}>section<sub>(Optional)</sub></td>
                <td style={this.getStyle('gender')}>gender<sub>(Optional)</sub></td>
                <td style={this.getStyle('studentEmail')}>studentEmail<sub>(Optional)</sub></td>
              </tr>
            </table>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Checkbox onChange={this.onChangeParentEmail} style={{ margin: '10px 5px 5px 5px' }}>Exclude Parent Email Check</Checkbox>
              <Checkbox onChange={this.onChangePhoneNumber} style={{ margin: '5px' }}>Exclude Phone Number Check</Checkbox>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {validStudents && <ValidStudentsBox data={data} valids={valids} />}
          </div>
          <div style={{ flex: 1 }}>
            {inValidStudents && <InvalidStudentsBox data={data} errors={errors} />}
          </div>
          <div style={{ flex: 1 }}>
            {headerError && <ErrorBox data={data} errors={errors} />}
          </div>
        </div >
      </div >
    )
  }
}
