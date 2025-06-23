const { fetchTable, exeQuery, queryGet } = require('../../config')



async function fetchDayReportFilter({ data }) {
    let getDateQuery = await fetchTable(`SELECT * FROM dayReport WHERE  employeeName IN ('${data.username}') AND (DATEPART(DAY, week) BETWEEN ${data.fromDay} AND ${data.toDay}) AND 
         (DATEPART(MONTH, week) BETWEEN ${data.fromMonth} AND ${data.toMonth}) AND 
         (DATEPART(YEAR, week) BETWEEN ${data.fromYear} AND ${data.toYear})`);
    return getDateQuery
}



module.exports = { fetchDayReportFilter }