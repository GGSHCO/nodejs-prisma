const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRY_TIME = process.env.JWT_EXPIRY;

async function updateLoginStatus({username}){
    try{
        let updateUser_query = exeQuery(`update SYF_USERMASTER set status='login' where email='${username}'`);
        return updateUser_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function checkUser({username}){
    try{
        let res = await fetchTable(`select email,password,lid from SYF_USERMASTER where email='${username}'`);
        // const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: EXPIRY_TIME });
        // res[0].token=token
        return res
    }
    catch (error) {
        console.log(error)
        return { error: true, message: error.message, details: error };
    }
}

async function checkEmail({username}){
    try{
        let res = await fetchTable(`select * from SYF_USERMASTER where email='${username}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports={updateLoginStatus,checkUser,checkEmail}