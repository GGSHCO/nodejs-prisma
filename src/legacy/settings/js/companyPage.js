const { fetchTable, queryGet, fetchOptions, exeQuery, dateTimeGeneration } = require('../../config')

async function updateTable({ data }) {
    try {
        let res = await exeQuery(`UPDATE ${data.table} SET ${data.colName}='${data.value}'${data.updateDateFormat} where lid='${data.lid}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateACBKTable({ data }) {
    try {
        let update_query = await exeQuery(`UPDATE ${data.table} SET ${data.colName}='${data.value}',
            MODIFIEDUSER='${data.modifiedUser}', MODIFIEDTIME='${data.modifiedTime}' where
             LID='${data.acbk_lid}'`);
        let tallyCompanymaster_json = {
            "fromdate": "startingfrom",
            "todate": "endingat",
            "organizationid": "companyid",
            "namepersoftware": "companyname"
        }
        if (tallyCompanymaster_json[data.colName]) {
            let column = tallyCompanymaster_json[data.colName];
            let update_tallyQuery = await exeQuery(
                `UPDATE tbl_tallyprime_CompanyMasters SET ${column}='${data.value}' 
                WHERE acbkid='${data.acbk_lid}'`
            );
            return update_tallyQuery
        }
        else {
            return update_query
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getPlanOptions() {
    try {
        let res = await fetchOptions(`select * from syf_planmaster`, 'name', 'name')
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function basicsFetch({ lid }) {
    try {
        let companyMaster = await fetchTable(`SELECT * FROM SYF_COMPANYMASTER WHERE LID='${lid}'`)
        let company = companyMaster[0];
        return company
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function accountsFetch({ lid }) {
    try {
        let companyACBK = await fetchTable(`SELECT * FROM SYF_COMPANYACBKMASTER WHERE COMPANYID='${lid}'`)
        return companyACBK
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function branchFetch({ lid }) {
    try {
        let branchDetails = await fetchTable(`SELECT * FROM SYF_BRANCHMASTER WHERE COMPANYID='${lid}'`)
        return branchDetails
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function tanFetch({ lid }) {
    try {
        let tanDetails = await fetchTable(`SELECT * FROM SYF_TANMASTER WHERE COMPANYID='${lid}'`)
        return tanDetails
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function gstFetch({ lid }) {
    try {
        let gstDetails = await fetchTable(`SELECT * FROM SYF_GSTMASTER WHERE COMPANYID='${lid}'`)
        return gstDetails
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


async function emptyValueInsertUserId({ data }) {
    try {
        let date = new Date()
        let addedTime = dateTimeGeneration(date)
        let addedUser = data.username
        let createRecords = await exeQuery(`INSERT INTO ${data.table} (COMPANYID,USERID,ADDEDUSER,ADDEDTIME)
             VALUES ('${data.lid}','${data.userId}','${addedUser}','${addedTime}')`);
        return createRecords

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function emptyValueInsertAcbk({ data }) {
    try {
        let createAccounts = await exeQuery(`INSERT INTO SYF_COMPANYACBKMASTER 
            (COMPANYID,ADDEDTIME,EMAIL) VALUES ('${data.lid}','${data.addedTime}','${data.email}')`);

        if (createAccounts.responseType === "SUCCESS") {
            let getAcbk_insertedRecord = await fetchTable(`
                SELECT * FROM SYF_COMPANYACBKMASTER WHERE ADDEDTIME='${data.addedTime}'
            `);
            let acbk_lid = getAcbk_insertedRecord[0].lid;
            insert_tallyCompanyMaster = await exeQuery(`INSERT INTO 
                tbl_tallyprime_CompanyMasters (companyidacbkmaster,
                email,cmpstatus,acbkid) VALUES ('${data.lid}','${data.email}','Available','${acbk_lid}')`)
            return insert_tallyCompanyMaster
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteRow({ table, lid }) {
    try {
        if (table == "SYF_COMPANYACBKMASTER") {
            let deleteQuery = await exeQuery(`delete from ${table} where LID='${lid}'`)
            if (deleteQuery.responseType === "SUCCESS") {
                let deleteQuery = await exeQuery(`delete from tbl_tallyprime_CompanyMasters where acbkid='${lid}'`)
                return deleteQuery
            }
        }
        else {
            let res = await exeQuery(`delete from ${table} where LID='${lid}'`)
            return res
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateCompanyName({data}){
    try{
        let company = await fetchTable(`select companyname from syf_companymaster where companyname='${data.companyname}'`)
        if (company.length == 0) {
            let res=await exeQuery(`update syf_companymaster set companyname='${data.companyname}' where lid='${data.lid}'`)
            await exeQuery(`update INVITEDUSERS set companyname='${data.companyname}' where companyid='${data.lid}'`)
            return res
        } else {
            return {responseType:'exists'}
        }

    }
    catch(error){
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { updateTable, deleteRow, getPlanOptions,updateCompanyName, basicsFetch, accountsFetch, branchFetch, tanFetch, gstFetch, emptyValueInsertUserId, emptyValueInsertAcbk, updateACBKTable }