import styled from 'styled-components'

const UmsDashboardStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`
const boxDivision = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 12px 0;
`

const Box = styled.div`
    margin: 0px;
    padding: 0px;
`

const Options = styled.button`
    height: 26px;
    border-radius: 18px;
    border: solid 1px #4c4c4c;
    text-align: center;
    line-height: 1;
    text-transform: capitalize;
    font-size: 12px;
    font-weight: 100;
    -webkit-transition: all .4s ease;
    transition: all .4s ease;
    margin: 5px;
    min-width: 45px;
    padding: 0 10px;
    &:hover {
        box-shadow: 5px 9px 13px #9fa2a445;
    }
`

const redOptions = styled(Options)`
    background-color: #f8cccc;
    border-color: #de2b20;
    color: #4a4a4a;
    margin: 8px 5px;
    opacity: 0.6;
`

const yellowOptions = styled(Options)`
    background-color: #f8e7cc;
    border-color: #deb720;
    color: #4a4a4a;
    margin: 8px 5px;
`

const OutlinedOptions = styled.button`
    height: 26px;
    border-radius: 28px;
    text-align: center;
    line-height: 1;
    text-transform: capitalize;
    font-size: 12px;
    font-weight: 100;
    -webkit-transition: all .4s ease;
    transition: all .4s ease;
    min-width: 50px;
    margin: 0 0px 0 10px;
    background-color: #efefef;
    display: inline-block;
    border: 1px solid;
    &:hover {
        background-color: #4c4c4c59 !important;
        color: #fff !important;
        box-shadow: 0px 3px 5px #00000057;
    }
`

const hl = styled.div`
    border-bottom: 1px solid rgb(232, 232, 232);
    margin: 24px 0;
`

const errMsg = styled.p`
    color: red;
    margin: 0;
`

const PrevBtn = styled.button`
    position: absolute;
    left: 0;
    color: #bbbbbb;
    background: #f7f8fc;
    top: 50vh;
    transform: translateY(-50%) translateX(-120%);
    z-index: 1111;
    width: 70px;
    height: 70px;
    border-radius: 36%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    font-size: 40px;
    cursor: pointer;
    border: 0;
    box-shadow: 8px 10px 20px 0 rgba(46,61,73,.15);
    transition: all 0.3s ease;
    &:hover{
        box-shadow: 2px 4px 8px 0 rgba(46,61,73,.2);
        background: #bbbbbb;
        color: #f7f8fc;
    }
    &:focus{
        outline: 0;
        border: 0;
    }
`

const NextBtn = styled(PrevBtn)`
    left: auto;
    right: 0;
    transform: translateY(-50%) translateX(120%);
`

const FlexBox = styled.div`
    display: flex;
    justify-contents: space-between
`

UmsDashboardStyle.Box = Box
UmsDashboardStyle.boxDivision = boxDivision
UmsDashboardStyle.Options = Options
UmsDashboardStyle.redOptions = redOptions
UmsDashboardStyle.yellowOptions = yellowOptions
UmsDashboardStyle.OutlinedOptions = OutlinedOptions
UmsDashboardStyle.hl = hl
UmsDashboardStyle.errMsg = errMsg
UmsDashboardStyle.PrevBtn = PrevBtn
UmsDashboardStyle.NextBtn = NextBtn
UmsDashboardStyle.FlexBox = FlexBox

export default UmsDashboardStyle
