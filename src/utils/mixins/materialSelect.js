import { css } from 'styled-components'
import colors from '../../constants/colors'

const materialSelect = () => css`
  &&& {
    .ant-select-selection--single {
      /* resets input style */
      border: 0;
      outline: 0;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      /* resets input style */

      border-bottom: 2px solid ${colors.input.theme};
      &:focus{
          border-right-width: 0px;
      }
      &:hover{
        border-right-width: 0px;
      }
      .ant-select-selection__rendered {
        margin: 0;
      }
    }
  }
`
/** styling for multiple select antd */
export const materialSelectMultiple = () => css`
  &&&{
    .ant-select-selection--multiple{
      border:0;
      border-bottom: 2px solid ${colors.input.theme};
      border-radius:0px;
    }
  }
`
export default materialSelect
