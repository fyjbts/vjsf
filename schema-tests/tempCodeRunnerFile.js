const Ajv = require('ajv') //node环境运行
const addFormats = require('ajv-formats')
const localize = require("ajv-i18n")

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      test:false
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
  name: 'why',
  age:18,
  pets: ['dog', 1],
  isWorker: true,
}
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv)

/* ajv.addKeyword("test",{
    //schema是test的值：true，data是why
    validate(schema,data){
        if(schema===true) return true;
        else return schema.length===6
        // console.log(schema,data);
    }
}) */

/* ajv.addKeyword("test",{
    //sch是test的值：false，parentSchema：name的值{ type: 'string', test: false }
    compile(sch,parentSchema){
        console.log(sch,parentSchema);
        return ()=>true;//return 函数
    },
    //定义test值的schema定义
    metaSchema:{
        type:"boolean"
    }
}) */
ajv.addKeyword("test",{
    //return的schema值会被加入使用test的属性中 name:{minLength:10}
    macro(sch,parentSchema){
        return {
            minLength:10
        }
    },
})
const validate = ajv.compile(schema)
const valid = validate(data) //校验

//报错，不通过校验执行 true/false
if (!valid) {
    localize.zh(validate.errors)//zh:中文错误
    console.log(validate.errors)
}