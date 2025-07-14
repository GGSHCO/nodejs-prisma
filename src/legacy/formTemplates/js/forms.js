const { fetchTable, exeQuery, fetchOptions, queryGet } = require("../../config");

async function fetchFormOptions({ condition, label, value }) {
    try {
        let res = await fetchOptions(`select * from ${condition}`, `${label}`, `${value}`)
        let uniqueRes = Array.from(
            new Map(res.map(item => [JSON.stringify(item), item])).values()
        );
        return uniqueRes
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


async function getEmployeeOptions({ companyid, type }) {
    try {
        console.log(companyid)
        let res = await fetchTable(`SELECT DISTINCT iu.inviteduseremail, a.name
    FROM invitedusers iu
  LEFT JOIN syf_usermaster a ON iu.inviteduseremail = a.email
     WHERE iu.companyid = '${companyid}'`)
        let res2 = await fetchTable(`SELECT username,email from syf_companymaster where lid='${companyid}'`)
        let options = []
        if (type == "email") {
            res.map((item) => {
                options.push({ label: item.name, value: item.inviteduseremail })
            })
            res2.map((item) => {
                options.push({ label: item.username, value: item.email })
            })
        }
        else if (type == "name") {
            res.map((item) => {
                options.push({ label: item.name, value: item.name })
            })
            res2.map((item) => {
                options.push({ label: item.username, value: item.username })
            })
        }

        return options
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getEmployeeTimesheetOptions({ companyid, type }) {
    try {
        console.log(companyid)
        let res = await fetchTable(`SELECT DISTINCT iu.inviteduseremail, a.name
    FROM invitedusers iu
  LEFT JOIN syf_usermaster a ON iu.inviteduseremail = a.email
     WHERE iu.companyid = '${companyid}' AND iu.role!='Client'`)
        let res2 = await fetchTable(`SELECT username,email from syf_companymaster where lid='${companyid}'`)
        let options = []
        if (type == "email") {
            res.map((item) => {
                options.push({ label: item.name, value: item.inviteduseremail })
            })
            res2.map((item) => {
                options.push({ label: item.username, value: item.email })
            })
        }
        else if (type == "name") {
            res.map((item) => {
                options.push({ label: item.name, value: item.name })
            })
            res2.map((item) => {
                options.push({ label: item.username, value: item.username })
            })
        }

        return options
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveFormData({ parentTable, addedTime, addedUser, userid, companyid, companyname, string1, string2 }) {
    try {
        let res = await exeQuery(`INSERT INTO ${parentTable} (addedTime,addedUser,userid,companyid,companyname, ${string1} OUTPUT Inserted.lid VALUES('${addedTime}','${addedUser}','${userid}','${companyid}','${companyname}', ${string2}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateFormData({ data }) {
    try {
        let queries = []
        data.map((item) => {
            if (item.type == "Parent") {
                let update = `UPDATE ${item.parentTable} set modifiedtime='${item.addedTime}',
             modifieduser='${item.addedUser}',companyid='${item.companyid}', ${item.string}`
                let encrypted = Buffer.from(update).toString('base64');
                queries.push(encrypted)
            }
            if(item.type=="subForm"){
                if(item.operation=="insert"){
                    let res = `INSERT INTO ${item.subFormTable} (addedTime,addedUser,${item.foreignKey},userid,companyid,companyname, ${item.string1} OUTPUT Inserted.lid VALUES('${item.addedTime}','${item.addedUser}','${item.lid}','${item.userid}',
                    '${item.companyid}','${item.companyname}', ${item.string2}`
                    let encrypted = Buffer.from(res).toString('base64');
                    queries.push(encrypted)
                }
                if(item.operation=="update"){
                    let update = `UPDATE ${item.subFormTable} set modifiedtime='${item.addedTime}',
                    modifieduser='${item.addedUser}',companyid='${item.companyid}', ${item.string}`
                       let encrypted = Buffer.from(update).toString('base64');
                       queries.push(encrypted)
                }
            }

        })
        if (queries.length > 0) {
            let res = await queryGet(queries)
            return res
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
const saveSubform = async (params) => {
    try {
        let data = params.data
        let query = []
        let parentTable = data[0].parentTable
        let parentId = data[0].parentId
        data.map((item) => {
            let res = `INSERT INTO ${item.subFormTable} 
            (addedTime,addedUser,${item.foreignKey},userid,companyid,companyname,
             ${item.string1} OUTPUT Inserted.lid VALUES('${item.addedTime}','${item.addedUser}','${item.parentId}','${item.userid}',
            '${item.companyid}','${item.companyname}', ${item.string2}`
            let encrypted = Buffer.from(res).toString('base64');
            query.push(encrypted)
        })
        let result = await queryGet(query)
        if (result.responseType == "ERROR") {
            await exeQuery(`delete from ${parentTable} where lid='${parentId}'`)
        }
        return result
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getUvFormData({ tableName, lid, name }) {
    try {
        let res =await fetchTable(`select * from ${tableName} where lid='${lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getUvSubFormData({ tableName, lid, foreignKey }) {
    try {
        let res = await fetchTable(`select * from ${tableName} where ${foreignKey}='${lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteRowData({ tableName, id }) {
    try {
        let res = await exeQuery(`delete from ${tableName} where lid='${id}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { fetchFormOptions, saveFormData, getUvFormData, updateFormData, getEmployeeOptions,getEmployeeTimesheetOptions, saveSubform,getUvSubFormData,deleteRowData,getEmployeeTimesheetOptions }