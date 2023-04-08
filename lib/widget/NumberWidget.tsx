import { defineComponent, ref, PropType, watch ,nextTick } from 'vue'
import { CommonWidgetDefine,CommonWidgetPropsDefine} from '../types'
import FormItem,{withFormItem} from '../theme-default/FormItem'

const NumberWidget= withFormItem(defineComponent({
  name: 'NumberWidget',
  props: CommonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
        const value = e.target.value
        e.target.value=props.value
        //更新props.value
        props.onChange(value)
        
      }
    return () => {
        const { value } = props
        return <input value={value as any} type="number" onInput={handleChange} />
    }
  },
}))
export default NumberWidget