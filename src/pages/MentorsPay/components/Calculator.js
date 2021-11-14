/* eslint-disable no-alert */
import React, { Component } from 'react'
import { get } from 'lodash'
import './CalculatorStyle.scss'

class Calculator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      studentInTypeOne: 1,
      studentInTypeTwo: 2,
      studentInTypeThree: 3,
      batchNumbersForOne: 1,
      batchNumbersForTwo: 1,
      batchNumbersForThree: 1,
      alertInOne: '',
      alertInTwo: '',
      alertInThree: '',
    }
  }
  render() {
    // Validate input values and set to state
    const setTypeOne = (e) => {
      if (e.target.value <= 0) {
        this.setState({
          alertInOne: 'Invalid Students Number for ClassType 1:1',
          studentInTypeOne: null,
          batchNumbersForOne: 0,
        })
      } else {
        this.setState({
          alertInOne: '',
          studentInTypeOne: (this.state.studentInTypeOne = e.target.value),
          batchNumbersForOne: (this.state.batchNumbersForOne = this.state.studentInTypeOne),
        })
      }
      e.preventDefault()
    }
    const setTypeTwo = (e) => {
      if (e.target.value <= 1 || e.target.value % 2 !== 0) {
        this.setState({
          alertInTwo: 'Invalid Students Number for ClassType 1:2',
          studentInTypeTwo: null,
          batchNumbersForTwo: 0,
        })
      } else {
        this.setState({
          alertInTwo: '',
          studentInTypeTwo: (this.state.studentInTypeTwo = e.target.value),
          batchNumbersForTwo: (this.state.batchNumbersForTwo =
            this.state.studentInTypeTwo / 2),
        })
      }
      e.preventDefault()
    }
    const setTypeThree = (e) => {
      if (e.target.value <= 2 || e.target.value % 3 !== 0) {
        this.setState({
          alertInThree: 'Invalid Students Number for ClassType 1:3',
          studentInTypeThree: null,
          batchNumbersForThree: 0,
        })
      } else {
        this.setState({
          alertInThree: '',
          studentInTypeThree: (this.state.studentInTypeThree = e.target.value),
          batchNumbersForThree: (this.state.batchNumbersForThree =
            this.state.studentInTypeThree / 3),
        })
      }
      e.preventDefault()
    }

    // Get the Number of students
    const studentInOne = parseFloat(this.state.batchNumbersForOne)
    const studentInTwo = parseFloat(this.state.batchNumbersForTwo * 2)
    const studentInThree = parseFloat(this.state.batchNumbersForThree * 3)
    const totalStudents = studentInOne + studentInTwo + studentInThree
    // Find amount for every Batch
    const amountForOneToOne =
      this.props.topicsMeta.count *
        get(this.props.mentorPricings, '[0].sessionPrice.amount', 0) +
      get(this.props.mentorPricings, '[0].bonusAmount.amount', 0)
    const amountForOneToTwo =
      this.props.topicsMeta.count *
        get(this.props.mentorPricings, '[1].sessionPrice.amount', 0) +
      get(this.props.mentorPricings, '[1].bonusAmount.amount', 0)
    const amountForOneToThree =
      this.props.topicsMeta.count *
        get(this.props.mentorPricings, '[2].sessionPrice.amount', 0) +
      get(this.props.mentorPricings, '[2].bonusAmount.amount', 0)
    // Find the total amount for every Batch
    const totalForOneToOne = this.state.batchNumbersForOne * amountForOneToOne
    const totalForOneToTwo = this.state.batchNumbersForTwo * amountForOneToTwo
    const totalForOneToThree =
      this.state.batchNumbersForThree * amountForOneToThree
    const grandTotal = totalForOneToOne + totalForOneToTwo + totalForOneToThree
    // Render the UI
    return (
      <div style={{ width: '30%', position: 'relative' }}>
        <h1 style={{ textAlign: 'left' }}>Calculator</h1>
        <p
          style={{
            textAlign: 'left',
            color: '#4ab6e7',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '5px',
          }}
        >
          What do your earning Looks like with{' '}
          <span style={{ color: '#0360d4fc', fontSize: '18px' }}>
            {totalStudents}
          </span>{' '}
          students:
        </p>
        {this.state.alertInOne !== '' && (
          <strong style={{ color: '#fb385d' }}>
            {this.state.alertInOne}
            <br />
          </strong>
        )}

        {this.state.alertInTwo !== '' && (
          <strong style={{ color: '#E12426' }}>
            {this.state.alertInTwo} <br />
          </strong>
        )}

        {this.state.alertInThree !== '' && (
          <strong style={{ color: '#FF9C00' }}>
            {this.state.alertInThree}
            <br />
          </strong>
        )}
        <div className='calculator-div'>
          <table style={{ width: 'auto' }}>
            <tr>
              <th>Paid ClassType</th>
              <td>1:1</td>
              <td>1:2</td>
              <td>1:3</td>
            </tr>
            <tr>
              <th>Students</th>
              <td>
                <form action=''>
                  <input
                    type='number'
                    onChange={setTypeOne}
                    style={{ width: '75%' }}
                    value={this.state.studentInTypeOne}
                  />
                </form>
              </td>
              <td>
                <form action=''>
                  <input
                    type='number'
                    onChange={setTypeTwo}
                    style={{ width: '75%' }}
                    value={this.state.studentInTypeTwo}
                  />
                </form>
              </td>
              <td>
                <form action=''>
                  <input
                    type='number'
                    onChange={setTypeThree}
                    style={{ width: '75%' }}
                    value={this.state.studentInTypeThree}
                  />
                </form>
              </td>
            </tr>
            <tr>
              <th>Batches</th>
              <td>{this.state.batchNumbersForOne}</td>
              <td>{this.state.batchNumbersForTwo}</td>
              <td>{this.state.batchNumbersForThree}</td>
            </tr>
            <tr>
              <th>Amount Per Student</th>
              <td>{amountForOneToOne}</td>
              <td>{amountForOneToTwo}</td>
              <td>{amountForOneToThree}</td>
            </tr>
            <tr>
              <th> = </th>
              <td>=</td>
              <td>=</td>
              <td>=</td>
            </tr>
            <tr>
              <th> Total Amount</th>
              <td>{totalForOneToOne}</td>
              <td>{totalForOneToTwo}</td>
              <td>{totalForOneToThree}</td>
            </tr>
          </table>
          <hr />
          <h3 style={{ textAlign: 'Center' }}>Calculated Earning is:</h3>
          <h1 style={{ textAlign: 'Center' }}>&#8377; {grandTotal}</h1>
        </div>
      </div>
    )
  }
}

export default Calculator
