<template>
  <div class="session">
    <div class="session-header">
      <span class="session-id">{{ userFriendlySessionId }}</span>
      <div class="session-timestamps">
        <span class="session-timestamps__enter">
          {{ timeStampToDate(0) }}
        </span>
        <span>---</span>
        <span class="session-timestamps__exit">
          {{ timeStampToDate(1) }}
        </span>
      </div>
    </div>
    <div class="session-body">
      <div class="session-body-time-wrapper">
        <div class="session-body__enter-time">
          <span>Вход</span>
          <span>{{ timeStampToDate(0) }}</span>
        </div>
        <div class="session-body__exit-time">
          <span>Выход</span>
          <span>{{ timeStampToDate(1) }}</span>
        </div>
      </div>
      <div
        class="session-body__products"
        v-for="product in products"
        :key="product.id"
      >
        <div class="product">
          <span class="product-name">{{ product.productName }}</span>
          <div class="product-controls">
            <button
              class="product-controls__delete"
              @click="deleteProduct(product.productName)"
            >
              delete
            </button>
            <button
              class="product-controls__subsctract"
              @click="changeProductCount('take_off', product.productName)"
            >
              -
            </button>
            <span class="product-controls-display-count">{{
              product.productCount
            }}</span>
            <button
              class="product-controls__add"
              @click="changeProductCount('put_on', product.productName)"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="session-controls">
      <button v-if="!add_product_modal" @click="add_product_modal = true">
        Add product
      </button>
      <hr />
      <form action="" class="add-product-modal" v-if="add_product_modal">
        <label for="add-product-input-name">
          Название продукта:
          <input
            type="text"
            id="add-product-input-name"
            v-model="modalProductName"
        /></label>

        <label for="add-product-input-quality">
          Количество:
          <input
            type="number"
            id="add-product-input-quality"
            v-model="modalProductCount"
        /></label>
        <button v-if="add_product_modal" @click="add_product_modal = false, ">
          Confirm
        </button>
      </form>

      <button>Save</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uniqueSessionData: {
      required: false
    }
  },
  data () {
    return {
      isLoked: false,
      currentSessionId: null,
      sessionData: this.uniqueSessionData,
      shortSessionId: null,
      userFriendlySessionId: null,
      products: null,
      add_product_modal: false,
      modalProductName: null,
      modalProductCount: null
    }
  },
  mounted () {
    this.currentSessionId = Object.keys(this.sessionData)[0]
    this.setUserFriendlySessionId()
    this.sumAllProductPrice()
    // setTimeout(() => {
    //   const lockedSessions = this.$store.submittedSessions
    //   if (lockedSessions === undefined) {
    //     return
    //   }
    //   const isLoked = lockedSessions.forEach(session => {
    //     if (this.currentSessionId === session) {
    //       return true
    //     }
    //   })
    //   this.isLoked = isLoked
    // }, 3000)

    // setTimeout(() => {
    //   const details = {
    //     productName: 'Ареееххх',
    //     quantity: 123,
    //     sessionId: '143c1ddd-be57-4644-ae9a-6b16fee9078b',
    //     actionType: 'put_on',
    //     shortSessionId: this.sessionId.slice(5)
    //   }
    //   this.$store.commit('ADD_NEW_PRODUCT', details)
    // }, 2000)
    // setTimeout(() => {
    //   const details = {
    //     currentSessionId: '6822d3db-a766-499f-b6ca-b9d6382c94b0',
    //     targetSessionId: '143c1ddd-be57-4644-ae9a-6b16fee9078b',
    //     productName: 'Конфеты шоколадные с фундуком и морковью, 150г'
    //   }
    //   this.$store.commit('CHANGE_PRODUCT_SESSION', details)
    //   this.$store.dispatch('changeProductCount', {
    //     currentSessionId: '6822d3db-a766-499f-b6ca-b9d6382c94b0',
    //     productName: 'Конфеты шоколадные с фундуком и морковью, 150г',
    //     count: 10,
    //     actionType: 'take_off',
    //     changedByUser: true
    //   })
    //   // change put-off

    // }, 2000)
  },
  methods: {
    setUserFriendlySessionId () {
      this.userFriendlySessionId = this.currentSessionId.slice(0, 5)
    },
    timeStampToDate (index) {
      const date = new Date(this.sessionData.timeData[index].timestamp)
      const shortDate =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds() +
        date.getMilliseconds()
      return shortDate
    },
    sumAllProductPrice () {
      const productsArr = this.sessionData[this.currentSessionId]
      const sortedProdArr = productsArr.sort((a, b) =>
        a.productName > b.productName ? 1 : -1
      )
      console.log(this.uniqueSessionData)
      var product
      for (product = sortedProdArr.length - 1; product >= 0; product -= 1) {
        if (sortedProdArr[product - 1] === undefined) {
          break
        }
        if (
          sortedProdArr[product].productName ===
          sortedProdArr[product - 1].productName
        ) {
          sortedProdArr[product - 1].productCount =
            sortedProdArr[product - 1].productCount +
            sortedProdArr[product].productCount
          sortedProdArr.splice(product, 1)
        }
      }
      this.products = sortedProdArr
    },
    deleteProduct (prodName) {
      this.$store.commit('DELETE_PRODUCT', {
        name: prodName,
        sessionId: this.currentSessionId
      })
    },
    changeProductCount (action, productName) {
      const quantity = action === 'put_on' ? 1 : -1
      this.$store.dispatch('changeProductCount', {
        productName: productName,
        quantity: quantity,
        sessionId: this.currentSessionId,
        actionType: action
      })
      this.sumAllProductPrice()
    },
    saveSession () {
      this.$store.dispatch('submitCurrentSession', {
        currentSessionId: this.currentSessionId
      })
    },
    addProduct () {}
  }
}
</script>

<style scoped>
.session {
  width: 500px;
  background-color: lightgray;
  margin: 0 auto;
  box-shadow: 2px 2px 3px 3px rgba(126, 126, 126, 0.5);
}
.session-header {
  display: flex;
  flex-direction: column;
}
</style>
