const { readFileSync } = require('fs')
const iconv = require('iconv-lite')
const request = require('request')
const CHARSET = 'utf-8'

module.exports = {
  // 解析页面，获取书签信息
  get(url, callback) {
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
        if (error) {
          callback(error, null)
          return
        }
        const { statusCode } = res
        const [contentType, flag, headerCharset] = res.headers['content-type']
          .split(/;|=/)
          .map(item => item.trim().toLowerCase())

        if (statusCode >= 400) {
          error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
        } else if (contentType !== 'text/html') {
          error = new Error(
            `Invalid content-type.\nExpected text/html but received ${contentType}`,
          )
        }
        if (error) {
          callback(error, null)
          return
        }

        // parse content
        let testString = rawData.toString()
        let charset = flag === 'charset' ? headerCharset : CHARSET

        // get charset
        let charsetReg1 = /<\s*meta[^>]+charset=['"](.*?)['"]/gi
        let charsetMatch1 = charsetReg1.exec(testString)
        let charsetReg2 = /<\s*meta[^>]+http-equiv=['"]content-type['"][^>]+?charset=([\w-]+)/gi
        let charsetMatch2 = charsetReg2.exec(testString)
        charset = charsetMatch1
          ? charsetMatch1[1].toLowerCase()
          : charsetMatch2
          ? charsetMatch2[1].toLowerCase()
          : charset

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
      },
    )
  },
  // 创建数据项
  add(url, callback = null, alert = true) {
    utools.hideMainWindow()
    if (url && /^https?:\/\//i.test(url)) {
      this.get(url, (err, bookmark) => {
        if (err) {
          alert && utools.showNotification(err.message)
          callback && callback(false)
        } else {
          let oldData = utools.db.get(bookmark._id)
          if (oldData) {
            // * 兼容 0.1.2
            bookmark.times = oldData.times ? oldData.times : 0
            bookmark._rev = oldData._rev
          }
          utools.db.put(bookmark)
          alert && utools.showNotification('😁 Bookmark saved!')
          callback && callback(true)
        }
      })
    } else {
      alert && utools.showNotification('😫 There is no URL to save!')
      callback && callback(false)
    }
    utools.outPlugin()
  },
  // 导入
  import(path) {
    let linkMatch,
      count = 0,
      succ = 0,
      fail = 0,
      linkReg = /<\s*a[^>]+href=['"](.*?)['"]/gi,
      content = readFileSync(path, CHARSET)
    utools.showNotification(`🚀 Import is started...`)
    while ((linkMatch = linkReg.exec(content))) {
      count++
      this.add(
        linkMatch[1],
        isOk => {
          isOk ? succ++ : fail++
          if ((succ + fail) % 7 === 0) {
            utools.showNotification(`👍 ${succ} / 👎 ${fail} / 👊 ${count}`)
          }
          if (succ + fail === count) {
            utools.showNotification(
              `🎉 Import completed! (👍${succ}/👎${fail}/👊${count})`,
            )
          }
        },
        false,
      )
    }
  },
}
