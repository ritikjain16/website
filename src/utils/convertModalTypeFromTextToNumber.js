import { oneToOne, oneToTwo, oneToThree, oneToFour, oneToFive, oneToSix, oneToSeven, oneToEight, oneToNine, oneToTen, oneToEleven, oneToTwelve, oneToThirty } from '../constants/modelType'

const convertModelTypeFromTextToNumber = (text) => {
  switch (text) {
    case oneToOne:
      return '1:1 '
    case oneToTwo:
      return '1:2'
    case oneToThree:
      return '1:3 '
    case oneToFour:
      return '1:4'
    case oneToFive:
      return '1:5 '
    case oneToSix:
      return '1:6'
    case oneToSeven:
      return '1:7'
    case oneToEight:
      return '1:8'
    case oneToNine:
      return '1:9'
    case oneToTen:
      return '1:10'
    case oneToEleven:
      return '1:11 '
    case oneToTwelve:
      return '1:12'
    case oneToThirty:
      return '1:30'
    default:
      break
  }
}


export default convertModelTypeFromTextToNumber
