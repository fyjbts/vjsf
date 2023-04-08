import { defineComponent, ref, PropType, watch } from 'vue'
import { SelectionWidgetPropsDefine ,SelectionWidgetDefine} from '../types'
import FormItem,{withFormItem} from '../theme-default/FormItem'

const Selection= withFormItem(defineComponent({
  name: 'SelectionWidget',
  props: SelectionWidgetPropsDefine,
  setup(props) {
    const currentValueRef = ref(props.value)
    //currentValueRef:选中的值
    watch(currentValueRef, (newv, oldv) => {
      if (newv !== props.value) {
        props.onChange(newv)
      }
    })
    //响应式数据value变化=>currentValueRef.value变化
    watch(
      () => props.value,
      (v) => {
        if (v !== currentValueRef.value) {
          currentValueRef.value = v
        }
      },
    )
    return () => {
      const { options } = props

      //v-model绑定select表单选中的值
      return (
        <select multiple={true} v-model={currentValueRef.value}>
          {options.map((op) => {
            return <option value={op.value}>{op.key}</option>
          })}
        </select>
      )
    }
  },
}))
export default Selection