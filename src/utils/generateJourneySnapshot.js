/* eslint-disable no-console */
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { get } from 'lodash'
import {
  GILROY_EXTRA_BOLD_FONT_URL, JOURNEY_SNAPSHOT_URL_1,
  JOURNEY_SNAPSHOT_URL_2, NUNITO_BOLD_FONT_URL,
} from '../constants/courseCompletion'

// const capitalize = (str, lower = false) =>
//   (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
//     match.toUpperCase()
//   )

const dataURItoBlob = (dataURI) => {
  const byteString = window.atob(dataURI)
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const int8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < byteString.length; i += 1) {
    int8Array[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([int8Array], { type: 'application/pdf' })
  return blob
}

const generateJourneySnapshot = async (
  templatetoFetch, data, userSavedCodes,
  userApprovedCodes, userPqCount, avatarCode) => {
  let shoutouts = 0
  userApprovedCodes.forEach((code) => {
    shoutouts += get(code, 'totalReactionCount')
  })
  const user = get(data, 'user', {})
  const userName = get(user, 'name')
  const courseName = get(data, 'course.title')
  const avatarCodeUrl = `https://tekie-backend.s3.amazonaws.com/python/email/${avatarCode}.png`
  console.log('avatarCodeUrl', avatarCodeUrl)
  console.log('shoutouts', shoutouts)
  if (courseName && userName) {
    try {
      const existingPdfBytes = (templatetoFetch === 'JourneySnapshot-1') ?
        await fetch(JOURNEY_SNAPSHOT_URL_1).then((res) => res.arrayBuffer()) :
        await fetch(JOURNEY_SNAPSHOT_URL_2).then((res) => res.arrayBuffer())
      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      pdfDoc.registerFontkit(fontkit)
      // get font
      const NunitoBoldfontBytes = await fetch(NUNITO_BOLD_FONT_URL).then((res) =>
        res.arrayBuffer()
      )

      const GilroyExtraBoldfontBytes = await fetch(GILROY_EXTRA_BOLD_FONT_URL).then((res) =>
        res.arrayBuffer()
      )
      // Embed our custom font in the document
      const GilroyExtraBoldFont = await pdfDoc.embedFont(GilroyExtraBoldfontBytes)
      const NunitoBoldFont = await pdfDoc.embedFont(NunitoBoldfontBytes)

      // Get the first page of the document
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      if (templatetoFetch === 'JourneySnapshot-1') {
        // TODO : change the positions here
        // Draw a string of text diagonally across the first page
        await firstPage.drawText(`${userSavedCodes && userSavedCodes.length}`, {
          x: 85,
          y: 1240,
          size: 224,
          font: GilroyExtraBoldFont,
          color: rgb(0.827, 0.294, 0.341),
        })

        // Draw a string of text diagonally across the first page
        await firstPage.drawText(`${userPqCount}`, {
          x: 1180,
          y: 2040,
          size: 224,
          font: GilroyExtraBoldFont,
          color: rgb(0.729, 0.219, 0.51),
        })

        // Draw a string of text diagonally across the first page
        await firstPage.drawText(`# ${userName.split(' ')[0]}'s Python Wrap`, {
          x: 300,
          y: 5000,
          size: 60,
          font: NunitoBoldFont,
          color: rgb(0.208, 0.894, 0.914),
        })
      } else {
        // Draw a string of text diagonally across the first page
        await firstPage.drawText(`${userSavedCodes && userSavedCodes.length}`, {
          x: 85,
          y: 1240,
          size: 224,
          font: GilroyExtraBoldFont,
          color: rgb(0.827, 0.294, 0.341),
        })

        // Draw a string of text diagonally across the first page
        await firstPage.drawText(`${userPqCount}`, {
          x: 1180,
          y: 2040,
          size: 224,
          font: GilroyExtraBoldFont,
          color: rgb(0.729, 0.219, 0.51),
        })

        // Draw a string of text diagonally across the first page
        await firstPage.drawText(`# ${userName.split(' ')[0]}'s Python Wrap`, {
          x: 300,
          y: 5000,
          size: 60,
          font: NunitoBoldFont,
          color: rgb(0.208, 0.894, 0.914),
        })
      }

      /** PDF Meta Details */
      pdfDoc.setAuthor('Tekie')
      pdfDoc.setCreator('Kiwhode Learning Pvt Ltd')
      pdfDoc.setSubject('Course Completion Certificate')
      pdfDoc.setTitle(courseName)
      pdfDoc.setProducer('Tekie.in')
      /**
       * Serialize the PDFDocument to bytes (a Uint8Array)
       * const pdfBytes = await pdfDoc.save();
       * */
      const pdfBase64 = await pdfDoc.saveAsBase64()
      const blob = dataURItoBlob(pdfBase64)
      const url = URL.createObjectURL(blob)
      // to open the PDF in a new window
      // window.open(url, '_blank')
      return url
    } catch (e) {
      console.log('PDF GENERATION EXCEPTION => ', e)
    }
  }
  return null
}

export default generateJourneySnapshot
