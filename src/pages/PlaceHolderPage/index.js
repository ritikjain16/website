import React from 'react'
import PropTypes from 'prop-types'
import withNav from '../../components/withNav'

/**
 * This page is not supposed to use permanently
 * It is created temporarily to keep the app flow intact.
 * As pages will be added, this wil be deleted
 * @param {Object} props
 * @returns { React.ReactElement }
 */
const PlaceHolderPage = props => (
  <div>
    <h1>{props.title}</h1>
    <h1>{props.title}</h1>
    <h2>{props.title}</h2>
    <h2>{props.title}</h2>
    <h3>{props.title}</h3>
    <h3>{props.title}</h3>
    <h4>{props.title}</h4>
    <h4>{props.title}</h4>
    <h5>{props.title}</h5>
    <h5>{props.title}</h5>
    <h6>{props.title}</h6>
    <h6>{props.title}</h6>
    <h1>{props.title}</h1>
    <h1>{props.title}</h1>
    <h2>{props.title}</h2>
    <h2>{props.title}</h2>
    <h3>{props.title}</h3>
    <h3>{props.title}</h3>
    <h4>{props.title}</h4>
    <h4>{props.title}</h4>
    <h5>{props.title}</h5>
    <h5>{props.title}</h5>
    <h6>{props.title}</h6>
    <h6>{props.title}</h6>
    <h1>{props.title}</h1>
    <h1>{props.title}</h1>
    <h2>{props.title}</h2>
    <h2>{props.title}</h2>
    <h3>{props.title}</h3>
    <h3>{props.title}</h3>
    <h4>{props.title}</h4>
    <h4>{props.title}</h4>
    <h5>{props.title}</h5>
    <h5>{props.title}</h5>
    <h6>{props.title}</h6>
    <h6>{props.title}</h6>
    <h1>{props.title}</h1>
    <h1>{props.title}</h1>
    <h2>{props.title}</h2>
    <h2>{props.title}</h2>
    <h3>{props.title}</h3>
    <h3>{props.title}</h3>
    <h4>{props.title}</h4>
    <h4>{props.title}</h4>
    <h5>{props.title}</h5>
    <h5>{props.title}</h5>
    <h6>{props.title}</h6>
    <h6>{props.title}</h6>
    <h1>{props.title}</h1>
    <h1>{props.title}</h1>
    <h2>{props.title}</h2>
    <h2>{props.title}</h2>
    <h3>{props.title}</h3>
    <h3>{props.title}</h3>
    <h4>{props.title}</h4>
    <h4>{props.title}</h4>
    <h5>{props.title}</h5>
    <h5>{props.title}</h5>
    <h6>{props.title}</h6>
    <h6>{props.title}</h6>
  </div>
)

PlaceHolderPage.propTypes = {
  title: PropTypes.string.isRequired
}

/**
 * exports a function which takes args and returns
 * a component wrapped with witNav
 */
export default withNavArgs => {
  const NewComponent = () => <PlaceHolderPage title={withNavArgs.title} />
  return withNav(NewComponent)(withNavArgs)
}
