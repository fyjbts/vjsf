import { createApp, defineComponent, h, reactive, ref, Ref } from 'vue'
import MonacoEditor from './components/MonacoEditor' // 引入别人用monaco写的组件

import { createUseStyles } from 'vue-jss'
//将对象转换成字符串
function toJson(data: any) {
  return JSON.stringify(data, null, 2)
}

// schema规则
const schema = {
  type: 'string',
}
const useStyles = createUseStyles({
  editor: {
    minHeight: 400,
  },
})
export default defineComponent({
  setup(props, ctx) {
    //setup就执行一次

    //Ref数据类型 取得响应式的schema
    const schemaRef: Ref<any> = ref(schema)
    // 当在页面修改了code后会触发
    const handleCodeChange = (code: string) => {
      let schema: any
      try {
        schema = JSON.parse(code) // 转换回来
      } catch (err) {} //parse错误
      //页面修改，schemaRef更新=>jsx重新执行渲染模板
      schemaRef.value = schema // 转换回来
    }
    const classesRef = useStyles()
    const classes = classesRef.value

    return () => {
      //数据更新就执行一次
      const code = toJson(schemaRef.value)
      //return xx等同template。直接使用setup定义的变量方法。因此不需要return data/method数据
      return (
        <div>
          <MonacoEditor
            code={code}
            onChange={handleCodeChange}
            title="schema"
            class={classes.editor}
          />
          <div>你好</div>
        </div>
      )
    }
  },
})
