import { createStore } from 'vuex'

import sessionModule from './modules/session/index.js'

const store = createStore({
  modules: {
    session: sessionModule
  }
})

export default store
