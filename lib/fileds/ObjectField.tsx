import { defineComponent, inject, DefineComponent, ExtractPropTypes } from 'vue'
import { FiledPropsDefine } from '../types'
import { SchemaFormContextKey, useVJSFContext } from '../context'
// import SchemaItem from '../SchemaItems'
import { isObject } from '../utils'

// ObjectField组件作用：将schema渲染成表单，渲染内容是properties的name和age
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
}

export default defineComponent({
  name: 'ObjectField',
  props: FiledPropsDefine,
  setup(props) {
    //组件数据类型
    const context = useVJSFContext()
    //NumberField或者StringField的表单输入执行该函数
    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}
      if (v === undefined) {
        delete value[key]
      } else {
        //1.有key  2.没有key，value编辑区自动生成schema对应的key
        value[key] = v
      }
      props.onChange(value) //demo.data=value 改变value区域内容
    }
    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props
      const { SchemaItem } = context
      const properties = schema.properties || {} //schema不是对象类型

      //schema有值，value没有值 value传递过来是普通值，不是响应式
      const currentValue: any = isObject(value) ? value : {}
      // key表示循环时候的key ，map类似v-for
      //循环引用：schema是Object。因此将属性的schema拆分出来，生成对应的number，string对应的组件
      //循环生成多个<SchemaItem />组件。根据对象schema不同属性生成不同的schema
      //return <SchemaItem />组件的数组。等同三个<SchemaItem />组件

      //数组map：根据多个属性对应生成多个组件
      return Object.keys(properties).map((k: string, index: number) => {
        return (
          <SchemaItem
            //属性的schema
            schema={properties[k]}
            rootSchema={rootSchema}
            //value对应属性的value,传递给SchemaItem组件=>比如value是string=>显示StringField组件，对应value值应该就是属性值string
            value={currentValue[k]}
            key={index}
            //onChange数据类型(v:any)=>void  k：对应不同属性名
            onChange={(v: any) => handleObjectFieldChange(k, v)} //执行函数传实参(k,v)
            errorSchema={errorSchema[k] || {}}
            uiSchema={uiSchema.properties ? uiSchema.properties[k] || {} : {}}
          />
        )
      })

      //   return <div>ObjectField</div>
    }
  },
})
