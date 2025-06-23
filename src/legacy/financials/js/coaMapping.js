const { fetchTable, exeQuery, queryGet } = require('../../config')

async function getGgshCoa({ companyid }) {
    try {
        let getggshCoa_res = await fetchTable(`SELECT * FROM coaMaster WHERE companyid='${companyid}'`);
        let ggshCoaOptions = [];
        getggshCoa_res.map((gCoa) => {
            ggshCoaOptions.push({ label: gCoa.coa + "=>" + gCoa.head, value: gCoa.coa + "=>" + gCoa.head });
        });

        let response = {
            obj: getggshCoa_res,
            options: ggshCoaOptions
        }
        return response;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function tbTable({ companyid, topbarFY }) {


    if (companyid != "" && topbarFY != "") {

        let tallyLedgerMaster = await fetchTable(`SELECT * FROM coa_mapped WHERE companyid='${companyid}'`);
        // let tb_call = await queryGet([tb_query]);
        // let tallyLedgerMaster = tb_call.responseData.table;

        let tbData = await fetchTable(`SELECT * FROM dbo.fnfetchUniqueCoa('${companyid}')`);
        // let newRec_call = await queryGet([newRec_query]);
        // let tbData = newRec_call.responseData.table;


        // let data = {
        //     "companyId": topbarClient
        // }
        // let tbData = await workPaper(data, "feUniqCoa");
        // console.log(tbData,tallyLedgerMaster)

        let unmapped_groupList = [];
        tbData.map((tb) => {
            unmapped_groupList.push(tb.ledgergroup);
        });


        let unmapped_pendingCoa_obj = {};

        unmapped_groupList.map((group) => {
            let unmapped_ledgerList = [], unmapped_groupEmpty_ledgerList = [];
            tbData.map((tb) => {
                if (group == tb.ledgergroup && tb.alie == null) {
                    let obj = {
                        action: `<input type="checkbox" class="ledgerSel">`,
                        ledger: tb.ledgerName,
                        ggshCoa: "<input type='text' class='form-control ggshCoaMapped' disabled>",
                        alie: "<input type='text' class='form-control alieMapped' disabled>",
                        bspl: "<input type='text' class='form-control bsplMapped' disabled>",
                        classification: "<input type='text' class='form-control classificationMapped' disabled>",
                        head: "<input type='text' class='form-control headMapped' disabled>",
                        subHead: "<input type='text' class='form-control subHeadMapped' disabled>",
                        ledgergroup: group
                    }

                    if (group == null) {
                        obj.ledgergroup = "group not available";
                        unmapped_groupEmpty_ledgerList.push(obj);
                    }
                    else {
                        unmapped_ledgerList.push(obj);
                    }

                }
            });

            if (unmapped_ledgerList.length != 0) {
                let unique_unmapped_ledgerList = Array.from(new Set(unmapped_ledgerList));
                unmapped_pendingCoa_obj[group] = {
                    groupName: group,
                    lineItems: unique_unmapped_ledgerList,
                    status: ""
                };
            }

            if (unmapped_groupEmpty_ledgerList.length != 0) {
                unmapped_pendingCoa_obj["group not available"] = {
                    groupName: "group not available",
                    lineItems: unmapped_groupEmpty_ledgerList,
                    status: ""
                };
            }

        });


        let pendingCoaCount = 0;
        Object.keys(unmapped_pendingCoa_obj).forEach(() => {
            pendingCoaCount += 1;
        });



        unmapped_dataTableTable = unmapped_pendingCoa_obj;

        let unmapped_keys = Object.keys(unmapped_pendingCoa_obj);
        let unmapped_dataSet = unmapped_keys.map((keyItem) => {
            return ({
                action: `<input type="checkbox" class="tb_group_selAll">`,
                group: unmapped_pendingCoa_obj[keyItem].groupName
            });
        });



        // ************** Mapped Table dataset formation ***************
        let mapped_groupList = [];
        tallyLedgerMaster.map((tb, inx) => {
            let ledgerItem = tb.subHead;
            mapped_groupList.push(ledgerItem);
        });
        let uniqueMappedGroup = Array.from(new Set(mapped_groupList));

        let mapped_pendingCoa_obj = {};
        for (const element of uniqueMappedGroup) {
            let group = element;  //replaceAll(/[^\w\s]/gi, "")
            let mapped_ledgerList = [];
            tallyLedgerMaster.map((tb) => {
                if (group == tb.subHead) {
                    mapped_ledgerList.push({
                        action: `<input type="checkbox" class="ledgerSel">`,
                        ledger: tb.name,
                        ggshCoa: `<input type='text' class='form-control ggshCoaMapped' value="${tb.ggshCoa}" disabled>`,
                        alie: `<input type='text' class='form-control alieMapped' value="${tb.alie}" disabled>`,
                        bspl: `<input type='text' class='form-control bsplMapped' value="${tb.bspl}" disabled>`,
                        classification: `<input type='text' class='form-control classificationMapped' value="${tb.classification}" disabled>`,
                        head: `<input type='text' class='form-control headMapped' value="${tb.head}" disabled>`,
                        subHead: `<input type='text' class='form-control subHeadMapped' value="${tb.subHead}" disabled>`
                    });
                }
            });
            let unique_mapped_ledgerList = Array.from(new Set(mapped_ledgerList));
            mapped_pendingCoa_obj[group] = {
                groupName: group,
                lineItems: unique_mapped_ledgerList,
                status: ""
            };
        }
        mapped_dataTableTable = mapped_pendingCoa_obj;

        let mapped_keys = Object.keys(mapped_pendingCoa_obj);
        let mapped_dataSet = mapped_keys.map((keyItem) => {
            return ({
                action: `<input type="checkbox" class="tb_group_selAll_mapped">`,
                group: mapped_pendingCoa_obj[keyItem].groupName
            });
        });


        return {
            mapped_dataSet: mapped_dataSet,
            pendingCoaCount: pendingCoaCount,
            unmapped_dataSet: unmapped_dataSet,
            unmapped_pendingCoa_obj: unmapped_pendingCoa_obj,
            mapped_pendingCoa_obj: mapped_pendingCoa_obj
        }
    }

}

async function saveMapping({ data }) {
    let query = []
    try {
        data.map((item) => {
            let insertQuery = `INSERT INTO coa_mapped (companyid,companyname,name,ggshCoa,alie,bspl,classification,head,subHead,ledgergroup,alieSeq,classificationSeq,headSeq,subHeadSeq,uniquefield)
        VALUES(
            '${item.companyid}',
            '${item.companyname}',
            '${item.ledger}',
            '${item.ggshCoaVal}',
            '${item.alie}',
            '${item.bspl}',
            '${item.classification}',
            '${item.head}',
            '${item.subHead}',
            '${item.groupName}',
            '${item.alieSeq}',
            '${item.classificatonSeq}',
            '${item.headSeq}',
            '${item.subHeadSeq}',
            '${item.uniqueField}'
        )`
            let query64 = Buffer.from(insertQuery).toString('base64');
            query.push(query64)
        })
        let res = await queryGet(query)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function updateMapping({ data }) {
    let query = []
    try {
        data.map((item) => {
            let updateQuery = `UPDATE coa_mapped SET
                ggshCoa='${item.ggshCoaVal}',
                alie='${item.alie}',
                bspl='${item.bspl}',
                classification='${item.classification}',
                head='${item.head}',
                subHead='${item.subHead}',
                alieSeq='${item.alieSeq}',
                classificationSeq='${item.classificatonSeq}',
                headSeq='${item.headSeq}',
                subHeadSeq='${item.subHeadSeq}',
                uniquefield='${item.uniqueField}'
                WHERE companyid='${item.companyid}' AND name='${item.ledger}'
        `
            let query64 = Buffer.from(updateQuery).toString('base64');
            query.push(query64)
        })
        let res = await queryGet(query)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function coaExcelUpload({ data }) {
    let query = []
    try {
        data.map((item) => {
            let insertQuery = `INSERT INTO coa_mapped (companyname,name,ggshCoa,alie,bspl,classification,head,subHead,ledgergroup,alieSeq,classificationSeq,headSeq,subHeadSeq)
                                         VALUES(
                                             '${item.companyname}',
                                             '${item.name}',
                                             '${item.ggshCoa}',
                                             '${item.alie}',
                                             '${item.bspl}',
                                             '${item.classification}',
                                             '${item.head}',
                                             '${item.subHead}',
                                             '${item.ledgergroup}',
                                             '${item.alieSeq}',
                                             '${item.classificatonSeq}',
                                             '${item.headSeq}',
                                             '${item.subHeadSeq}'
                                         )`
            let query64 = Buffer.from(insertQuery).toString('base64');
            query.push(query64)
        })
        let res = await queryGet(query)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function coaLedgerData({ companyid }) {
    try {
        let res = await fetchTable(`SELECT * FROM tbl_tallyprime_LedgerMasters WHERE companyid='${companyid}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getGgshCoa, tbTable, saveMapping, updateMapping, coaExcelUpload, coaLedgerData }