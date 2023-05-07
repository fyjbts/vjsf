/* eslint-disable */
// eslint-disable-next-line vue/no-setup-props-destructure
import { defineComponent, PropType, computed } from 'vue'
import { Schema, SchemaTypes, FiledPropsDefine } from './types' //类型声明
import StringField from './fileds/StringField'
import NumberField from './fileds/NumberField'
import ObjectField from './fileds/ObjectField'
import ArrayField from './fileds/ArrayField'

import { retrieveSchema } from './utils'

export default defineComponent({
  name: 'SchemaItem',
  props: FiledPropsDefine,
  /* {
    schema: {
      type: Object as PropType<Schema>, //引入Schema类型
      required: true,
    },
    value:{
        required:true
    },
    onChange:{
        type:Function as PropType<(v:any)=>void>
    }
  }, */

  setup(props, ctx) {
    //因为放在h函数内更新就执行一次，消耗资源
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      // console.log('retrieved', retrieveSchema(schema, rootSchema, value))
      return retrieveSchema(schema, rootSchema, value)
    })

    return () => {
      const { schema, rootSchema, value } = props
      // const retrievedSchema= retrieveSchema(schema,rootSchema,value)
      const retrievedSchema = retrievedSchemaRef.value

      //TODO:如果type没有指定，我们需要猜测这个type
      const type = schema.type //schema类型
      let Component: any
      switch (type) {
        //根据父组件传递的参数决定Schema组件的结构
        case SchemaTypes.STRING: {
          Component = StringField //vc
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField //vc
          break
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField //vc
          break
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField //vc
          break
        }
        default: {
          console.warn(`${type}is not supported`)
        }
      }

      //Component=>NumberField/StringField组件
      //schema覆盖{...props}的schema
      return <Component {...props} schema={retrievedSchema} />
    }
  },
})
