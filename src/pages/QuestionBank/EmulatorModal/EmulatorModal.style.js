import styled from 'styled-components'

const Emulator = styled.div`
   height: 670px;
   width: 360px;
   background-color: #ffffff;
   border-style: solid;
   border-width: 1px;
   border-radius: 16px;
   margin: 0 10px 0 10px;
   position: relative;
`
const Outline = styled.div`
   display: flex;
   flex-direction: row;
`

const Header = styled.div`
    height: 104px;
    width: 360px;
`

const Body = styled.div`
    height: 424px;
    width: 360px;
`

const Footer = styled.div`
    height: 112px;
    width: 360px;
    position: absolute;
`

Emulator.Outline = Outline
Emulator.Header = Header
Emulator.Footer = Footer
Emulator.Body = Body

export default Emulator
