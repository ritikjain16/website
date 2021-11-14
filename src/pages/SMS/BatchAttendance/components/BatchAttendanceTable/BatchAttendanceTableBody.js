/* eslint-disable max-len */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon, Button, Tooltip, Popconfirm } from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import { Table } from '../../../../../components/StyledComponents'
import BatchAttendanceTableRow from './BatchAttendanceTableRow'
import MainTable from '../../../../../components/MainTable'
import updateBatchSession from '../../../../../actions/batchAttendance/updateAbsentReason'
import { SMS, MENTOR } from '../../../../../constants/roles'
import attendanceStatus from '../../../../../constants/attendanceStatus'
import getDataFromLocalStorage from '../../../../../utils/extract-from-localStorage'

const CalendarSvg = () => (
  <svg id='Capa_1' enableBackground='new 0 0 512 512' height='1em' viewBox='0 0 512 512' width='1em' xmlns='http://www.w3.org/2000/svg'>
    <g>
      <path d='m391.017 251.454h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-.357 145h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-102.273-45h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-168.475 170.546h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643zm-.357 50h-35v-35h35zm.357-235.546h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.075-6.569-14.643-14.643-14.643zm-.357 50h-35v-35h35zm168.475 107.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm159.365-259.953h-32.066v-11.467c0-12.576-10.231-22.807-22.807-22.807h-3.444c-12.575 0-22.806 10.231-22.806 22.807v11.467h-223.4v-11.467c0-12.576-10.231-22.807-22.807-22.807h-3.444c-12.576 0-22.807 10.231-22.807 22.807v11.467h-32.065c-20.705 0-37.55 16.845-37.55 37.55v402.676c0 20.678 16.822 37.5 37.5 37.5h385.748c20.678 0 37.5-16.822 37.5-37.5v-402.676c-.001-20.705-16.846-37.55-37.552-37.55zm-66.123-11.467c0-4.305 3.502-7.807 7.807-7.807h3.444c4.305 0 7.807 3.502 7.807 7.807v11.467h-19.058zm-272.457 0c0-4.305 3.502-7.807 7.807-7.807h3.444c4.305 0 7.807 3.502 7.807 7.807v11.467h-19.057v-11.467zm361.131 451.693c0 12.407-10.093 22.5-22.5 22.5h-385.748c-12.407 0-22.5-10.093-22.5-22.5v-.047c6.284 4.735 14.095 7.547 22.551 7.547h304.083c10.03 0 19.46-3.906 26.552-10.999l77.562-77.562zm-85.215-17.059c.588-2.427.908-4.958.908-7.563v-50.064c0-9.44 7.681-17.121 17.122-17.121h50.063c2.605 0 5.136-.32 7.563-.908zm85.215-315.987h-319.574c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5h319.574v194.118c0 9.441-7.681 17.122-17.122 17.122h-50.063c-17.712 0-32.122 14.41-32.122 32.121v50.064c0 9.441-7.681 17.122-17.121 17.122h-291.769c-12.434 0-22.55-10.116-22.55-22.551v-287.996h81.173c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5h-81.174v-69.63c0-12.434 10.116-22.55 22.55-22.55h32.066v22.052c0 12.576 10.231 22.807 22.807 22.807 4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5c-4.305 0-7.807-3.502-7.807-7.807v-22.052h257.458v22.052c0 12.576 10.231 22.807 22.807 22.807 4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5c-4.305 0-7.807-3.502-7.807-7.807v-22.052h66.124c12.434 0 22.55 10.116 22.55 22.55zm-350.391 137.773h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.075-6.569-14.643-14.643-14.643zm-.357 50h-35v-35h35zm66.559-77.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm101.907 220.546c-.186-3.977-3.469-7.143-7.492-7.143-4.142 0-7.5 3.358-7.5 7.5 0 8.074 6.569 14.643 14.643 14.643h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v10.3c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5v-9.943h35v35zm-102.264-77.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35zm-.357 142.773h35.714c8.074 0 14.643-6.569 14.643-14.643v-35.714c0-8.074-6.569-14.643-14.643-14.643h-35.714c-8.074 0-14.643 6.569-14.643 14.643v35.714c0 8.074 6.569 14.643 14.643 14.643zm.357-50h35v35h-35z' fill='#fff' />
    </g>
  </svg>
)
const BatchMappingSvg = () => (
  <svg width='1em' height='1em' viewBox='0 0 512 512' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='86' cy='355' r='32' fill='#E6F7FF' />
    <circle cx='258' cy='355' r='32' fill='#E6F7FF' />
    <circle cx='430' cy='355' r='32' fill='#E6F7FF' />
    <rect x='58' y='23' width='383' height='254' fill='#E6F7FF' />
    <path d='M334.701 36.8085H296.509C294.674 36.8085 292.914 36.0796 291.616 34.782C290.319 33.4845 289.59 31.7246 289.59 29.8896C289.59 28.0546 290.319 26.2948 291.616 24.9972C292.914 23.6997 294.674 22.9707 296.509 22.9707H334.701C336.536 22.9707 338.296 23.6997 339.594 24.9972C340.891 26.2948 341.62 28.0546 341.62 29.8896C341.62 31.7246 340.891 33.4845 339.594 34.782C338.296 36.0796 336.536 36.8085 334.701 36.8085Z' fill='#87C5F9' />
    <path d='M446.756 277.033H65.247C63.412 277.033 61.6522 276.304 60.3546 275.007C59.0571 273.709 58.3281 271.95 58.3281 270.115V29.8896C58.3281 28.0546 59.0571 26.2948 60.3546 24.9972C61.6522 23.6997 63.412 22.9707 65.247 22.9707H181.762C183.597 22.9707 185.357 23.6997 186.654 24.9972C187.952 26.2948 188.681 28.0546 188.681 29.8896C188.681 31.7246 187.952 33.4845 186.654 34.782C185.357 36.0796 183.597 36.8085 181.762 36.8085H72.166V263.196H439.837V36.8085H371.755C369.92 36.8085 368.16 36.0796 366.863 34.782C365.565 33.4845 364.836 31.7246 364.836 29.8896C364.836 28.0546 365.565 26.2948 366.863 24.9972C368.16 23.6997 369.92 22.9707 371.755 22.9707H446.756C448.591 22.9707 450.351 23.6997 451.649 24.9972C452.946 26.2948 453.675 28.0546 453.675 29.8896V270.115C453.675 271.95 452.946 273.709 451.649 275.007C450.351 276.304 448.591 277.033 446.756 277.033Z' fill='#87C5F9' />
    <path d='M255.999 36.8085H219.813C217.978 36.8085 216.219 36.0796 214.921 34.782C213.623 33.4845 212.895 31.7246 212.895 29.8896C212.895 28.0546 213.623 26.2948 214.921 24.9972C216.219 23.6997 217.978 22.9707 219.813 22.9707H255.999C257.834 22.9707 259.594 23.6997 260.892 24.9972C262.189 26.2948 262.918 28.0546 262.918 29.8896C262.918 31.7246 262.189 33.4845 260.892 34.782C259.594 36.0796 257.834 36.8085 255.999 36.8085Z' fill='#87C5F9' />
    <path d='M491.242 489.002H359.88C358.045 489.002 356.285 488.273 354.987 486.975C353.69 485.678 352.961 483.918 352.961 482.083V449.239C352.974 438.699 357.166 428.594 364.619 421.141C372.072 413.688 382.177 409.495 392.717 409.482H458.398C468.94 409.493 479.046 413.685 486.5 421.138C493.955 428.592 498.149 438.697 498.161 449.239V482.083C498.161 483.918 497.432 485.678 496.135 486.975C494.837 488.273 493.077 489.002 491.242 489.002ZM366.799 475.164H484.324V449.239C484.314 442.366 481.58 435.778 476.72 430.919C471.86 426.06 465.271 423.328 458.398 423.32H392.717C385.845 423.328 379.257 426.061 374.398 430.92C369.539 435.779 366.806 442.367 366.799 449.239V475.164Z' fill='#87C5F9' />
    <path d='M425.561 395.831C417.317 395.833 409.258 393.389 402.403 388.81C395.548 384.231 390.204 377.721 387.049 370.105C383.894 362.489 383.068 354.108 384.676 346.022C386.284 337.936 390.253 330.509 396.083 324.68C401.912 318.85 409.339 314.881 417.425 313.273C425.511 311.665 433.892 312.491 441.508 315.646C449.124 318.802 455.633 324.145 460.213 331C464.792 337.855 467.236 345.915 467.234 354.159C467.219 365.206 462.824 375.798 455.012 383.609C447.2 391.421 436.609 395.817 425.561 395.831V395.831ZM425.561 326.317C420.055 326.316 414.671 327.947 410.092 331.006C405.512 334.064 401.943 338.412 399.834 343.499C397.726 348.587 397.173 354.185 398.247 359.586C399.32 364.987 401.972 369.949 405.865 373.843C409.759 377.738 414.719 380.39 420.12 381.465C425.521 382.54 431.12 381.989 436.208 379.882C441.295 377.775 445.644 374.206 448.704 369.627C451.763 365.049 453.396 359.666 453.396 354.159C453.389 346.778 450.454 339.702 445.236 334.482C440.018 329.263 432.942 326.326 425.561 326.317V326.317Z' fill='#87C5F9' />
    <path d='M457.063 489.002H394.06C392.225 489.002 390.465 488.273 389.167 486.975C387.87 485.678 387.141 483.918 387.141 482.083V457.341C387.141 455.506 387.87 453.746 389.167 452.448C390.465 451.151 392.225 450.422 394.06 450.422C395.895 450.422 397.654 451.151 398.952 452.448C400.25 453.746 400.978 455.506 400.978 457.341V475.136H450.144V457.341C450.144 455.506 450.873 453.746 452.171 452.448C453.468 451.151 455.228 450.422 457.063 450.422C458.898 450.422 460.658 451.151 461.956 452.448C463.253 453.746 463.982 455.506 463.982 457.341V482.055C463.986 482.966 463.81 483.869 463.463 484.711C463.117 485.554 462.608 486.32 461.965 486.965C461.323 487.611 460.559 488.123 459.717 488.472C458.876 488.822 457.974 489.002 457.063 489.002Z' fill='#87C5F9' />
    <path d='M321.68 489.002H190.317C188.482 489.002 186.722 488.273 185.425 486.975C184.127 485.678 183.398 483.918 183.398 482.083V449.239C183.411 438.699 187.604 428.594 195.057 421.141C202.51 413.688 212.614 409.495 223.155 409.482H288.843C299.383 409.495 309.487 413.688 316.94 421.141C324.393 428.594 328.586 438.699 328.599 449.239V482.083C328.599 483.918 327.87 485.678 326.572 486.975C325.275 488.273 323.515 489.002 321.68 489.002ZM197.236 475.164H314.761V449.239C314.754 442.367 312.021 435.779 307.162 430.92C302.303 426.061 295.714 423.328 288.843 423.32H223.155C216.283 423.328 209.695 426.061 204.836 430.92C199.977 435.779 197.244 442.367 197.236 449.239V475.164Z' fill='#87C5F9' />
    <path d='M255.999 395.831C247.755 395.833 239.696 393.389 232.84 388.81C225.985 384.231 220.642 377.721 217.487 370.105C214.331 362.489 213.505 354.108 215.113 346.022C216.721 337.936 220.691 330.509 226.52 324.68C232.35 318.85 239.777 314.881 247.863 313.273C255.948 311.665 264.329 312.491 271.945 315.646C279.562 318.802 286.071 324.145 290.65 331C295.23 337.855 297.673 345.915 297.672 354.159C297.659 365.207 293.264 375.799 285.452 383.612C277.64 391.424 267.047 395.818 255.999 395.831V395.831ZM255.999 326.317C250.492 326.316 245.109 327.947 240.529 331.006C235.95 334.064 232.38 338.412 230.272 343.499C228.163 348.587 227.611 354.185 228.684 359.586C229.758 364.987 232.409 369.949 236.303 373.843C240.196 377.738 245.157 380.39 250.558 381.465C255.959 382.54 261.557 381.989 266.645 379.882C271.733 377.775 276.082 374.206 279.141 369.627C282.201 365.049 283.834 359.666 283.834 354.159C283.828 346.777 280.894 339.7 275.676 334.48C270.457 329.26 263.38 326.324 255.999 326.317V326.317Z' fill='#87C5F9' />
    <path d='M287.501 489.002H224.497C222.662 489.002 220.902 488.273 219.605 486.975C218.307 485.678 217.578 483.918 217.578 482.083V457.341C217.578 455.506 218.307 453.746 219.605 452.448C220.902 451.151 222.662 450.422 224.497 450.422C226.332 450.422 228.092 451.151 229.389 452.448C230.687 453.746 231.416 455.506 231.416 457.341V475.136H280.582V457.341C280.582 455.506 281.311 453.746 282.608 452.448C283.906 451.151 285.666 450.422 287.501 450.422C289.336 450.422 291.096 451.151 292.393 452.448C293.691 453.746 294.42 455.506 294.42 457.341V482.055C294.423 482.966 294.247 483.869 293.901 484.711C293.555 485.554 293.046 486.32 292.403 486.965C291.76 487.611 290.996 488.123 290.155 488.472C289.314 488.822 288.412 489.002 287.501 489.002Z' fill='#87C5F9' />
    <path d='M152.117 489.002H20.7549C18.9198 489.002 17.16 488.273 15.8624 486.975C14.5649 485.678 13.8359 483.918 13.8359 482.083V449.239C13.8488 438.697 18.0424 428.592 25.4968 421.138C32.9513 413.685 43.0577 409.493 53.599 409.482H119.28C129.82 409.495 139.925 413.688 147.378 421.141C154.831 428.594 159.024 438.699 159.036 449.239V482.083C159.036 483.918 158.307 485.678 157.01 486.975C155.712 488.273 153.952 489.002 152.117 489.002V489.002ZM27.6738 475.164H145.199V449.239C145.191 442.367 142.458 435.779 137.599 430.92C132.74 426.061 126.152 423.328 119.28 423.32H53.599C46.7266 423.328 40.1378 426.06 35.2776 430.919C30.4175 435.778 27.6829 442.366 27.6738 449.239V475.164Z' fill='#87C5F9' />
    <path d='M86.4374 395.831C78.1937 395.831 70.1351 393.387 63.2808 388.807C56.4264 384.226 51.0843 377.717 47.9298 370.1C44.7754 362.484 43.9504 354.103 45.5592 346.018C47.168 337.933 51.1383 330.506 56.9679 324.677C62.7976 318.849 70.2249 314.88 78.3104 313.272C86.3959 311.665 94.7765 312.491 102.392 315.647C110.008 318.803 116.517 324.146 121.096 331.001C125.675 337.856 128.118 345.915 128.117 354.159C128.104 365.208 123.709 375.801 115.895 383.614C108.081 391.427 97.4869 395.82 86.4374 395.831V395.831ZM86.4374 326.317C80.9308 326.317 75.5479 327.95 70.9694 331.009C66.3908 334.068 62.8223 338.417 60.715 343.504C58.6077 348.592 58.0564 354.19 59.1306 359.59C60.2049 364.991 62.8566 369.952 66.7503 373.846C70.6441 377.739 75.605 380.391 81.0057 381.465C86.4065 382.54 92.0046 381.988 97.092 379.881C102.179 377.774 106.528 374.205 109.587 369.627C112.646 365.048 114.279 359.665 114.279 354.159C114.274 346.776 111.339 339.698 106.118 334.478C100.898 329.258 93.8198 326.322 86.4374 326.317V326.317Z' fill='#87C5F9' />
    <path d='M117.938 489.002H54.9345C53.0995 489.002 51.3397 488.273 50.0421 486.975C48.7446 485.678 48.0156 483.918 48.0156 482.083V457.341C48.0156 455.506 48.7446 453.746 50.0421 452.448C51.3397 451.151 53.0995 450.422 54.9345 450.422C56.7696 450.422 58.5294 451.151 59.827 452.448C61.1245 453.746 61.8535 455.506 61.8535 457.341V475.136H111.019V457.341C111.019 455.506 111.748 453.746 113.046 452.448C114.343 451.151 116.103 450.422 117.938 450.422C119.773 450.422 121.533 451.151 122.831 452.448C124.128 453.746 124.857 455.506 124.857 457.341V482.055C124.861 482.966 124.685 483.869 124.338 484.711C123.992 485.554 123.483 486.32 122.84 486.965C122.198 487.611 121.434 488.123 120.592 488.472C119.751 488.822 118.849 489.002 117.938 489.002Z' fill='#87C5F9' />
    <path d='M386.704 93.3569H125.294C123.459 93.3569 121.699 92.6279 120.402 91.3304C119.104 90.0328 118.375 88.273 118.375 86.438C118.375 84.603 119.104 82.8431 120.402 81.5455C121.699 80.248 123.459 79.519 125.294 79.519H386.704C388.539 79.519 390.299 80.248 391.597 81.5455C392.894 82.8431 393.623 84.603 393.623 86.438C393.623 88.273 392.894 90.0328 391.597 91.3304C390.299 92.6279 388.539 93.3569 386.704 93.3569Z' fill='#87C5F9' />
    <path d='M386.704 156.942H125.294C123.459 156.942 121.699 156.213 120.402 154.915C119.104 153.618 118.375 151.858 118.375 150.023C118.375 148.188 119.104 146.428 120.402 145.131C121.699 143.833 123.459 143.104 125.294 143.104H386.704C388.539 143.104 390.299 143.833 391.597 145.131C392.894 146.428 393.623 148.188 393.623 150.023C393.623 151.858 392.894 153.618 391.597 154.915C390.299 156.213 388.539 156.942 386.704 156.942Z' fill='#87C5F9' />
    <path d='M386.706 220.534H241.872C240.037 220.534 238.277 219.805 236.98 218.507C235.682 217.21 234.953 215.45 234.953 213.615C234.953 211.78 235.682 210.02 236.98 208.722C238.277 207.425 240.037 206.696 241.872 206.696H386.706C388.541 206.696 390.301 207.425 391.598 208.722C392.896 210.02 393.625 211.78 393.625 213.615C393.625 215.45 392.896 217.21 391.598 218.507C390.301 219.805 388.541 220.534 386.706 220.534Z' fill='#87C5F9' />
  </svg>
)

const CalendarIcon = props => <Icon component={CalendarSvg} {...props} />

const BatchMappingIcon = props => <Icon component={BatchMappingSvg} {...props} />
class BatchAttendanceTableBody extends React.Component {
  state = {
    isButtonsDisabled: false
  }
  startSession = ({ batchSessionId, input }) => {
    updateBatchSession({ batchSessionId, input, key: SMS })
  }
  stopSession = ({ batchSessionId, input }) => {
    updateBatchSession({ batchSessionId, input, key: SMS })
  }
  markAllPresent = (batchSessionId) => {
    const isPresent = true
    const status = attendanceStatus.PRESENT
    updateBatchSession({
      batchSessionId,
      input: {
        attendance: {
          updateAll: {
            isPresent,
            status
          }
        }
      },
      key: SMS
    })
  }

  getSlotLabel = (slotNumberString, isCapital = true) => {
    const slotNumber = Number(slotNumberString)
    let AM = 'AM'
    let PM = 'PM'
    if (!isCapital) {
      AM = 'am'
      PM = 'pm'
    }
    let startTime = ''
    let endTime = ''
    if (slotNumber < 12) {
      if (slotNumber === 0) {
        startTime = `12:00 ${AM}`
      } else {
        startTime = `${slotNumber}:00 ${AM}`
      }
      if (slotNumber === 11) {
        endTime = `12:00 ${PM}`
      } else {
        endTime = `${slotNumber + 1}:00 ${AM}`
      }
    } else if (slotNumber > 12) {
      startTime = `${slotNumber - 12}:00 ${PM}`
      if (slotNumber === 23) {
        endTime = `12:00 ${AM}`
      } else {
        endTime = `${slotNumber - 11}:00 PM`
      }
    } else {
      startTime = `12:00 ${PM}`
      endTime = `1:00 ${PM}`
    }
    return {
      startTime,
      endTime
    }
  }
  getSlot = (item) => {
    for (let i = 0; i <= 23; i += 1) {
      if (item[`slot${i}`] !== null && item[`slot${i}`] === true) {
        const label = this.getSlotLabel(i)
        return label.startTime
      }
    }
    return '-'
  }

  renderMentorPopOver = (child, type) => {
    const savedId = getDataFromLocalStorage('login.id')
    return (
      <Popconfirm
        title={`Please ${type} from new mentor dashboard`}
        placement='topRight'
        okText='Go to new Mentor Dashboard'
        cancelText='Cancel'
        onConfirm={() => {
          this.props.history.push(`/mentordashboard/${savedId}`)
        }}
        key='view'
        overlayClassName='popconfirm-overlay-primary'
      >
        {child}
      </Popconfirm>
    )
  }

  updateSession = (batchSessionId, sessionStatus) => {
    this.setState({
      isButtonsDisabled: true
    }, () => this.startSession({ batchSessionId, input: { sessionStatus } }))
    setTimeout(function () {
      this.setState({
        isButtonsDisabled: false
      })
    }.bind(this), 5000)
  }

  renderSelectiveButtons = (item) => {
    const savedRole = getDataFromLocalStorage('login.role')
    if (savedRole === MENTOR) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      if (item.sessionStatus === 'allotted') {
        return (
          this.renderMentorPopOver(
            <span style={{ flex: 2, padding: '0px 5px 0px 5px', display: 'flex' }}>
              <span style={{ flex: 1, padding: '0px 5px 0px 5px' }}>
                <Button
                  type='default'
                  style={{ color: 'rgb(100,217,120)' }}
                  disabled={this.state.isButtonsDisabled}
                >
                  <Icon type='play-circle' style={{ paddingRight: '2px' }} />
                  Start Session
                </Button>
              </span>
              <span style={{ flex: 1, padding: '0px 5px 0px 5px' }}>
                <Button
                  type='default'
                  style={{ color: 'rgb(238,84,65)' }}
                  disabled={this.state.isButtonsDisabled}
                >
                  <Icon type='close-circle' style={{ paddingRight: '2px' }} />
                  Stop Session
                </Button>
              </span>
              <span style={{
                padding: '0px 5px 0px 5px', flex: 0.6
              }}
              >
                <Tooltip title='Mark All Students Present'>
                  <Button
                    type='default'
                    style={{ color: 'rgb(100,217,120)' }}
                  >
                    <Icon type='check' style={{ paddingRight: '2px' }} />
                  </Button>
                </Tooltip>
              </span>
            </span>, item.sessionStatus === 'started' ? 'stop session' : 'start session'))
      } else if (item.sessionStatus === 'started') {
        return (
          this.renderMentorPopOver(
            <span style={{ flex: 2, padding: '0px 5px 0px 5px', display: 'flex' }}>
              <span style={{ flex: 1, padding: '5px 0px 0px 0px' }}>
                Started
              </span>
              <span style={{ flex: 1, padding: '0px 5px 0px 5px' }}>
                <Button
                  type='default'
                  style={{ color: 'rgb(238,84,65)' }}
                  disabled={this.state.isButtonsDisabled}
                >
                  <Icon type='close-circle' style={{ paddingRight: '2px' }} />
                  Stop Session
                </Button>
              </span>
              <span style={{
                padding: '0px 5px 0px 5px', flex: 0.6
              }}
              >
                <Tooltip title='Mark All Students Present'>
                  <Button
                    type='default'
                    style={{ color: 'rgb(100,217,120)' }}
                  >
                    <Icon type='check' style={{ paddingRight: '2px' }} />
                  </Button>
                </Tooltip>
              </span>
            </span>, item.sessionStatus === 'started' ? 'stop session' : 'start session'))
      }
    }
    if (item.sessionStatus === 'allotted') {
      return (
        <span style={{ flex: 2, padding: '0px 5px 0px 5px', display: 'flex' }}>
          <span style={{ flex: 1, padding: '0px 5px 0px 5px' }}>
            <Button
              type='default'
              style={{ color: 'rgb(100,217,120)' }}
              onClick={() => this.updateSession(item.id, 'started')}
              disabled={this.state.isButtonsDisabled}
            >
              <Icon type='play-circle' style={{ paddingRight: '2px' }} />
              Start Session
            </Button>
          </span>
          <span style={{ flex: 1, padding: '0px 5px 0px 5px' }}>
            <Button
              type='default'
              style={{ color: 'rgb(238,84,65)' }}
              onClick={() => this.updateSession(item.id, 'completed')}
              disabled={this.state.isButtonsDisabled}
            >
              <Icon type='close-circle' style={{ paddingRight: '2px' }} />
              Stop Session
            </Button>
          </span>
          <span style={{
            padding: '0px 5px 0px 5px', flex: 0.6
          }}
          >
            <Tooltip title='Mark All Students Present'>
              <Button
                type='default'
                style={{ color: 'rgb(100,217,120)' }}
                onClick={() => this.markAllPresent(item.id)}
              >
                <Icon type='check' style={{ paddingRight: '2px' }} />
              </Button>
            </Tooltip>
          </span>
        </span>
      )
    } else if (item.sessionStatus === 'started') {
      return (
        <span style={{ flex: 2, padding: '0px 5px 0px 5px', display: 'flex' }}>
          <span style={{ flex: 1, padding: '5px 0px 0px 0px' }}>
            Started
          </span>
          <span style={{ flex: 1, padding: '0px 5px 0px 5px' }}>
            <Button
              type='default'
              style={{ color: 'rgb(238,84,65)' }}
              onClick={() => this.updateSession(item.id, 'completed')}
              disabled={this.state.isButtonsDisabled}
            >
              <Icon type='close-circle' style={{ paddingRight: '2px' }} />
              Stop Session
            </Button>
          </span>
          <span style={{
            padding: '0px 5px 0px 5px', flex: 0.6
          }}
          >
            <Tooltip title='Mark All Students Present'>
              <Button
                type='default'
                style={{ color: 'rgb(100,217,120)' }}
                onClick={() => this.markAllPresent(item.id)}
              >
                <Icon type='check' style={{ paddingRight: '2px' }} />
              </Button>
            </Tooltip>
          </span>
        </span>
      )
    }
    return (
      <>
        <span style={{ flex: 2, padding: '0px 5px 0px 5px' }}>
          Completed
        </span>
      </>
    )
  }
  getStudentDetails = (student) => {
    if (student && get(student, 'student.parents[0].user')) {
      return get(student, 'student.parents[0].user')
    }
    return null
  }

  getBatchDetails = (data) => {
    let batchCode = '-'
    let batchCount = 0
    let batchSchool = ''
    if (data && get(data, 'batch.code')) batchCode = get(data, 'batch.code')
    if (data && get(data, 'batch.studentsMeta.count')) batchCount = get(data, 'batch.studentsMeta.count')
    if (data && get(data, 'batch.school')) batchSchool = get(data, 'batch.school.name')
    return `${batchSchool} - \n ${batchCode}(${batchCount})`
  }
  render() {
    const { batchesData, hasFetchedBatches, columnsTemplate, minWidth, isUpdatingBatchSession, hasUpdatedBatchSession, isUpdatingAttendance, hasUpdatedAttendance } = this.props
    if (!hasFetchedBatches) {
      return (
        <MainTable.Item justifyContent='flex-start'>
          <Icon type='loading' style={{ fontSize: 18 }} spin />
        </MainTable.Item>
      )
    }
    if (hasFetchedBatches && batchesData.length === 0) {
      const emptyText = 'No Data found!'
      return <MainTable.EmptyTable>{emptyText}</MainTable.EmptyTable>
    }
    const sessionsLinkedToBatches = batchesData.filter(item => get(item, 'batch') !== null)
    if (!sessionsLinkedToBatches) {
      return (
        <MainTable.Row
          columnsTemplate='1fr'
          minWidth={this.props.minWidth}
          style={{
            height: '48px',
            position: 'relative',
            left: 0,
            top: 0,
            marginTop: '10px',
            marginBottom: '10px'
          }}
          noBorder
        />
      )
    }
    return (
      sessionsLinkedToBatches.map((item) => ((
        <React.Fragment>
          <div style={{ marginTop: '10px' }}>
            <MainTable.Row
              columnsTemplate='1fr'
              minWidth={this.props.minWidth}
              style={{
                height: '48px',
                position: 'relative',
                left: 0,
                top: 0,
                marginTop: '10px',
                marginBottom: '10px'
              }}
              noBorder
            >
              <Table.SubHeadItem
                style={{
                  width: '100vw',
                }}
              >
                <MainTable.Item>
                  <div
                    style={{
                      backgroundColor: 'rgb(67,174,231)',
                      height: '45px',
                      minWidth: '900px',
                      borderRadius: '2%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <span style={{ padding: '5px', flex: 0.6 }} >{this.getBatchDetails(item)}</span>
                    <Link
                      rel='noopener noreferrer'
                      to={`/sms/assignTimetable/${!item.batch ? '' : item.batch.code}`}
                    >
                      <Tooltip
                        placement='top'
                        title='Click to View Timetable'
                      >
                        <CalendarIcon
                          style={{ color: '#fff', marginLeft: '.75rem', fontSize: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', flex: 1 }}
                        />
                      </Tooltip>
                    </Link>
                    <Link
                      rel='noopener noreferrer'
                      to={`/sms/batchMapping/${!item.batch ? '' : item.batch.code}`}
                    >
                      <Tooltip
                        placement='top'
                        title='Click to View View Batch-User Mapping'
                      >
                        <BatchMappingIcon
                          style={{ color: '#fff', marginLeft: '.75rem', fontSize: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', flex: 1 }}
                        />
                      </Tooltip>
                    </Link>
                    <span style={{ padding: '5px', flex: 0.6 }}>{!item.mentorSession || !item.mentorSession.user ? '-' : item.mentorSession.user.name}</span>
                    <span style={{ padding: '5px', flex: 0.6 }}>{!item.topic ? '-' : item.topic.title}</span>
                    <span style={{ padding: '5px', flex: 0.6 }}>{this.getSlot(item)}</span>
                    <span style={{ padding: '5px', flex: 0.6 }}>{moment(new Date(item.bookingDate)).format('Do MMM yyyy')}</span>
                    {this.renderSelectiveButtons(item)}
                  </div>
                </MainTable.Item>
              </Table.SubHeadItem>
            </MainTable.Row>
            {
              get(item, 'attendance', []).map((student, index) => (
                <BatchAttendanceTableRow
                  studentName={get(student, 'student.user.name')}
                  studentId={get(student, 'student.id')}
                  parentName={get(this.getStudentDetails(student), 'name')}
                  parentPhone={get(this.getStudentDetails(student), 'phone.number', '-')}
                  parentEmail={get(this.getStudentDetails(student), 'email', '-')}
                  batchCode={item.batch.code}
                  currentTopic={item.topic.title}
                  key={item.batch.id}
                  description={item.batch.description}
                  studentData={student}
                  attendance={item.attendance}
                  columnsTemplate={columnsTemplate}
                  minWidth={minWidth}
                  order={index + 1}
                  batchSessionId={item.id}
                  isUpdatingBatchSession={isUpdatingBatchSession}
                  hasUpdatedBatchSession={hasUpdatedBatchSession}
                  isUpdatingAttendance={isUpdatingAttendance}
                  hasUpdatedAttendance={hasUpdatedAttendance}
                  isDisabled={item.sessionStatus !== 'started'}
                  sessionStatus={item.sessionStatus}
                />
              ))
            }
          </div>
        </React.Fragment >
      ))))
  }
}

BatchAttendanceTableBody.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
}

export default BatchAttendanceTableBody
