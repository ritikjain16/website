import { capitalize } from 'lodash'
import { BLANK_PATTERN, MIN_BLANKS, MAX_BLANKS,
  // MINLENGTH, MAXLENGTH,
  MAX_ORDER_COUNT, sectionValue } from '../constants/questionBank'
import { getDataByProp } from './data-utils'

const validateOrder = (ordersInUse, maxLen) => (rule, value, callback) => {
  if (value < 1) {
    callback('Only positive numerical value is allowed')
  }
  if (ordersInUse.includes(value)) {
    callback('Order already in use')
  }
  if (value > maxLen) {
    callback(`Order cannot be more than ${maxLen}`)
  }
  callback()
}
const validateOrderNew = ordersInUse => (rule, value, callback) => {
  const valuefield = (value !== '' && value !== undefined) ? value : null
  if (valuefield != null && valuefield < 1) {
    callback('Only positive numerical value is allowed')
  }
  if (ordersInUse.includes(valuefield)) {
    callback('Order already in use')
  }
  callback()
}
const validateBlankCount = (type) => (rule, value, callback) => {
  const { FIB_BLOCK, FIB_INPUT } = sectionValue
  if (((type === FIB_BLOCK || type === FIB_INPUT) && value)) {
    const noOfBlanks = ((value || '').match(BLANK_PATTERN) || []).length
    if (noOfBlanks < MIN_BLANKS || noOfBlanks > MAX_BLANKS) {
      callback(`Number of blanks should be between ${MIN_BLANKS} and ${MAX_BLANKS}`)
    }
  }
  callback()
}

const validateSelect = (children, maxChildren, prop) =>
  (rule, value, callback) => {
    const topicsLength = getDataByProp(children, prop, value).length
    if (topicsLength + 1 > maxChildren) {
      callback(`A chapter cannot have more than ${maxChildren} topics`)
    }
    callback()
  }
// const lengthValidate = () => (rule, value, callback) => {
//   if (value) {
//     if (value.length < MINLENGTH) {
//       callback(`A min of ${MINLENGTH} characters should be present`)
//     }
//     if (value.length > MAXLENGTH) {
//       callback(`A max of ${MAXLENGTH} characters should be present`)
//     }
//   }
//   callback()
// }
const blankCountValidate = (type, form) => (rule, value, callback) => {
  const { FIB_BLOCK } = sectionValue
  if (type === FIB_BLOCK && value) {
    const codeSnippet = form.getFieldValue('codeSnippet')
    const fibBlockOptionKeys = form.getFieldValue('fibBlockOptionKeys')
    const noOfBlanks = ((codeSnippet || '').match(BLANK_PATTERN) || []).length
    const noOfBlocks = (fibBlockOptionKeys).length
    if (noOfBlanks > noOfBlocks) {
      callback(`Number of blocks should be equal or more than number of blanks ${noOfBlanks}`)
    }
  }
  callback()
}
const validateMaxOrder = () => (rule, value, callback) => {
  if (value > MAX_ORDER_COUNT) {
    callback(`Order entered is more than MAX ( ${MAX_ORDER_COUNT} ) order`)
  }
  callback()
}
const validateSliderMovement = () => (rule, value, callback) => {
  if (value === 0) {
    callback('select the difficulty of question')
  }
  callback()
}

const validators = {
  title: [
    'title',
    {
      rules: [
        { required: true, message: 'Enter Title' },
      ],
      validateFirst: true
    },
  ],
  descripton: [
    'description',
    {
      rules: [
        { required: false, message: 'Enter Description' },
      ]
    }
  ],
  message: [
    'message',
    {
      rules: [
        { required: true, message: 'Enter Message' },
      ],
      validateFirst: true
    }
  ],
  select: (title, children, maxChildren) => [
    title,
    {
      rules: [
        { required: true, message: `Enter ${capitalize(title)}` },
        { validator: validateSelect(children, maxChildren, `${title}.id`) }
      ],
      validateFirst: true
    }
  ],

  order: (ordersInUse, maxLen) => [
    'order',
    {
      rules: [
        { required: true, message: 'Enter Order' },
        { validator: validateOrder(ordersInUse, maxLen) },
      ],
      validateFirst: true
    }
  ],

  learningObjective: [
    'learningObjective',
    {
      rules: [
        { required: true, message: 'choose LO' },
      ],
      validateFirst: true
    }
  ],

  conceptCard: [
    'conceptCard',
    {
      rules: [
        { required: true, message: 'choose ConceptCard' },
      ],
      validateFirst: true
    }
  ],

  type: [
    'type',
    {
      rules: [
        { required: true, message: 'choose Type' },
      ],
      validateFirst: true
    }
  ],

  questionStatement: [
    'questionStatement',
    {
      rules: [
        { required: true, message: 'Enter Question Statement' }
      ],
      validateFirst: true
    }
  ],

  logicalExplanation: [
    'logicalExplanation',
    {
      rules: [
        { required: true, message: 'Enter Logical Explanation' }
      ],
      validateFirst: true
    }
  ],

  optionInput: [
    [
      'optionInput1',
      {
        rules: [
          { required: false, message: 'Enter Option Input' }
        ],
        initialValue: '',
        validateFirst: true
      }
    ], [
      'optionInput2',
      {
        rules: [
          { required: false, message: 'Enter Option Input' }
        ],
        initialValue: '',
        validateFirst: true
      }], [
      'optionInput3',
      {
        rules: [
          { required: false, message: 'Enter Option Input' }
        ],
        initialValue: '',
        validateFirst: true
      }], [
      'optionInput4',
      {
        rules: [
          { required: false, message: 'Enter Option Input' }
        ],
        initialValue: '',
        validateFirst: true
      }]
  ],

  optionExplanation: [[
    'optionExplanation1',
    {
      rules: [
        { required: false, message: 'Enter Option Explanation' }
      ],
      initialValue: '',
      validateFirst: true
    }
  ],
  [
    'optionExplanation2',
    {
      rules: [
        { required: false, message: 'Enter Option Explanation' }
      ],
      initialValue: '',
      validateFirst: true
    }
  ],
  [
    'optionExplanation3',
    {
      rules: [
        { required: false, message: 'Enter Option Explanation' }
      ],
      initialValue: '',
      validateFirst: true
    }
  ],
  [
    'optionExplanation4',
    {
      rules: [
        { required: false, message: 'Enter Option Explanation' }
      ],
      initialValue: '',
      validateFirst: true
    }
  ]],

  optionIsTrue: [[
    'optionIstrue1',
    {
      valuePropName: 'checked',
      initialValue: false,
      validateFirst: true
    }
  ], [
    'optionIstrue2',
    {
      valuePropName: 'checked',
      initialValue: false,
      validateFirst: true
    }
  ], [
    'optionIstrue3',
    {
      valuePropName: 'checked',
      initialValue: false,
      validateFirst: true
    }
  ], [
    'optionIstrue4',
    {
      valuePropName: 'checked',
      initialValue: false,
      validateFirst: true
    }
  ]
  ],
  statement: [
    'statement',
    {
      rules: [{ required: true, message: 'Enter the statement' },
        // { validator: lengthValidate() }
      ],
      validateFirst: true
    }
  ],
  assignmentType: [
    'assignmentType',
    {
      rules: [{ required: true, message: 'Select assignment type' },
      ],
      validateFirst: true
    }
  ],
  explanation: [
    'explanation',
    {
      rules: [{ required: true, message: 'Enter The Explanation' }],
      validateFirst: true
    }
  ],
  output: [
    'output',
    {
      rules: [{ required: true, message: 'Enter The Output' }],
      validateFirst: true
    }
  ],
  logicText: [
    'logicText',
    {
      rules: [{ required: true, message: 'Enter the logicText' }],
      validateFirst: true
    }
  ],
  orderNew: ordersInUse => [
    'order',
    {
      rules: [
        { required: true, message: 'Enter Order', type: 'number' },
        { validator: validateOrderNew(ordersInUse) },
        { validator: validateMaxOrder() }
      ],
      validateFirst: true
    }
  ],
  assessmentType: [
    'assessmentType',
    {
      rules: [{ required: true, message: 'Choose the type' }],
      validateFirst: true
    }
  ],
  answerCodeSnippet: (type = null, form = null) => [
    'answerCodeSnippet',
    {
      rules: [
        { validator: validateBlankCount(type) },
        // { validator: lengthValidate() },
        { validator: blankCountValidate(type, form) }
      ],
      validateTrigger: ['onChange', 'onBlur'],
      validateFirst: true
    }
  ],
  slider: [
    'slider',
    {
      rules: [{ required: true, message: 'Select the difficulty' },
        { validator: validateSliderMovement() }
      ],
      initialValue: 0
    }
  ],
  questionType: [
    'questionType',
    {
      rules: [{ required: true, message: 'Choose the question type' }],
      validateFirst: true
    }
  ],
  questionLayoutType: [
    'questionLayoutType',
    {
      rules: [{ required: true, message: 'Choose the questionLayout type' }],
      validateFirst: true
    }
  ],
  hint: [
    'hint',
    {
      rules: [{ required: true, message: 'Enter the hint' },
        // { validator: lengthValidate() }
      ],
      validateFirst: true
    }
  ],
  questionExplanation: [
    'explanation',
    {
      rules: [{ required: true, message: 'Enter The Explanation' },
        // { validator: lengthValidate() }
      ],
      validateFirst: true
    }
  ],
  courseTitle: [
    'courseTitle',
    {
      rules: [{ required: true, message: 'Choose the title' }]
    }
  ],
  courseCategory: [
    'courseCategory',
    {
      rules: [{ required: true, message: 'Choose the category' }]
    }
  ],
  courseDescription: [
    'courseDescription',
    {
      rules: [{ required: false, message: 'Enter the description' }]
    }
  ],
  courseMapping: [
    'courseMapping',
    {
      rules: [{ required: true, message: 'Choose the course' }]
    }
  ],
  isTrial: [
    'isTrial',
    {
      rules: [{ required: true, message: 'Choose whether topic is free or paid' }],
      validateFirst: true
    }
  ],
  badgeType: [
    'badgeType',
    {
      rules: [{ required: true, message: 'Choose the badge type' }]
    }
  ],
  badgeName: [
    'badgeName',
    {
      rules: [{ required: true, message: 'Enter the badge name' }]
    }
  ],
  unlockPoint: [
    'unlockPoint',
    {
      rules: [{ required: true, message: 'Choose badge unlock point' }]
    }
  ],
  code: [
    'code',
    {
      rules: [{ required: true, message: 'Code is required' }]
    }
  ],
  userRole: [
    'userRole',
    {
      rules: [{ required: true, message: 'Select the user type' }]
    }
  ],
  countryCode: [
    'countryCode',
    {
      rules: [{ required: true, message: 'Country code is required' }]
    }
  ],
  mobileNumber: [
    'mobileNumber',
    {
      rules: [{ required: true, message: 'Number is required' }]
    }
  ],
  email: [
    'email',
    {
      rules: [{ required: true, message: 'Email is required' }]
    }
  ],
  mentor: [
    'mentor',
    {
      rules: [{ required: true, message: 'Select a mentor' }]
    }
  ],
  parentName: [
    'parentName',
    {
      rules: [{ required: true, message: 'Parent name is required' }]
    }
  ],
  sessionDate: [
    'sessionDate',
    {
      rules: [{ required: true, message: 'Select a date' }]
    }
  ],
  discount: [
    'discount',
    {
      rules: [
        { required: true, message: 'Discount field is required' }
      ]
    }
  ],
  price: [
    'price',
    {
      rules: [
        { required: true, message: 'Discount field is required' }
      ]
    }
  ],
  expiryDate: [
    'expiryDate',
    {
      rules: [
        { required: true, message: 'Expiry date is required' }
      ]
    }
  ],
  salesStatus: [
    'salesStatus'
  ],
  userResponseStatus: [
    'userResponseStatus'
  ],
  sessionVideoLink: [
    'sessionVideoLink'
  ],
  sessionLink: [
    'sessionLink',
    {
      rules: [
        { require: true, mession: 'Session Link is required' }
      ]
    }
  ],
  rejectionComment: [
    'rejectionComment',
    {
      rules: [
        { require: true, mession: 'Comment is required' }
      ]
    }
  ],
  topic: [
    'topic',
    {
      rules: [
        { required: false, message: 'Select topic' },
      ],
    }
  ],
}

export default validators
