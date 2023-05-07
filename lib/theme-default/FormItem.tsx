import { defineComponent } from 'vue'
import { CommonWidgetDefine, CommonWidgetPropsDefine } from '../types'
import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  container: {},
  label: {
    display: 'block',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    margin: '5px 0',
    padding: 0,
    paddingLeft: 20,
  },
})

const FormItem = defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles()
    return () => {
      const { schema, errors } = props
      const classes = classesRef.value
      return (
        <div>
          <label class={classes.label}>{schema.title}</label>
          {slots.default && slots.default()}
          <ul class={classes.errorText}>
            {errors?.map((err) => {
              return <li>{err}</li>
            })}
          </ul>
        </div>
      )
    }
  },
})

export default FormItem
//HCO:Higher Ordeer Component：高阶组件
export function withFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget.name}`, //组件名
    props: CommonWidgetPropsDefine, //props是使用该return组件<defineComponent>传递的参数
    setup(props, { attrs, slots }) {
      //attrs:props没有声明接收到的属性：适用于SelectionWidget
      return () => {
        // console.log("props",props.errors);

        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs}></Widget>
          </FormItem>
        )
      }
    },
  }) as CommonWidgetDefine
}
;``
