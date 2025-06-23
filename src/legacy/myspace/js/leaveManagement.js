const { fetchTable } = require("../../config");

async function getEmployeeOptions({ companyid }) {
    try {
        let res = await fetchTable(`SELECT DISTINCT iu.inviteduseremail, a.name
FROM invitedusers iu
LEFT JOIN syf_usermaster a ON iu.inviteduseremail = a.email
WHERE iu.companyid = '${companyid}'`)
        let res2 = await fetchTable(`SELECT username,email from syf_companymaster where lid='${companyid}'`)
        let options = []
        res.map((item) => {
            options.push({ label: item.name, value: item.inviteduseremail })
        })
        res2.map((item) => {
            options.push({ label: item.username, value: item.email })
        })
        return options
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getEmployeeOptions }