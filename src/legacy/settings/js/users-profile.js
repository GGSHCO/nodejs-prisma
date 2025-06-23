const { fetchTable, queryGet, fetchOptions, exeQuery, dateTimeGeneration } = require('../../config')

async function updateProfile({ data }) {
    try {
        let updateRes = await exeQuery(`update SYF_USERMASTER set
             country='${data.country}',phonenumber='${data.phoneNumber}',
             profileimage='${data.blobUrl}' where lid='${data.userId}'`)
        return updateRes
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

module.exports = { updateProfile }
