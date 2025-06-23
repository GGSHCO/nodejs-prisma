const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getDataById({lid}){
    try{
        let res=await fetchTable(`select * from SOPTable where lid=${lid}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getDataById }
