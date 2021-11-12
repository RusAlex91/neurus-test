<template>
  <session />
</template>

<script>
import Session from './components/Session.vue'

export default {
  name: 'App',
  components: {
    Session
  },
  async mounted () {
    await this.$store.dispatch('getProductEvents')
    await this.$store.dispatch('getTrunstileEvents')
    await this.$store.dispatch('getUniqueId')
    await this.$store.dispatch('createCustomerSessions')
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
