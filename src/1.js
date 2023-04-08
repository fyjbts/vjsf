const value=
{
    "type": "object",
    "properties": {
      "pass1": {
        "type": "string",
        "minLength": 10,
        "title": "password"
      },
      "pass2": {
        "type": "string",
        "minLength": 10,
        "title": "re try password"
      }
      
    }
  }

  const json = JSON.parse(value)

  console.log(json );