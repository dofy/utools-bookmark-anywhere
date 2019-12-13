const bookmark = require('./Bookmark')
let bookmarks = []

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
  import: {
    mode: 'none',
    args: {
      enter({ payload }) {
        payload.map(item => bookmark.import(item.path))
      },
    },
  },
  clean: {
    mode: 'none',
    args: {
      enter() {
        utools.hideMainWindow()
        utools.db.allDocs().map(item => {
          utools.db.remove(item)
        })
        utools.outPlugin()
      },
    },
  },
}
