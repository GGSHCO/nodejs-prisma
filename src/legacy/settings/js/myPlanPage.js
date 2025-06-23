const { fetchTable, queryGet, fetchOptions, exeQuery, dateTimeGeneration } = require('../../config')

async function getUserPlanAndModules({ id }) {
    try {
        let res = await fetchTable(`select  * from SYF_COMPANYMASTER where lid='${id}'`)
        let plans = await fetchTable(`select * from SYF_PLANMASTER`)
        let allPlans = {}
        for (let plan of plans) {
            let getModules = await fetchTable(`select * from SYF_PLANMASTER where NAME='${plan.name}'`)
            let getModule = JSON.parse(getModules[0].module)
            let modulesId = getModule.modules
            if (modulesId.length > 0) {
                let formattedIds = modulesId.join(', ');
                let modulesQuery = await fetchTable(`select distinct subcategory from SYF_MODULEMASTER WHERE LID IN (${formattedIds});`)
                let moduleList = modulesQuery.map((item) => { return item.subcategory })
                allPlans[plan.name] = moduleList;

            }
        }
        let plan = ''
        let modulesList = ''
        if (res != undefined & res.length > 0) {
            plan = res[0].subscription
            if (plan == null) {
                plan = 'No Plan'
            }
            else {
                let getModules = await fetchTable(`select * from SYF_PLANMASTER where NAME='${plan}'`)
                let getModule = JSON.parse(getModules[0].module)
                let modulesId = getModule.modules
                if (modulesId.length > 0) {
                    let formattedIds = modulesId.join(', ');
                    let modulesQuery = await fetchTable(`select distinct subcategory from SYF_MODULEMASTER WHERE LID IN (${formattedIds});`)
                    let moduleList = modulesQuery.map((item) => { return item.subcategory })
                    moduleList.filter((item) => {

                        modulesList += `<li class="list-group-item"><i class="bi bi-check-circle-fill text-primary up_icon"></i>${item}</li>
                    `
                    })

                }
            }



        }
        return { plan: plan, modulesList: modulesList, allPlans: allPlans }

    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }




}

async function updatePlan({ name, companyid }) {
    try {
        let res = await exeQuery(`update SYF_COMPANYMASTER set subscription='${name}' where LID='${companyid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }

}

module.exports = { getUserPlanAndModules, updatePlan }