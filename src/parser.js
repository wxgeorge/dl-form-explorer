const jmespath = require('jmespath')

const wrapSchema = (schema) => {
	let jp = (jmespath_query) => jmespath.search(schema, jmespath_query)

	return {
		allBindingNames: () => jp("decisionTree.nodes[].fields[].binding"),
		bindingContext: (bindingName) => jp(`decisionTree.nodes[].fields[?binding=='${bindingName}'][]`)
	}
}

module.exports = wrapSchema
