const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getAllRecoJson() {
    try {
        let res = await fetchTable(`SELECT * from syf_reco`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function deleteReco({ lids }) {
    try {
        let del_call = await exeQuery(`DELETE FROM syf_reco WHERE lid IN (${lids})`);
        return del_call;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }


}


module.exports = { getAllRecoJson,deleteReco }