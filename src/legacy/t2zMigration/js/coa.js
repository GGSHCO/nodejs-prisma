const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function fetchCoaGroups({ companyid }) {
    try {
        let coa = await fetchTable(`select * from coa_definition where companyid='${companyid}' `) // istranavl='Yes' and istranavl='Yes'  and
        let groups = await fetchOptions(`select distinct groupedunder from coa_definition where companyid='${companyid}'`, 'groupedunder', 'groupedunder')
        return {
            coa: coa,
            groups: groups
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getDistinctOptions({ value }) {
    try {
        let res = await fetchOptions(`SELECT DISTINCT ${value} FROM coa_definition WHERE ${value} IS NOT NULL AND ${value} <> '';`, `${value}`, `${value}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function bulkUpdate({ data, dimensionOnChange, dimension1Change }) {
    try {
        let updateList = []
        data.map((item) => {
            let updateString = "UPDATE coa_definition set "
            let keys = Object.keys(item)
            let excludedKeys = ['lid', 'ledger', 'zohocoa', 'groupedunder', 'zohodimension1', 'plbs', 'miG_OB', 'miG_DR_TRAN', 'miG_CR_TRAN', 'miG_CB', 'istranavl']
            keys.map((key) => {
                if (!excludedKeys.includes(key)) {
                    updateString += `${key}='${item[key]}', `
                    if (key == "zohodimension2") {
                        let zohodimension2 = item[key]
                        let zohocoa = item['zohocoa']
                        if (zohodimension2 !== null || zohodimension2 != "") {
                            if (zohodimension2 == "Accounts Payable" || zohodimension2 == "Accounts Receivable") {
                                zohocoa = zohodimension2
                            }
                            let zohodimension1 = getDimension1(zohodimension2, dimensionOnChange)
                            let plbs = getpsbl(zohodimension1, dimension1Change)
                            updateString += `zohodimension1='${zohodimension1}', plbs='${plbs}',zohocoa='${zohocoa}', `
                        }
                    }
                }
            })
            updateString = updateString.slice(0, -2) + ` where lid='${item.lid}';`;
            let query = Buffer.from(updateString).toString('base64');
            updateList.push(query)
        })
        return updateList
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function filterCoa({ filterCriteria, value, companyid }) {
    try {
        let res = await fetchTable(`select * from coa_definition where ${filterCriteria}='${value}' and companyid='${companyid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

function getDimension1(value, dimensionOnChange) {
    let keys = Object.keys(dimensionOnChange)
    for (let key of keys) {
        let values = dimensionOnChange[key]
        if (values.includes(value)) {
            return key
        }
    }

}

function getpsbl(value, dimension1Change) {
    let keys = Object.keys(dimension1Change)
    for (let key of keys) {
        let values = dimension1Change[key]
        if (values.includes(value)) {
            return key
        }
    }

}

async function updateMutipleRow({ data }) {
    try {
        let updateList = []
        data.map((item) => {
            if (item.lid != undefined) {
                let query = `update coa_definition set ${item.column}='${item.value}' where lid='${item.lid}'`
                let encrypt = Buffer.from(query).toString('base64');
                updateList.push(encrypt)
                if (item.column == "zohodimension2") {
                    if (item.value == "Accounts Payable" || item.value == "Accounts Receivable") {
                        if (item.zohoContact == "" || item.zohoContact == null) {
                            let q1 = `update coa_definition set zohocontact='${item.zohocoa}',zohocoa='${item.value}' where lid='${item.lid}'`
                            let encryptQ1 = Buffer.from(q1).toString('base64');
                            updateList.push(encryptQ1)
                        }
                        else {
                            let q1 = `update coa_definition set zohocoa='${item.value}' where lid='${item.lid}'`
                            let encryptQ1 = Buffer.from(q1).toString('base64');
                            updateList.push(encryptQ1)
                        }
                    }
                    else {
                        if (item.zohoContact !== "" && item.zohoContact !== " " && item.zohoContact !== null) {
                            let q1 = (`update coa_definition set zohocoa='${item.zohoContact}',zohocontact='' where lid='${item.lid}'`)
                            let encryptQ1 = Buffer.from(q1).toString('base64');
                            updateList.push(encryptQ1)
                        }
                    }
                    let query = `update coa_definition set zohodimension1='${item.option}',plbs='${item.plbs}' where lid='${item.lid}'`
                    let encrypt = Buffer.from(query).toString('base64');
                    updateList.push(encrypt)
                }
            }
        })
        let res = await queryGet(updateList)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateSingleRow({ data }) {
    try {
        let queryList=[]
        let addingColumns = {}
        if (data.column == "zohodimension2") {
            if (data.value == "Accounts Payable" || data.value == "Accounts Receivable") {
                if (data.zohoContact == "" || data.zohoContact == null) {
                    addingColumns['zohocontact'] = data.zohocoa
                    addingColumns['zohocoa'] = data.value
                }
                else {
                    addingColumns['zohocoa'] = data.value
                }

            }
            else {
                if (data.zohoContact !== "" && data.zohoContact !== " " && data.zohoContact !== null) {
                    addingColumns['zohocontact'] = ''
                    addingColumns['zohocoa'] = data.zohoContact
                }
            }
            addingColumns['zohodimension1'] = data.option
            addingColumns['plbs'] = data.plbs
        }
        let keys = Object.keys(addingColumns)
        let query;
        if (keys.length > 0) {
            let ans=keys.map(item => `${item}='${addingColumns[item]}'`).join(",");
            query = (`update coa_definition set ${data.column}='${data.value}', ${ans} where lid='${data.lid}'`)

        }
        else {
            query = (`update coa_definition set ${data.column}='${data.value}' where lid='${data.lid}'`)

        }
        let res= await exeQuery(query)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateInputField({data}){
    try{
        let queryList=[]
        data.map((item)=>{
            let query=`update coa_definition set ${item.column}='${item.value}' where lid='${item.lid}'`
            let encryptQuery= Buffer.from(query).toString('base64');
            queryList.push(encryptQuery)
        })
        let res=await queryGet(queryList)
        return res

    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { fetchCoaGroups, getDistinctOptions, bulkUpdate, filterCoa, updateMutipleRow, updateSingleRow,updateInputField }