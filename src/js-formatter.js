const beautify = require('js-beautify')
const Handlebars = require('handlebars')
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

function formMetaAsHeader(form, domain) {
	return Handlebars.compile([
		"/*",
		" * title: {{form.title}}",
		" * organization: {{form.organization}}",
		" * team: {{form.team}}",
		" * slug: {{form.slug}}",
		" *{{#if domain}} domain: {{ domain }}\n *{{/if}}",

		" * version: {{form.version.label}}",
		" * cuid: {{form.cuid}}",
		" * created: {{form.created}}",
		" *",
		" * downloaded at: {{ dateFormat now ''}}",
		" */",
		].join('\n')
	)({ form, domain, now: Date.now() })
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

function fullFormAsString(form, domain) {
	return [
		formMetaAsHeader(form, domain),
		globalJsAsString(form),
		`const nodes = [];`,
		...(form.decisionTree.nodes.filter(n => n.useOnChangeJavaScript).map(nodeJsAsString)),
		`module.exports = { globalJs, nodes };`
	].join('\n\n')
}

module.exports = fullFormAsString
