/* eslint-disable */
// eslint-disable-next-line vue/no-setup-props-destructure
import {
  defineComponent,
  PropType,
  provide,
  reactive,
  Ref,
  shallowRef,
  watch,
  watchEffect,
  ref,
  computed
} from 'vue'
import { CustomFormat, Schema, SchemaTypes, Theme, UISchema,CommonWidgetDefine  } from './types' //类型声明
import SchemaItem from './SchemaItems'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'

import { validateFormData, ErrorSchema } from './validator'
interface ContextRef {
  doValidate: () => Promise<{
    errors: any[]
    vaild: boolean
  }>
}

const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers:true
}
export default defineComponent({
  name: 'SchemaForm',
  props: {
    //schema编辑器的内容
    schema: {
      type: Object as PropType<Schema>, //引入Schema类型
      required: true,
    },
    //data编辑器的内容
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    /* theme:{
        type:Object as  PropType<Theme>,
        required:true
    } */
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    //自定义校验函数
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    customFormats:{
      type: [Array,Object] as PropType<CustomFormat[]|CustomFormat>,
    },
    uiSchema:{
      type:Object as PropType<UISchema>
    }
  },
  setup(props, ctx) {
   

    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    const validatorRef: Ref<Ajv> = shallowRef() as any

    //监测ajvOptions变化=>validatorRef就会改变
    //一开始就会执行一次
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        // props.ajvOptions可能变化
        ...props.ajvOptions,
      })
    })
    // const validator=new Ajv({
    //     ...defaultAjvOptions,
    //     // props.ajvOptions可能变化，computed
    //     ...props.ajvOptions
    // })

    if(props.customFormats){
      const customFormats=Array.isArray(props.customFormats)?props.customFormats:[props.customFormats]
      customFormats.forEach((format)=>{
        validatorRef.value.addFormat(format.name,format.definition)
      })
    }

    const validReSolveRef = ref() //保存resolve
    const validateIndex = ref(0)

    //监测 props.value变化，如果之前异步校验还没结束，自动执行doValidate校验
    watch(
      () => props.value,
      () => {
        if (validReSolveRef.value) {
          doValidate()
        }
      },
      {
        deep: true,
      },
    )

    //校验
    async function doValidate() {
      //记录校验次数  --点击校验，校验延迟，此时输入的props.value变化=>执行校验。validateIndex变化
      //当点击校验的那个index就跟全局validateIndex不同
      const index = validateIndex.value += 1
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      )
      
      if (index !== validateIndex.value) return//第一次点击校验不执行
      errorSchemaRef.value = result.errorSchema//执行最后一次确定好的校验
      validReSolveRef.value(result) //resolve(result) 异步操作完成 app的onclick事件执行then
      
      validReSolveRef.value = undefined
    }
    watch(
      //监测props.contextRef的引用：undefined或者有值
      () => props.contextRef,
      () => {
        //不是undefined
        if (props.contextRef) {
          //更改contextRef.value，使得父组件button声明函数更新
          props.contextRef.value = {
            doValidate() {//async doValidate
              //ajv.validate(schema规则,data)
              /* const valid=validatorRef.value.validate(props.schema,props.value) as boolean
              return {
                vaild: valid,//true
                errors: validatorRef.value.errors || [],
              } */

              //await validateFormData得到validateFormData的返回值=>then操作

              return new Promise((resolve) => {
                validReSolveRef.value = resolve
                doValidate() //校验
              })
              /*   const result=await validateFormData(
                validatorRef.value,
                props.value,
                props.schema,
                props.locale,
                props.customValidate
                 errorSchemaRef.value=result.errorSchema;
              
              return result
                ) */
            },
          }
        }
      },
      {
        immediate: true,
      },
    )
    const formatMapRef = computed(() => {
      const result: { [key: string]: CommonWidgetDefine } = {};
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats) ? props.customFormats : [props.customFormats];
        return customFormats.reduce((result,format )=> {
          // validatorRef.value.addFormat(format.name, format.definition);
          result[format.name]=format.component
          return result;
        },{} as {[key:string]:CommonWidgetDefine});
      }else{
        return {}
      }
      
    });
     //SchemaItem响应式变化=>provide不会更新执行
    // const context:any=reactive({SchemaItem})
    //provide：theme对象
    const context: any = {
      SchemaItem,
      formatMapRef
      // theme:props.theme
    }
    provide(SchemaFormContextKey, context) //传递值给Field组件

    const handleChange = (v: any) => {
      props.onChange(v)
    }
    return () => {
      const { schema, value,uiSchema } = props

      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          onChange={handleChange}
          value={value}
          errorSchema={errorSchemaRef.value || {}}
          uiSchema={uiSchema|| {}}
        />
      )
    }
  },
})
