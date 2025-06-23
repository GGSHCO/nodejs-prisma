const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function getOnLoadDataLead({ companyid, userid }) {
    try {
        let res = await fetchTable(`select * from contactMaster where companyid='${companyid}'`)
        let names = res.map((item) => item.name)
        let allContacts = {
            names: names,
            obj: res
        }
        let clientOptions = await fetchOptions(`select name from contactMaster where companyid='${companyid}'`, 'name', 'name')
        let brigadeList = await fetchTable(`select distinct inviteduserid from INVITEDUSERS where userid='${userid}' and role='Brigade'`)
        let brigadesId = brigadeList.map((item) => item.inviteduserid)
        let brigadesIdString = brigadesId.join(', ');
        let brigadeOptions = await fetchOptions(`select distinct name  from syf_usermaster where lid in (${brigadesIdString})`, "name", "name")
        return {
            allContacts: allContacts,
            clientOptions: clientOptions,
            brigadeOptions: brigadeOptions
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getUvDataLead({ decryptLeadID }) {
    try {
        let getLead_query = await fetchTable(`SELECT * FROM leadmanagement WHERE lid='${decryptLeadID}'`);
        return getLead_query[0]

    } catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function saveLead({ data }) {
    try {
        let insert_leadManagement_query = await exeQuery(`INSERT INTO LEADMANAGEMENT(
            CLIENTNAME,
            PROSPECTNAME,
            EMAILID,
            MOBILENUMBER,
            PROSPECTBUSINESSNAME,
            LEADSOURCE,
            REQUIREMENT,
            ANNUALBUSINESSVOLUME,
            NUMBEROFEMPLOYEES,
            ISQUALIFIED,
            LEADHEAT,
            ISOPEN,
            REMARKS,
            LEADDATE,
            LEADSTATUS,
            PRIMARYPERSONHANDLING,
            LEADNATURE,
            ESTIMATE,
            FINAL,
            ACV,
            ENTITY,
            BRIGADE,
            ADDEDUSER,
            ADDEDTIME,
            COMPANYNAME,
            COMPANYID
            )
            VALUES(
            '${data.leadName}',
            '${data.prospectname}',
            '${data.email}',
            '${data.mobileNo}',
            '${data.prospectbusinessname}',
            '${data.leadsource}',
            '${data.services}',
            '${data.annualBusinessVolume}',
            '${data.numberofemployees}',
            '${data.isqualified}',
            '${data.leadHeat}',
            '${data.isopen}',
            '${data.remarks}',
            '${data.leadDate}',
            'Pending',
            '${data.primarypersonhandling}',
            '${data.leadnature}',
            '${data.estimate}',
            '${data.final}',
            '${data.acv}',
            '${data.leadEntity}',
            '${data.Brigade}',
            '${data.loginUser}',
            '${data.addedTime}',
            '${data.companyname}',
            '${data.companyid}'
            )
        `);
        return insert_leadManagement_query
    } catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function updateLead({ data }) {
    try {
        let leadManagentQuery = await exeQuery(`UPDATE leadManagement SET
            CLIENTNAME='${data.leadName}',
            PROSPECTNAME='${data.prospectname}',
            EMAILID='${data.email}',
            MOBILENUMBER='${data.mobileNo}',
            PROSPECTBUSINESSNAME='${data.prospectbusinessname}',
            LEADSOURCE='${data.leadsource}',
            REQUIREMENT='${data.services}',
            ANNUALBUSINESSVOLUME='${data.annualBusinessVolume}',
            NUMBEROFEMPLOYEES='${data.numberofemployees}',
            ISQUALIFIED='${data.isqualified}',
            LEADHEAT='${data.leadHeat}',
            ENTITY='${data.entity}',
            ISOPEN='${data.isopen}',
            REMARKS='${data.remarks}',
            LEADDATE='${data.leadDate}',
            LEADNATURE='${data.leadnature}',
            ESTIMATE='${data.estimate}',
            FINAL='${data.final}',
            ACV='${data.acv}',
            BRIGADE='${data.Brigade}'
            where lid='${data.decryptLeadID}'`)
        return leadManagentQuery

    } catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function saveNewContact({ data }) {
    try {
        let res = await exeQuery(`insert into contactMaster (name,entity,annualbusinessvolume,type,poc1,poc1Mobile,poc1Mail,addedUser,addedTime,COMPANYNAME,COMPANYID)
            values('${data.leadName}','${data.leadEntity}','${data.annualBusinessVolume}','Lead','${data.prospectname}','${data.mobileNo}','${data.email}',
            '${data.loginUser}','${data.addedTime}','${data.companyname}','${data.companyid}')`)
        return res

    } catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

module.exports = { getOnLoadDataLead, getUvDataLead, saveLead, updateLead, saveNewContact }