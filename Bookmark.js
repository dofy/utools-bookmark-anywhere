const http = require('http')
const https = require('https')

function url2id(url) {
  return url.replace(/\W/gi, '')
}

module.exports = {
  create(url, callback) {
    let proxy
    if (url.search(/^https/i) !== -1) {
      proxy = https
    } else {
      proxy = http
    }
    proxy.get(url, res => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      let error
      if (statusCode >= 400) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      } else if (!/^text\/html/.test(contentType)) {
        error = new Error(
          `Invalid content-type.\nExpected text/html but received ${contentType}`,
        )
      }
      if (error) {
        // Consume response data to free up memory
        res.resume()
        callback(error, null)
        return
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })
      res
        .on('end', () => {
          // TODO: get title and keywords
          let titleReg = /<\s*title[^>]*>(.*?)<\s*\/\s*title>/gi
          let keywordsReg = /<\s*meta[^>]+name=['"]keywords['"][^>]+content=['"](.*?)['"]/gi
          let descReg = /<\s*meta[^>]+name=['"]description['"][^>]+content=['"](.*?)['"]/gi
          let titleMatch = titleReg.exec(rawData)
          let keywordsMatch = keywordsReg.exec(rawData)
          let descriptionMatch = descReg.exec(rawData)
          let title = titleMatch ? titleMatch[1] : url
          let keywords = keywordsMatch ? keywordsMatch[1] : url
          let description = descriptionMatch ? descriptionMatch[1] : url
          callback(null, {
            _id: url2id(url),
            title,
            keywords,
            description,
            url,
            search: [url, title, keywords, description].join(),
          })
        })
        .on('error', error => {
          callback(error, null)
        })
    })
  },
}
