const { fetchTable,fetchOptions, exeQuery, queryGet } = require('../../config')

async function getSegments({ companyid }) {
    try {
        let data=await fetchTable(`SELECT distinct segmentname FROM segmentMaster WHERE companyId='${companyid}'`)
        let options=[]
        if(data.length>0){
            data.map((item)=>{
                options.push({label:item.segmentname,value:item.segmentname})
            })
        }
        return options;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function saveSegment({ companyid,companyname,segment,addedTime,addedUser}) {
    try {
        let res = await exeQuery(`insert into segmentMaster (companyId,companyName,segmentname,addedTime,addedUser) values 
            ('${companyid}','${companyname}','${segment}','${addedTime}','${addedUser}')`);
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateCoaSegment({segment,lid}) {
    try {
        let res = await exeQuery(`update coa_mapped set a='${segment}' where lid='${lid}'`);
        return res;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}



module.exports = { getSegments,saveSegment,updateCoaSegment }