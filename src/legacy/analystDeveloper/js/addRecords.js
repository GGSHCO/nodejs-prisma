const { exeQuery,fetchTable, dateTimeGeneration } = require('../../config')

const addRecords = async (params) => {
    try {
        let time = dateTimeGeneration(new Date())
        let res
        let companyData=``
        let companyvalue=``
        let tableName=`globalModules`
        if(params.hasOwnProperty('companyid')){
            companyData=`,companyname,companyid`
            companyvalue=`,'${params.companyname}','${params.companyid}'`
            tableName=`specificModules`
        }
        if (params.lid == undefined) {
            res = await exeQuery(`insert into ${tableName}(particulars,name,jsonData,addeduser,addedtime${companyData})
            values('${params.particulars}','${params.name}','${JSON.stringify(params.jsonData)}','${params.addeduser}','${time}'${companyvalue})`)
        }
        else if(params.lid!=undefined){
            res = await exeQuery(`update ${tableName} set name='${params.name}', jsonData='${JSON.stringify(params.jsonData)}',
            modifieduser='${params.addeduser}',modifiedtime='${time}' where lid='${params.lid}'`)
        }
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const getRecordData = async (params) =>{
    try {
        let tableName=`globalModules`
        if(params.hasOwnProperty('companyid')){
            tableName=`specificModules`
        }
        let res = await fetchTable(`select * from ${tableName} where lid='${params.lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}



module.exports = { addRecords,getRecordData }
