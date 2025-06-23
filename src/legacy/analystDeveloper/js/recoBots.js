const { fetchTable, fetchOptions, queryGet } = require('../../config')

const getAllReco = async () => {
    let allReco = await fetchTable(`select lid,name from syf_reco`)
    return allReco;
}

module.exports = { getAllReco };