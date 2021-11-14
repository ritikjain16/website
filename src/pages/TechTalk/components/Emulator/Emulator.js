/* eslint-disable */
import React from 'react'
import FullScreenOverlay from '../FullScreenOverlay'
import Main from './Emulator.style'
import Device from '../Device'

const Emulator = props => {
  const [isFullScreenMode, setIsFullScreenMode] = React.useState(false)

  return (
    <div style={{ height: '100%' }} >
      <Main>
        <Main.Phone>
          <Device />
        </Main.Phone>
        <Main.FullScreenIcon onClick={() => setIsFullScreenMode(true)}>
          <Main.Icon type='arrows-alt' />
        </Main.FullScreenIcon>
      </Main>
      {/* <FullScreenOverlay
        {...props}
        isFullScreenMode={isFullScreenMode}
        exit={() => setIsFullScreenMode(false)}
      /> */}
    </div>
  )
}

export default Emulator
