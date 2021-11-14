import { lighten, darken } from 'polished'
import colors from '../../constants/colors'

const antdButtonColor = color => {
  const buttonColor = color || colors.conceptCardsTable.addConceptBtnShadow
  const buttonHoverColor = lighten(0.1, buttonColor)
  const buttonActiveColor = darken(0.1, buttonColor)
  return `
    border-color: ${buttonColor};
    background-color: ${buttonColor};
    box-shadow: 0 2px 0 0 ${buttonColor};
    &:hover {
      border-color: ${buttonHoverColor};
      background-color: ${buttonHoverColor};
      box-shadow: 0 2px 0 0 ${buttonHoverColor};
    }
    &:active, &:focus {
      border-color: ${buttonActiveColor};
      background-color: ${buttonActiveColor};
      box-shadow: 0 2px 0 0 ${buttonActiveColor};
    }
  `
}

export default antdButtonColor
