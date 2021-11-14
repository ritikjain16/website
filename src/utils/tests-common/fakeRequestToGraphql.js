export const errorMessage = 'Error Message'

const fakeRequestToGraphql = mockData => requestResult => async () => {
  const requestPassResponse = {
    data: {
      ...mockData
    }
  }

  const requestFailNoDataResponse = {
    data: {
      [Object.keys(mockData)[0]]: {}
    }
  }

  const requestFailWithMessageResponse = {
    errors: [
      { message: errorMessage }
    ]
  }

  const requestFailWithoutMessageResponse = {}

  switch (requestResult) {
    case 'PASS':
      return requestPassResponse
    case 'FAIL_NO_DATA':
      return requestFailNoDataResponse
    case 'FAIL_WITH_MESSAGE':
      throw requestFailWithMessageResponse
    case 'FAIL_WITHOUT_MESSAGE':
      throw requestFailWithoutMessageResponse
    default:
      return {}
  }
}

export default fakeRequestToGraphql
