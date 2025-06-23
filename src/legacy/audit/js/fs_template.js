const { fetchTable, exeQuery, fetchOptions, queryGet } = require('../../config')

async function getCoaOptions({ companyid }) {
    try {
        let coaMaster = await fetchOptions(`select distinct coa from coamaster where companyid='${companyid}'`, "coa", "coa")
        return coaMaster
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function fetchTemplates({ companyid, financialYear }) {
    try {
        let template;
        let type;
        let lid;
        let template_transaction = await fetchTable(`select * from templateTransaction where companyid='${companyid}' and financialyear='${financialYear}'`)
        if (template_transaction.length == 0) {
            let template_global = await fetchTable(`select * from syf_globalTemplates where category='Audit'`)
            type = 'global'
            template = template_global

        }
        else {
            lid = template_transaction[0].lid
            type = 'transaction'
            template = template_transaction;

        }
        return {
            lid: lid,
            type: type,
            template: template
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function insertTransaction({ data }) {
    try {
        let res = await exeQuery(`insert into templateTransaction (companyid,companyname,financialyear,htmltemplate,templateName,category,standardPath,addedUser,addedTime)
        values('${data.companyid}','${data.companyname}','${data.financialYear}','${data.temp}','${data.templateName}','Audit','${data.decryptPath}','${data.username}','${data.addedTime}')`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateTransaction({ data }) {
    try {
        let res = await exeQuery(`update templateTransaction set htmltemplate='${data.temp}',modifiedTime='${data.modifiedTime}',modifiedUser='${data.username}' where lid='${data.lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function balanceSheet({ company, dateDetails, roman }) {
    try {
        let client = company.companyID;
        let crntFY = dateDetails.currentYear;
        let prevFY = dateDetails.previousYear;
        let crntYearFormat = dateDetails.cy_current;
        let prevYearFormat = dateDetails.cy_previous;
        let crntYear = crntFY;
        let preYear = prevFY;
        let tb_pl;
        let tb_bs;
        let tbDataLength
        let tb_pl_notesList = []
        let tb_bs_notesList = []

        let tbData = await fetchTable(`SELECT * FROM dbo.fnfetchAnnualTb('${client}','${preYear}','${crntYear}') ORDER BY alieSeq,classificationSeq,headSeq,subHeadSeq`);
        if (tbData.length != 0) {
            let bs_alieList = [];
            let pl_alieList = [];
            tbData.map((tb) => {
                if (tb.bspl == "BS") {
                    bs_alieList.push(tb.alie);
                }
                else if (tb.bspl == "PL") {
                    pl_alieList.push(tb.alie);
                }
            });
            let bs_uniqueAlieList = Array.from(new Set(bs_alieList));
            let pl_uniqueAlieList = Array.from(new Set(pl_alieList));




            // ********************* Financials Profit & Loss table formation start *********************
            let headList_check = [];
            bs_uniqueAlieList.map((alie) => {
                tbData.map(function (fo) {
                    if (fo.alie == alie) {
                        headList_check.push(fo.head);
                    }
                });
            });
            let uniqueHeadList_check = Array.from(new Set(headList_check));


            let headCount = uniqueHeadList_check.length + 1;
            let plRow = "";
            let pl_current_profit, pl_prev_profit;
            let income_current_Total, income_prev_Total, expense_current_Total, expense_prev_Total;
            pl_uniqueAlieList.map((alie, inx) => {
                let totalRow;
                if (alie == "Income") {
                    totalRow = "incomeTotalRow";
                }
                else {
                    totalRow = "expenseTotalRow";
                }
                plRow += `<tr><td class="tbsAlie"><b>${roman[inx + 3]}. ${alie}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;

                let classList = [];
                tbData.map(function (fo) {
                    if (fo.alie == alie) {
                        classList.push(fo.classification);
                    }
                });
                let uniqueClassList = Array.from(new Set(classList));

                let crntAlieTotal = 0;
                let prevAlieTotal = 0;
                uniqueClassList.map((cls) => {
                    plRow += `<tr><td class="tbsClassify"><b>${cls}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;
                    let headList = [];
                    tbData.map(function (fo) {
                        if (fo.alie == alie && fo.classification == cls) {
                            headList.push(fo.head);
                        }
                    });
                    let uniqueHeadList = Array.from(new Set(headList));

                    let crntClassTotal = 0;
                    let prevClassTotal = 0;

                    uniqueHeadList.map((head) => {
                        headCount += 1;
                        let crntClosing = 0;
                        let prevClosing = 0;
                        let subHeadList = [];

                        tbData.map(function (fo) {
                            if (fo.alie == alie && fo.classification == cls && fo.head == head) {
                                subHeadList.push(fo.subhead);
                                if (fo.fy == crntFY) {
                                    let closing = Number(fo.closingbalance);
                                    if (closing < 0) { closing *= 1 }
                                    crntClosing += closing;
                                    crntAlieTotal += closing;
                                    crntClassTotal += closing;
                                }
                                else if (fo.fy == prevFY) {
                                    let closing = Number(fo.closingbalance);
                                    if (closing < 0) { closing *= 1 }
                                    prevClosing += closing;
                                    prevAlieTotal += closing;
                                    prevClassTotal += closing;
                                }
                            }
                        });
                        // Profit/loss SubHead Creation Start
                        let uniqueSubHeadList = Array.from(new Set(subHeadList));
                        let shRow = "";
                        let crnt_subHeadTotal = 0;
                        let prev_subHeadTotal = 0;
                        uniqueSubHeadList.map((subHead) => {
                            let sh_crntClosing = 0;
                            let sh_prevClosing = 0;
                            tbData.map(function (fo) {
                                if (fo.alie == alie && fo.classification == cls && fo.head == head && fo.subhead == subHead) {
                                    if (fo.fy == crntFY) {
                                        let closing = Number(fo.closingbalance);
                                        if (closing < 0) { closing *= 1 }
                                        sh_crntClosing += closing;
                                        crnt_subHeadTotal += closing;
                                    }
                                    else if (fo.fy == prevFY) {
                                        let closing = Number(fo.closingbalance);
                                        if (closing < 0) { closing *= 1 }
                                        sh_prevClosing += closing;
                                        prev_subHeadTotal += closing;
                                    }
                                }
                            });
                            let subHeadWitoutSpace = subHead.replaceAll(/[^A-Z0-9]+/ig, "");
                            let pageId_subhead = subHeadWitoutSpace;
                            let pageId_subhead_crntClosing = subHeadWitoutSpace + headCount + sh_crntClosing;
                            let pageId_subhead_preClosing = subHeadWitoutSpace + headCount + sh_prevClosing;

                            let bs_crntSH_value, bs_prevSH_value;
                            if (alie == "Income") {
                                if (sh_crntClosing != 0) {
                                    bs_crntSH_value = (sh_crntClosing * -1);
                                }
                                else {
                                    bs_crntSH_value = (sh_crntClosing);
                                }
                                if (sh_prevClosing != 0) {
                                    bs_prevSH_value = (sh_prevClosing * -1);
                                }
                                else {
                                    bs_prevSH_value = (sh_prevClosing);
                                }
                            }
                            else {
                                bs_crntSH_value = (sh_crntClosing);
                                bs_prevSH_value = (sh_prevClosing);
                            }
                            shRow += `<tr class="subHead"><td class="pl-5 contextList" id="${pageId_subhead}" style="position:relative;">${subHead}</td><td id="${pageId_subhead_crntClosing}" class="fs_notes fs_yearCount"  style="position:relative;text-align:right;">${INR(bs_crntSH_value)}</td><td id="${pageId_subhead_preClosing}" style="position:relative;text-align:right;" class="contextList  fs_yearCount">${INR(bs_prevSH_value)}</td></tr>`;
                        });

                        let pageId_crnt_subHeadTotal = "sht" + crnt_subHeadTotal;
                        let pageId_prev_subHeadTotal = "sht" + prev_subHeadTotal;

                        let bs_crntSH_value_T, bs_prevSH_value_T;
                        if (alie == "Income") {
                            if (crnt_subHeadTotal != 0) {
                                bs_crntSH_value_T = (crnt_subHeadTotal * -1);
                            }
                            else {
                                bs_crntSH_value_T = (crnt_subHeadTotal);
                            }
                            if (prev_subHeadTotal != 0) {
                                bs_prevSH_value_T = (prev_subHeadTotal * -1);
                            }
                            else {
                                bs_prevSH_value_T = (prev_subHeadTotal);
                            }
                        }
                        else {
                            bs_crntSH_value_T = (crnt_subHeadTotal);
                            bs_prevSH_value_T = (prev_subHeadTotal);
                        }

                        shRow += `<tr class="fs_total classifyTotal" style='border-top:1px solid black;'><td style="text-align:left;padding-left:15px;font-weight:bold;">Total</td><td id="${pageId_crnt_subHeadTotal}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(bs_crntSH_value_T)}</td><td id="${pageId_prev_subHeadTotal}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prevSH_value_T)}</td></tr>`;

                        let headWitoutSpace = head.replaceAll(/[^A-Z0-9]+/ig, "");
                        let pageId_head = headWitoutSpace;
                        let pageId_head_crntClosing = headWitoutSpace + headCount + crntClosing;
                        let pageId_head_preClosing = headWitoutSpace + headCount + prevClosing;

                        let bs_crnt_value, bs_prev_value;
                        if (alie == "Income") {
                            if (crntClosing != 0) {
                                bs_crnt_value = (crntClosing * -1);
                            }
                            else {
                                bs_crnt_value = (crntClosing);
                            }
                            if (prev_subHeadTotal != 0) {
                                bs_prev_value = (prevClosing * -1);
                            }
                            else {
                                bs_prev_value = (prevClosing);
                            }
                        }
                        else {
                            bs_crnt_value = (crntClosing);
                            bs_prev_value = (prevClosing);
                        }
                        plRow += `<tr class="tbsHead subHeadNavigation" onclick="subHeadNavigation('pl${headCount}')"><td id="${pageId_head}" style="position:relative;text-align:left;padding-left:60px;" class="contextList">${head}</td><td class="fs_notes"  style="text-align:center;padding:0px;">${headCount}</td><td id="${pageId_head_crntClosing}" style="position:relative;text-align:right;" class="contextList  fs_yearCount">${INR(bs_crnt_value)}</td><td  id="${pageId_head_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prev_value)}</td></tr>`;


                        let subHeadTable = `<div id="pl${headCount}" class="pt-4">
                    <h6 style="font-weight:bold;">Note No.${headCount}-${head.toUpperCase()}</h6>
                    <div class="table-responsive">
                        <table class="table financials_table">
                            <thead>
                                <tr>
                                    <th style="width:46vw;">Particulars</th>
                                    <th style="width:11vw;">As at March 31,<span class="summaryCrntFY"></span></th>
                                    <th style="width:11vw;">As at March 31, <span class="summaryPrevFY"></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${shRow}
                            </tbody>
                        </table>
                    </div>
                    </div>
                `;
                        tb_pl_notesList.push(subHeadTable)
                    });
                    let pageId_crntClassTotal = "clst" + crntClassTotal;
                    let pageId_prevClassTotal = "clst" + prevClassTotal;

                    let bs_crntClass_value_T, bs_prevClass_value_T;
                    if (alie == "Income") {
                        if (crntClassTotal != 0) {
                            bs_crntClass_value_T = (crntClassTotal * -1);
                        }
                        else {
                            bs_crntClass_value_T = (crntClassTotal);
                        }
                        if (prevClassTotal != 0) {
                            bs_prevClass_value_T = (prevClassTotal * -1);
                        }
                        else {
                            bs_prevClass_value_T = (prevClassTotal);
                        }
                    }
                    else {
                        bs_crntClass_value_T = (crntClassTotal);
                        bs_prevClass_value_T = (prevClassTotal);
                    }

                    plRow += `<tr class="classifyTotal"><td></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="position:relative;border-top:1px solid black;text-align:right;" id="${pageId_crntClassTotal}" class="contextList  fs_yearCount">${INR(bs_crntClass_value_T)}</td><td style="position:relative;border-top:1px solid black;text-align:right;border-left:1px solid black;" id="${pageId_prevClassTotal}" class="contextList  fs_yearCount">${INR(bs_prevClass_value_T)}</td></tr>`;
                });
                let pageId_crntAlieTotal = "alie" + crntAlieTotal;
                let pageId_prevAlieTotal = "alie" + prevAlieTotal;

                let bs_crntAlie_value_T, bs_prevAlie_value_T;
                if (alie == "Income") {
                    if (crntAlieTotal != 0) {
                        bs_crntAlie_value_T = (crntAlieTotal * -1);
                    }
                    else {
                        bs_crntAlie_value_T = (crntAlieTotal);
                    }
                    if (prevAlieTotal != 0) {
                        bs_prevAlie_value_T = (prevAlieTotal * -1);
                    }
                    else {
                        bs_prevAlie_value_T = (prevAlieTotal);
                    }
                }
                else {
                    bs_crntAlie_value_T = (crntAlieTotal);
                    bs_prevAlie_value_T = (prevAlieTotal);
                }

                if (alie == "Income") {
                    income_current_Total = bs_crntAlie_value_T;
                    income_prev_Total = bs_prevAlie_value_T;
                }
                else {
                    expense_current_Total = bs_crntAlie_value_T;
                    expense_prev_Total = bs_prevAlie_value_T;
                }

                plRow += `<tr class="fs_total alieTotal ${totalRow}"><td class="text-center" style="font-weight:bold;">Total</td><td style="border:none;"></td><td id="${pageId_crntAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_crntAlie_value_T)}</td><td id="${pageId_prevAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList fs_yearCount">${INR(bs_prevAlie_value_T)}</td></tr>`;
            });

            pl_current_profit = income_current_Total - expense_current_Total;
            pl_prev_profit = income_prev_Total - expense_prev_Total;

            plRow += `<tr class="alieTotal"><td class="text-center" style="font-weight:bold;">Profit</td><td style="border-left:1px solid black;"></td><td style="position:relative;text-align:right;font-weight:bold;border-left:1px solid black;" class="contextList  fs_yearCount">${INR(pl_current_profit)}</td><td style="position:relative;text-align:right;font-weight:bold;" class="fs_notes fs_yearCount">${INR(pl_prev_profit)}</td></tr>`;
            tb_pl = plRow
            // ****************** Financials Profit & Loss table formation End *********************

            // ********************* Financials Balance sheet Creation Start *********************

            let clsHtmlrow = "";
            let headCount_bs = 1;

            bs_uniqueAlieList.map((alie, inx) => {
                clsHtmlrow += `<tr><td class="tbsAlie"><b>${roman[inx + 1]}. ${alie}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;

                let classList = [];
                tbData.map(function (fo) {
                    if (fo.alie == alie) {
                        classList.push(fo.classification);
                    }
                });
                let uniqueClassList = Array.from(new Set(classList));


                let crntAlieTotal = 0;
                let prevAlieTotal = 0;
                uniqueClassList.map((cls) => {
                    clsHtmlrow += `<tr><td class="tbsClassify"><b>${cls}</b></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="text-align:right;" class="fs_yearCount"></td><td style="text-align:right;border-left:1px solid black;" class="fs_yearCount"></td></tr>`;

                    let headList = [];
                    tbData.map(function (fo) {
                        if (fo.alie == alie && fo.classification == cls) {
                            headList.push(fo.head);
                        }
                    });
                    let uniqueHeadList = Array.from(new Set(headList));

                    let crntClassTotal = 0;
                    let prevClassTotal = 0;

                    uniqueHeadList.map((head) => {
                        headCount_bs += 1;
                        let crntClosing = 0;
                        let prevClosing = 0;
                        let subHeadList = [];

                        tbData.map(function (fo) {
                            if (fo.alie == alie && fo.classification == cls && fo.head == head) {
                                subHeadList.push(fo.subhead);
                                if (fo.fy == crntFY) {
                                    let closing = Number(fo.closingbalance);
                                    if (closing < 0) { closing *= 1 }
                                    crntClosing += closing;
                                    crntAlieTotal += closing;
                                    crntClassTotal += closing;
                                }
                                else if (fo.fy == prevFY) {
                                    let closing = Number(fo.closingbalance);
                                    if (closing < 0) { closing *= 1 }
                                    prevClosing += closing;
                                    prevAlieTotal += closing;
                                    prevClassTotal += closing;
                                }
                            }
                        });
                        // SubHead Creation Start
                        let uniqueSubHeadList = Array.from(new Set(subHeadList));
                        let shRow = "";
                        let crnt_subHeadTotal = 0;
                        let prev_subHeadTotal = 0;
                        uniqueSubHeadList.map((subHead) => {
                            let sh_crntClosing = 0;
                            let sh_prevClosing = 0;
                            tbData.map(function (fo) {
                                if (fo.alie == alie && fo.classification == cls && fo.head == head && fo.subhead == subHead) {
                                    if (fo.fy == crntFY) {
                                        let closing = Number(fo.closingbalance);
                                        if (closing < 0) { closing *= 1 }
                                        sh_crntClosing += closing;
                                        crnt_subHeadTotal += closing;
                                    }
                                    else if (fo.fy == prevFY) {
                                        let closing = Number(fo.closingbalance);
                                        if (closing < 0) { closing *= 1 }
                                        sh_prevClosing += closing;
                                        prev_subHeadTotal += closing;

                                    }
                                }
                            });
                            let subHeadWitoutSpace = subHead.replaceAll(/[^A-Z0-9]+/ig, "");
                            let pageId_subhead = subHeadWitoutSpace;
                            let pageId_subhead_crntClosing = subHeadWitoutSpace + headCount_bs + sh_crntClosing;
                            let pageId_subhead_preClosing = subHeadWitoutSpace + headCount_bs + sh_prevClosing;

                            let bs_crntSH_value, bs_prevSH_value;
                            if (alie == "Liabilities") {
                                if (sh_crntClosing != 0) {
                                    bs_crntSH_value = (sh_crntClosing * -1);
                                }
                                else {
                                    bs_crntSH_value = (sh_crntClosing);
                                }
                                if (sh_prevClosing != 0) {
                                    bs_prevSH_value = (sh_prevClosing * -1);
                                }
                                else {
                                    bs_prevSH_value = (sh_prevClosing);
                                }
                            }
                            else {
                                bs_crntSH_value = (sh_crntClosing);
                                bs_prevSH_value = (sh_prevClosing);
                            }

                            if (subHead == "Other reserves") {
                                shRow += `
                                <tr class="subHead openingBalance"><td class="pl-3 contextList" id="openingBalance" style="position:relative;">Opening Balance</td><td id="${pageId_subhead_crntClosing}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(bs_crntSH_value)}</td><td id="${pageId_subhead_preClosing}" style="position:relative;text-align:right;" class="contextList fs_yearCount">${INR(bs_prevSH_value)}</td></tr>
                                <tr class="subHead profitOrLoss"><td class="pl-3 contextList" id="profitLoss" style="position:relative;">Profit / Loss</td><td id="pageId_${pl_current_profit}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(pl_current_profit)}</td><td id="pageId_${pl_prev_profit}" style="position:relative;text-align:right;" class="contextList fs_yearCount">${INR(pl_prev_profit)}</td></tr>
                                <tr class="subHead closingBalance" style="border-top:1px solid black;"><td class="pl-3 contextList" id="closingBalance" style="position:relative;"><b>Closing Balance</b></td><td id="pageId_${bs_crntSH_value + pl_current_profit}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount"><b>${INR(bs_crntSH_value + pl_current_profit)}</b></td><td id="pageId_${bs_prevSH_value + pl_prev_profit}" style="position:relative;text-align:right;" class="contextList fs_yearCount"><b>${INR(bs_prevSH_value + pl_prev_profit)}</b></td></tr>
                            `;
                            }
                            else {
                                shRow += `<tr class="subHead"><td class="pl-3 contextList" id="${pageId_subhead}" style="position:relative;">${subHead}</td><td id="${pageId_subhead_crntClosing}" style="position:relative;text-align:right;" class="fs_notes fs_yearCount">${INR(bs_crntSH_value)}</td><td id="${pageId_subhead_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prevSH_value)}</td></tr>`;
                            }
                        });

                        let pageId_crnt_subHeadTotal = "sht" + crnt_subHeadTotal;
                        let pageId_prev_subHeadTotal = "sht" + prev_subHeadTotal;

                        let bs_crntSH_value_T, bs_prevSH_value_T;
                        if (alie == "Liabilities") {
                            if (crnt_subHeadTotal != 0) {
                                bs_crntSH_value_T = (crnt_subHeadTotal * -1);
                            }
                            else {
                                bs_crntSH_value_T = (crnt_subHeadTotal);
                            }
                            if (prev_subHeadTotal != 0) {
                                bs_prevSH_value_T = (prev_subHeadTotal * -1);
                            }
                            else {
                                bs_prevSH_value_T = (prev_subHeadTotal);
                            }
                        }
                        else {
                            bs_crntSH_value_T = (crnt_subHeadTotal);
                            bs_prevSH_value_T = (prev_subHeadTotal);
                        }

                        if (head != "Reserves and surplus") {
                            shRow += `<tr class="fs_total classifyTotal" style='border-top:1px solid black;font-weight:bold;'><td>Total</td><td id="${pageId_crnt_subHeadTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList fs_yearCount">${INR(bs_crntSH_value_T)}</td><td id="${pageId_prev_subHeadTotal}" style="position:relative;text-align:right;font-weight:bold;border-left:1px solid black;" class="contextList fs_yearCount">${INR(bs_prevSH_value_T)}</td></tr>`;
                        }

                        let headWitoutSpace = head.replaceAll(/[^A-Z0-9]+/ig, "");
                        let pageId_head = headWitoutSpace;
                        let pageId_head_crntClosing = headWitoutSpace + headCount_bs + crntClosing;
                        let pageId_head_preClosing = headWitoutSpace + headCount_bs + prevClosing;

                        let bs_crnt_value, bs_prev_value;
                        if (alie == "Liabilities") {
                            if (crntClosing != 0) {
                                bs_crnt_value = (crntClosing * -1);
                            }
                            else {
                                bs_crnt_value = (crntClosing);
                            }
                            if (prev_subHeadTotal != 0) {
                                bs_prev_value = (prevClosing * -1);
                            }
                            else {
                                bs_prev_value = (prevClosing);
                            }
                        }
                        else {
                            bs_crnt_value = (crntClosing);
                            bs_prev_value = (prevClosing);
                        }

                        if (head == "Reserves and surplus") {
                            clsHtmlrow += `<tr class="tbsHead subHeadNavigation" onclick="subHeadNavigation('bs${headCount_bs}')"><td id="${pageId_head}" style="position:relative;padding-left:60px;" class="contextList">${head}</td><td style="text-align:center;padding:0px;" class="fs_notes">${headCount_bs}</td><td id="${pageId_head_crntClosing}" style="position:relative;text-align:right;" class="contextList fs_yearCount">${INR(bs_crnt_value + pl_current_profit)}</td><td  id="${pageId_head_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList  fs_yearCount">${INR(bs_prev_value + pl_prev_profit)}</td></tr>`;
                        }
                        else {
                            clsHtmlrow += `<tr class="tbsHead subHeadNavigation" onclick="subHeadNavigation('bs${headCount_bs}')"><td id="${pageId_head}" style="position:relative;padding-left:60px;" class="contextList">${head}</td><td style="text-align:center;padding:0px;" class="fs_notes">${headCount_bs}</td><td id="${pageId_head_crntClosing}" style="position:relative;text-align:right;" class="contextList  fs_yearCount">${INR(bs_crnt_value)}</td><td  id="${pageId_head_preClosing}" style="position:relative;text-align:right;border-left:1px solid black;" class="contextList  fs_yearCount">${INR(bs_prev_value)}</td></tr>`;
                        }
                        let subHeadTable = `<div id="bs${headCount_bs}" class="pt-4">
                    <h6 style="font-weight:bold;">Note No.${headCount_bs}-${head.toUpperCase()}</h6>
                    <div class="table-responsive">
                        <table class="table financials_table">
                            <thead>
                                <tr>
                                    <th style="width:46vw;">Particulars</th>
                                    <th style="width:11vw;">As at March 31,<span class="summaryCrntFY"></span></th>
                                    <th style="width:11vw;">As at March 31,<span class="summaryPrevFY"></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${shRow}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    `;
                        tb_bs_notesList.push(subHeadTable)
                    });
                    let pageId_crntClassTotal = "clst" + crntClassTotal;
                    let pageId_prevClassTotal = "clst" + prevClassTotal;

                    let bs_crntClass_value_T, bs_prevClass_value_T;
                    if (alie == "Liabilities") {
                        if (crntClassTotal != 0) {
                            bs_crntClass_value_T = (crntClassTotal * -1);
                        }
                        else {
                            bs_crntClass_value_T = (crntClassTotal);
                        }
                        if (prevClassTotal != 0) {
                            bs_prevClass_value_T = (prevClassTotal * -1);
                        }
                        else {
                            bs_prevClass_value_T = (prevClassTotal);
                        }
                    }
                    else {
                        bs_crntClass_value_T = (crntClassTotal);
                        bs_prevClass_value_T = (prevClassTotal);
                    }

                    if (cls == "Equity and Shareholders funds") {
                        clsHtmlrow += `<tr class="classifyTotal"><td></td><td class="fs_notes" style="text-align:center;padding:0px;"></td><td style="position:relative;border-top:1px solid black;text-align:right;" id="${pageId_crntClassTotal}" class="contextList  fs_yearCount">${INR(bs_crntClass_value_T + pl_current_profit)}</td><td style="position:relative;border-top:1px solid black;text-align:right;border-left:1px solid black;" id="${pageId_prevClassTotal}" class="contextList  fs_yearCount">${INR(bs_prevClass_value_T + pl_prev_profit)}</td></tr>`;
                    }
                    else {
                        clsHtmlrow += `<tr class="classifyTotal"><td></td><td class="fs_notes"  style="text-align:center;padding:0px;"></td><td style="position:relative;border-top:1px solid black;text-align:right;" id="${pageId_crntClassTotal}" class="contextList  fs_yearCount">${INR(bs_crntClass_value_T)}</td><td style="position:relative;border-top:1px solid black;text-align:right;border-left:1px solid black;" id="${pageId_prevClassTotal}" class="contextList  fs_yearCount">${INR(bs_prevClass_value_T)}</td></tr>`;
                    }
                });
                let pageId_crntAlieTotal = "alie" + crntAlieTotal;
                let pageId_prevAlieTotal = "alie" + prevAlieTotal;

                let bs_crntAlie_value_T, bs_prevAlie_value_T;
                if (alie == "Liabilities") {
                    if (crntAlieTotal != 0) {
                        bs_crntAlie_value_T = (crntAlieTotal * -1);
                    }
                    else {
                        bs_crntAlie_value_T = (crntAlieTotal);
                    }
                    if (prevAlieTotal != 0) {
                        bs_prevAlie_value_T = (prevAlieTotal * -1);
                    }
                    else {
                        bs_prevAlie_value_T = (prevAlieTotal);
                    }
                }
                else {
                    bs_crntAlie_value_T = (crntAlieTotal);
                    bs_prevAlie_value_T = (prevAlieTotal);
                }
                if (alie == "Liabilities") {
                    clsHtmlrow += `<tr class="fs_total alieTotal"><td class="text-center" style="font-weight:bold;">Total</td><td style="border:none;"></td><td id="${pageId_crntAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_crntAlie_value_T + pl_current_profit)}</td><td id="${pageId_prevAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_prevAlie_value_T + pl_prev_profit)}</td></tr>`;
                }
                else {
                    clsHtmlrow += `<tr class="fs_total alieTotal"><td class="text-center" style="font-weight:bold;">Total</td><td style="border:none;"></td><td id="${pageId_crntAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_crntAlie_value_T)}</td><td id="${pageId_prevAlieTotal}" style="position:relative;text-align:right;font-weight:bold;" class="contextList  fs_yearCount">${INR(bs_prevAlie_value_T)}</td></tr>`;
                }
            });
            tb_bs = clsHtmlrow
            // $(".tbBalance>tbody").html(clsHtmlrow);
            // ********************* Financials Balance sheet Creation End *********************





        }
        return {
            tb_pl: tb_pl,
            tb_bs: tb_bs,
            tb_bs_notesList: tb_bs_notesList,
            tb_pl_notesList: tb_pl_notesList,
            tbDataLength: tbData.length
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}
function INR(num) {
    let currency = num.toLocaleString('en-IN', {
        // style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    return currency;
}
async function updateCoaMapped({ company,lid,stdCoa }) {
    try {
        let ggshCoa = await fetchTable(`select * from coamaster where companyid='${company.companyID}'`)
        let coaRowList = ggshCoa.filter((item) => {
            return item.coa == stdCoa
        })
        let coaRow = coaRowList[0]



        let updateCoa = await exeQuery(`update COA_mapped set 
            ggshcoa='${stdCoa}',
            alie='${coaRow.alie}',
            classification='${coaRow.classification}',
            head='${coaRow.head}',
            subhead='${coaRow.subHead}',
            alieseq='${coaRow.alieSeq}',
            classificationseq='${coaRow.classificatonSeq}',
            headseq='${coaRow.headSeq}',
            subheadseq='${coaRow.subHeadSeq}'
             where lid=${lid}`);
        
        return updateCoa
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getCoaOptions, fetchTemplates, insertTransaction, updateTransaction, balanceSheet, updateCoaMapped }