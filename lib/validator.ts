import Ajv, { ErrorObject } from 'ajv'
import { Schema } from './types'
import { isObject } from './utils'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18n = require('ajv-i18n')
import toPath from 'lodash.topath'

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
function toErrorSchema(errors: TransformerErrorObject[]) {
  if (errors.length < 1) return {}
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
   
    const patharr = property.split('/').filter(Boolean); // 把字符串切分成数组，去掉空字符串
    // /obj/a/0 [obj, a,0]
  
   const path = toPath(patharr) // /obj/a/0 [obj, a,0]

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

function TransformerErrors(
  errors: ErrorObject[] | null | undefined,
): TransformerErrorObject[] {
  //errors是数组
  if (errors === null || errors === undefined) return []
  //return 数组[{},{},{}]
  return errors.map(
    ({ message, instancePath, keyword, params, schemaPath }) => {
      return {
        name: keyword,
        property: `${instancePath}`,
        message,
        params,
        schemaPath,
      }
    },
  )
}

//校验数据
export async function  validateFormData(
  validator: Ajv, //类也是一种数据类型
  formData: any,
  schema: Schema,
  locale = 'zh',
  customValidate?: (data: any, errors: any) => void,//SchemaForm传递的函数定义
) {
  let validatorError: { message: string } | null = null
  try {
    //schema错误
    validator.validate(schema, formData)
  } catch (err: any) {
    validatorError = err
  }

  i18n[locale](validator.errors)

  let errors = TransformerErrors(validator.errors)
  if (validatorError) {
    errors = [
      ...errors,
      {
        message: validatorError.message,
      } as TransformerErrorObject,
    ]
  }
//   let errors=
// [
//   {
//     property: '/name',
//     schemaPath: '#/properties/name/test/minLength',
//     name: 'minLength',
//     params: { limit: 10 },
//     message: '不应少于 10 个字符'
//   },
//   {
//     property: '/name/a/0',
//     schemaPath: '#/properties/name/test',
//     name: 'test',
//     params: {},
//     message: '应当通过 "test 关键词校验"'
//   }
// ]
  const errorSchema = toErrorSchema(errors)

  if (!customValidate) {
    return {
      errors,
      errorSchema,
      vaild: errors.length === 0,
    }
  }

  /**
   * formData/errorSchema
   * {
   *    obj:{
   *      a:{b:str}
   *      _errors:[]
   *    }
   *
   * }
   *
   *
   */

  //自定义errorSchema
  const proxy = createErrorProxy()
  //自定义校验
  //customValidate自定义校验函数执行
  await customValidate(formData, proxy) //proxy
  
  const newErrorSchema = mergeObjects(errorSchema, proxy)
  return {
    errors,
    errorSchema: newErrorSchema,
    vaild: errors.length === 0,
  }
}

//创建自定义Error的代理对象
//raw.a.b.adddError=>使用proxy处理没有属性添加属性的过程
function createErrorProxy() {
  const raw = {}
  return new Proxy(raw, {
    get(target, key, reciver) {
      //递归终止条件
      if (key === 'addError') {
        //addError执行的函数
        //return 给proxy.key,即proxy.addError
        return (msg: string) => {
          //添加到对应属性的_errors属性中，一开始是空，之后变成一个数组
          const _errors = Reflect.get(target, '_errors', reciver)
          if (_errors && Array.isArray(_errors)) {
            _errors.push(msg)
          } else {
            ;(target as any)._errors = [msg]
          }
        }
      }
      //代理目标对象 target 中获取 key 属性的值
      const res = Reflect.get(target, key, reciver)
      if (res === undefined) {
        const p: any = createErrorProxy() //创建新的代理对象
        ;(target as any)[key] = p
        //return -get
        return p
      }
      //有res的情况,当执行完customValidate函数=>得到proxy，用到proxy.xx=>return res
      //return-get
      return res
    },
  })
}

//合并对象
export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  const acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {}
    const right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else {
      if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
        acc[key] = left.concat(right)
      } else {
        acc[key] = right
      }
    }
    return acc
  }, acc)
}


