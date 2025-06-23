const { fetchTable, fetchOptions, exeQuery, queryGet } = require('../../config')

const saveCommitment = async (params) => {
    try {
        let result = await exeQuery(`INSERT INTO commitments (
    companyName, 
    owner, 
    segment, 
    branch, 
    rawcoa, 
    fileUpload, 
    companyId, 
    functionType, 
    frequency, 
    timesaYear, 
    partyName, 
    valueRate, 
    rate, 
    quantity, 
    commitmentNature, 
    annual, 
    perMonth, 
    description, 
    remarks, 
    startDate, 
    endDate, 
    status, 
    addedTime, 
    addedUser, 
    natureOfExpense,
    financialYear
)
VALUES (
    '${params.clientName}', 
    '${params.owner}', 
    '${params.segment}', 
    '${params.branch}', 
    '${params.rawcoa}', 
    '${params.blobUrl}', 
    '${params.companyId}', 
    '${params.functionType}', 
    '${params.frequency}', 
    '${params.timesaYear}', 
    '${params.partyName}', 
    '${params.value}', 
    '${params.rate}', 
    '${params.quantity}', 
    '${params.commitmentNature}', 
    '${params.annual}', 
    '${params.perMonth}', 
    '${params.description}', 
    '${params.remarks}', 
    '${params.startDate}', 
    '${params.endDate}', 
    '${params.status}', 
    '${params.addedTime}', 
    '${params.addedUser}', 
    '${params.natureOfExpense}',
    '${params.financialYear}'
);
`);
        return result
    }
    catch (error) {
        return { error: error.message }
    }
}

const updateCommitment = async (params) => {
    try {
        let result = await exeQuery(`UPDATE commitments
SET 
    companyName = '${params.clientName}',
    owner = '${params.owner}',
    segment = '${params.segment}',
    branch = '${params.branch}',
    rawcoa = '${params.rawcoa}',
    fileUpload = '${params.blobUrl}',
    companyId = '${params.companyId}',
    functionType = '${params.functionType}',
    frequency = '${params.frequency}',
    timesaYear = '${params.timesaYear}',
    financialYear = '${params.financialYear}',
    partyName = '${params.partyName}',
    valueRate = '${params.value}',
    rate = '${params.rate}',
    quantity = '${params.quantity}',
    commitmentNature = '${params.commitmentNature}',
    annual = '${params.annual}',
    perMonth = '${params.perMonth}',
    description = '${params.description}',
    remarks = '${params.remarks}',
    startDate = '${params.startDate}',
    endDate = '${params.endDate}',
    status = '${params.status}',
    addedTime = '${params.addedTime}',
    addedUser = '${params.addedUser}',
    natureOfExpense = '${params.natureOfExpense}'
WHERE lid = '${params.lid}';
`);
        return result
    }
    catch (error) {
        return { error: error.message }
    }
}

const getCommitment = async (params) => {
    try {
        let result = await exeQuery(`select * from commitments where lid='${params.lid}'`);
        return result
    }
    catch (error) {
        return { error: error.message }
    }
}

const fetchRawCoa = async (params) => {
    try {
        let result = await fetchTable(`SELECT DISTINCT particulars FROM tbl_tallyprime_TrialBalances WHERE companyid ='${100001001}'`);
        return result
    }
    catch (error) {
        return { error: error.message }
    }
}

async function getUserNames() {
    let getRes = await exeQuery(`select distinct userName from userMaster`)
    let options = []
    if (getRes.responseType == "SUCCESS") {
        let data = getRes.responseData.table
        data.filter((item) => {
            options.push({ label: item.userName, value: item.userName })
        })
    }
    return options
}

module.exports = { saveCommitment, getCommitment, updateCommitment, fetchRawCoa, getUserNames }