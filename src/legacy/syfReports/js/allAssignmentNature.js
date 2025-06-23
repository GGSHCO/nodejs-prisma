const { fetchTable, exeQuery, bulkInsert, queryGet } = require('../../config')

async function getAssignmentNatureData({companyid}) {
    try {
        let res = await fetchTable(`SELECT * FROM AssignmentNature where companyId='${companyid}' order by addedTime desc`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteAssignmentNature({ lids }) {
    try {
        let delMilestoneQuery = `DELETE FROM Milestones WHERE assignmentNatureID IN (${lids})`
        let delMilestone = Buffer.from(delMilestoneQuery).toString('base64');
        let delAssignmentQuery = `DELETE FROM AssignmentNature WHERE lid IN (${lids})`;
        let delAssignment = Buffer.from(delAssignmentQuery).toString('base64');
        let del_call = await queryGet([delMilestone, delAssignment]);
        return del_call
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function assignmentBulkUpload({ obj }) {
    try {
        let insertData = {
            "tableName": "AssignmentNature",
            "tableJsonData": JSON.stringify(obj),
            "clearTableBeforeInsertion": false
        }
        let res = await bulkInsert(insertData);
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}



module.exports = { getAssignmentNatureData, deleteAssignmentNature, assignmentBulkUpload }