<template>
  <div class="session">
    <div class="session-header">
      <span
        class="session-id"
        v-if="hideRealId"
        @click="hideRealId = !hideRealId"
        >Session name: {{ userFriendlySessionId }}</span
      >
      <span
        class="session-id"
        v-if="!hideRealId"
        @click="hideRealId = !hideRealId"
        >Session id: {{ currentSessionId }}</span
      >
    </div>
    <div class="session-body">
      <div class="session-body-time-wrapper">
        <div class="session-body__enter-time">
          <span class="session-body__enter-text">Вход </span>
          <span>{{ timeStampToDate(0) }}</span>
        </div>

        <div class="session-body__exit-time">
          <span class="session-body__exit-text">Выход </span>
          <span>{{ timeStampToDate(1) }}</span>
        </div>
      </div>
      <div class="session-products-wrapper">
        <div
          class="session-body__products"
          v-for="product in products"
          :key="product.id"
        >
          <hr />
          <div class="product">
            <span class="product-name">{{ product.productName }}</span>
            <div class="product-controls">
              <button
                :disabled="isLocked"
                class="product-controls__delete"
                @click="deleteProduct(product.productName)"
              >
                delete
              </button>
              <button
                :disabled="isLocked"
                class="product-controls__subsctract"
                @click="changeProductCount('take_off', product.productName)"
              >
                -
              </button>
              <span class="product-controls-display-count">{{
                product.productCount
              }}</span>
              <button
                :disabled="isLocked"
                class="product-controls__add"
                @click="changeProductCount('put_on', product.productName)"
              >
                +
              </button>
              <button
                :disabled="isLocked"
                @click="
                  ;(sessionListVisible = !sessionListVisible),
                    (this.chosenProduct = product.productName)
                "
              >
                [ ]=>[ ]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="session-controls">
      <button
        :disabled="isLocked"
        v-if="!add_product_modal"
        @click="add_product_modal = true"
      >
        Add product
      </button>
      <button :disabled="isLocked" @click="saveSession()">Save session</button>
    </div>

    <div class="add-product-modal" v-if="add_product_modal">
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
      <button
        :disabled="isLocked"
        v-if="add_product_modal"
        @click=";(add_product_modal = false), addProduct()"
      >
        Confirm
      </button>
    </div>
    <div class="sessions-list-wrapper" v-if="sessionListVisible">
      <div
        class="sessions-list"
        v-for="session in uniqueSessionsIds"
        :key="session"
      >
        <span
          v-if="session != this.currentSessionId"
          @click="changeSession(this.chosenProduct, session)"
        >
          {{ session }}</span
        >
      </div>
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
      isLocked: false,
      currentSessionId: null,
      sessionData: this.uniqueSessionData,
      shortSessionId: null,
      userFriendlySessionId: null,
      products: null,
      add_product_modal: false,
      modalProductName: null,
      modalProductCount: null,
      uniqueSessionsIds: null,
      sessionListVisible: false,
      chosenProduct: null,
      hideRealId: true
    }
  },
  mounted () {
    this.currentSessionId = Object.keys(this.sessionData)[0]
    this.setUserFriendlySessionId()
    setInterval(() => {
      this.sumAllProductPrice()
    }, 400)
    this.sumAllProductPrice()
    this.getLockedSessions()
    this.uniqueSessionsIds = this.$store.getters.getUniqueSessionsIds
    this.randomWord()
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
      this.getLockedSessions()
    },
    addProduct () {
      const productName = this.modalProductName
      const productCount = this.modalProductCount

      let type = null
      if (productCount < 0) {
        type = 'take_off'
      } else {
        type = 'put_on'
      }
      if (this.modalProductName === null || this.modalProductCount === null) {
        return
      }
      const sessionId = this.currentSessionId
      this.$store.dispatch('addProduct', {
        productName: productName,
        quantity: productCount,
        sessionId: sessionId,
        actionType: type
      })
      this.modalProductCount = null
      this.modalProductName = null
    },
    getLockedSessions () {
      const lockedSessions = this.$store.getters.getSubmittedSessions
      if (lockedSessions === undefined) {
        return
      }
      lockedSessions.forEach(session => {
        if (this.currentSessionId === session) {
          this.isLocked = true
        }
      })
    },
    changeSession (name, targetSession) {
      const details = {
        currentSessionId: this.currentSessionId,
        targetSessionId: targetSession,
        productName: name
      }
      this.$store.commit('CHANGE_PRODUCT_SESSION', details)
      this.$emit('forceRerender', true)
    },
    randomWord () {
      fetch('https://random-word-api.herokuapp.com/word?number=20&swear=0')
        .then(response => response.json())
        .then(
          dataWords =>
            (this.userFriendlySessionId = dataWords[6] + ' ' + dataWords[12])
        )
    }
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
.sessions-list span {
  cursor: pointer;
}

.sessions-list span:hover {
  color: tomato;
}

.session-header {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 10px;
}
.session-id {
  cursor: pointer;
  border: 2px solid gray;
  border-style: inset;
  background-color: gray;
}
.session-timestamps {
  display: flex;
  align-items: center;
  font-size: 10px;
}

.session-timestamps span {
  margin: 5px;
}

.session-body-time-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 2px solid gray;
  border-style: inset;
  background-color: gray;
}
.session-body__enter-text {
  color: lightgreen;
}
.session-body__exit-text {
  color: lightcoral;
}

.session-body-time-wrapper {
  margin-bottom: 20px;
}
.session-body__products {
  margin-bottom: 10px;
}
.session-products-wrapper {
}
.session-controls button {
  margin: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}
.product-controls {
  margin-top: 5px;
  display: flex;
  justify-content: center;
  column-gap: 5px;
  align-items: center;
}
.product-controls button {
  cursor: pointer;
}
.product-controls span {
  width: 25px;
}

.add-product-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-product-modal button {
  margin-top: 5px;
  margin-bottom: 5px;
}

.add-product-modal label {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}
</style>
