ajv.addKeyword('test', {
  //return的schema值会被加入使用test的属性中 name:{minLength:10}
  macro(sch, parentSchema) {
    return {
      minLength: 10,
    }
  },
})
