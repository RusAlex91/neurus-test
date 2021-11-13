<template>
  <div class="session">
    <div class="session-header">
      <span class="session-id"> generated session id</span>
      <div class="session-timestamps">
        <span class="session-timestamps__enter">
          timestamp enter
        </span>
        <span class="session-timestamps__exit">
          timestamp exit
        </span>
      </div>
    </div>
    <div class="session-body">
      <div class="session-body-time-wrapper">
        <div class="session-body__enter-time">
          <span>Вход</span>
          <span>TimeStamp - Enter</span>
        </div>
        <div class="session-body__exit-time">
          <span>Выход</span>
          <span>TimeStamp - Exit</span>
        </div>
      </div>
      <div class="session-body__products">
        <div class="product">
          <span class="product-name">Соус Сальса, 210г</span>
          <div class="product-controls">
            <button class="product-controls__delete">delete</button>
            <button class="product-controls__subsctract">-</button>
            <button class="product-controls-display-count">5</button>
            <button class="product-controls__add">+</button>
          </div>
        </div>
      </div>
    </div>
    <div class="session-controls">
      <button>Add product</button>
      <button>Save</button>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    // setTimeout(() => {
    //   const prodName = 'Матча латте, 100г'
    //   this.$store.commit('DELETE_PRODUCT', prodName)
    // }, 2000)
    setTimeout(() => {
      const details = {
        productName: 'Ареееххх',
        quantity: 123,
        sessionId: '143c1ddd-be57-4644-ae9a-6b16fee9078b'
      }
      this.$store.commit('ADD_NEW_PRODUCT', details)
    }, 2000)
    setTimeout(() => {
      const details = {
        currentSessionId: '6822d3db-a766-499f-b6ca-b9d6382c94b0',
        targetSessionId: '143c1ddd-be57-4644-ae9a-6b16fee9078b',
        productName: 'Конфеты шоколадные с фундуком и морковью, 150г'
      }
      this.$store.commit('CHANGE_PRODUCT_SESSION', details)
    }, 2000)
  }
}
</script>

<style scoped>
.session {
  width: 1400px;
  height: 800px;
  background-color: lightgray;
  margin: 0 auto;
  box-shadow: 2px 2px 3px 3px rgba(126, 126, 126, 0.5);
}
.session-header {
  display: flex;
  flex-direction: column;
}
</style>
