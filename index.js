const { Configuration, OpenAIApi } = require('openai')
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

function replaceLineInFile(filePath, lineNumber, newContent, stream) {
  const data = fs.readFileSync(filePath, 'utf8')
  console.log(`line:${lineNumber} || ${newContent}`)
  const lines = data.split('\n');
  if (lineNumber < 1 || lineNumber > lines.length) {
    stream.write('\n'+ newContent)
    return false;
  }

  lines[lineNumber - 1] = newContent;
  const modifiedContent = lines.join('\n');
  fs.writeFileSync(filePath, modifiedContent, 'utf8');
}

// you can modify to make your own analogy to tell the AI how to deal with the translation
const analog = (text) => {
  return `Translate this "${text}" into English using analogies from Chinese web novels in the Xianxia or Xuanhuan genre use by English translators. Avoid explanations and keep it brief.`
}

const analog2 = (text) => {
  `Translate this Chinese text "${text}" into English, using English translations of xianxia/xuanhuan web novels as a reference for the translation content. Avoid explanations and keep it brief.
`
}

const fs = require('fs')

const readline = require('readline')

const arg = process.argv[2] // for example 'content/1189490/2826780370/plugins/Translations/etc.txt'
const bkp = `${arg.slice(0, -4)}_bkp.txt`
if (!fs.existsSync(bkp)) {
  fs.copyFileSync(arg, bkp)
}

const rd = readline.createInterface({
  input: fs.createReadStream(bkp),
  output: process.stdout,
  terminal: false
})

const crd = readline.createInterface({
  input: fs.createReadStream(arg),
  output: process.stdout,
  terminal: false
})

const splitter = '==//=='

const re = /([\u4e00-\u9fa5])/

const rNum = /^[0-9]+$/

const ch = []
const cch = []
const cht = []

rd.on('line', async function (text) {
  const splitText = text.split('')
    .filter(glyph => glyph !== '') // Remove empty elements from the array

  let s
  if (/¤/.test(text)) {
    s = splitText.find(s => /¤/.test(s))
  } else

  if (/=/.test(text)) {
    s = splitText.find(s => /=/.test(s))
  }

  
  const index = splitText.indexOf(s)
  cht.push(splitText.slice(index + 1, splitText.length).join(''))
  splitText.splice(index, splitText.length)

  let combinedText = ''
  for (let i = 0; i < splitText.length; i += 2) {
    if (splitText[i + 1]) {
      if ((splitText[i - 1] && re.test(splitText[i - 1]) && !re.test(splitText[i])) ||
          (splitText[i - 1] && !re.test(splitText[i - 1]) && re.test(splitText[i]))
      ) {
        combinedText += splitter
      }
      if ((re.test(splitText[i]) && !re.test(splitText[i + 1])) ||
          (!re.test(splitText[i]) && re.test(splitText[i + 1]))
      ) {
        combinedText += splitText[i] + splitter + splitText[i + 1]
      } else {
        combinedText += splitText[i] + splitText[i + 1]
      }
    } else {
      if ((splitText[i - 1] && re.test(splitText[i - 1]) && !re.test(splitText[i])) ||
          (splitText[i - 1] && !re.test(splitText[i - 1]) && re.test(splitText[i]))
      ) {
        combinedText += splitter
      }
      combinedText += splitText[i]
    }
  }
  const chGlyphSplitted = combinedText.split(splitter)

  combinedText = ''
  for (let i = 0; i < chGlyphSplitted.length; i += 2) {
    if (chGlyphSplitted[i + 1]) {
      if ((chGlyphSplitted[i - 1] && re.test(chGlyphSplitted[i - 1]) && !re.test(chGlyphSplitted[i]) && !rNum.test(chGlyphSplitted[i])) ||
          (chGlyphSplitted[i - 1] && !re.test(chGlyphSplitted[i - 1]) && re.test(chGlyphSplitted[i]) && !rNum.test(chGlyphSplitted[i - 1]))
      ) {
        combinedText += splitter
      }
      if ((re.test(chGlyphSplitted[i]) && !re.test(chGlyphSplitted[i + 1]) && !rNum.test(chGlyphSplitted[i + 1])) ||
          (!re.test(chGlyphSplitted[i]) && re.test(chGlyphSplitted[i + 1]) && !rNum.test(chGlyphSplitted[i]))
      ) {
        combinedText += chGlyphSplitted[i] + splitter + chGlyphSplitted[i + 1]
      } else {
        combinedText += chGlyphSplitted[i] + chGlyphSplitted[i + 1]
      }
    } else {
      if ((chGlyphSplitted[i - 1] && re.test(chGlyphSplitted[i - 1]) && !re.test(chGlyphSplitted[i]) && !rNum.test(chGlyphSplitted[i])) ||
          (chGlyphSplitted[i - 1] && !re.test(chGlyphSplitted[i - 1]) && re.test(chGlyphSplitted[i]) && !rNum.test(chGlyphSplitted[i - 1]))
      ) {
        combinedText += splitter
      }
      combinedText += chGlyphSplitted[i]
    }
  }

  const chg = combinedText.split(splitter)

  ch.push(chg)
})

let ci = 0
crd.on('line', function (text) {
  if(text && text.length) {
    cch.push(ci)
  }
  ci++
})


const run = (i = 0) => {

  const  stream = fs.createWriteStream(arg, {'flags': 'a'});

  if (i < ch.length) {
    const combineGlyph = []
    let chGlyphSplitted
    if (~cch.indexOf(i)) {
      // skip if data exist
      i++
      run(i)
    } else {
      chGlyphSplitted = ch[i]
      if (process.argv[3] === 'revert') {
        replaceLineInFile(arg, i+1, `${chGlyphSplitted.join('')}¤${cht[i]}`, stream)
        i++
        run(i)
      } else {
        const next = async (j) => {
          if (j < chGlyphSplitted.length) {
            const c = chGlyphSplitted[j]
            if (re.test(c)) {
              let a = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: analog(c),
                max_tokens: 500
              }).then(completion => {
                return completion.data.choices[0].text
              })
              a = a.replace(/[\r\n]+/g, '')
              a = a.replace(/"/g, '')
              a = a.trim()
              if (a.slice(-1) === '.') {
                a = a.slice(0, -1)
              }
              combineGlyph.push(a)
            } else {
              combineGlyph.push(c)
            }
            // wait for sometimes before next call because openai rate limit to 60 calls per minutes
            setTimeout(() => {
              j++
              next(j)
            }, 1000)
          } else {
            replaceLineInFile(arg, i+1, `${chGlyphSplitted.join('')}¤${combineGlyph.join('')}`, stream)
            i++
            run(i)
          }
        }
        next(0)
      }
    }
  } else {
    console.log('/////////////////////////// COMPLETE ///////////////////////////')
  }
}

Promise.all([rd, crd].map(async c => {
  const p = new Promise(r => {
    c.on('close', r)
  })
  await p
})).then(() => run())
