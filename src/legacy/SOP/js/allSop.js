const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getAllSopData() {
    try {
        let res = await fetchTable(`select * from SOPTable ORDER BY HEADSEQUENCE, SUBHEADSEQUENCE, CONTENTHEADSEQUENCE`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteSop({ lids }) {
    try {
        let res = await exeQuery(`delete from SOPTable where lid in (${lids}) `);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}




module.exports = { getAllSopData,deleteSop }