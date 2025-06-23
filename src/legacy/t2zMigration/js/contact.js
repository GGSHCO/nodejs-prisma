const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function t2z_contacts({type,companyid}){
    try{
        let res=await fetchTable(`select * from zohocontacts where contacttype='${type}' and companyid='${companyid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports={t2z_contacts}