const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function createAccount({ data }) {
    try {
        if (data.type == "Employee" || data.type == "Student") {
            let res =
                await exeQuery(`INSERT INTO SYF_USERMASTER(EMAIL,NAME,PASSWORD,TYPE,PHONENUMBER,istallysubscribed,ADDEDTIME,ZBStatus) VALUES(
         '${data.email}',
         '${data.name}',
         '${data.password}',
         '${data.type}',
         '${data.phoneNumber}',
         'true',
         '${data.addedTime}',
         'Not Connected'
     ) `)
            return res
        }
        else if (data.type == "Owner") {
            let res = await exeQuery(`INSERT INTO SYF_USERMASTER(EMAIL,NAME,PASSWORD,TYPE,PHONENUMBER,istallysubscribed,ADDEDTIME,ZBStatus) VALUES(
                '${data.email}',
                '${data.name}',
                '${data.password}',
                '${data.type}',
                '${data.phoneNumber}',
                'true',
                '${data.addedTime}',
                'Not Connected'
            ) `)
            if (res.responseType == "SUCCESS") {
                let userDetail = await fetchTable(`select * from syf_usermaster where email='${data.email}'`)
                let groupid = String(userDetail[0].lid) + '101'
                let companyRes = await exeQuery(`INSERT INTO SYF_COMPANYMASTER(USERID,USERNAME,GROUPID,GROUPNAME,EMAIL,COMPANYNAME,SUBSCRIPTION,ENTITY,COUNTRY,ADDEDTIME,ADDEDUSER) VALUES(
                    '${userDetail[0].lid}',
                    '${userDetail[0].name}',
                    '${BigInt(groupid)}',
                    '${data.groupName}',
                    '${userDetail[0].email}',
                    '${data.companyName}',
                    '${data.plan}',
                    '${data.natureOfEntity}',
                    '${data.country}',
                    '${data.addedTime}',
                     '${userDetail[0].name}'
                ) `)
                if (companyRes.responseType == "SUCCESS") {
                    if (data.integration) {
                        let companyDetail = await fetchTable(`select * from syf_companymaster where email='${data.email}' and companyname='${data.companyName}'`)
                        let key = `INSERT INTO syf_companyacbkmaster (addedTime,addedUser,companyName,companyId,email `
                        let value = ` VALUES('${data.addedTime}','${userDetail[0].name}','${data.companyName}','${companyDetail[0].lid}','${data.email}' `
                        // Object.keys(zohoFields).forEach(field => {
                        //     let check = $(`#${field}`).val()
                        //     if (check != "") {
                        //         data = data + `${field}` + ", "
                        //         value = value + `'${check}'` + ", "
                        //     }
                        // });
                        key = key + data.data
                        value = value + data.value

                        // if (integrationType == "Tally") {
                        //     let columnName = 'istallysubscribed';
                        //     let columnValue = 'true';
                        //     data = data + `${columnName}` + ", "
                        //     value = value + `${columnValue}` + ", "
                        // }
                        let s1 = key.slice(0, -2) + ')'
                        let s2 = value.slice(0, -2) + ');'
                        let query = `${s1 + s2}`
                        console.log(query)
                        let acbkRes = await exeQuery(query)
                        console.log(acbkRes)
                        if (acbkRes.responseType == "SUCCESS") {
                            let getAcbk_insertedRecord = await fetchTable(`
                                SELECT * FROM SYF_COMPANYACBKMASTER WHERE ADDEDTIME='${data.addedTime}'
                            `);
                            let acbk_lid = getAcbk_insertedRecord[0].lid;
                            let companyid = getAcbk_insertedRecord[0].companyid;
                            insert_tallyCompanyMaster = await exeQuery(`INSERT INTO tbl_tallyprime_CompanyMasters (companyidacbkmaster,email,cmpstatus,acbkid,companyname) VALUES ('${companyid}','${data.email}','Available','${acbk_lid}','${data.companyName}')`)
                            if (insert_tallyCompanyMaster.responseType === "SUCCESS") {

                                let duplicateGlobalCoa = await exeQuery(`INSERT INTO coaMaster(companyName,
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
                                UPDATE coaMaster SET companyName='${data.companyName}',companyID='${companyid}',addedUser='${userDetail[0].name}',addedTime='${data.addedTime}'
                                WHERE companyName='Not Set'`)
                                if (duplicateGlobalCoa.responseType === "SUCCESS") {

                                    return duplicateGlobalCoa
                                }
                                else{
                                    await deleteUser(data.email)
                                }
                            }
                            else{
                                await deleteUser(data.email)
                            }
                        }
                        else {
                            await deleteUser(data.email)
                            return acbkRes

                        }


                    }
                    else {
                        return companyRes
                    }
                }
                else {
                    await deleteUser(data.email)
                    return companyRes
                }
            }
            else {
                return res
            }


            console.log("test")
        }



    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}


async function emailVerify({ email_val }) {
    try {
        let getVerifiedEmail_res = await fetchTable(`select * from window_verifiedEmail where email='${email_val}'`);

        if (getVerifiedEmail_res.length == 0) {
            let insertVerifiedEmail = await exeQuery(`insert into window_verifiedEmail(email,status) values('${email_val}','sendingMail')`);
            // Inserting email into window_verifiedEmail end

            if (insertVerifiedEmail.responseType == "SUCCESS") {
                let getVerifiedEmail_res = await fetchTable(`select * from window_verifiedEmail where email='${email_val}'`);

                if (getVerifiedEmail_res.length != 0) {
                    let verifiedEmail = getVerifiedEmail_res[0];
                    return { status: 'success', data: verifiedEmail }
                }
            }
        }

        else {
            return { status: 'verified' }
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function setExpiryDate({ expiry }) {
    try {
        let updateVerifiedEmail_query = await exeQuery(`update window_verifiedEmail set expiry='${expiry.dateFormat}',status='mailSent' where lid='${lid}'`);
        return updateVerifiedEmail_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };

    }
}

async function deleteUser(email){
    let queryList=[]
    let tally=`delete from tbl_tallyprime_CompanyMasters where email='${email}'`
    let tallyQuery=Buffer.from(tally).toString('base64');
    queryList.push(tallyQuery)
    let acbk=`delete from syf_companyacbkmaster where email='${email}'`
    let acbQuery=Buffer.from(acbk).toString('base64');
    queryList.push(acbQuery)
    let company=`delete from syf_companymaster where email='${email}'`
    let companyQuery=Buffer.from(company).toString('base64');
    queryList.push(companyQuery)
    let user=`delete from syf_usermaster where email='${email}'`
    let userQuery=Buffer.from(user).toString('base64');
    queryList.push(userQuery)
    let res=await queryGet(queryList)

}

async function getVerifyStatus({email}){
    try{
        let getVerifiedEmail_res = await fetchTable(`select status from window_verifiedEmail where email='${email}'`);
        return getVerifiedEmail_res[0];
    }
    catch(error){
        return { error: true, message: error.message, details: error };

    }
}

async function deleteVerifyMail({email}){
    try{
        let deleteVerifiedEmail_query = await exeQuery(`delete from window_verifiedEmail where email='${email}'`);
        return deleteVerifiedEmail_query
    }
    catch(error){
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { createAccount, emailVerify, setExpiryDate,getVerifyStatus,deleteVerifyMail }