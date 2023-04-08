import { defineComponent, ref, PropType, watch, nextTick } from 'vue'
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../../lib/types'
import FormItem,{withFormItem} from '../../lib/theme-default/FormItem'
const PasswordWidget = withFormItem(
  defineComponent({
    name: 'PasswordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        console.log(e)
        const value = e.target.value
        e.target.value = props.value
        //更新props.value
        props.onChange(value)
       
      }
      return () => {
        return (
            <input
              type="password"
              value={props.value as any}
              onInput={handleChange}
            />
        )
      }
    },
  })
)
export default PasswordWidget
