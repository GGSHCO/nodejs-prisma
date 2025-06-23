const { exeQuery } = require('../../config')

const saveClassification = async (params) => {
    try {
        let res = await exeQuery(`update assignmentNature set classification='${params.classification}' where lid=${params.assignmentnature}`)
        return res
    }
    catch (error) {
        return { error: error.message }
    }
}

module.exports = { saveClassification }