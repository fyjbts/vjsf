<template>
  <input type="text" @input="handleChange" />
</template>

<script lang="ts" setup="props">
import { ref } from 'vue'
import { FiledPropsDefine, Schema } from '../types'
import { SchemaFormContextKey } from '../context'
//使用props
const props = defineProps(FiledPropsDefine)

//e是事件对象
const handleChange = (e: any) => {
  console.log(e)
  //执行父组件传递过的函数
  props.onChange(e.target.value)
}
</script>

<style></style>
