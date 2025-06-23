const { fetchTable, exeQuery } = require('../../config')

const saveDropdown = async (params) => {
    try {
        let options = JSON.stringify({options:params.options})
        let res = await exeQuery(`insert into dropdownMaster(dropdownName,options,addedTime,addedUser) values
            ('${params.dropdownName}','${options}','${params.addedTime}','${params.addedUser}')`)
        return res
    }
    catch (e) {
        return {e:e.message}
    }
}

const getAllDropdownNames = async (params) => {
    try {
        let res = await fetchTable(`select dropdownName from dropdownMaster`)
        let names = []
        res.filter((item)=>{
            names.push(item.dropdownName)
        })
        return {names:names}
    }
    catch (e) {
        return {e:e.message}
    }
}

const updateDropdown = async (params) => {
    try {
        let options = JSON.stringify({options:params.options})
        let res = await exeQuery(`update dropdownMaster set dropdownName='${params.dropdownName}',options='${options}',modifiedTime='${params.modifiedTime}',modifiedUser='${params.modifiedUser}' where lid='${params.lid}'`)
        return res
    }
    catch (e) {
        return {e:e.message}
    }
}

const viewDropdown = async (params) => {
    try {
        let res = await fetchTable(`select * from dropdownMaster where lid='${params.lid}'`)
        return res
    }
    catch (e) {
        return {e:e.message}
    }
}



module.exports = { viewDropdown, saveDropdown,updateDropdown,getAllDropdownNames }