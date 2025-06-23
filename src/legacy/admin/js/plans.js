const { fetchTable, exeQuery, fetchOptions, queryGet, INR, dateTimeGeneration } = require('../../config')

async function fetchAllModules() {

    try {
        let modulesQuery = await fetchTable(`select * from SYF_MODULEMASTER`)
        let moduleList = modulesQuery.map((item) => { return { label: `${item.name} - ${item.subcategory}`, value: item.lid } })
        return moduleList
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }


}

async function getAllPlans() {
    try {
        let allPlans = await fetchTable(`select * from SYF_PLANMASTER`)
        return allPlans
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function insertEmptyPlan({plan, name, addedTime }) {
    try {
        let insertEmptyPlan = await exeQuery(`insert into SYF_PLANMASTER
        (
            name,addedtime,addeduser
        )
        values(
            '${plan}','${addedTime}','${name}'
        )`
        );

        return insertEmptyPlan
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function deletePlan({ lid }) {
    try {
        let res = await exeQuery(`delete from SYF_PLANMASTER where lid='${lid}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function updatePlanName({ colName, value, lid }) {
    try {
        let getPlan = await fetchTable(`select name from SYF_PLANMASTER where lid=${lid}`)
        if (getPlan.length != 0) {
            let updatePlanRes = await exeQuery(`update SYF_PLANMASTER set ${colName}='${value}' where lid='${lid}'`)
            return updatePlanRes
        } else {
            let res={responseType:"Error"}
            return res
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}






module.exports = { fetchAllModules, insertEmptyPlan,getAllPlans,deletePlan,updatePlanName}