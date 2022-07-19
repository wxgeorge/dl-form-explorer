#!/usr/bin/env node
const doc = Object.freeze(`
Usage:
	extract-js <fq_form_slug> [--host=<host>]
`)

const { docopt } = require ('docopt')

const options = docopt(doc)

const buildApi = () => {
	const dlApiFactory = require(`${__dirname}/../src/api`)
	const apiConfig = {}
	apiConfig.domain = options['<host>'] || process.env.DL_CLOUD_HOST || 'formhero.cloud'
	return dlApiFactory(apiConfig)
}

const fqFormSlug = options['<fq_form_slug>']
if(/(.+)\/(.+)\/(.+)/.exec(fqFormSlug) == null) {
	console.error(`fq-form-slug (${fqFormSlug}) is malformed.`)
	console.error("format expected is organization/team/slug")
	process.exit(1)
}

const [ organization, team, form ] = fqFormSlug.split('/')

const api = buildApi()
api.getPublishedCuid(organization, team, form)
	.then(cuid => api.getRawFormData(cuid))
	.then(form => {
		const formJSFormatter = require(`${__dirname}/../src/js-formatter`)
		console.log(formJSFormatter(form))
	})
