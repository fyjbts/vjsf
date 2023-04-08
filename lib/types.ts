//存放类型声明
import { PropType, defineComponent, DefineComponent } from 'vue'
import SelectionWidget from './widget/SelectionWidget'
import {ErrorSchema} from "./validator"
import {FormatDefinition} from "ajv"
//枚举
export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string }

//定义schema对象类型
// type Schema = any
export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  // TODO: uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

//props定义提取，需要声明为as const=>readonly
export const FiledPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },

  uiSchema:{
    type:Object as PropType<UISchema>,
    required:true
  },
  errorSchema:{
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
 
} as const

export const TypeHelperComponent = defineComponent({
  props: FiledPropsDefine,
})
export type SchemaItemDefine = DefineComponent<typeof FiledPropsDefine>
export type CommonFieldType = typeof TypeHelperComponent

/* const schema:Schema={
    type:SchemaTypes.NUMBER//type:"number"
    
} */

export const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors:{
    type:Array as PropType<string[]>,
    
  },
  schema:{
    type:Object as PropType<Schema>,
    required:true
  },

  options:{
    type:Object as PropType<{[key:string]:any}>,
  }
} as const //props提取

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true,
  },
  
} as const

export type CommonWidgetDefine = DefineComponent<typeof CommonWidgetPropsDefine>
export type SelectionWidgetDefine = DefineComponent<
  typeof SelectionWidgetPropsDefine
>

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget',
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'TextWidget',
}
export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine
  }
}


export type UISchema={
  widget?:string |CommonWidgetDefine,
  properties?:{
    [key:string]:UISchema
  },
  items?:UISchema|UISchema[]
}&{
  //用户自定义属性
  [key:string]:any//w:
}


export interface CustomFormat {
  name:string,
  definition:FormatDefinition<string>,
  component:CommonWidgetDefine,

}