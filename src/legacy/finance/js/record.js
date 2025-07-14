const { fetchTable, exeQuery, fetchOptions, INR } = require("../../config");

const getRecordsGroupBy = async (params) => {
    try {
        let sumList = params.sum
        let sum = ``
        let groupby = ``
        let filter = ``
        if (params.hasOwnProperty('startDate')) {
            filter += ` AND ${params.dateField} >= '${params.startDate}' AND ${params.dateField} <= '${params.endDate}'`
        }
        if (params.hasOwnProperty('advancedFilter')) {
            let data=params.advancedFilter
            if (data.hasOwnProperty('date')) {
                let dateFields = params.advancedFilter.date
                dateFields.map((item) => {
                    filter += ` AND ${item.column} >= '${item.start}' AND ${item.column} <= '${item.end}'`
                })
            }
            if (data.hasOwnProperty('amount')) {
                let amountFields = params.advancedFilter.amount
                amountFields.map((item) => {
                    filter += ` AND ${item.column} >= ${item.start} AND ${item.column} <= ${item.end}`
                })
            }
            if (data.hasOwnProperty('search')) {
                let searchFields = params.advancedFilter.search
                searchFields.map((item) => {
                    filter += ` AND ${item.column} = '${item.value}'`
                })
            }
            if (data.hasOwnProperty('category')) {
                let categoryFields = params.advancedFilter.category
                categoryFields.map((item) => {
                    let values = item.values.map(value => `'${value}'`).join(',')
                    filter += ` AND ${item.column} in (${values})`
                })
            }
        }
        if (sumList.length > 0) {
            sumList.map((item) => {
                sum += `SUM(${item}) as ${item},`
            })
        }
        if (params.groupby.length > 0) {
            params.groupby.map((item) => {
                sum += `${item},`
            })
            if (sum.endsWith(',')) {
                sum = sum.slice(0, -1);
            }
            groupby = params.groupby.join(',');
        }
         console.log(`SELECT ${sum}
            FROM ${params.tableName}  where companyid='${params.companyid}'${filter}
            GROUP BY ${groupby}`)
        let getData = await fetchTable(`
            SELECT ${sum}
            FROM ${params.tableName}  where companyid='${params.companyid}'${filter}
            GROUP BY ${groupby}
        `);

       

        getData = getData.map(record => {
            sumList.forEach(key => {
                let item = key.toLowerCase()
                if (record[item] !== undefined && !isNaN(record[item])) {
                    record[item] = INR(Number(record[item]));
                }
            });
            return record;
        });
        return getData;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getRecordsGroupBy }
