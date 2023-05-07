import PasswordWidget from '../components/PasswordWidget'
//对象格式
export default {
  name: 'Demo',
  schema: {
    // type: 'string',
    // minLength:10,
    // title:"demo"

    type: 'object',
    properties: {
      pass1: {
        type: 'string',
        minLength: 10,
        title: 'password',
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 're try password',
      },
      color: {
        type: 'string',
        format: 'color',
        title: 'input color',
      },
    },
  },
  //对象内函数定义，不是函数执行
  async customValidate(data: any, errors: any) {
    // if(data.pass1!==data.pass2){
    //   errors.pass2.addError("密码必须相同")
    // }

    //Promise包含异步操作
    return new Promise<void>((resolve) => {
      //函数正常执行
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError('密码必须相同')
        }
        //异步执行成功
        resolve()
      }, 2000)
    })
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
      pass2: {
        color: 'red',
      },
    },
  },
  default: 1,
}
