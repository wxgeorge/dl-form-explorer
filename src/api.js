const axios = require('axios')

function apiFactory({ protocol = 'https://', servicesPrefix = 'services', domain = 'formhero.cloud' } = {}) {
  const getFormHeroServicesUrl = () => `${protocol}${servicesPrefix}.${domain}`;
  const formheroServices = async (path, token = null) => {
    let config = {
      url:`${getFormHeroServicesUrl()}/${path}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Formhero-Token': token || null,
      },
    }

    return axios(config).then(r => r.data)
  };

  return {
    formheroServices,
    getPublishedCuid: async (o, t, s) => formheroServices(`library/formflow/${o}/${t}/${s}`).then(r => r.value.cuid),
    getRawFormData: async (cuid) => formheroServices(`library/smartforms/${cuid}`).then(r => r.value)
  }
}


module.exports = apiFactory
