const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function createAccountNew(data) {

    try {
        let res =
            await exeQuery(`INSERT INTO SYF_USERMASTER(EMAIL,NAME,PASSWORD,istallysubscribed,ADDEDTIME,ZBStatus) VALUES(
         '${data.email}',
         '${data.name}',
         '${data.password}',
         'true',
         '${data.addedTime}',
         'Not Connected'
     ) `)
        return res




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

async function deleteUser(email) {
    let queryList = []
    let tally = `delete from tbl_tallyprime_CompanyMasters where email='${email}'`
    let tallyQuery = Buffer.from(tally).toString('base64');
    queryList.push(tallyQuery)
    let acbk = `delete from syf_companyacbkmaster where email='${email}'`
    let acbQuery = Buffer.from(acbk).toString('base64');
    queryList.push(acbQuery)
    let company = `delete from syf_companymaster where email='${email}'`
    let companyQuery = Buffer.from(company).toString('base64');
    queryList.push(companyQuery)
    let user = `delete from syf_usermaster where email='${email}'`
    let userQuery = Buffer.from(user).toString('base64');
    queryList.push(userQuery)
    let res = await queryGet(queryList)
    console.log(res)

}

async function getVerifyStatus({ email }) {
    try {
        let getVerifiedEmail_res = await fetchTable(`select status from window_verifiedEmail where email='${email}'`);
        return getVerifiedEmail_res[0];
    }
    catch (error) {
        return { error: true, message: error.message, details: error };

    }
}

async function deleteVerifyMail({ email }) {
    try {
        let deleteVerifiedEmail_query = await exeQuery(`delete from window_verifiedEmail where email='${email}'`);
        return deleteVerifiedEmail_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { createAccountNew, emailVerify, setExpiryDate, getVerifyStatus, deleteVerifyMail }