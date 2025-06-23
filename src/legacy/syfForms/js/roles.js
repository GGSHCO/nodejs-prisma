const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function displayRole({ lid }) {
    try {
        let id = Buffer.from(lid, 'base64').toString('utf-8');
        let getRes = await fetchTable(`select * from roles where lid='${id}'`)
        return getRes
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function saveRole({ data }) {
    try {
        let insertRoles = await exeQuery(`insert into 
            roles(role,modules,emailid,userid,addedUser,addedTime,companyId) 
            values('${data.role}','${data.modules}','${data.email}','${data.userid}',
            '${data.addedUser}','${data.addedtime}','${data.companyId}')`);
           
        return insertRoles
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateRole({ data }) {
    try {
        let id = Buffer.from(data.lid, 'base64').toString('utf-8');
        let insertRoles = await exeQuery(`update roles set role='${data.role}',
            modules='${data.modules}',modifiedUser='${data.modifiedUser}',
            modifiedTime='${data.addedtime}' where lid='${id}'`)
        return insertRoles
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }


}


module.exports = { displayRole, saveRole, updateRole }