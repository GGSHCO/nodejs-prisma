const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function displayAllRoles({companyid}) {
    try {
        let getRes = await fetchTable(`select * from  roles where companyId='${companyid}'`)
        return getRes
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function deleteRoles(params) {
    try {
        let del_call = await exeQuery(`DELETE FROM roles WHERE lid IN (${params.lid})`);
        console.log(del_call)
        return del_call;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}



module.exports = { displayAllRoles, deleteRoles }