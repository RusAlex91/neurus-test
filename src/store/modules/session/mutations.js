export default {
  SET_PRODUCT_EVENTS (state, events) {
    state.productEvents = events
  },
  SET_TRUNSTILE_EVENTS (state, events) {
    state.trunstileEvents = events
  },
  SET_UNIQUE_SESSIONS_ID (state, uniqueIds) {
    state.uniqueSessionsId = uniqueIds
  },
  SET_CUSTOMER_DATA (state, data) {
    state.customerData = data
  },
  DELETE_PRODUCT (state, prodName) {
    const index = state.customerData[0][
      '143c1ddd-be57-4644-ae9a-6b16fee9078b'
    ].findIndex(c => c.productName === prodName)
    // change static id to dynamic like FIND loop through all array and find correct one [0] https://www.py4u.net/discuss/275562
    state.customerData[0]['143c1ddd-be57-4644-ae9a-6b16fee9078b'].splice(
      index,
      1
    )
  },
  ADD_NEW_PRODUCT (state, details) {
    const product = {}
    function uniqueID () {
      return Math.floor(Math.random() * Date.now())
    }
    const id = uniqueID()

    const type = 'put_on'

    const currentDate = new Date()
    const timestamp = currentDate.getTime()

    const productName = details.productName
    const productCount = details.quantity

    const sessionId = details.sessionId

    product.id = id
    product.type = type
    product.timestamp = timestamp
    product.productName = productName
    product.productCount = productCount
    product.sessionId = sessionId

    console.log(Object.keys(state.customerData[0])[0])
    for (let uniqueId = 0; uniqueId < state.customerData.length; uniqueId++) {
      if (Object.keys(state.customerData[uniqueId])[0] === details.sessionId) {
        state.customerData[uniqueId][sessionId].push(product)
      }
    }
  },
  CHANGE_PRODUCT_SESSION (state, details) {
    const productName = details.productName
    const productEvents = []

    for (let uniqueId = 0; uniqueId < state.customerData.length; uniqueId++) {
      if (
        Object.keys(state.customerData[uniqueId])[0] ===
        details.currentSessionId
      ) {
        // f

        var i
        for (
          i = state.customerData[uniqueId][details.currentSessionId].length - 1;
          i >= 0;
          i -= 1
        ) {
          debugger
          if (
            state.customerData[uniqueId][details.currentSessionId][i]
              .productName === productName
          ) {
            productEvents.push(
              state.customerData[uniqueId][details.currentSessionId][i]
            )
            state.customerData[uniqueId][details.currentSessionId].splice(i, 1)
          }
        }

        // f
      }
    }
    for (let session = 0; session < state.customerData.length; session++) {
      if (
        Object.keys(state.customerData[session])[0] === details.targetSessionId
      ) {
        const concatArr = state.customerData[session][
          details.targetSessionId
        ].concat(productEvents)
        state.customerData[session][details.targetSessionId] = concatArr
      }
    }
    console.log(state.customerData)
  }
}
