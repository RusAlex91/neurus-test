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
    // change static id to dynamic like FIND loop through all array and find correct one [0]
    state.customerData[0]['143c1ddd-be57-4644-ae9a-6b16fee9078b'].splice(
      index,
      1
    )
    console.log(state.customerData)
  },
  ADD_NEW_PRODUCT (state, event) {}
}
