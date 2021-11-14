/* eslint-disable max-len */
import { Button, Icon, Popconfirm, Tooltip } from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lodash'
import deleteStudent from '../../../actions/batchUserMap/deleteStudent'
import MainTable from '../../../components/MainTable'
import { Table } from '../../../components/StyledComponents'
import BatchUserModal from './BatchUserModal'
import EditStudentModal from './EditStudentModal'
import getDataFromLocalStorage from '../../../utils/extract-from-localStorage'
import { MENTOR } from '../../../constants/roles'

const minWidth = '813px'
const columnsTemplate = 'repeat(5, 0.25fr) repeat(2, 0.2fr)'
const bodyColumnsTemplate = 'repeat(6, 0.45fr) repeat(2, 0.15fr)'
const tableTitleTemplate = 'repeat(3, 2.35fr) repeat(2, 0.11fr)'

const tableTitleStyle = {
  color: '#000000',
  border: 'none',
  height: 'auto',
  margin: '10px 0',
  gridGap: '0',
  pointerEvents: 'none',
  display: 'flex',
  justifyContent: 'center'
}
const titleButtonStyle = {
  width: '600px',
  minHeight: '40px',
  margin: 'auto',
  alignItems: 'center',
  boxShadow: '0 0 12px #8d999b',
  pointerEvents: 'visible',
  display: 'flex'
}

const mainSpanStyle = {
  float: 'left',
  fontSize: '16px',
  fontWeight: 'bold',
  paddingRight: '5px',
  flex: 1
}

const savedRole = getDataFromLocalStorage('login.role')

const CalendarSvg = () => (
  <svg id='Capa_1' enableBackground='new 0 0 512 512' height='1em' viewBox='0 0 512 512' width='1em' xmlns='http://www.w3.org/2000/svg'>
    <g>
      <path d='m391.017 251.454h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-.357 145h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-102.273-45h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-168.475 170.546h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643zm-.357 50h-35v-35h35zm.357-235.546h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.075-6.569-14.643-14.643-14.643zm-.357 50h-35v-35h35zm168.475 107.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm159.365-259.953h-32.066v-11.467c0-12.576-10.231-22.807-22.807-22.807h-3.444c-12.575 0-22.806 10.231-22.806 22.807v11.467h-223.4v-11.467c0-12.576-10.231-22.807-22.807-22.807h-3.444c-12.576 0-22.807 10.231-22.807 22.807v11.467h-32.065c-20.705 0-37.55 16.845-37.55 37.55v402.676c0 20.678 16.822 37.5 37.5 37.5h385.748c20.678 0 37.5-16.822 37.5-37.5v-402.676c-.001-20.705-16.846-37.55-37.552-37.55zm-66.123-11.467c0-4.305 3.502-7.807 7.807-7.807h3.444c4.305 0 7.807 3.502 7.807 7.807v11.467h-19.058zm-272.457 0c0-4.305 3.502-7.807 7.807-7.807h3.444c4.305 0 7.807 3.502 7.807 7.807v11.467h-19.057v-11.467zm361.131 451.693c0 12.407-10.093 22.5-22.5 22.5h-385.748c-12.407 0-22.5-10.093-22.5-22.5v-.047c6.284 4.735 14.095 7.547 22.551 7.547h304.083c10.03 0 19.46-3.906 26.552-10.999l77.562-77.562zm-85.215-17.059c.588-2.427.908-4.958.908-7.563v-50.064c0-9.44 7.681-17.121 17.122-17.121h50.063c2.605 0 5.136-.32 7.563-.908zm85.215-315.987h-319.574c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h319.574v194.118c0 9.441-7.681 17.122-17.122 17.122h-50.063c-17.712 0-32.122 14.41-32.122 32.121v50.064c0 9.441-7.681 17.122-17.121 17.122h-291.769c-12.434 0-22.55-10.116-22.55-22.551v-287.996h81.173c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5h-81.174v-69.63c0-12.434 10.116-22.55 22.55-22.55h32.066v22.052c0 12.576 10.231 22.807 22.807 22.807 4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5c-4.305 0-7.807-3.502-7.807-7.807v-22.052h257.458v22.052c0 12.576 10.231 22.807 22.807 22.807 4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5c-4.305 0-7.807-3.502-7.807-7.807v-22.052h66.124c12.434 0 22.55 10.116 22.55 22.55zm-350.391 137.773h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.075-6.569-14.643-14.643-14.643zm-.357 50h-35v-35h35zm66.559-77.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm101.907 220.546c-.186-3.977-3.469-7.143-7.492-7.143-4.142 0-7.5 3.358-7.5 7.5 0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v10.3c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-9.943h35v35zm-102.264-77.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-.357 142.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35z' fill='#fff' />
    </g>
  </svg>
)

const AttendanceSvg = () => (
  <svg width='1em' height='1m' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='219' y='17' width='254' height='191' fill='#E6F7FF' />
    <path d='M467.309 16.7681H221.454C215.326 16.7681 210.359 21.7351 210.359 27.8631V114.314L222.664 106.674C225.795 104.729 229.139 103.417 232.548 102.696V38.9581H456.213V198.974H232.549V173.084L210.359 186.862V210.07C210.359 216.198 215.326 221.165 221.454 221.165H467.309C473.436 221.165 478.404 216.198 478.404 210.07V27.8631C478.404 21.7351 473.436 16.7681 467.309 16.7681Z' fill='#87C5F9' />
    <path d='M306 78.356C303.081 74.654 297.715 74.021 294.014 76.938L255.797 107.071C259.446 109.456 262.647 112.651 265.098 116.598C265.793 117.715 266.396 118.864 266.932 120.029L304.583 90.342C308.285 87.424 308.919 82.057 306 78.356Z' fill='#87C5F9' />
    <path d='M121.537 63.87C139.174 63.87 153.472 49.5722 153.472 31.935C153.472 14.2978 139.174 0 121.537 0C103.899 0 89.6016 14.2978 89.6016 31.935C89.6016 49.5722 103.899 63.87 121.537 63.87Z' fill='#87C5F9' />
    <path d='M252.009 124.728C247.52 117.499 238.022 115.277 230.791 119.765L199.585 139.14C199.455 113.261 199.524 126.995 199.441 110.329C199.34 90.3241 182.983 74.0481 162.977 74.0481H147.818C134.867 107.636 139.039 95.1681 128.046 123.678L132.669 103.547C132.989 102.039 132.757 100.467 132.014 99.1171L125.75 87.7241L131.309 77.6151C132.138 76.1071 131.045 74.2591 129.324 74.2591H114.053C112.333 74.2591 111.238 76.1071 112.068 77.6151L117.638 87.7451L111.362 99.1591C110.634 100.484 110.396 102.024 110.69 103.506L114.695 123.678C112.536 118.079 97.6108 79.3721 95.5578 74.0481H80.0918C60.0868 74.0481 43.7288 90.3231 43.6278 110.329L43.0588 223.529C43.0168 232.039 49.8798 238.972 58.3898 239.015C58.4168 239.015 58.4418 239.015 58.4688 239.015C66.9418 239.015 73.8328 232.167 73.8748 223.684L74.4438 110.484C74.4438 110.466 74.4438 110.448 74.4438 110.431C74.4678 108.751 75.8428 107.405 77.5228 107.418C79.2028 107.43 80.5568 108.796 80.5568 110.476L80.5638 270.857C94.6698 270.257 107.74 275.345 117.545 284.28V221.712H125.528V293.485C131.151 301.753 134.442 311.728 134.442 322.459C134.442 332.236 131.71 341.387 126.973 349.19C131.839 349.213 136.565 349.859 141.072 351.051C147.148 345.78 154.457 341.9 162.509 339.915C162.509 60.5731 162.174 233.288 162.174 110.497C162.174 108.718 163.613 107.276 165.392 107.273C167.171 107.269 168.616 108.705 168.624 110.484C168.678 121.291 168.848 155.074 168.907 166.835C168.935 172.414 171.977 177.543 176.86 180.242C181.734 182.936 187.695 182.796 192.443 179.848L247.047 145.945C254.275 141.458 256.498 131.957 252.009 124.728Z' fill='#87C5F9' />
    <path d='M429.221 356.634C447.89 356.634 463.024 341.5 463.024 322.831C463.024 304.162 447.89 289.028 429.221 289.028C410.552 289.028 395.418 304.162 395.418 322.831C395.418 341.5 410.552 356.634 429.221 356.634Z' fill='#87C5F9' />
    <path d='M511.46 405.811C511.353 384.635 494.039 367.407 472.862 367.407C463.725 367.407 396.279 367.407 388.081 367.407C391.718 374.475 393.785 382.476 393.785 390.957C393.785 399.962 391.38 409.37 386.285 417.739C405.189 418.503 421.753 428.649 431.434 443.636H472.013V406.206C472.013 404.364 473.473 402.854 475.314 402.791C477.155 402.728 478.716 404.136 478.84 405.973C478.84 405.973 478.84 405.974 478.84 405.975L479.03 443.636H511.651L511.46 405.811Z' fill='#87C5F9' />
    <path d='M290.467 390.956C290.467 382.327 292.606 374.193 296.362 367.036C274.353 367.036 248.509 367.036 221.094 367.036C224.566 373.975 226.532 381.792 226.532 390.065C226.532 399.786 223.801 408.991 219.062 416.796C234.62 416.87 248.974 423.334 259.345 434.063C269.399 424.241 283.105 418.149 298.182 418.068C292.947 409.616 290.467 400.126 290.467 390.956Z' fill='#87C5F9' />
    <path d='M264.82 288.655C246.152 288.655 231.016 303.787 231.016 322.458C231.016 341.086 246.123 356.261 264.82 356.261C283.338 356.261 298.623 341.296 298.623 322.458C298.623 303.808 283.518 288.655 264.82 288.655Z' fill='#87C5F9' />
    <path d='M123.216 390.065C123.216 381.813 125.172 374.012 128.627 367.085C127.17 367.013 133.299 367.036 39.1416 367.036C18.0736 367.036 0.650563 384.174 0.543563 405.44L0.351562 443.636C15.2586 443.636 18.2576 443.636 32.9726 443.636L33.1636 405.605C33.1736 403.721 34.7046 402.203 36.5866 402.208C38.4686 402.214 39.9906 403.74 39.9906 405.622V443.636H85.7176C95.5726 427.882 112.518 417.99 130.961 417.23C125.955 409.168 123.216 399.865 123.216 390.065Z' fill='#87C5F9' />
    <path d='M82.7874 288.655C64.1194 288.655 48.9844 303.789 48.9844 322.458C48.9844 341.042 64.0304 356.261 82.7874 356.261C101.323 356.261 116.591 341.246 116.591 322.458C116.591 303.788 101.456 288.655 82.7874 288.655Z' fill='#87C5F9' />
    <path d='M422.532 473.807C422.427 452.629 405.112 435.401 383.935 435.401C381.689 435.401 300.966 435.401 298.428 435.401C277.252 435.401 258.827 452.628 258.72 473.805L258.445 472.914C258.34 451.822 241.104 434.51 219.848 434.51C195.304 434.51 160.053 434.51 134.341 434.51C113.165 434.51 94.7404 451.737 94.6334 472.914L94.4414 512H127.062L127.253 473.078C127.261 471.456 128.58 470.148 130.201 470.152C131.822 470.156 133.133 471.472 133.133 473.093V512.001C152.254 512.001 201.616 512.001 219.525 512.001V473.093C219.525 471.357 220.93 469.949 222.666 469.944C224.401 469.94 225.815 471.341 225.824 473.077L226.015 512C232.684 512 284.253 512 291.149 512L291.34 473.969C291.34 473.969 291.34 473.968 291.34 473.967C291.349 472.346 292.668 471.039 294.289 471.043C295.91 471.047 297.22 472.363 297.22 473.984V512C316.341 512 365.703 512 383.612 512V473.984C383.612 472.248 385.017 470.84 386.753 470.835C388.488 470.831 389.902 472.232 389.911 473.968L390.102 511.999H422.723L422.532 473.807Z' fill='#87C5F9' />
    <path d='M175.932 424.131C194.819 424.131 210.13 408.82 210.13 389.933C210.13 371.046 194.819 355.735 175.932 355.735C157.045 355.735 141.734 371.046 141.734 389.933C141.734 408.82 157.045 424.131 175.932 424.131Z' fill='#87C5F9' />
    <path d='M342.069 425.019C360.956 425.019 376.267 409.708 376.267 390.821C376.267 371.934 360.956 356.623 342.069 356.623C323.182 356.623 307.871 371.934 307.871 390.821C307.871 409.708 323.182 425.019 342.069 425.019Z' fill='#87C5F9' />
  </svg>
)

const CalendarIcon = props => <Icon component={CalendarSvg} {...props} />

const AttendanceIcon = props => <Icon component={AttendanceSvg} {...props} />
class BatchUserTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAddStudentModalVisible: false,
      isEditStudentModalVisible: false,
      studentName: '',
      studentId: '',
      currentBatch: '',
      currentBatchId: '',
      selectedBatch: null
    }
  }

  componentDidUpdate(prevprops) {
    if (prevprops.isAddingStudent && this.props.hasAddedStudent) {
      this.setState({
        isAddStudentModalVisible: false,
        isEditStudentModalVisible: false
      })
    }
  }

  renderTableHead = () => (
    <Table.Row
      columnsTemplate={columnsTemplate}
      minWidth={minWidth}
      style={{ border: 'none', margin: '0px auto 4px', gridGap: '0' }}
    >
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>SL No.</MainTable.Title>
      </Table.Item>
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>Student Name</MainTable.Title>
      </Table.Item>
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>Parent Name</MainTable.Title>
      </Table.Item>
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>Email ID</MainTable.Title>
      </Table.Item>
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>Phone No.</MainTable.Title>
      </Table.Item>
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>Grade</MainTable.Title>
      </Table.Item>
      <Table.Item style={{ background: '#cacaca' }}>
        <MainTable.Title>Action</MainTable.Title>
      </Table.Item>
    </Table.Row>
  )

  renderTitleButton = () => (
    <Table.Row
      minWidth={minWidth}
      style={tableTitleStyle}
      columnsTemplate={tableTitleTemplate}
    >
      <Button
        block
        type='primary'
        style={titleButtonStyle}
        onClick={() => {
          this.setState({
            isAddStudentModalVisible: true,
            selectedBatch: this.props.batches
          })
        }}
      >
        <span style={mainSpanStyle}>{this.props.batches.code}</span>
        {
          savedRole !== MENTOR ? <span style={{ flex: 1 }}>{get(this.props, 'batches.allottedMentor.username', '')}</span> : <div />
        }
        <span style={{ marginBottom: '.2rem', flex: 1 }}>
          {this.props.batches.currentComponent.currentTopic.title}
        </span>
        <Link
          rel='noopener noreferrer'
          to={`/ums/assignTimetable/${this.props.batches.code}`}
        >
          <Tooltip
            placement='top'
            title='Click to View Timetable'
          >
            <CalendarIcon
              style={{ color: '#fff', marginLeft: '.75rem', fontSize: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', flex: 1 }}
            />
          </Tooltip>
        </Link>
        <Link
          rel='noopener noreferrer'
          to={`/ums/batchAttendance/${this.props.batches.code}`}
        >
          <Tooltip
            placement='top'
            title='Click to View Attendance'
          >
            <AttendanceIcon
              style={{ color: '#fff', marginLeft: '.75rem', fontSize: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', flex: 1 }}
            />
          </Tooltip>
        </Link>
      </Button>{' '}
    </Table.Row>
  )

  renderParentData = (item) => {
    if (item && item.parents.length > 0 && item.parents[0].user) {
      return item.parents[0].user
    }
    return null
  }
  renderTableBody = () => {
    const students = []
    const { batches } = this.props
    if (get(batches, 'students', []).length > 0) {
      get(batches, 'students', []).forEach(student => {
        const studentIds = students.map(stu => get(stu, 'id'))
        if (!studentIds.includes(get(student, 'id'))) {
          students.push(student)
        }
      })
    }
    return students.map((studentInfo, index) => (
      <>
        <Table.Row
          columnsTemplate={bodyColumnsTemplate}
          minWidth={minWidth}
          style={{ border: 'none', margin: '2px auto', gridGap: '0' }}
        >
          <Table.Item style={{ fontSize: 14, background: '#ebebeb' }}>
            {index + 1}
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#ebebeb' }}>
            {studentInfo.user.name}
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#ebebeb' }}>
            {!this.renderParentData(studentInfo) ? '-' : this.renderParentData(studentInfo).name}
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#ebebeb' }}>
            {!this.renderParentData(studentInfo) ? '-' : this.renderParentData(studentInfo).email}
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#ebebeb' }}>
            {!this.renderParentData(studentInfo) ? '-' : this.renderParentData(studentInfo).phone.number}
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#ebebeb' }}>
            {!studentInfo.grade ? '-' : studentInfo.grade}
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#e7e7e7' }}>
            <MainTable.ActionItem.IconWrapper
              onClick={() => this.setState({
                isEditStudentModalVisible: true,
                studentName: studentInfo.user.name,
                studentId: studentInfo.id,
                currentBatch: this.props.batches.code,
                currentBatchId: this.props.batches.id
              })
              }
            >
              <MainTable.ActionItem.EditIcon />
            </MainTable.ActionItem.IconWrapper>
          </Table.Item>
          <Table.Item style={{ fontSize: 14, background: '#e7e7e7' }}>
            <MainTable.ActionItem.IconWrapper>
              <Popconfirm
                title='Do you want to delete this student?'
                placement='topRight'
                onConfirm={() => { deleteStudent(studentInfo.id, this.props.batches.id) }}
                okText='Yes'
                cancelText='Cancel'
                key='delete'
                overlayClassName='popconfirm-overlay-primary'
              >
                <MainTable.ActionItem.DeleteIcon />
              </Popconfirm>
            </MainTable.ActionItem.IconWrapper>
          </Table.Item>
        </Table.Row>
      </>
    ))
  }

  closeBatchUserModal = () => {
    this.setState({
      isAddStudentModalVisible: false,
    })
  }

  closeEditStudentModal = () => {
    this.setState({
      isEditStudentModalVisible: false,
    })
  }

  render() {
    const { studentName, studentId, currentBatch, currentBatchId } = this.state
    const { studentsInfo } = this.props
    return (
      <div style={{ marginTop: '10px' }}>
        <Table
          style={{
            width: '90%',
            margin: '0 auto',
            padding: '5px',
            boxShadow: '0 0 10px grey',
            border: '0',
            borderRadius: '5px',
          }}
        >
          {this.renderTableHead()}
          {this.renderTitleButton()}
          {this.renderTableBody()}
        </Table>
        <BatchUserModal
          {...this.props}
          isAddStudentModalVisible={this.state.isAddStudentModalVisible}
          closeBatchUserModal={this.closeBatchUserModal}
          studentsInfo={studentsInfo}
          studentsInBatch={this.props.batchesData.students}
          selectedBatch={this.state.selectedBatch}
        />
        <EditStudentModal
          {...this.props}
          isEditStudentModalVisible={this.state.isEditStudentModalVisible}
          closeEditStudentModal={this.closeEditStudentModal}
          studentName={studentName}
          studentId={studentId}
          currentBatch={currentBatch}
          currentBatchId={currentBatchId}
          batchesData={this.props.batchesData}
        />
      </div>
    )
  }
}

export default BatchUserTable
