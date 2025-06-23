const { exeQuery } = require('../../config')

async function changePassword({ data }) {
    try {
        let res = await exeQuery(`update syf_usermaster set password='${data.ecryptConfirmPass}' where email='${data.user}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { changePassword }
