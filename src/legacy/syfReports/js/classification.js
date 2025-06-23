const { fetchTable, exeQuery } = require('../../config')

const showClassification=async(params)=>{
    try{
        let res=await fetchTable(
        `SELECT * FROM AssignmentNature WHERE classification IS NOT NULL AND classification != '' and companyId='${params.companyid}'`);
        return res
    }
    catch(error){
        return {error:error.message}
    }
}

const deleteClassification=async(params)=>{
    try{
        let res = await exeQuery(`update assignmentNature set classification='' where lid IN (${params.lids})`);
        return res
    }
    catch(error){
        return {error:error.message}
    }
}

module.exports={showClassification,deleteClassification}