const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function saveAccess({ data }) {
    try {
        let queryList = []
        if (data.hasOwnProperty('roleQuery')) {
            let roleQuery = `insert into roles(role,modules,emailid,userid,addedUser,addedTime,companyId) 
                values('${data.role}','${data.modules}','${data.email}','${data.userid}',
                '${data.username}','${data.addedTime}','${data.company}')`
            let query = Buffer.from(roleQuery).toString('base64');
            queryList.push(query)
        }
        let insertAccess = `insert into invitedusers (companyname,companyid,userid,
             inviteduserid,inviteduseremail,role,modules,addedtime,addeduser,status)
         values('${data.companyName}','${data.company}','${data.userid}','${data.invitedid}','${data.invitedemail}','${data.role}'
         ,'${JSON.stringify(data.modules)}','${data.addedTime}','${data.user}','pending')`
        let query = Buffer.from(insertAccess).toString('base64');
        queryList.push(query)
        let res = await queryGet(queryList)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateAccess({ data }) {
    try {
        let res = await exeQuery(`update invitedusers set companyname='${data.companyname}',
            companyid='${data.companyid}',role='${data.role}',modules='${JSON.stringify(data.modules)}',
            modifiedtime='${data.addedTime}',modifieduser='${data.username}' where lid='${data.lid}'
   `)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function displayAccess({ lid }) {
    try {
        let res = await fetchTable(`select * from invitedusers where lid='${lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function roleBasedModules({ role, companyid }) {
    try {
        let selectRoles = await fetchTable(`select modules from roles where role='${role}' and companyId='${companyid}'`)
        return selectRoles
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getInvitedUser({username}) {
    try {
        let res = await fetchTable(`select * from SYF_USERMASTER where email='${username}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}


module.exports = { saveAccess, updateAccess, displayAccess, roleBasedModules,getInvitedUser }