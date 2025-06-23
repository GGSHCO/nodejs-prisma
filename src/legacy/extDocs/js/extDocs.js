const { fetchTable, exeQuery, fetchOptions, INR } = require("../../config");

const getAllExtTabs = async (params)=>{
    try {
        let res = await fetchTable(`select * from extDocsSpecific where companyid='${params.companyId}'`)
        if(res.length==0){
            res=await fetchTable(`select * from extDocsMaster`)
        }
        let data={}
        res.map((item)=>{
            let fields=JSON.parse(item.fields)
            let tabName;
            if(item.hasOwnProperty("tabName")){
                tabName=item.tabName
            }
            else{
                tabName=item.tabs
            }
            data[tabName]={
                tableName:item.tableName,
                tabName:tabName,
                fields: ['Party Name', 'Coa', 'Opening Balance'],
                excelFields:fields
            }
           
        })
        return data
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const checkOpeningBalance = async (params) => {
    try {
        let res = await fetchTable(`SELECT TOP 1 * FROM ${params.tableName} WHERE partyname = '${params.value}' and companyid='${params.companyId}' ORDER BY lid DESC`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const checkData = async (params) => {
    try {
        let res = await fetchTable(`SELECT * FROM ${params.tableName} WHERE CAST(trandate AS DATE) BETWEEN '${params.startDate}' 
        AND '${params.endDate}' AND partyname = '${params.partyname}' AND companyid = '${params.companyId}';`)
        res.map((item) => {
            item.trandate = item.trandate.split("T")[0];
            item.settlementdate = item.settlementdate.split("T")[0]
            item.openingbalance = INR(Number(item.openingbalance))
            item.closingbalance = INR(Number(item.closingbalance))
            item.increase = INR(Number(item.increase))
            item.decrease = INR(Number(item.decrease))
        })
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const deleteExtData = async (params) =>{
    try{
        let res = await exeQuery(`delete from ${params.tableName} WHERE CAST(trandate AS DATE) BETWEEN '${params.startDate}' 
        AND '${params.endDate}'  AND partyname = '${params.partyname}' AND companyid = '${params.companyId}' `)
        return res
    }
    catch(e){
        return { error: true, message: error.message, details: error };
    }
}

function convertToDate(dateString) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${day}-${month}-${year}`;
}

const extTableData = async (params) => {
    try {
        let res = await fetchTable(`SELECT * FROM ${params.tableName} where companyid='${params.companyId}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const deleteBatch = async (params) => {
    try {
        let res = await exeQuery(`delete FROM ${params.tableName} where companyid='${params.companyId}' and partyname='${params.currentPartyName}' and batchno='${params.batchNo}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const fetchPartyNames = async (params) => {
    try {
        let res = await fetchOptions(`select distinct partyname FROM statementscontrol where category='${params.category}' and companyid='${params.companyId}'`, 'partyname', 'partyname')
        let data = await fetchTable(`select * FROM statementscontrol where category='${params.category}' and companyid='${params.companyId}'`)
        return { options: res,data:data }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const extUpdatetags = async (params)=>{
    try{
        let lid=params.ids.join(',')
        let res = await exeQuery(`update ${params.tableName} set tags='${params.value}' where lid in (${lid})`)
        return res
    }
    catch(error){
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { checkOpeningBalance,getAllExtTabs, extTableData, checkData, deleteBatch, fetchPartyNames,extUpdatetags,deleteExtData }