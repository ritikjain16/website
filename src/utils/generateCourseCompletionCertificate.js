/* eslint-disable no-console */
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { get } from 'lodash'
import { COURSE_CERTIFICATE_URL, NUNITO_REGULAR_FONT_URL, NUNITO_BOLD_FONT_URL } from '../constants/courseCompletion'


const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  )

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
const masteryLevelCoordinates = {
  MASTER: {
    x: 812,
    y: 341,
  },
  PROFICIENT: {
    x: 800,
    y: 341,
  },
  FAMILIAR: {
    x: 808,
    y: 341,
  },
}
const generateCourseCompletionCertificate = async (downloadBtnID,
  lastSessionDate = null,
  proficiencyLevel,
  data,
  nameEntered) => {
  const user = get(data, 'user', {})
  const userName = !nameEntered.trim() ? get(user, 'name') : nameEntered
  const sessionDate = lastSessionDate
  const courseName = get(data, 'course.title')
  const masteryLevel = proficiencyLevel

  if (courseName && userName && sessionDate && masteryLevel) {
    try {
      const existingPdfBytes = await fetch(COURSE_CERTIFICATE_URL).then((res) => res.arrayBuffer())

      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      pdfDoc.registerFontkit(fontkit)

      // get font
      const NunitorRegularfontBytes = await fetch(NUNITO_REGULAR_FONT_URL).then((res) =>
        res.arrayBuffer()
      )
      const NunitorBoldfontBytes = await fetch(NUNITO_BOLD_FONT_URL).then((res) =>
        res.arrayBuffer()
      )

      // Embed our custom font in the document
      const NunitoRegularFont = await pdfDoc.embedFont(NunitorRegularfontBytes)
      const NunitoBoldFont = await pdfDoc.embedFont(NunitorBoldfontBytes)

      // Get the first page of the document
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]
      // Draw a string of text diagonally across the first page
      await firstPage.drawText(capitalize(userName), {
        x: 296,
        y: 579,
        size: 26,
        font: NunitoRegularFont,
        color: rgb(0.30, 0.30, 0.30),
      })
      await firstPage.drawText(courseName, {
        x: 97,
        y: 518,
        size: 26,
        font: NunitoBoldFont,
        color: rgb(0.24, 0.751, 0.900),
      })
      await firstPage.drawText(sessionDate, {
        x: 306,
        y: 489,
        size: 21,
        font: NunitoBoldFont,
        color: rgb(0.30, 0.30, 0.30),
      })
      await firstPage.drawText(masteryLevel, {
        ...masteryLevelCoordinates[masteryLevel],
        size: 15,
        font: NunitoBoldFont,
        color: rgb(1, 1, 1),
      })

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

export default generateCourseCompletionCertificate
