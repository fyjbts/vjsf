import { defineComponent, inject, DefineComponent, ExtractPropTypes,PropType } from 'vue'
import { FiledPropsDefine, Schema,SelectionWidgetNames } from '../types'
import { SchemaFormContextKey, useVJSFContext } from '../context'
import SchemaItems from '../SchemaItems'
import { isObject } from '../utils'
import { createUseStyles } from 'vue-jss'
import { constant } from 'lodash'
import {getWidget} from "../theme"

// import SelectionWidget  from '../widget/Selection'

const useStyles = createUseStyles({
    container: {
      border: '1px solid #eee',
    },
    actions: {
      background: '#eee',
      padding: 10,
      textAlign: 'right',
    },
    action: {
      '& + &': {
        marginLeft: 10,
      },
    },
    content: {
      padding: 10,
    },
  })
//数组排序组件
const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  //ArrayItemWrapper组件操作ArrayField内容，执行其函数
  props: {
    onAdd:{
        type:Function as PropType<(index:number)=>void>,
        required:true
    },
    onDelete:{
        type:Function as PropType<(index:number)=>void>,
        required:true
    },
    onUp:{
        type:Function as PropType<(index:number)=>void>,
        required:true
    },
    onDown:{
        type:Function as PropType<(index:number)=>void>,
        required:true
    },
    index:{
        type:Number,
        required:true
    }
  },
  setup(props, { slots }) {
    const classesRef=useStyles();
    
    const handleAdd = () => props.onAdd(props.index)
    const handleDown = () => props.onDown(props.index)
    const handleUp = () => props.onUp(props.index)
    const handleDelete = () => props.onDelete(props.index)

    return () => {
    const classes=classesRef.value
   
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>新增</button>
            <button class={classes.action} onClick={handleDelete}>删除</button>
            <button class={classes.action} onClick={handleUp}>上移</button>
            <button class={classes.action} onClick={handleDown}>下移</button>
          </div>
          <div></div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

/**
 * {
 *  item:{type:string}
 * }
 *
 * {
 *  item:[
 *   {type:string},
 *   {type:number},
 * ]
 *
 * {
 *  item:{type:string,enum:["1","2"]}
 * }
 *
 * }
 *
 *  */
export default defineComponent({
  name: 'ArrayField',
  props: FiledPropsDefine,
  setup(props) {
    //组件数据类型
    const context = useVJSFContext()
    const handleArrayFieldChange = function (v: any, index: number) {
      const arr = Array.isArray(props.value) ? props.value : []
      arr[index] = v
      //对象含有数组的情况：onChange是handleObjectFieldChange
      props.onChange(arr)
    }
    //新增 处理arr数组
    const handleAdd=function(index:number){
        const {value}=props
        const arr=Array.isArray(value)?value:[]
        arr.splice(index+1,0,undefined)
        props.onChange(arr)
    }
    const handleDelete=function(index:number){
        const {value}=props
        const arr=Array.isArray(value)?value:[]
        arr.splice(index,1)
        props.onChange(arr)
    }
    const handleUp=function(index:number){
        if(index===0) return
        const {value}=props
        const arr=Array.isArray(value)?value:[]
        
        const item=arr.splice(index,1)
        arr.splice(index-1,0,item[0])
        props.onChange(arr)
    }
    const handleDown=function(index:number){
        const {value}=props
        const arr=Array.isArray(value)?value:[]
        
        const item=arr.splice(index,1)
        arr.splice(index+1,0,item[0])
        props.onChange(arr)
    }
    const SelectionWidgetRef=getWidget(SelectionWidgetNames.SelectionWidget)
    return () => {
    // const context=useVJSFContext()
    //inject受到theme，按需取对应的widget
    // const SelectionWidget=context.theme.widgets.SelectionWidget;
    const SelectionWidget=SelectionWidgetRef.value;
      const { schema, rootSchema, value,errorSchema,uiSchema } = props
      const SchemaItem = context.SchemaItem
      const isMultitype = Array.isArray(schema.items)

      const isSelect = schema.items && (schema.items as any).enum

      //固定长度数组
      if (isMultitype) {
        const items: Schema[] = schema.items as any
        const arr = Array.isArray(value) ? value : []
        return items.map((s: Schema, index: number) => {
          const itemUISchema=uiSchema.items
          const us=Array.isArray(itemUISchema)?itemUISchema[index]||{}:itemUISchema||{}
         
          return (
            
            <SchemaItems
              schema={s}
              rootSchema={rootSchema}
              value={arr[index]}
              onChange={(v: any) => handleArrayFieldChange(v, index)}
              key={index}
              errorSchema={errorSchema[index]||{}}
              uiSchema={us as any}
            />
           
          )
        })
      }
      //!isMultitype && !isSelect 单类型数组
      else if (!isSelect) {
        const arr = Array.isArray(value) ? value : []
       
        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
            index={index}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onDown={handleDown}
            onUp={handleUp}
          >
            <SchemaItem
              //单类型数组的schema相同
              schema={schema.items as Schema}
              rootSchema={rootSchema}
              value={v}
              key={index}
              onChange={(v: any) => {
                handleArrayFieldChange(v, index)
              }}
              errorSchema={errorSchema[index]||{}}
              uiSchema={uiSchema.items as any||{}}
            />
            </ArrayItemWrapper>
          )
        })
      }else{//多选数组 enum
        console.log("schema",schema);
        
        const enumOptions=(schema as any).items.enum;
        const options=enumOptions.map((e:any)=>({
            key:e,
            value:e
        }))
       
        //直接更新数组，而不是更新数组某一项
        return (
            <SelectionWidget 
            onChange={props.onChange} 
            value={props.value} 
            options={options}
            errors={errorSchema._errors}
            schema={schema}
            />
        )
       
      }
    }
  },
})
