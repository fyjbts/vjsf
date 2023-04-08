import Ajv, { ErrorObject } from 'ajv'
import { Schema } from '../lib/types'
import { isObject } from '../lib/utils'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18n = require('ajv-i18n')
import toPath from '../node_modules/lodash.topath/index.js'

export interface TransformerErrorObject {
  name: string
  property: string //`${instancePath}`
  message: string | undefined //error message
  params: Record<string, any>
  schemaPath: string
}
interface ErrorSchemaObject {
  [level: string]: ErrorSchema
}
export type ErrorSchema = ErrorSchemaObject & {
  _errors?: string[]
}

//将errors数组转换为对象
const errors=
[
  {
    property: '/name',
    schemaPath: '#/properties/name/test/minLength',
    name: 'minLength',
    params: { limit: 10 },
    message: '不应少于 10 个字符'
  },
  {
    property: '/name',
    schemaPath: '#/properties/name/test',
    name: 'test',
    params: {},
    message: '应当通过 "test 关键词校验"'
  }
]
function toErrorSchema(errors: TransformerErrorObject[]) {
  if (errors.length < 1) return {}
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
   
   
    // const path = toPath(property.slice(1).split('/')) // /obj/a/0 [obj, a,0]
   const path = toPath(property) // /obj/a/0 [obj, a,0]

    
    let parent = errorSchema //对象的引用{}

    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1) //删除根节点为空
    }
   
    //遍历path
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment] //{ obj: { a: {} } }
    }

    if (Array.isArray(parent._errors)) {
      ;(parent._errors as any) = parent._errors.concat(message || '')
    } else {
      if (message) {
        ;(parent._errors as any) = [message]
      }
    }
    return errorSchema
  }, {} as ErrorSchema)
}



  const errorSchema = toErrorSchema(errors)
console.log(errorSchema);


  

