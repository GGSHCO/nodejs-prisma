const { exeQuery,fetchTable, dateTimeGeneration } = require('../../config')

const getAllRecords = async (params) => {
    try {
        let condition=``
        let tableName=`globalModules`
        if(params.hasOwnProperty('companyid')){
            condition=` and companyid='${params.companyid}'`
            tableName=`specificModules`
        }
        let res = await fetchTable(`select * from ${tableName} where particulars='${params.particulars}' ${condition}`)
       
        let records=[]
        let specificNames = []
        if(res.length>0){
            res.filter((item)=>{
                if(!records.includes(item.name)){
                    records.push(item.name)
                    console.log(item.name)           
                }
                let json = JSON.parse(item.jsonData)
                if(json.hasOwnProperty('recordDisplayName')&&!specificNames.includes(json.recordDisplayName)){
                    specificNames.push(json.recordDisplayName)
                }
            })
        }
        console.log(records)
        return {
            records:records,
            data:res,
            specificNames
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const deleteRecords = async (params) => {
    try {
        let condition=``
        let tableName=`globalModules`
        if(params.hasOwnProperty('companyid')){
            tableName=`specificModules`
        }
        let lid=params.lid.join(',')
        let res = await exeQuery(`delete from ${tableName} where lid in (${lid})`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getAllRecords, deleteRecords }


