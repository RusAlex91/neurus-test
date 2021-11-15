<template>
  <!-- force rerender because when change session product, reactivity dont trigger for some reason? idk  -->
  <div class="force-update" :key="componentKey">
    <div class="sessions" v-for="session in sessionData" :key="session">
      <session :uniqueSessionData="session" @forceRerender="forceRerender()" />
    </div>
  </div>
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
    this.sessionData = this.$store.getters.getSessions
  },
  data () {
    return {
      sessionData: null,
      componentKey: 0
    }
  },
  methods: {
    forceRerender () {
      console.log('force rr')
      this.componentKey += 1
    }
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
.sessions {
  margin-bottom: 50px;
}
</style>
