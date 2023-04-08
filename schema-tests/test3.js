const Ajv = require('ajv') //node环境运行
const addFormats = require('ajv-formats')
const localize = require("ajv-i18n")

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength:10,
      //针对不同报错的errorMessage
      errorMessage:{
        type:"必须是字符串",
        minLength:"长度不能小于10"
      }

    //test:false
    },
    age: {
      type: 'number',
    },
    pets: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
    },
    isWorker: {
      type: 'boolean',
    },
  },
  required: ['name', 'age'], //必传
  additionalProperties: false,
}

const data = {
  name: "why",
  age:18,
  pets: ['dog', 1],
  isWorker: true,
}
const ajv = new Ajv({allErrors: true,jsonPointers:true})

require("ajv-errors")(ajv)
/* ajv.addKeyword("test",{
    //schema是test的值：true，data是why
    validate:function fn(schema,data){
        fn.errors=[]//test自定义错误信息
        if(schema===true) return true;
        else return schema.length===6
        // console.log(schema,data);
    }
}) */


/* ajv.addKeyword("test",{
    //return的schema值会被加入使用test的属性中 name:{minLength:10}
    macro(sch,parentSchema){
        return {
            minLength:10
        }
    },
}) */
const validate = ajv.compile(schema)
const valid = validate(data) //校验

//报错，不通过校验执行 true/false
if (!valid) {
    console.log(validate.errors)
}