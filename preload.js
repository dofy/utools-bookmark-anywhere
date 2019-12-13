const bookmark = require('./Bookmark')
let bookmarks = []

function addBookmark(url) {
  utools.hideMainWindow()
  if (url && /^https?:\/\//i.test(url)) {
    bookmark.create(url, (err, bookmark) => {
      if (err) {
        utools.showNotification(err.message)
      } else {
        let oldData = utools.db.get(bookmark._id)
        if (oldData) {
          // * 兼容 0.1.2
          bookmark.times = oldData.times ? oldData.times : 0
          bookmark._rev = oldData._rev
        }
        utools.db.put(bookmark)
        utools.showNotification('😁 Bookmark saved!')
      }
    })
  } else {
    utools.showNotification('😫 There is no URL to save!')
  }
  utools.outPlugin()
}

window.exports = {
  add: {
    mode: 'none',
    args: {
      enter({ code, type, payload }) {
        addBookmark(utools.getCurrentBrowserUrl())
      },
    },
  },
  input: {
    mode: 'none',
    args: {
      enter({ code, type, payload }) {
        addBookmark(payload)
      },
    },
  },
  bookmark: {
    mode: 'list',
    args: {
      enter(action, callback) {
        bookmarks = utools.db.allDocs().sort((x, y) => y.times - x.times)
        callback(bookmarks)
      },
      search(action, word, callback) {
        let reg = new RegExp(word, 'i')
        callback(
          bookmarks.filter(item => {
            return reg.test(item.search)
          }),
        )
      },
      select(action, item, callback) {
        utools.hideMainWindow()
        require('electron').shell.openExternal(item.url)
        // * 兼容 0.1.2
        item.times = item.times ? item.times + 1 : 1
        utools.db.put(item)
        utools.outPlugin()
      },
      placeholder: '搜索书签',
    },
  },
  clean: {
    mode: 'none',
    args: {
      enter({ code, type, payoad }) {
        utools.hideMainWindow()
        utools.db.allDocs().map(item => {
          utools.db.remove(item)
        })
        utools.outPlugin()
      },
    },
  },
}
