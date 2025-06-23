const { fetchTable, exeQuery } = require('../../config')

const showChecklist = async (params) => {
    try {
        let res = await fetchTable(`SELECT * FROM AssignmentNature WHERE checkPoints IS NOT NULL AND checkPoints != '' and companyId='${params.companyid}'`);
        return res
    }
    catch (e) {
        return { error: e.message }
    }
}

const deleteChecklist = async (params) => {
    try {
        let res = await exeQuery(`update assignmentNature set checkPoints='' where lid IN (${params.lids})`);
        return res
    }
    catch (e) {
        return { error: e.message }
    }
}



module.exports = { showChecklist, deleteChecklist }