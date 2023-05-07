import { FiledPropsDefine, CommonWidgetNames } from '../types'
import { defineComponent } from 'vue'
import { getWidget } from '../theme'

export default defineComponent({
  name: 'NumberFeild',
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      const num = Number(v)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        //执行app的onChange
        props.onChange(num)
      }
    }

    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)
    return () => {
      //NumberWidget的引用
      const NumberWidget = NumberWidgetRef.value
      //...rest是剩余的属性:属性值
      const { rootSchema, errorSchema, ...rest } = props
      return (
        <NumberWidget
          {...rest}
          onChange={handleChange}
          errors={errorSchema._errors}
        />
      )
      //   return <input value={value as any} type="number" onInput={handleChange} />
    }
  },
})
