console.log(module.paths)

let {
  getPublishedCuid,
  getRawFormData
} = require('./src/api')()
const wrapSchema = require('./src/parser')

// All forms have a cuid.
// Often when we talk about a form, we're referring to the latest published
// version. The line below can retrieve that.
let cuidGetter = getPublishedCuid(
  'shoppers-drug-mart',
  'minor-ailments',
  'allergic-rhinitis'
)

// Older versions can be retrieved by querying their cuid directly.
// cuids can be retrieved via studio.
// let cuidGetter = Promise.resolve("ckv2ztepr000a8vta3f4o1tbl"); // v1.4.0

cuidGetter.then(cuid => {
  console.log(`cuid: ${cuid}`)
  getRawFormData(cuid).
    then(schema => {
      let sp = wrapSchema(schema)
      let allBindingNames = sp.allBindingNames()
      console.log(allBindingNames)
      allBindingNames.forEach(n => { console.log(`Pulling context for ${n}`); console.log(sp.bindingContext(n)) })
    }).
    catch(e => console.log(e))
}).catch((e) => {
  console.log(e)
})

