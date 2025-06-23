const { fetchTable, exeQuery, fetchOptions, queryGet, INR } = require('../../config')


async function coa_financialView({ companyid }) {
    try {
        coaMaster = await fetchTable(`select * from coamaster where companyid=${companyid} order by alieseq,classificatonseq,headseq,subheadseq`)
        let alieList = [];
        coaMaster.map((item) => {
            alieList.push(item.alie)
        })


        // For Balance Sheet
        const bsAlie = ["Liabilities", "Asset", "Income", "Expense"]
        const bsClassifications = ["Equity and Shareholders funds"];
        // const bsHeads = ["Reserves and surplus"];
        // const bsSubheads = ["Other reserves"];
        const bsCoa = ["Current Year Earnings", "Retained Earnings"];

        // For Profit & Loss
        const plHeads = ["Equity and Shareholders funds", "Depreciation and amortisation"];
        const plSubheads = ["Deferred tax", "Current tax"];

        let modalList = ""
        let resultJson = []
        uniqueAlieList = Array.from(new Set(alieList))
        uniqueAlieList.map((alie) => {
            let coaTree = ""
            let notesTable = ""


            let alieObj;
            let classificationList = []

            coaMaster.map((item) => {
                if (alie == item.alie) {
                    alieObj = JSON.stringify({ "bspl": item.bspl, "alieSeq": item.alieSeq })
                    classificationList.push(item.classification)
                }
            })
            let alieSequence = JSON.parse(alieObj)
            let isEditableAlie = !bsAlie.includes(alie);
            let contentEditableAttrAlie = isEditableAlie ? "true" : "false";
            coaTree += `
                <tr>
                    <td class='createCoa d-flex'><button class="btn btn-primary addLevel m-1 p-0"><i class="bi bi-plus"></i></button><button class="btn delLevel m-1 p-0"  old='${alieSequence.alieSeq}'  val="${alie}" column="alieSeq" conditionColumn="alie"><i class="fa-solid fa-trash icon"></i></button></td>
                    <td class="coaValue" column='${alieObj}'><span class="coaName" val='${alie}' column="alie" contenteditable=${contentEditableAttrAlie}>${alie}</span></td>
                    <td class='fs_sequence'><span class="coaSeq" old='${alieSequence.alieSeq}' val="${alie}" contenteditable=true column="alieSeq" conditionColumn="alie">${alieSequence.alieSeq}</span></td>
                    <td class="fs_notes"></td>
                    <td class="fs_currentYear"></td>
                    <td class="fs_prevoiusYear"></td>
                </tr>
            `;
            // let coa = $(e.target).attr("val");
            // let oldSeq = $(e.target).attr("old");
            // let seq = $(e.target).text().trim();
            // let column = $(e.target).attr("column");
            // let conditionColumn = $(e.target).attr("conditionColumn");

            let uniqueClassification = Array.from(new Set(classificationList))
            uniqueClassification.map((classification) => {
                let classificationObj;
                let headList = []
                coaMaster.map((item) => {
                    if (alie == item.alie && classification == item.classification) {
                        classificationObj = JSON.stringify({ "bspl": item.bspl, 'alie': item.alie, "alieSeq": item.alieSeq, "classificationSeq": item.classificatonSeq })
                        headList.push(item.head)
                    }
                })

                let classificationSequence = JSON.parse(classificationObj)
                let isEditableClassification = !bsClassifications.includes(classification);
                let contentEditableAttrClassification = isEditableClassification ? "true" : "false";

                coaTree += `
                <tr>
                    <td class='createCoa d-flex'><button class="btn btn-primary addLevel m-1 p-0" ><i class="bi bi-plus"></i></button><button class="btn delLevel m-1 p-0"><i class="fa-solid fa-trash icon"></i></button></td>
                    <td style='padding-left:30px;' class="coaValue" column='${classificationObj}'><span class="coaName" val='${classification}' column="classification"  contenteditable=${contentEditableAttrClassification}>${classification}</span></td>
                    <td class='fs_sequence'><span class="coaSeq" old='${classificationSequence.classificationSeq}' contenteditable=true val="${classification}" column="classificatonSeq" conditionColumn="classification"> ${classificationSequence.classificationSeq}</span></td>
                    <td class="fs_notes"></td>
                    <td class="fs_currentYear"></td>
                    <td class="fs_prevoiusYear"></td>
                </tr>
                `;


                let uniqueHead = Array.from(new Set(headList))
                uniqueHead.map((head) => {
                    let headObj;
                    let headId = alie.replaceAll(/[^A-Z0-9]+/ig, "") + classification.replaceAll(/[^A-Z0-9]+/ig, "") + head.replaceAll(/[^A-Z0-9]+/ig, "")
                    let subheadList = []
                    coaMaster.map((item) => {
                        if (alie == item.alie && classification == item.classification && head == item.head) {
                            headObj = JSON.stringify({ "bspl": item.bspl, 'alie': item.alie, "classification": item.classification, "alieSeq": item.alieSeq, "classificationSeq": item.classificatonSeq, "headSeq": item.headSeq })
                            subheadList.push(item.subHead)
                        }
                    })

                    let headSequence = JSON.parse(headObj)

                    // let nonEditableHeads = alieSequence.bspl ===  plHeads;
                    // let isEditableHead = !nonEditableHeads.includes(head);
                    // let contentEditableAttrHead = isEditableHead ? "true" : "false";
                    let isEditableHead = !plHeads.includes(head);
                    let contentEditableAttrHead = isEditableHead ? "true" : "false";
                    coaTree += `
                        <tr  id='${headId}_head'>
                            <td class='createCoa d-flex'><button class="btn btn-primary addLevel m-1 p-0" ><i class="bi bi-plus"></i></button><button class="btn delLevel m-1 p-0"><i class="fa-solid fa-trash icon"></i></button></td>
                            <td style='padding-left:60px;' class="coaValue" column='${headObj}' ><a href="#${headId}" class="scroll-to"><i class="fa-solid fa-arrow-down icon" style="margin-right:5px;"></i></a><span class="coaName" val='${head}' column="head"  contenteditable=${contentEditableAttrHead}>${head}</span></td>
                            <td class='fs_sequence'><span class="coaSeq" old='${headSequence.headSeq}' contenteditable=true val="${head}" column="headSeq" conditionColumn="head"> ${headSequence.headSeq}</span></td>
                            <td class="fs_notes"></td>
                            <td class="fs_currentYear"></td>
                            <td class="fs_prevoiusYear"></td>
                        </tr>
                        `;

                    let uniqueSubHead = Array.from(new Set(subheadList))
                    let subHeadRows = ''
                    let coaList = []
                    uniqueSubHead.map((subHead) => {
                        let subHeadObj;
                        coaMaster.map((item) => {
                            if (alie == item.alie && classification == item.classification && head == item.head && subHead == item.subHead) {
                                subHeadObj = JSON.stringify({ "bspl": item.bspl, 'alie': item.alie, "classification": item.classification, "head": item.head, "alieSeq": item.alieSeq, "classificationSeq": item.classificatonSeq, "headSeq": item.headSeq, "subHeadSeq": item.subHeadSeq })
                                coaObj = JSON.stringify({ "bspl": item.bspl, 'alie': item.alie, "classification": item.classification, "head": item.head, "subHead": item.subHead, "alieSeq": item.alieSeq, "classificationSeq": item.classificatonSeq, "headSeq": item.headSeq, "subHeadSeq": item.subHeadSeq })
                                coaList.push(item.coa)

                            }
                        })

                        let subHeadSequence = JSON.parse(subHeadObj)
                        let isEditableSubhead = !plSubheads.includes(subHead);
                        let contentEditableAttrSubhead = isEditableSubhead ? "true" : "false";
                        subHeadRows += `
                        <tr>
                            <td class='createCoa d-flex'><button class="btn btn-primary addLevel m-1 p-0" ><i class="bi bi-plus"></i></button><button class="btn delLevel m-1 p-0"><i class="fa-solid fa-trash icon"></i></button></td>
                            <td style='padding-left:60px;' class="coaValue" column='${subHeadObj}'><i class="fa-solid fa-eye subHead icon" style="margin-right:5px" val="${subHead}"></i><span class="coaName" val='${subHead}' column="subHead"  contenteditable=${contentEditableAttrSubhead}>${subHead}</span></td>
                            <td class='fs_sequence'><span class="coaSeq" old='${subHeadSequence.subHeadSeq}' val="${subHead}" contenteditable=true column="subHeadSeq" conditionColumn="coa"> ${subHeadSequence.subHeadSeq}</span></td>
                            <td class="fs_currentYear"></td>
                            <td class="fs_prevoiusYear"></ td>
                        </tr>
                        `;


                        let uniqueCoa = Array.from(new Set(coaList))
                        uniqueCoa.map((coa) => {
                            let coaObj;
                            coaMaster.map((item) => {
                                if (alie == item.alie && classification == item.classification && head == item.head && subHead == item.subHead && coa == item.coa) {
                                    coaObj = JSON.stringify({ "bspl": item.bspl, 'alie': item.alie, "classification": item.classification, "head": item.head, "subHead": item.subHead, "alieSeq": item.alieSeq, "classificationSeq": item.classificatonSeq, "headSeq": item.headSeq, "subHeadSeq": item.subHeadSeq })
                                    let subHeadId = alie.replaceAll(/[^A-Z0-9]+/ig, "") + classification.replaceAll(/[^A-Z0-9]+/ig, "") + head.replaceAll(/[^A-Z0-9]+/ig, "") + item.subHead.replaceAll(/[^A-Z0-9]+/ig, "")
                                    let isEditableCoa = alieSequence.bspl === "BS" ? !bsCoa.includes(item.coa) : true;
                                    let contentEditableAttrCoa = isEditableCoa ? "true" : "false";
                                    modalList += `<tr class="hideColumn" id="modal_${subHeadId}" style="display:none">
                                        <td class='createCoa d-flex'><button class="btn btn-primary addLevel m-1 p-0" ><i class="bi bi-plus"></i></button><button class="btn delLevel m-1 p-0"><i class="fa-solid fa-trash icon"></i></button></td>
                                        <td style='padding-left:60px;' class="coaValue" column='${coaObj}'><span class="coaName" val='${item.coa}' column="coa" contenteditable=${contentEditableAttrCoa}>${item.coa}</span></td>
                                        <td class="fs_currentYear"></td>
                                        <td class="fs_prevoiusYear"></td>
                                    </tr>`

                                }
                            })

                        })

                    })
                    notesTable += `<div  class="pt-4" id='${headId}'>
                            <h6 style="font-weight:bold;">Note No.${0}-${head.toUpperCase()} <span id='${headId}'><a href="#${headId}_head"  class="scroll-to-head"><i class="fa-solid fa-arrow-up icon" style="margin-right:5px;font-size:15px;"></i></a></span></h6>
                            <div class="table-responsive">
                                <table class="table financials_table">
                                    <thead>
                                        <tr>
                                            <th style="width:2vw;"></th>
                                            <th style="width:46vw;">Particulars</th>
                                            <th style="width:6vw;">Sequence</th>
                                            <th style="width:11vw;">As at March 31,<span class="summaryCrntFY"></span></th>
                                            <th style="width:11vw;">As at March 31,<span class="summaryPrevFY"></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${subHeadRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>`

                    //  class="scroll-to-head"
                })
                // document.querySelectorAll('.scroll-to').forEach(anchor => {
                //     anchor.addEventListener('click', function (e) {
                //         e.preventDefault();
                //         const targetId = this.getAttribute('href').substring(1);
                //         smoothScrollTo(targetId);
                //     });
                // });
            })

            let alieObj_json = JSON.parse(alieObj)
            resultJson.push({ bspl: alieObj_json.bspl, coaTree: coaTree, notesTable: notesTable })
            // if (alieObj_json.bspl == "BS") {
            //     $(".tbBalance>tbody").append(coaTree)
            //     $(".tbNotes_bs").append(notesTable)
            // } else {
            //     $(".tbPL>tbody").append(coaTree);
            //     $(".tbNotes_pl").append(notesTable)
            // }

        })
        return {
            resultJson: resultJson,
            modalList: modalList
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function createCoa({ data, addedTime, company, username }) {
    try {
        let keys = Object.keys(data)
        let newAlie = `newAlie` + addedTime
        let newClassification = `newClassification` + addedTime
        let newHead = `newHead` + addedTime
        let newSubHead = `newSubHead` + addedTime
        let newCoa = `newCoa` + addedTime
        let maxAlieSeq = await exeQuery(`SELECT MAX(alieSeq) FROM coaMaster WHERE companyID=${company.companyID} and bspl='${data.bspl}'`);
        let currentMaxAlieSeq = maxAlieSeq.responseData.table[0].column1;
        let maxClassificationSeq = await exeQuery(`SELECT MAX(classificatonSeq) as maxClassificationSeq FROM coaMaster WHERE companyID=${company.companyID} and alie='${data.alie}'`);
        let currentMaxClassificationSeq = maxClassificationSeq.responseData.table[0].maxClassificationSeq;
        let maxHeadSeq = await exeQuery(`SELECT MAX(headSeq) as maxHeadSeq FROM coaMaster WHERE companyID=${company.companyID} and classification='${data.classification}'`);
        let currentMaxHeadSeq = maxHeadSeq.responseData.table[0].maxHeadSeq;
        let maxSubHeadSeq = await exeQuery(`SELECT MAX(subHeadSeq) as maxSubHeadSeq FROM coaMaster WHERE companyID=${company.companyID} and head='${data.head}'`);
        let currentMaxSubHeadSeq = maxSubHeadSeq.responseData.table[0].maxSubHeadSeq;
        let res;
        if (keys.includes('bspl') && !keys.includes('alie') && !keys.includes('classification') && !keys.includes('head') && !keys.includes('subHead')) {
            let alieSeq = Number(currentMaxAlieSeq) + 1
            res = await exeQuery(`insert into coaMaster (alie,alieSeq,classification,classificatonSeq,head,headSeq,subHead,subHeadSeq,coa,bspl,companyID,companyName,addedTime,addedUser) 
                values('${newAlie}','${alieSeq}','${newClassification}','1','${newHead}','1','${newSubHead}','1','${newCoa}','${data.bspl}','${company.companyID}','${company.companyname}','${addedTime}','${username}')`)
        }
        else if (keys.includes('bspl') && keys.includes('alie') && !keys.includes('classification') && !keys.includes('head') && !keys.includes('subHead')) {
            let classificationSeq = Number(currentMaxClassificationSeq) + 1
            res = await exeQuery(`insert into coaMaster (alie,alieSeq,classification,classificatonSeq,head,headSeq,subHead,subHeadSeq,coa,bspl,companyID,companyName,addedTime,addedUser) 
                values('${data.alie}','${data.alieSeq}','${newClassification}','${classificationSeq}','${newHead}','1','${newSubHead}','1','${newCoa}','${data.bspl}','${company.companyID}','${company.companyname}','${addedTime}','${username}')`)
        }
        else if (keys.includes('bspl') && keys.includes('alie') && keys.includes('classification') && !keys.includes('head') && !keys.includes('subHead')) {
            let headSeq = Number(currentMaxHeadSeq) + 1
            res = await exeQuery(`insert into coaMaster (alie,alieSeq,classification,classificatonSeq,head,headSeq,subHead,subHeadSeq,coa,bspl,companyID,companyName,addedTime,addedUser) 
                values('${data.alie}','${data.alieSeq}','${data.classification}','${data.classificationSeq}','${newHead}','${headSeq}','${newSubHead}','1','${newCoa}','${data.bspl}','${company.companyID}','${company.companyname}','${addedTime}','${username}')`)
        }
        else if (keys.includes('bspl') && keys.includes('alie') && keys.includes('classification') && keys.includes('head') && !keys.includes('subHead')) {
            let subHeadSeq = Number(currentMaxSubHeadSeq) + 1
            res = await exeQuery(`insert into coaMaster (alie,alieSeq,classification,classificatonSeq,head,headSeq,subHead,subHeadSeq,coa,bspl,companyID,companyName,addedTime,addedUser) 
                values('${data.alie}','${data.alieSeq}','${data.classification}','${data.classificationSeq}','${data.head}','${data.headSeq}','${newSubHead}','${subHeadSeq}','${newCoa}','${data.bspl}','${company.companyID}','${company.companyname}','${addedTime}','${username}')`)
        }
        else if (keys.includes('bspl') && keys.includes('alie') && keys.includes('classification') && keys.includes('head') && keys.includes('subHead')) {
            res = await exeQuery(`insert into coaMaster (alie,alieSeq,classification,classificatonSeq,head,headSeq,subHead,subHeadSeq,coa,bspl,companyID,companyName,addedTime,addedUser) 
                values('${data.alie}','${data.alieSeq}','${data.classification}','${data.classificationSeq}','${data.head}','${data.headSeq}','${data.subHead}','${data.subHeadSeq}','${newCoa}','${data.bspl}','${company.companyID}','${company.companyname}','${addedTime}','${username}')`)
        }
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }

}

async function deleteCoa({ name, column, parentColumn, company }) {
    try {
        let parentColumn_json = JSON.parse(parentColumn)
        let parentCol_keys = Object.keys(parentColumn_json)
        let bsplCondition, alieCondition, classificationCondition, headCondition, subheadCondition
        (parentCol_keys.includes("bspl")) ? bsplCondition = ` AND bspl='${parentColumn_json.bspl}'` : bsplCondition = "";
        (parentCol_keys.includes("alie")) ? alieCondition = ` AND alie='${parentColumn_json.alie}'` : alieCondition = "";
        (parentCol_keys.includes("classification")) ? classificationCondition = ` AND classification='${parentColumn_json.classification}'` : classificationCondition = "";
        (parentCol_keys.includes("head")) ? headCondition = ` AND head='${parentColumn_json.head}'` : headCondition = "";
        (parentCol_keys.includes("subHead")) ? subheadCondition = ` AND subHead='${parentColumn_json.subHead}'` : subheadCondition = "";
        let res = await exeQuery(`delete from coaMaster where ${column}='${name}' and companyID='${company.companyID}'${bsplCondition}${alieCondition}${classificationCondition}${headCondition}${subheadCondition}`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function updateCoaMaster({ oldCoa, newCoa, column, parentColumn, company }) {
    try {
        let modifiedColumn = column
        let parentColumn_json = JSON.parse(parentColumn)
        let parentCol_keys = Object.keys(parentColumn_json)
        let bsplCondition, alieCondition, classificationCondition, headCondition, subheadCondition
        (parentCol_keys.includes("bspl")) ? bsplCondition = ` AND bspl='${parentColumn_json.bspl}'` : bsplCondition = "";
        (parentCol_keys.includes("alie")) ? alieCondition = ` AND alie='${parentColumn_json.alie}'` : alieCondition = "";
        (parentCol_keys.includes("classification")) ? classificationCondition = ` AND classification='${parentColumn_json.classification}'` : classificationCondition = "";
        (parentCol_keys.includes("head")) ? headCondition = ` AND head='${parentColumn_json.head}'` : headCondition = "";
        (parentCol_keys.includes("subHead")) ? subheadCondition = ` AND subHead='${parentColumn_json.subHead}'` : subheadCondition = "";


        if (column == "coa") {
            modifiedColumn = "ggshCoa";
        }

        let updateCoaMaster_query = `UPDATE coaMaster SET ${column}='${newCoa}' WHERE ${column}='${oldCoa}' AND companyid='${company.companyID}'${bsplCondition}${alieCondition}${classificationCondition}${headCondition}${subheadCondition}`;
        let query1 = Buffer.from(updateCoaMaster_query).toString('base64');
        let updateCoaMapped_query = `UPDATE COA_mapped SET ${modifiedColumn}='${newCoa}' WHERE ${modifiedColumn}='${oldCoa}' AND companyid='${company.companyID}'${bsplCondition}${alieCondition}${classificationCondition}${headCondition}${subheadCondition}`;
        let query2 = Buffer.from(updateCoaMapped_query).toString('base64');
        let updateCoaMaster_call = await queryGet([query1, query2]);
        return updateCoaMaster_call
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function updateCoaMasterSeq({ coa, seq, column, conditionColumn, company }) {
    try {
        let updateCoaMaster_query = await exeQuery(`UPDATE coaMaster SET ${column}='${seq}' WHERE ${conditionColumn}='${coa}' AND companyid='${company.companyID}'`);
        return updateCoaMaster_query
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function bulkInsertCoaMapped({ data }) {
    try {
        let queryList = []
        data.map((item) => {
            let query = `INSERT INTO coa_mapped (companyname,name,ggshCoa,ledgergroup)
                                    VALUES(
                                        '${item.companyname}',
                                        '${item.name}',
                                        '${item.ggshCoa}',
                                       '${item.ledgergroup}'
                                    )`
            let insert = Buffer.from(query).toString('base64');
            queryList.push(insert)
        })
        let res = await queryGet(queryList)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function resetCompanyCoa({ username, companyname, companyid, addedTime }) {
    try {
        let udeleteCoaMaster = await exeQuery(`delete from coaMaster where companyID='${companyid}'`);
        let insertCoaMaster = await exeQuery(`INSERT INTO coaMaster(companyName,
        coa,
        alie,
        bspl,
        classification,
        head,
        subHead,
        dc,
        alieSeq,
        classificatonSeq,
        headSeq,
        subHeadSeq,
        misCoa,
        country,
        entityType
        ) SELECT companyName,
        coa,
        alie,
        bspl,
        classification,
        head,
        subHead,
        dc,
        alieSeq,
        classificatonSeq,
        headSeq,
        subHeadSeq,
        misCoa,
        country,
        entityType FROM ggshCoa;
        UPDATE coaMaster SET companyName='${companyname}',companyID='${companyid}',addedUser='${username}',addedTime='${addedTime}'
        WHERE companyName='Not Set'`);
        return {
            'del':udeleteCoaMaster,
            'ins':insertCoaMaster
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }

}





module.exports = { coa_financialView, createCoa, deleteCoa,resetCompanyCoa, updateCoaMaster, updateCoaMasterSeq, bulkInsertCoaMapped }