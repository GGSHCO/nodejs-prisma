const { fetchTable, exeQuery, fetchOptions } = require("../../config");

async function onloadTemplates({ companyid }) {
    try {
        let mailTemplates = await fetchTable(`select * from specificMailTemplates where companyid='${companyid}'`)
        let templateOptions = await fetchOptions(`select * from specificMailTemplates where companyid='${companyid}'`, "templatename", "templatename")
        return {
            mailTemplates: mailTemplates,
            templateOptions: templateOptions
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getTabCounts({ data, companyid, approverWorkflow, approverColumn, userColumn, email }) {
    try {
        let approvalCondition = ''
        if (approverWorkflow) {
            approvalCondition += `and (${approverColumn}='${email}' or ${userColumn}='${email}' or  '${email}' IN (SELECT value FROM STRING_SPLIT(copyTo, ',')))`
        }
        let res = await exeQuery(`select * from ${data.tableName} where companyid='${companyid}' ${approvalCondition}`)
        let result = res.responseData.table
        let countJson = {}
        data.stages.map((stage) => {
            let count = 0
            result.filter((item) => { if (item[`${data.stageColumnName}`] == stage) { count++ } })
            countJson[stage] = count
        })
        return countJson
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getTableData({ tableName, stageColumn, stage, companyid, approverWorkflow, approverColumn, userColumn, email }) {
    try {
        let approvalCondition = ''
        if (approverWorkflow) {
            approvalCondition += `and (${approverColumn}='${email}' or ${userColumn}='${email}' or  '${email}' IN (SELECT value FROM STRING_SPLIT(copyTo, ',')))`
        }
        let res = await fetchTable(`select * from ${tableName} where ${stageColumn}='${stage}' and companyid='${companyid}' ${approvalCondition}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateWorkflowstage({ tableName, stageColumn, value, idList }) {
    try {
        let res = await exeQuery(`update ${tableName} set ${stageColumn}='${value}' where lid IN (${idList})`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
async function updateInputs({ tableName, query, id }) {
    try {
        let updateQuery = `update ${tableName} set ${query}`
        updateQuery = updateQuery.slice(0, -2) + `where lid IN (${id})`
        let res = await exeQuery(updateQuery)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


module.exports = { onloadTemplates, getTabCounts, getTableData, updateWorkflowstage, updateInputs }
