const { exeQuery,fetchTable,dateTimeGeneration } = require('../../config')

const insertExtTab=async(params)=>{
    try{
        let companyKey = ``
        let companyValue=``
        let tableName=`extDocsMaster`
        if(params.hasOwnProperty("companyid")){
            companyKey = `,companyname,companyid,tabName`
            companyValue = `,'${params.companyname}','${params.companyid}','${params.displayTabName}'`
            tableName=`extDocsSpecific`
        }
        let res=await exeQuery(`insert into ${tableName} (tabs,tableName,fields,addeduser,addedtime${companyKey}) 
                values('${params.tabName}','${params.tableName}','${JSON.stringify(params.fields)}','${params.addedUser}','${dateTimeGeneration(new Date())}'${companyValue})`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const updateExtTab=async(params)=>{
    try{
        let companyKey = ``
        let tableName=`extDocsMaster`
        if(params.hasOwnProperty("companyid")){
            companyKey = `,tabName='${params.displayTabName}',companyname='${params.companyname}',companyid='${params.companyid}'`
            tableName=`extDocsSpecific`
        }
        let res = await exeQuery(`update ${tableName} set tableName='${params.tableName}',tabs='${params.tabName}',fields='${JSON.stringify(params.fields)}'${companyKey} where lid=${params.lid}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const viewExtTab=async(params)=>{
    try{
        let tableName=`extDocsMaster`
        if(params.hasOwnProperty("companyid")){
            tableName=`extDocsSpecific`
        }
        let res = await fetchTable(`select * from ${tableName} where lid='${params.lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const getMasterExtTabs=async(params)=>{
    try{
        let res = await fetchTable(`select * from extDocsMaster`)
        let distinctTabs=[]
        res.filter((item)=>{
            if(!distinctTabs.includes(item.tabs)&&item.tabs!==""){
                distinctTabs.push(item.tabs)
            }
        })
        return {
            tabs:distinctTabs,
            data:res
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports={insertExtTab,updateExtTab,viewExtTab,getMasterExtTabs}


