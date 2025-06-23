const { fetchTable, exeQuery } = require('../../config')

const getDropdownList = async (params) => {
    try {
        let res = await fetchTable(`select * from dropdownMaster`)
        return res
    }
    catch (e) {
        return { e: e.message }
    }
}

const deleteDropdown = async (params) => {
    try {
        let lid = params.lids.join(',')
        let res = await exeQuery(`delete from dropdownMaster where lid in (${lid})`)
        return res
    }
    catch (e) {
        return { e: e.message }
    }
}

module.exports = { getDropdownList, deleteDropdown }