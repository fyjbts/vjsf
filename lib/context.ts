import { inject, Ref } from 'vue'
import { CommonWidgetDefine, SchemaItemDefine, Theme } from './types'
export const SchemaFormContextKey = Symbol() //唯一值

export function useVJSFContext() {
  const context:
    | {
        SchemaItem: SchemaItemDefine //组件
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>
      }
    | undefined = inject(SchemaFormContextKey) //接收SchemaForm
  if (!context) {
    throw Error('SchemaForm should be used')
  }
  return context
}
