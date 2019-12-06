utools.onPluginReady(() => {
  console.log('-- ready')
})
utools.onDbPull(() => {
  console.log('-- onDbPull')
})

window.exports = {
  add: {
    mode: 'none',
    args: {
      enter({ code, type, payload }) {
        console.log('..:: enter -> code', code)
        console.log('..:: enter -> type', type)
        console.log('..:: enter -> payload', payload)
        // TODO: add bookmark
        let url = null
        if (payload === 'add') {
          url = utools.getCurrentBrowserUrl()
        } else {
          url = payload
        }
        console.log('..:: enter -> url', url)
        if (url) {
          console.log('--- add bookmark')
        }
      },
    },
  },
  bookmark: {
    mode: 'list',
    args: {
      enter({ code, type, payload }, callback) {
        console.log('..:: enter -> code', code)
        console.log('..:: enter -> type', type)
        console.log('..:: enter -> payload', payload)
      },
      search({ code, type, payload }, word, callback) {
        console.log('..:: search -> code', code)
        console.log('..:: search -> type', type)
        console.log('..:: search -> payload', payload)
        console.log('..:: search -> word', word)
      },
      select({ code, type, payload }, item, callback) {
        console.log('..:: select -> code', code)
        console.log('..:: select -> type', type)
        console.log('..:: select -> payload', payload)
        console.log('..:: select -> item', item)
      },
      placeholder: '搜索书签',
    },
  },
}
