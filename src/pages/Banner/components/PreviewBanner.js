import { Player } from '@lottiefiles/react-lottie-player'
import { get } from 'lodash'
import React from 'react'
import getFullPath from '../../../utils/getFullPath'
import BannerStyle from '../Banner.style'

const PreviewBanner = (props) => {
  const { data } = props
  const { backgroundImage, height, width, lottieFile,
    textBeforeDiscountColor, textBeforeDiscountFontSize,
    textBeforeDiscount, discountColor, discountFontSize,
    discountBackground, discount, textAfterDiscount,
    textAfterDiscountColor, textAfterDiscountFontSize,
    disclaimerText, disclaimerTextColor,
    disclaimerTextFontSize
  } = data
  return (
    <BannerStyle.LivePreview
      style={{
        backgroundImage: `url(${getFullPath(get(backgroundImage, 'uri'))})`,
        height: `${height}px`,
        width: `${width ? `${width}px` : '100%'}`
      }}
    >
      <Player
        autoplay
        loop
        src={getFullPath(get(lottieFile, 'uri'))}
      />
      <span style={{ zIndex: '10', position: 'unset' }} >
        <h4
          className='landing-page-header-bannerText'
          style={{
            color: textBeforeDiscountColor,
            fontSize: `${textBeforeDiscountFontSize}px`
          }}
        >
          {textBeforeDiscount}
        </h4>
        <h2
          className='landing-page-header-gradientText'
          style={{
            color: discountColor,
            fontSize: `${discountFontSize}px`,
            backgroundImage: `${discountBackground}`,
          }}
        >{discount}
        </h2>
        <h4
          className='landing-page-header-bannerText'
          style={{
            color: textAfterDiscountColor,
            fontSize: `${textAfterDiscountFontSize}px`
          }}
        >
          {textAfterDiscount}
        </h4>
      </span>
      <h5 className='landing-page-header-limitedText'
        style={{
          color: disclaimerTextColor || 'white',
          fontSize: `${disclaimerTextFontSize}px`
        }}
      >{disclaimerText}
      </h5>
    </BannerStyle.LivePreview>
  )
}

export default PreviewBanner
