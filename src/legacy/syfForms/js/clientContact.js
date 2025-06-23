const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getUvDataClient({ lid }) {
    try {
        let res = await fetchTable(`select * from contactMaster where lid='${lid}'`)
        return res[0]
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveClient({ data }) {
    try {
        let res = await exeQuery(`insert into contactMaster (entity,source,name,groupName,subGroup,
            poc1,poc1Mobile,poc1Mail,poc2,poc2Mobile,poc2Mail,poc3,poc3Mobile,
            poc3Mail,companyname,companyid
            ) values
            ('${data.entityName}','${data.source}','${data.name}','${data.groupname}','${data.subgroup}',
            '${data.poc1}','${data.poc1mobile}','${data.poc1mail}','${data.poc2}',
            '${data.poc2mobile}','${data.poc2mail}','${data.poc3}','${data.poc3Mobile}',
            '${data.poc3mail}','${data.company.companyname}','${data.company.companyID}'
            )`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateClient({ data }) {
    try {
        let clientRes = await exeQuery(`UPDATE contactMaster SET entity='${data.entityName}',source='${data.source}',name='${data.name}',groupName='${data.groupname}',subGroup='${data.subgroup}',poc1='${data.poc1}',poc1Mobile='${data.poc1mobile}',poc1Mail='${data.poc1mail}',poc2='${data.poc2}',poc2Mobile='${data.poc2mobile}',poc2Mail='${data.poc2mail}',poc3='${data.poc3}',poc3Mobile='${data.poc3mobile}',poc3Mail='${data.poc3mail}' WHERE lid='${data.decryptID}'`)
        return clientRes
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getUvDataClient, saveClient, updateClient }