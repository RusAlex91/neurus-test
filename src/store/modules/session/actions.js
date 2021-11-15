export default {
  async getProductEvents (context, data) {
    const response = await fetch(
      'https://my-json-server.typicode.com/RusAlex91/neurus-test/events'
    )
    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.massage || 'failed to fetch')
      throw error
    }
    context.commit('SET_PRODUCT_EVENTS', responseData)
  },
  async getTrunstileEvents (context, data) {
    const response = await fetch(
      'https://my-json-server.typicode.com/RusAlex91/neurus-test/trunstile-events'
    )
    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.massage || 'failed to fetch')
      throw error
    }
    context.commit('SET_TRUNSTILE_EVENTS', responseData)
  },
  getUniqueId (context, data) {
    const prodEvents = context.state.productEvents
    const uniqueSessionId = [...new Set(prodEvents.map(item => item.sessionId))]
    context.commit('SET_UNIQUE_SESSIONS_ID', uniqueSessionId)
  },
  createCustomerSessions (context) {
    const uniqueSessionId = context.state.uniqueSessionsId
    const prodEvents = context.state.productEvents
    const trunstileEvents = context.state.trunstileEvents

    const customerData = []
    // тройной цикл, лол
    for (let id = 0; id < uniqueSessionId.length; id++) {
      const sesObj = { [uniqueSessionId[id]]: [] }
      for (let product = 0; product < prodEvents.length; product++) {
        if (uniqueSessionId[id] === prodEvents[product].sessionId) {
          sesObj[uniqueSessionId[id]].push(prodEvents[product])
        }
      }
      const tempObj = { timeData: [] }
      for (let event = 0; event < trunstileEvents.length; event++) {
        if (trunstileEvents[event].sessionId === uniqueSessionId[id]) {
          tempObj.timeData.push(trunstileEvents[event])
        }
      }
      Object.assign(sesObj, tempObj)
      customerData.push(sesObj)
    }

    context.commit('SET_CUSTOMER_DATA', customerData)
  },
  changeProductCount (context, data) {
    // call add product
    context.commit('ADD_NEW_PRODUCT', data)
  },
  addProduct (context, data) {
    // call add product
    context.commit('ADD_NEW_PRODUCT', data)
  },
  submitCurrentSession (context, data) {
    context.state.submittedSessions.push(data.currentSessionId)
  }
}
