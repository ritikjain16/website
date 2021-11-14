import * as React from 'react'

const getViewBox = name => {
    switch (name) {
        case 'session':
            return '0 0 36 38'
        default:
            return '0 0 32 32'
    }
};

const getPath = (name) => {
    switch (name) {
        case 'profile':
            return (
                <path id='profile' d="M.668,19.642A.669.669,0,0,1,0,18.973V12.206A3.346,3.346,0,0,1,3.343,8.863H7.436a3.346,3.346,0,0,1,3.343,3.343v6.768a.668.668,0,0,1-.668.668ZM3.425,7.526a4.011,4.011,0,1,1,1.964.514A4.023,4.023,0,0,1,3.425,7.526Z" fill="rgb(134 197 255)"/>
            )
        case 'session':
          return (
            <path id='session' d="M-11525.591-1872.622a.716.716,0,0,1-.715-.715v-7.239a3.578,3.578,0,0,1,3.574-3.574h4.377a3.579,3.579,0,0,1,3.577,3.574v7.239a.716.716,0,0,1-.715.715Zm-5.189,0a2.147,2.147,0,0,1-2.145-2.145v-3.945a3.579,3.579,0,0,1,3.574-3.575h1.916a5.016,5.016,0,0,0-.3,1.711v7.239a2.156,2.156,0,0,0,.121.715Zm-.526-13.783a3.218,3.218,0,0,1,3.215-3.216,3.22,3.22,0,0,1,3.216,3.216,3.212,3.212,0,0,1-.379,1.511,3.251,3.251,0,0,1-1.571,1.444,3.235,3.235,0,0,1-1.266.26A3.22,3.22,0,0,1-11531.307-1886.405Zm8.662.825a4.3,4.3,0,0,1-2.2-3.748,4.3,4.3,0,0,1,4.3-4.3,4.3,4.3,0,0,1,4.3,4.3,4.3,4.3,0,0,1-2.2,3.748,4.273,4.273,0,0,1-2.1.55A4.27,4.27,0,0,1-11522.645-1885.58Z" transform="translate(11532.925 1893.627)" fill="rgb(134 197 255)"/>
          )
        default:
            return <path />
    }
};

const SVGIcon = ({
         name = '',
         style = {},
         viewBox = '',
         width = '100%',
         className = '',
         height = '100%'
     }) => (
    <svg
        width={width}
        style={style}
        height={height}
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={viewBox || getViewBox(name)}
        xmlnsXlink='http://www.w3.org/1999/xlink'
    >
        {getPath(name)}
    </svg>
);

export default SVGIcon
