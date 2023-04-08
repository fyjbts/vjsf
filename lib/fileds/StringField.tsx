import { defineComponent,computed } from 'vue'
import { FiledPropsDefine,CommonWidgetNames } from '../types'
import {getWidget} from "../theme"

export default defineComponent({
  name: 'StringFeild',
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
    //   console.log(e)
      props.onChange(v)
    }
    const TextWidgetRef=computed(()=>{
      //props.uiSchema变化，widgetRef变化
      const widgetRef=getWidget(CommonWidgetNames.TextWidget,props)//uiSchema.widget
      return widgetRef.value
    })
    const  widgetOptionsRef=computed(()=>{
      //获取uiSchema自定义属性rest
      const {widget,properties,items,...rest}=props.uiSchema
      return rest
    })
    
    return () => {
        const {rootSchema,errorSchema,...rest}=props
        const TextWidget=TextWidgetRef.value//组件

     
      return (
        <TextWidget 
        {...rest}
         errors={errorSchema._errors}
         onChange={handleChange}
         options={ widgetOptionsRef.value}
         />
       
        // {...rest} 也有onChange，因此merge onChange成数组
        // <TextWidget {...rest} onChange={handleChange}/>
       
        // <input type="text" value={props.value as any} onInput={handleChange} />
      )
    }
  },
})
