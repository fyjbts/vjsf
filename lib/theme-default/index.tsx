import SelectionWidget from './SelectionWidget'
import NumberWidget from './NumberWidget'
import TextWidget from './TextWidget'

import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { defineComponent } from 'vue'
const CommonWidget = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(props, ctx) {
    return () => null
  },
})

export default {
  widgets: {
    SelectionWidget,
    TextWidget,
    NumberWidget,
  },
}
