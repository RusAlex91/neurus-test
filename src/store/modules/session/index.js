import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

export default {
  state () {
    return {
      // api-call-here
      productEvents: null,
      trunstileEvents: null,
      uniqueSessionsId: null,
      customerData: null
    }
  },
  mutations,
  actions,
  getters
}
