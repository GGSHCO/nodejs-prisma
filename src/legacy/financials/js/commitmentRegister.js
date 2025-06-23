const { fetchTable, fetchOptions, exeQuery, queryGet } = require('../../config')

const showCommitment = async (params) => {
    try {
        let result = await exeQuery(`select * from commitments where companyId='${params.companyid}' and financialYear='${params.financialYear}'`);
        return result
    }
    catch (error) {
        return { error: error.message }
    }
}

const delCommitment = async (params) => {
    try {
        let result = await exeQuery(`delete from commitments where lid in (${params.lid})`);
        return result
    }
    catch (error) {
        return { error: error.message }
    }
}

module.exports = { showCommitment, delCommitment }