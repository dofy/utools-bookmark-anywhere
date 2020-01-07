const bookmark = require('./Bookmark')
let bookmarks = []

function search(action, word, callback) {
  let reg = new RegExp(word.replace(/\s+/g, '|'), 'i')
  callback(
    bookmarks.filter(item => {
      return reg.test(item.search)
    }),
  )
}

window.exports = {
  add: {
    mode: 'none',
    args: {
      enter() {
        bookmark.add(utools.getCurrentBrowserUrl())
      },
    },
  },
  input: {
    mode: 'none',
    args: {
      enter({ payload }) {
        bookmark.add(payload)
      },
    },
  },
  bookmark: {
    mode: 'list',
    args: {
      enter({ payload }, callback) {
        bookmarks = utools.db.allDocs().sort((x, y) => y.times - x.times)
        search(null, payload, callback)
      },
      select(action, item, callback) {
        utools.hideMainWindow()
        require('electron').shell.openExternal(item.url)
        // * 兼容 0.1.2
        item.times = item.times ? item.times + 1 : 1
        utools.db.put(item)
        utools.outPlugin()
      },
      search,
      placeholder: '搜索，在浏览器中打开书签',
    },
  },
  import: {
    mode: 'none',
    args: {
      enter({ payload }) {
        payload.map(item => bookmark.import(item.path))
      },
    },
  },
  manager: {
    mode: 'list',
    args: {
      enter(action, callback) {
        bookmarks = utools.db.allDocs().sort((x, y) => x.times - y.times)
        callback(bookmarks)
      },
      select(select, item, callback) {
        utools.hideMainWindow()
        utools.db.remove(item)
        utools.outPlugin()
        utools.showNotification('🤔 Bookmark has been removed!')
      },
      search,
      placeholder: '搜索，删除选中书签',
    },
  },
}
