/* eslint no-use-before-define: 0 */

import { defineComponent, ref, onMounted, watch, onBeforeUnmount, shallowReadonly, shallowRef } from 'vue'

import * as Monaco from 'monaco-editor'

import type { PropType, Ref } from 'vue'
import { createUseStyles } from 'vue-jss'

//vue.jss js写css样式
const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 5
  },
  title: {
    backgroundColor: '#eee',
    padding: '10px 0',
    paddingLeft: 20,
  },
  code: {
    flexGrow: 1
  }
})

export default defineComponent({
  props: {
    code: {
      type: String as PropType<string>,
      required: true
    },
    onChange: {
      type: Function as PropType<(value: string, event: Monaco.editor.IModelContentChangedEvent) => void>,
      required: true
    },
    title: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    // must be shallowRef, if not, editor.getValue() won't work
    const editorRef = shallowRef()

    const containerRef = ref()

    let _subscription: Monaco.IDisposable | undefined
    let __prevent_trigger_change_event = false

    onMounted(() => {
        //containerRef.value=>dom元素，editor绑定在在dom元素上
      const editor = editorRef.value = Monaco.editor.create(containerRef.value, {
        value: props.code,//默认显示的值
        language: 'json',
        formatOnPaste: true,
        tabSize: 2,
        minimap: {
          enabled: false,
        },
      })

    //编辑器内容改变
      _subscription = editor.onDidChangeModelContent((event) => {
        console.log('--------->', __prevent_trigger_change_event)
        if (!__prevent_trigger_change_event) {
            //editor.getValue()编辑器内容
            
          props.onChange(editor.getValue() ,event);
        }
      });
    })

    onBeforeUnmount(() => {
      if (_subscription)
        _subscription.dispose()
    })

    watch(() => props.code, (v) => {
      const editor = editorRef.value
      const model = editor.getModel()
      if (v !== model.getValue()) {
        editor.pushUndoStop();
        __prevent_trigger_change_event = true
        // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: v,
            },
          ]
        );
        editor.pushUndoStop();
        __prevent_trigger_change_event = false
      }
      // if (v !== editorRef.value.getValue()) {
      //   editorRef.value.setValue(v)
      // }
    })

    const classesRef = useStyles()

    return () => {

      const classes = classesRef.value

      return (
        <div class={classes.container}>
          <div class={classes.title}><span>{props.title}</span></div>
          <div class={classes.code} ref={containerRef}></div>
        </div>
      )
    }
  }
})