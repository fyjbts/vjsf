import { inject ,Ref} from 'vue'
import { CommonWidgetDefine, SchemaItemDefine,Theme } from './types'
export function useVJSFContext() {
  const context: {
     SchemaItem: SchemaItemDefine ,
     formatMapRef:Ref<{[key:string]:CommonWidgetDefine}>
    }
      | undefined =
    inject(SchemaFormContextKey) //接收SchemaForm
  if (!context) {
    throw Error('SchemaForm should be used')
  }
  return context
}
export const SchemaFormContextKey = Symbol()
