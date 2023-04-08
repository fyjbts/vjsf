// or ESM/TypeScript import
// import Ajv from "ajv"
// Node.js require:
const Ajv = require('ajv') //node环境运行
const addFormats = require('ajv-formats')


const schema = {
  // type:"string",
  // minLength:10

  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      format: 'email',
    //   format: 'test',//校验自定义test

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

// const data = {
//   foo: 1,
//   bar: "abc",
// }

// const data="why"//校验data是string
const data = {
  name: 'why',
  age:18,
  pets: ['dog', 'cat'],
  isWorker: true,
}
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv)

//自定义format
//test是format名字，data就是validate(data)的data
ajv.addFormat("test",(data)=>{
    console.log(data);
    return data==="haha"
})

const validate = ajv.compile(schema)
const valid = validate(data) //校验
if (!valid) console.log(validate.errors)

/* 
error：不少于10个
keyword：表示不符合要求的字段
[
    {
      instancePath: '',
      schemaPath: '#/minLength',
      keyword: 'minLength',
      params: { limit: 10 },
      message: 'must NOT have fewer than 10 characters'
    }
] */

