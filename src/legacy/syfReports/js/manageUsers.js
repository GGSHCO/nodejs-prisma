const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getAllInvites({ userid }) {
    try {
        let res = await fetchTable(`select * from  INVITEDUSERS where userid='${userid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function deleteAccess({ lids }) {
    try {
        let del_call = await exeQuery(`DELETE FROM invitedusers WHERE lid IN (${lids})`);
        return del_call;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }


}


module.exports = { getAllInvites,deleteAccess }