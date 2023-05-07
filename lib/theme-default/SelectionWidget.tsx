import { defineComponent, ref, PropType, watch } from 'vue'
import { SelectionWidgetPropsDefine, SelectionWidgetDefine } from '../types'
import FormItem, { withFormItem } from './FormItem'

const Selection = withFormItem(
  defineComponent({
    name: 'SelectionWidget',
    props: SelectionWidgetPropsDefine,
    setup(props) {
      const currentValueRef = ref(props.value)
      //currentValueRef:选中的值 选中某个值，监测变化。类型oninput变化时执行onChange
      watch(currentValueRef, (newv, oldv) => {
        if (newv !== props.value) {
          props.onChange(newv) //数组
        }
      })
      //value手动修改=>currentValueRef.value绑定的select值变化
      //h函数没有直接使用因为props.value，因此修改props.value，不执行。监测props.value变化=>更新currentValueRef响应式=>更新h函数
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

        //v-model绑定select表单选中的值-响应式，选中哪个-select的value值就是哪个
        return (
          <select multiple={true} v-model={currentValueRef.value}>
            {options.map((op) => {
              return <option value={op.value}>{op.key}</option>
            })}
          </select>
        )
      }
    },
  }),
)
export default Selection
