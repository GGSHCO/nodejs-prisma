const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getRecoData({ id }) {
    try {
        let res = await fetchTable(`select * from syf_reco where lid='${id}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveRecoJson({ data }) {
    try {
        let res;
        if (data.decryptID == undefined)
            res = await exeQuery(`insert into syf_reco (name,recoJson,addedTime,addedUser,companyName,companyId) values
    ('${data.recoName}','${data.jsondata}','${data.addedTime}','${data.name}','${data.company}',
    '${data.companyId}')`)
        else {
            res = await exeQuery(`update syf_reco set name='${data.recoName}',recoJson='${data.jsondata}' where lid='${data.decryptID}'`)
        }
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}




module.exports = { getRecoData, saveRecoJson }