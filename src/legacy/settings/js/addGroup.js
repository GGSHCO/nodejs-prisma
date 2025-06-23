const { fetchTable, queryGet, fetchOptions, exeQuery,dateTimeGeneration } = require('../../config')

async function getCompanies({ lid }) {
    try {
        let res = await fetchTable(`select * from syf_companymaster where userid=${lid}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function addNew({ userInfo }) {
    try {
        let res = await fetchTable(`select * from syf_companymaster where userid=${userInfo.lid}`)
        if (res.length > 0) {
            result = await createNewCompany(userInfo, res[0].groupid, res[0].groupname)
            return result
        }
        if (res.length == 0) {
            let groupid=`${userInfo.lid}`+`01`
            result = await createNewCompany(userInfo, groupid, 'Default Group')
            return result
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function createNewCompany(userInfo, gid, gname) {
    let addedTime = dateTimeGeneration(new Date());
    let companyName = `Company_${addedTime}`;
    let insertCompany = await exeQuery(`INSERT INTO SYF_COMPANYMASTER
            (USERID,USERNAME,EMAIL,COMPANYNAME,ADDEDTIME,ADDEDUSER,GROUPNAME,GROUPID,subscription)
            VALUES
            ('${userInfo.lid}','${userInfo.name}','${userInfo.email}','${companyName}','${addedTime}','${userInfo.name}','${gname}','${gid}','Financials') 
        `);

    let fetchCompany = await fetchTable(`select * from syf_companymaster where companyName='${companyName}'`)
    let res = fetchCompany[0]
    await resetCompanyCoa(userInfo.name, res.companyname, res.lid)
    return insertCompany
}


async function updateGroup({lid,gid,groupname}) {
    try {
        let id=Buffer.from(lid,'base64').toString('utf-8');
        let res = await exeQuery(`update syf_companymaster set groupid='${BigInt(gid)}',groupname='${groupname}' where lid=${id}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function resetCompanyCoa(username, companyname, companyid) {
    let addedTime = dateTimeGeneration(new Date())
    let udeleteCoaMaster = await exeQuery(`delete from coaMaster where companyID='${companyid}'`);
    let insertCoaMaster = await exeQuery(`INSERT INTO coaMaster(companyName,
        coa,
        alie,
        bspl,
        classification,
        head,
        subHead,
        dc,
        alieSeq,
        classificatonSeq,
        headSeq,
        subHeadSeq,
        misCoa,
        country,
        entityType
        ) SELECT companyName,
        coa,
        alie,
        bspl,
        classification,
        head,
        subHead,
        dc,
        alieSeq,
        classificatonSeq,
        headSeq,
        subHeadSeq,
        misCoa,
        country,
        entityType FROM ggshCoa;
        UPDATE coaMaster SET companyName='${companyname}',companyID='${companyid}',addedUser='${username}',addedTime='${addedTime}'
        WHERE companyName='Not Set'`);
}

async function updateCompany({companyname,lid}){
    try {
        let id=Buffer.from(lid,'base64').toString('utf-8');
        let res = await exeQuery(`update syf_companymaster set companyname='${companyname}' where lid=${id}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function updateGroupName({gid,userid,groupname}){
    try {
        let res = await exeQuery(`update syf_companymaster set groupname='${groupname}' where groupid=${gid} and userid=${userid}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

module.exports = { getCompanies, addNew,updateGroup,updateCompany,updateGroupName }