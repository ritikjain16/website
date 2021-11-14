/* eslint-disable */
import React from 'react'
import { get } from 'lodash'
import parser from './text-parser'
import getFullPath from './getFullPath'
const styles = {
  block: {
    backgroundColor: 'rgba(26, 201, 232, 0.16)',
    display: 'inline-block'
  },
  inlineBlock: {
    display: 'inline-block'
  },
  bulletStyle: {
    textAlign: 'left',
    display: 'inline',
    width: '100%',
  }
}
const parseChatStatement = props => {
  const { emojis, alignment } = props
  const regex = new RegExp('\n', 'gi')
  let statement = get(props, 'statement', '')
  if (!statement.includes('<bullet>')) {
    statement = statement.replace(regex, '<br></br>')
  }
  statement = statement.replaceAll('<code>', '')
  statement = statement.replaceAll('</code>', '')
  const isEmoji = emojiCode => emojis && emojis.find(emoji => emoji.code === emojiCode)
  const textStyles = styles.inlineBlock
  const brStyle = { display: 'block' }
  const triggers = ['<', ':']
  const tags = {
    bold: {
      startTag: '<bold>',
      endTag: '</bold>',
      render: value => ((value && value.split
        ? (
          value.split(' ').map((text, i) =>
            value.split(' ').length - 1 === i
              ? (
                <div
                  key={i}
                  style={{
                    ...textStyles,
                    fontWeight: 700
                  }}
                  from-bold="true"
                >{text}
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    ...textStyles,
                    fontWeight: 700
                  }}
                >{text}&nbsp;
                </div>
              )
          )
        ) : (
          <div
            style={{
              ...textStyles,
              fontWeight: 700
            }}
          >{value}
          </div>
        )
      ))
    },
    a: {
      startTag: (string, i) => {
        const splittedString = string.slice(i, string.length).split(' ').filter(s => s)
        if (splittedString[0] === '<a' && splittedString[1].split('=')[0] === 'href') {
          const link = splittedString[1].split('="')[1].split('">')[0]
          const skipLength = string.slice(i, string.length).indexOf('">') + 1
          return {
            tag: 'a',
            i: 1,
            link: link,
            skipLength
          }
        }
        return false
      },
      endTag: '</a>',
      render: (value, { link }) => {
        return (
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
          >
            <div
              style={{
                ...textStyles,
                color: (alignment === 'left' ? '#0077cc' : '#0e1bcc'),
                textDecoration: 'underline',
                fontFamily: 700
              }}
            >{value}
            </div>
          </a>
        )
      }
    },
    emoji: {
      startTag: '::',
      endTag: '::',
      disableNesting: true,
      render: value => {
        const emoji = isEmoji(`::${value}::`)
        if (emoji) {
          return (
            <img
              style={{
                width: hs(30),
                height: hs(30),
                position: 'relative',
                top: hs(5)
              }}
              src={getFullPath(get(emoji, 'image.uri'))}
              alt={'emoji'}
            />
          )
        }
      }
    },
    normal: {
      render: value => (value && value.split
        ? (
          value.split(' ').map((text, i) =>
            value.split(' ').length - 1 === i
              ? (
                <div style={textStyles} key={i}>{text}</div>
              ) : (
                <div style={textStyles} key={i}>{text}&nbsp;</div>
              )
          )
        ) : (
          value
            ? <div style={textStyles}>{value}</div>
            : <></>
        )
      )
    },
  block: {
      startTag: '<block>',
      endTag: '</block>',
      render: value => ((value && value.split
              ? (
                  value.split(' ').map((text, i) =>
                      value.split(' ').length - 1 === i
                          ? (
                              <div
                                  key={i}
                                  style={styles.block}
                              >{text}
                              </div>
                          ) : (
                              <div
                                  key={i}
                                  style={styles.block}
                              >{text}&nbsp;
                              </div>
                          )
                  )
              ) : (
                  <div style={styles.block}>{value}</div>
              )
        ))
    },
    break: {
      startTag: '<br>',
      endTag: '</br>',
      render: value => ((value && value.split
        ? (
          value.split(' ').map((texts, i) =>
            value.split(' ').length - 1 === i
              ? (
                <span
                  key={i}
                  style={brStyle}
                >{texts}
                </span>
              ) : (
                <span
                  key={i}
                  style={brStyle}
                >{texts}&nbsp;
                </span>
              )
          )
        ) : (
          <span style={brStyle}>{value}</span>
        )
      ))
    },
    bullet: {
      startTag: '<bullet>',
      endTag: '</bullet>',
      render: value => ((value && value.split
        ? (
          value.split(' ').map((text, i) =>
            value.split(' ').length - 1 === i
              ? (
                <div
                  key={i}
                  style={styles.bulletStyle}
                >{text}
                </div>
              ) : (
                <div
                  key={i}
                  style={styles.bulletStyle}
                >{text}&nbsp;
                </div>
              )
          )
        ) : (
          <li
            style={{
              ...textStyles,
              width: '80%',
            }}
          >{value}
          </li>
        )
      ))
    },
    code: {
      startTag: '<code>',
      endTag: '</code>',
      render: value => ((value && value.split
        ? (
          value.split(' ').map((text, i) =>
            value.split(' ').length - 1 === i
              ? (
                <div
                  key={i}
                  style={textStyles}
                >{text}
                </div>
              ) : (
                <div
                  key={i}
                  style={textStyles}
                >{text}&nbsp;
                </div>
              )
          )
        ) : (
          <div
            style={textStyles}
          >{value}
          </div>
        )
      ))
    },
    blank: {
      startTag: '<blank>',
      endTag: '</blank>',
      render: value => ((value && value.split
        ? (
          value.split(' ').map((text, i) =>
            value.split(' ').length - 1 === i
              ? (
                <div
                  key={i}
                  style={textStyles}
                >{text}
                </div>
              ) : (
                <div
                  key={i}
                  style={textStyles}
                >{text}&nbsp;
                </div>
              )
          )
        ) : (
          <div
            style={textStyles}
          >{value}
          </div>
        )
      ))
    },
  }
  return parser(tags, triggers)(statement)
}

export default parseChatStatement