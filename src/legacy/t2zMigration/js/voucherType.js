const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function onloadVoucherType({companyid}) {
    try {
        let res = await fetchTable(`select * from tally_vouchertype_py where companyid='${companyid}'`)
        let groups = await fetchOptions(`select distinct systemvouchertype  from tally_vouchertype_py where companyid='${companyid}'`, 'systemvouchertype', 'systemvouchertype')

        return {
            tableData: res,
            groups: groups
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateVoucher({data}){
    try {
        let updateQuery=[]
        data.map((item)=>{
            let query=`update tally_vouchertype_py set considertran='${item.value}' where lid='${item.lid}'`
            let encryptQuery=Buffer.from(query).toString('base64');
            updateQuery.push(encryptQuery)
        })
        let updateQueryRes= await queryGet(updateQuery)
        return updateQueryRes
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { onloadVoucherType,updateVoucher }
