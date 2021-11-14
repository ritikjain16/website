import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'

const FETCH_BANNERS = (filterQuery, perPage, skip) => gql`
query {
  banners(filter: { and: [${!filterQuery ? '' : filterQuery}] }
    first: ${perPage}
    skip: ${perPage * skip}
  ) {
    id
    backgroundImage {
      id
      uri
      name
    }
    textBeforeDiscount
    textAfterDiscount
    textAfterDiscountColor
    textAfterDiscountFontSize
    width
    height
    lottieFile {
      id
      uri
      name
    }
    expiryDate
    textBeforeDiscountFontSize
    textBeforeDiscountColor
    type
    discount
    discountFontSize
    discountColor
    discountBackground
    disclaimerText
    disclaimerTextColor
    disclaimerTextFontSize
    inceptionDate
    type
    title
    description
    status
  }
  bannersMeta(filter: { and: [${!filterQuery ? '' : filterQuery}] }) {
    count
  }
}
`
const fetchBanners = async (filterQuery, perPage, skip) =>
  duck.query({
    query: FETCH_BANNERS(filterQuery, perPage, skip),
    type: 'banners/fetch',
    key: 'banners',
    changeExtractedData: (extractedData, originalData) => {
      const datas = []
      if (originalData && originalData.banners && originalData.banners.length > 0) {
        originalData.banners.forEach((data, index) => {
          datas.push({
            srNo: index + 1,
            backgroundImg: get(data, 'backgroundImage.uri', '-'),
            lotieFile: get(data, 'lottieFile.name', '-'),
            expiry: moment(data.expiryDate).format('DD-MM-YYYY'),
            inception: moment(data.inceptionDate).format('DD-MM-YYYY'),
            ...data
          })
        })
        return { ...extractedData, banners: datas }
      }
      return { ...extractedData, banners: [] }
    },
  })

export default fetchBanners
