import { css } from 'styled-components'
import colors from '../../constants/colors'

const materialInput = () => css`
  &&& {
    /* resets input style */
    border: 0;
    outline: 0;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    /* resets input style */

    border-bottom: 2px solid ${colors.input.theme};
    padding-bottom: 8px;
    font-weight: 500;
    &::placeholder {
      color: ${colors.input.theme};
    }

    &:focus {
      border-bottom-color: ${colors.themeColor};
      color: ${colors.themeColor};
      box-shadow: none;
      &::placeholder {
        color: ${colors.themeColor};
      }
    }
  }
`

export default materialInput
