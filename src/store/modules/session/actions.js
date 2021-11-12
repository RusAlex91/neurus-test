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
    console.table(prodEvents)
    const customerData = []

    for (let id = 0; id < uniqueSessionId.length; id++) {
      const sesObj = { [uniqueSessionId[id]]: [] }
      for (let product = 0; product < prodEvents.length; product++) {
        if (uniqueSessionId[id] === prodEvents[product].sessionId) {
          sesObj[uniqueSessionId[id]].push(prodEvents[product])
        }
      }
      customerData.push(sesObj)
    }

    context.commit('SET_CUSTOMER_DATA', customerData)
  }
}
