const request = require('request')
const iconv = require('iconv-lite')

const CHARSET = 'utf-8'

module.exports = {
  create(url, callback) {
    request(
      {
        url,
        gzip: true,
        method: 'GET',
        encoding: null,
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      },
      (error, res, rawData) => {
        const { statusCode } = res
        const contentType = res.headers['content-type']

        if (statusCode >= 400) {
          error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
        } else if (!/^text\/html/i.test(contentType)) {
          error = new Error(
            `Invalid content-type.\nExpected text/html but received ${contentType}`,
          )
        }
        if (error) {
          callback(error, null)
        } else {
          let testString = rawData.toString()

          // get charset
          let charsetReg = /<\s*meta[^>]+charset=['"](.*?)['"]/gi
          let charsetMatch = charsetReg.exec(testString)
          let charset = charsetMatch ? charsetMatch[1].toLowerCase() : CHARSET

          if (charset !== CHARSET) {
            testString = iconv.decode(rawData, charset)
          }

          // get title and keywords
          let titleReg = /<\s*title[^>]*>(.*?)<\s*\/\s*title>/gi
          let keywordsReg = /<\s*meta[^>]+name=['"]keywords['"][^>]+content=['"](.*?)['"]/gi
          let descReg = /<\s*meta[^>]+name=['"]description['"][^>]+content=['"](.*?)['"]/gi

          let titleMatch = titleReg.exec(testString)
          let keywordsMatch = keywordsReg.exec(testString)
          let descMatch = descReg.exec(testString)

          let title = titleMatch ? titleMatch[1] : url
          let keywords = keywordsMatch ? keywordsMatch[1] : ''
          let description = (descMatch ? descMatch[1] : url) || url
          callback(null, {
            _id: `bmaw::${url}`,
            title,
            keywords,
            description,
            url,
            times: 0,
            search: [url, title, keywords, description].join(),
          })
        }
      },
    )
  },
}
