const { exeQuery, dateTimeGeneration } = require('../../config')

const getExtTabsData = async (params) => {
    try {
        let tableName = `extDocsMaster`
        let companyFilter =``
        if (params.hasOwnProperty("companyid")) {
            companyFilter = ` where companyid='${params.companyid}'`

            tableName = `extDocsSpecific`
        }
        let res = await exeQuery(`select * from ${tableName}${companyFilter}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const deleteExtTabsData = async (params) => {
    try {
        let tableName = `extDocsMaster`
        let lid = params.lid.join(',')
        if (params.hasOwnProperty("companyid")) {
            tableName = `extDocsSpecific`
        }
        let res = await exeQuery(`delete from ${tableName} where lid in (${lid})`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getExtTabsData, deleteExtTabsData }


