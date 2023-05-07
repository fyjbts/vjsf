<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" :age="12" />
    <p>{{ state.name }}</p>
    <p>{{ name }}</p>
    <p>{{ computedNameRef }}</p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  ref,
  computed,
  watchEffect,
} from 'vue'
import HelloWorld from './components/HelloWorld.vue'

interface Config {
  name: string
}
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup(props, { slots, attrs, emit }) {
    //ref：{value:xx}
    const nameRef = ref('jockey')
    const state = reactive({ name: 'jockey' })
    setTimeout(() => {
      nameRef.value + '2'
    }, 2000)
    const computedNameRef = computed(() => {
      return nameRef.value + '2'
    })
    watchEffect(() => {
      console.log(nameRef.value)
    })
    return {
      state,
      name: nameRef,
      computedNameRef,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
