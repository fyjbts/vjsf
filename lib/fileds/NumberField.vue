<template>
  <input type="number" @input="handleChange" />
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
  //input的值无论是数字还是字符串=>input.value还是字符串
  const value = e.target.value
  const num = Number(value)
  props.onChange(isNaN(num) ? value : num)
}
</script>

<style></style>
