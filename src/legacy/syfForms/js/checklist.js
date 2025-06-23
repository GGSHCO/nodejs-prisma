const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

const fetchclassification = async (params) => {
    try {
        let data = await fetchTable(`select classification from assignmentNature where lid='${params.assignNature}'`)
        let milestones = await fetchTable(`select milestones from milestones where assignmentNatureID='${params.assignNature}' order by milestoneNumber`)
        return {
            data: data,
            milestones: milestones
        }
    }
    catch (e) {
        return { error: e.message }
    }
}

const fetchChecklistData = async (params) => {
    try {
        let data = await fetchTable(`select checkpoints from assignmentNature where lid=${params.lid} and checkpoints is not null and checkpoints<>''`)
        return data
    }
    catch (e) {
        return { error: e.message }
    }
}

const saveChecklist = async (params) => {
    try {
        let checkpoints = params.checkpoints
        let jsonData = params.jsonData
        let getExisingData = await fetchTable(`select checkpoints from assignmentNature where lid=${params.assignmentNature} and checkpoints is not null and checkpoints<>''`)
        if (getExisingData.length > 0) {
            if (getExisingData[0].checkpoints != null) {
                let d = JSON.parse(getExisingData[0].checkpoints)
                let data = JSON.parse(d.data)
                data[params.classification] = jsonData[params.classification]
                checkpoints = JSON.stringify({
                    data: JSON.stringify(data)
                })
            }
        }
        console.log(checkpoints,`update assignmentNature set checkpoints='${checkpoints}' where lid=${params.assignmentNature}`)
        let res = await exeQuery(`update assignmentNature set checkpoints='${checkpoints}' where lid=${params.assignmentNature}`)
        return res
    }
    catch (e) {
        return { error: e.message }
    }
}



module.exports = { fetchclassification, fetchChecklistData, saveChecklist }