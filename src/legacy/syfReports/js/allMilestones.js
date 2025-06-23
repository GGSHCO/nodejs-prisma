
const { fetchTable, exeQuery, bulkInsert } = require('../../config')

async function getAssignmentNature(params) {
    try {
        let get_query = await fetchTable(`select assignmentNature FROM AssignmentNature where companyId='${params.companyid}'`);
        return get_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getAllMilestones(params) {
    try {
        let get_query = await fetchTable(`SELECT *
    FROM Milestones where companyid='${params.companyid}'`)
        return get_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
async function deleteMilestoneList({ lids }) {
    try {
        let result = exeQuery(`DELETE FROM Milestones WHERE assignmentNatureID IN (${lids})`)
        return result
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function milestonesbulkUpload({ obj }) {
    try {
        let insertMilestones = {
            "tableName": "Milestones",
            "tableJsonData": JSON.stringify(obj),
            "clearTableBeforeInsertion": false
        }
        let res = await bulkInsert(insertMilestones);
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getAssignmentNature, getAllMilestones, deleteMilestoneList, milestonesbulkUpload }