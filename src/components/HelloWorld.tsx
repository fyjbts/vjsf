import { defineComponent } from 'vue'
const PropsType = {
  msg: String,
  age: {
    type: Number,
    required: true,
  },
} as const

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
    age: Number,
  },
  setup(props, ctx) {
    return () => {
      //props是setup的参数
      return <div>{props.age}</div>
    }
  },
  // props:PropsType,
})
