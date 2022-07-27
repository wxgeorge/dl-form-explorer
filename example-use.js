const apiFactory = require('./src/api')
const wrapSchema = require('./src/parser')

let {
  getPublishedCuid,
  getRawFormData
} = apiFactory({ domain: 'sit-eforms.loblaw.ca' })

// All forms have a cuid.
// Often when we talk about a form, we're referring to the latest published
// version. The line below can retrieve that.
let cuidGetter = getPublishedCuid(
  'shoppers-drug-mart',
  'covid',
  'ab-care-plan-2.0'
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
      // console.log(allBindingNames)
      console.log('"Binding Name","type","label"')
      allBindingNames.forEach(n => {
        // console.log(`Pulling context for ${n}`);
        // console.log(sp.bindingContext(n))
        sp.bindingContext(n).forEach(bindingCtx => {
          console.log(`${n},${bindingCtx.type},${bindingCtx.label.en}`)
        })
      })
    }).
    catch(e => console.log(e))
}).catch((e) => {
  console.log(e)
})

