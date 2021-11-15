export default {
  getSessions (state) {
    return state.customerData
  },
  getSubmittedSessions (state) {
    return state.submittedSessions
  },
  getUniqueSessionsIds (state) {
    return state.uniqueSessionsId
  }
}
