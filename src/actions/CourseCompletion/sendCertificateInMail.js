import gql from 'graphql-tag'
import duck from '../../duck'

const sendCertificateInMail = async (userId) =>
  duck.query({
    query: gql`
      mutation{
        sendCertificateInMail(input:
        {userId: "${userId}"}){
        result
        error
      }
      }
    `,
    type: 'sendCertificateInMail/update',
    key: 'sendCertificateInMail',
  })

export default sendCertificateInMail
