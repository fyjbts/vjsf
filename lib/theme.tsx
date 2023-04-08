import {
  defineComponent,
  PropType,
  computed,
  provide,
  inject,
  Ref,
  ComputedRef,
  ref,
  ExtractPropTypes,
} from 'vue'
import {
  Theme,
  CommonWidgetNames,
  SelectionWidgetNames,
  UISchema,
  CommonWidgetDefine,
  FiledPropsDefine,
} from './types'
import { useVJSFContext } from './context'
import def from 'ajv-i18n'
import { isObject } from 'lodash'
const THEME_PROVIDER_KEY = Symbol()
//provide提供组件
const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme) //ref对象：context.value
    provide(THEME_PROVIDER_KEY, context)
    // 插槽显示 <slot></slot>
    return () => slots.default && slots.default()
  },
})

//inject获取组件
//name接收几个固定值=>字面量
export function getWidget<T extends CommonWidgetNames | SelectionWidgetNames>(
  name: T,
  props?: ExtractPropTypes<typeof FiledPropsDefine>,
) {
  const formContext = useVJSFContext()
  if (props) {
    const { uiSchema, schema } = props
    //uiSchema存在优先返回uiSchema.widget组件
    //uiSchema.widget是否存在对应属性uiSchema.widget，没有则执行下面的widget
    if (uiSchema?.widget && isObject(uiSchema?.widget)) {
      return ref(uiSchema.widget)
    }
    console.log("schema.format",schema.format);
    
    if (schema.format) {
      if (formContext.formatMapRef.value[schema.format]) {
        return ref(formContext.formatMapRef.value[schema.format])
      }
    }
  }

  // | 或者 可选类型
  const context: Ref<Theme> | undefined = inject(THEME_PROVIDER_KEY)
  if (!context) {
    throw Error('vjsf theme required')
  }

  //可能context.value会变化
  // const widget=context.value.widgets[name]//context.value:props.theme
  const widgetRef = computed(() => {
    return context.value.widgets[name]
  })
  return widgetRef
}
export default ThemeProvider
