import { defineComponent, ref, PropType, watch, nextTick,computed } from 'vue'
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../types'
import FormItem, { withFormItem } from './FormItem'
const TextWidget = withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        console.log(e)
        const value = e.target.value
        e.target.value = props.value
        //更新props.value
        props.onChange(value)
        /*  nextTick(()=>{
              if(props.value!==e.target.value){//正常情况一定相等（比如prop正常执行onchange）此时完成dom更新，执行该回调函数
                  e.target.value=props.value//当StringField不执行onchange时，props.value一直初始值1，执行该回调=>两个值相同
              }
          }) */
      }
      const styleRef=computed(()=>{
        return {
          color:(props.options && props.options.color)||"black"
        }
      })
    
      return () => {
        return (
          // <FormItem {...props}>
          <input
            type="text"
            value={props.value as any}
            onInput={handleChange}
            style={styleRef.value}
            
          />
          // </FormItem>
        )
      }
    },
  }),
)
export default TextWidget
