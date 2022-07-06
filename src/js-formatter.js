const beautify = require('js-beautify')

function formMetaAsHeader(form) {
	return `/*
* title: ${form.title}
* organization: ${form.organization}
* team: ${form.team}
* slug: ${form.slug}
*
* version: ${form.version.label}
* cuid: ${form.cuid}
* created: ${form.created}
*/`
}

function globalJsAsString(form) {
	return beautify(`const globalJs = () => {
		${form.decisionTree.scopeJavaScript}
	}`)
}

function nodeJsAsString(node) {
	let js = node.customOnChangeJavaScript.replace(/^function /, '')
	js = beautify(`	${js}`)
	return `nodes.push({
uuid: "${node.uuid}",
label: "${node.nodeLabel}",
${js}
})`}

function fullFormAsString(form) {
	return [
		formMetaAsHeader(form),
		globalJsAsString(form),
		`const nodes = [];`,
		...(form.decisionTree.nodes.filter(n => n.useOnChangeJavaScript).map(nodeJsAsString)),
		`module.exports = { globalJs, nodes };`
	].join('\n\n')
}

module.exports = fullFormAsString
