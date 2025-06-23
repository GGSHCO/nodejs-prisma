const { fetchTable,fetchOptions,queryGet,exeQuery } = require('../../config')

async function getCoaOptionsDocs(params){
    try {
        let res = await fetchOptions(`select name from tbl_tallyprime_LedgerMasters where companyid='${params.companyid}'`,'name','name')
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getContactsPartyNames(params){
    try {
        let res = await fetchOptions(`select * from zohoContacts where companyid='${params.companyid}'`,'contactname','contactname')
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function manageData(params){
    try {
        let res = await fetchTable(`select * from STATEMENTSCONTROL where companyId='${params.companyid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function insertExtData(params){
    try {
        let data = params.data
        let query=[]
        data.filter((item)=>{
            let q=`insert into STATEMENTSCONTROL(companyid,companyname,category,coa,partyname,accountid,mode,basecurrency,predefinedlist,createdby,createddatetime,accountowner,remarks,disableObCheck)
            values('${params.companyid}','${params.companyname}','${item.category}','${item.coa}','${item.partyname}','${item.accountid}','${item.mode}','${item.basecurrency}','${item.predefinedlist}','${params.user}','${params.addedtime}','${item.accountowner}','${item.remarks}','${item.disableObCheck}')`
            let encrypt= Buffer.from(q).toString('base64');
            query.push(encrypt)
        })
        let result = await queryGet(query)
        return result
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateExtData(params){
    try {
        let result = await exeQuery(`update statementscontrol set category='${params.category}',coa='${params.coa}',partyname='${params.partyname}',accountid='${params.accountid}',remarks='${params.remarks}',
            basecurrency='${params.basecurrency}',mode='${params.mode}',accountowner='${params.accountowner}',disableObCheck='${params.disableObCheck}' where lid='${params.lid}'`)
        return result
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
async function extDeleteData(params){
    try {
        let lids=params.lid.join(',')
        let result = await exeQuery(`delete from statementscontrol where lid in (${lids})`)
        return result
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


module.exports={getCoaOptionsDocs,manageData,insertExtData,getContactsPartyNames,updateExtData,extDeleteData}