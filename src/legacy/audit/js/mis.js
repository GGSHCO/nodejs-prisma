const { workPaper, fetchTable, exeQuery, fetchOptions, queryGet, INR } = require('../../config')


// async function misTable({ groupid, company, year, amount }) {

async function fetchCompanyGroup({ companyIdList }) {
    let companyId = "";
    companyIdList.map((item) => {
        companyId += `'${item}',`;
    })
    companyId = companyId.substring(0, companyId.length - 1)

    try {
        let allCompany = await fetchTable(`select * from syf_companymaster where lid in (${companyId})`);

        let companyGroupId = [];
        allCompany.map((company) => {
            companyGroupId.push(company.groupid)
        });

        let uniqueCompanyGroupId = Array.from(new Set(companyGroupId));

        let companyGroupOptions = [];
        uniqueCompanyGroupId.map((groupid) => {
            let options = [];
            let label;
            allCompany.filter((company) => {

                if (groupid == company.groupid) {
                    (company.groupname != null && company.groupname != "") ? label = company.groupname : label = "Groupless";

                    options.push(
                        { label: company.companyname, value: company.lid },
                    )
                }

            });

            companyGroupOptions.push({
                label: label,
                options: options
            })
        })

        return companyGroupOptions;
    } catch (e) {
        return { error: e }
    }

}
async function misTable({ groupid, company, year, amount, segment, advFilter }) {
    try {

        // ********************************* Need to update later *********************************
        let companyid = "";
        groupid.map((item) => {
            companyid += `${item},`
        })
        companyid = companyid.substring(0, companyid.length - 1);

        // groupid
        let client = groupid[0];
        let split1 = year.split("-")
        let startYear = split1[0];
        let endYear = Number((split1[0])) + 1;

        let company_fe = await fetchTable(`select * from syf_companymaster where lid=${client}`)
        let companyData = company_fe[0]
        let financialMonth = Number(companyData.financialstartmonth)
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthList = { "Jan": "1", "Feb": "2", "Mar": "3", "Apr": "4", "May": "5", "Jun": "6", "Jul": "7", "Aug": "8", "Sep": "9", "Oct": "10", "Nov": "11", "Dec": "12" };

        let monthIndex = monthNames.indexOf(financialMonth);
        let amountFormat = amount
        // let amountFormat = Number($(".amountFormat").val());

        let startMonth = monthIndex + 1;

        let date = new Date(`${startYear}-${financialMonth}-01`);
        let dynamicMonthColumns = [{ title: "Particulars", data: "name" }];
        monthNames.map((month) => {
            let monthName = monthNames[date.getMonth()]
            // date.toLocaleString('default', { month: "short" });
            let monthNumber = monthList[monthName];
            date = date.add(1).month();
            dynamicMonthColumns.push({ title: monthName, data: monthNumber })
            // dynamicMonthColumns.push(monthName)
        });



        let balanceSheet_column = "<th></th>";
        let column = "<th></th>";
        let subColumn = `<th></th>`;
        let timeSyncstamp;
        dynamicMonthColumns.forEach((col) => {
            let colspan = col.title === "Particulars" ? "" : ` colspan="3"`;
            let subColumnContent = col.title === "Particulars" ? "<th></th>" : `<th class="budget">B</th><th class="actual">A</th><th class="variance">V</th>`;

            balanceSheet_column += `<th style="background-color:green;">${col.title}</th>`;
            column += `<th${colspan} style="background-color:red;">${col.title}</th>`;
            subColumn += subColumnContent;
        });

        // $("#profitAndLoss>thead").html(`
        //     <tr>${column}<th colspan='3'>Total</th></tr>
        //     <tr>${subColumn}<th class="budget numbers">B</th><th class="actual">A</th><th class="variance numbers">V</th></tr>
        // `);
        // $("#balanceSheet>thead").html(`<tr>${balanceSheet_column}</tr>`);

        let endDate = date;
        endDate.setMonth(date.getMonth() - 12);
        let endMonth = endDate.getMonth()
        if (endMonth <= 9) {
            endMonth = `0${endMonth}`;
        }
        let closingTotalPyFun;
        let closingTotal;
        let tableRow;
        let tableRow_bs;

        // let tbData1 = await fetchTable(`SELECT * FROM dbo.variableMonthlyTbFetchgroup('${companyid}','${startYear}','${endYear}','${companyData.financialstartmonth}','${endMonth}') ORDER BY alieseq,classificationseq,headseq,subheadseq`);

        let data = {
            "companyIdList": companyid,
            "startYear": startYear,
            "endYear": endYear.toString(),
            "startMonth": companyData.financialstartmonth,
            "endMonth": endMonth
        }


        let tbData1 = await workPaper(data, "feMonthlyTbGroup")
        tbData1 = tbData1.res;
        // return tbData1;
        // if (segment != null && segment !== "") {
        //     tbData1 = tbData1.filter((item) => item.a == segment)
        // }

        // return tbData1;

        // ********************************* Need to update later *********************************


        if (tbData1.length !== 0) {
            timeSyncstamp = tbData1[0].synctimestamp;
            // (synctimestamp != null) ? $(" .lastSync").text(`Last Sync : ${synctimestamp}`) : $(" .lastSync").text(`sync time not available`);
            let rejectedHead = ["Finance cost", "Depreciation and amortisation"]; //Depreciation and amortisation
            let rejectedSubHead = ["Deferred tax", "Current tax"];

            let plExceptionalSet = {
                "ebitda": {},
                "ebt": {},
                "head": {},
                "subhead": {},
                "totalTax": {},
                "eat": {}
            };



            let closingCheck = 0;
            let tbCheck = await pfFunTotalCheck();
            let tbData2 = tbData1.filter((item) => {
                let cb = Number(item.closingbalance) / amountFormat;
                closingCheck += cb;
                if (!rejectedHead.includes(item.head)) {
                    return item;
                }
                if (plExceptionalSet.head.hasOwnProperty(item.head)) {
                    let ds = plExceptionalSet.head[item.head];
                    if (ds.hasOwnProperty(item.monthNo)) {
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    } else {
                        ds[item.monthNo] = { "budget": 0, "actual": 0 };
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    }
                }
                else {
                    plExceptionalSet.head[item.head] = {};
                    let ds = plExceptionalSet.head[item.head];
                    if (ds.hasOwnProperty(item.monthNo)) {
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    } else {
                        ds[item.monthNo] = { "budget": 0, "actual": 0 };
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    }
                }
            });



            // Closing balance total updation
            // $(".closingTotal_pyFun").text(`PY Function Total : ${INR(closingCheck)}`);
            // $(".closingTotal").text(`TB Data Total : ${INR(tbCheck)}`);
            closingTotalPyFun = (INR(closingCheck))
            closingTotal = (INR(tbCheck))

            // if (closingTotalPyFun <= 0 && closingTotal <= 0) {
            //     $(".status-icon").show().css("color", "green").text("TBTotal ✔"); // Green tick
            // } else {
            //     $(".status-icon").show().css("color", "red").text("TBTotal ❌"); // Red cross
            // }

            // (closingCheck == 0 && tbCheck == 0) ? $(".cb_status").html(`<i class="fa-solid fa-check"></i>`) : $(".cb_status").html(`<i class="fa-solid fa-xmark"></i>`);


            let tbData = tbData2.filter((item, inx) => {
                let cb = Number(item.closingbalance) / amountFormat;
                if (!rejectedSubHead.includes(item.subhead)) {
                    return item;
                }
                if (plExceptionalSet.subhead.hasOwnProperty(item.subhead)) {
                    let ds = plExceptionalSet.subhead[item.subhead];
                    if (ds.hasOwnProperty(item.monthNo)) {
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    } else {
                        ds[item.monthNo] = { "budget": 0, "actual": 0 };
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    }
                }
                else {
                    plExceptionalSet.subhead[item.subhead] = {};
                    let ds = plExceptionalSet.subhead[item.subhead];
                    if (ds.hasOwnProperty(item.monthNo)) {
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    } else {
                        ds[item.monthNo] = { "budget": 0, "actual": 0 };
                        if (item.a == "Budget") {
                            ds[item.monthNo].budget += (cb * -1);
                        } else {
                            ds[item.monthNo].actual += (cb * -1);
                        }
                    }
                }
            });

            let subhead_length = Object.keys(plExceptionalSet.subhead)
            if (subhead_length.length == 0) {
                plExceptionalSet.subhead["nodata"] = {};
                dynamicMonthColumns.map((monthNum) => {
                    if (monthNum.data != "name") {

                        if (plExceptionalSet.subhead.hasOwnProperty(monthNum.data)) {
                            plExceptionalSet.subhead["nodata"][monthNum.data].budget = 0;
                            plExceptionalSet.subhead["nodata"][monthNum.data].actual = 0;
                            plExceptionalSet.subhead["nodata"][monthNum.data].variance = 0;
                        } else {
                            plExceptionalSet.subhead["nodata"][monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            plExceptionalSet.subhead["nodata"][monthNum.data].budget = 0;
                            plExceptionalSet.subhead["nodata"][monthNum.data].actual = 0;
                            plExceptionalSet.subhead["nodata"][monthNum.data].variance = 0;
                        }
                    }
                });
            }




            const profit_loss = [
                {
                    "name": "Income",
                    "classification": {

                    }
                },
                {
                    "name": "Expense",
                    "classification": {

                    }
                }
            ]

            let febTotal = 0;
            // profit_loss.map((ds) => {
            tbData.map((tb) => {
                let cb = Number(tb.closingbalance);

                if (tb.alie == "Expense") {
                    if (tb.monthNo == 3) {
                        febTotal += cb;
                    }
                }
            });
            // });


            let income_t = 0, expense_t = 0;
            profit_loss.map((ds) => {
                tbData.map((tb) => {
                    if (tb.alie == ds.name) {
                        let cb = ((Number(tb.closingbalance)) / amountFormat) * -1; // / amountFormat) * -1

                        if (ds.hasOwnProperty(tb.monthNo)) {
                            if (tb.a === "Budget") {
                                ds[tb.monthNo].budget += cb;
                            } else {
                                ds[tb.monthNo].actual += cb;
                            }
                        } else {
                            ds[tb.monthNo] = { "budget": 0, "actual": 0 };
                            if (tb.a === "Budget") {
                                ds[tb.monthNo].budget += cb;
                            } else {
                                ds[tb.monthNo].actual += cb;
                            }
                        }


                        // Classification Creation
                        if (!(ds.classification.hasOwnProperty(tb.classification))) {
                            ds.classification[tb.classification] = {};
                        }
                        let cls = ds.classification[tb.classification];
                        if (cls.hasOwnProperty(tb.monthNo)) {
                            if (tb.a === "Budget") {
                                cls[tb.monthNo].budget += cb;
                            } else {
                                cls[tb.monthNo].actual += cb;
                            }
                        } else {
                            cls[tb.monthNo] = { "budget": 0, "actual": 0 };
                            if (tb.a === "Budget") {
                                cls[tb.monthNo].budget += cb;
                            } else {
                                cls[tb.monthNo].actual += cb;
                            }
                        }


                        // Head Creation
                        if (!(cls.hasOwnProperty(tb.head))) {
                            ds.classification[tb.classification][tb.head] = {};
                        }
                        let head = cls[tb.head];
                        if (head.hasOwnProperty(tb.monthNo)) {
                            if (tb.a == "Budget") {
                                head[tb.monthNo].budget += cb;
                            } else {
                                head[tb.monthNo].actual += cb;
                            }
                        } else {
                            head[tb.monthNo] = { "budget": 0, "actual": 0 };
                            if (tb.a == "Budget") {
                                head[tb.monthNo].budget += cb;
                            } else {
                                head[tb.monthNo].actual += cb;
                            }
                        }

                        // SubHead Creation
                        if (!(head.hasOwnProperty(tb.subhead))) {
                            ds.classification[tb.classification][tb.head][tb.subhead] = {};
                        }
                        let subhead = head[tb.subhead];
                        if (subhead.hasOwnProperty(tb.monthNo)) {
                            if (tb.a == "Budget") {
                                subhead[tb.monthNo].budget += cb;
                            } else {
                                subhead[tb.monthNo].actual += cb;
                            }
                        } else {
                            subhead[tb.monthNo] = { "budget": 0, "actual": 0 };
                            if (tb.a == "Budget") {
                                subhead[tb.monthNo].budget += cb;
                            } else {
                                subhead[tb.monthNo].actual += cb;
                            }
                        }

                        // Particulars Creation
                        if (!(subhead.hasOwnProperty(tb.particulars))) {
                            ds.classification[tb.classification][tb.head][tb.subhead][tb.particulars] = {};
                        }
                        let particulars = subhead[tb.particulars];
                        if (particulars.hasOwnProperty(tb.monthNo)) {
                            if (tb.a == "Budget") {
                                particulars[tb.monthNo].budget += cb;
                            } else {
                                particulars[tb.monthNo].actual += cb;
                            }
                        } else {
                            particulars[tb.monthNo] = { "budget": 0, "actual": 0 };
                            if (tb.a == "Budget") {
                                particulars[tb.monthNo].budget += cb;
                            } else {
                                particulars[tb.monthNo].actual += cb;
                            }
                        }
                    }
                });
            });


            // let profit_obj = {};
            // profit_loss.map((alie) => {
            //     dynamicMonthColumns.map((monthNum) => {
            //         if (monthNum.data != "name") {
            //             if (alie.name = "Income") {
            //                 if (alie.hasOwnProperty(monthNum.data)) {
            //                     profit_obj[monthNum.data] = alie[monthNum.data].actual;
            //                 } else {
            //                     profit_obj[monthNum.data] = {};
            //                     profit_obj[monthNum.data] = 0;
            //                 }
            //             } else {
            //                 if (alie.hasOwnProperty(monthNum.data)) {
            //                     profit_obj[monthNum.data] -= alie[monthNum.data].actual;
            //                 } else {
            //                     profit_obj[monthNum.data] = {};
            //                     profit_obj[monthNum.data] = 0;
            //                 }
            //             }
            //         }
            //     });
            // });





            // let profit = income_t - expense_t





            let rejectedKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "name"];

            let tableRows = "";
            profit_loss.map((ds) => {
                let generated_td = "";
                let [alie_budget_total, alie_actual_total, alie_variance_total] = [0, 0, 0];
                dynamicMonthColumns.map((monthNum) => {
                    if (monthNum.data != "name") {
                        if (ds.hasOwnProperty(monthNum.data)) {

                            let variance = ds[monthNum.data].budget - ds[monthNum.data].actual;
                            let varianceClass;
                            if (variance < 0) {
                                varianceClass = 'negative-variance';
                            } else if (variance > 0) {
                                varianceClass = 'positive-variance';
                            } else {
                                varianceClass = '';
                            }

                            let actualClass = ds[monthNum.data].actual > ds[monthNum.data].budget ? 'red-actual' : 'green-actual';
                            let Actuals = ds[monthNum.data].actual;
                            let formattedActuals = INR(Actuals);
                            if (Actuals < 0) {
                                formattedActuals = `(-)${INR(-Actuals)}`;
                            }
                            let formattedvariance = INR(variance);
                            if (variance < 0) {
                                formattedvariance = `(-)${INR(-variance)}`;
                            }
                            generated_td += `<td class="budget numbers" value="${INR(ds[monthNum.data].budget)}" style="font-weight:bold;">${INR(ds[monthNum.data].budget)}</td><td class="actual numbers ${actualClass}" value="${formattedActuals}" style="font-weight:bold;">${formattedActuals}</td><td class="variance ${varianceClass} numbers" value="${formattedvariance}" style="font-weight:bold;">${formattedvariance}</td>`;

                            alie_budget_total += ds[monthNum.data].budget;
                            alie_actual_total += Actuals;
                            alie_variance_total += variance;
                        } else {
                            generated_td += `<td class="budget numbers" value="0" style="font-weight:bold;">0</td><td class="actual numbers" style="font-weight:bold;" value="0">0</td><td class="variance numbers" style="font-weight:bold;" value="0">0</td>`;
                        }
                    }

                });
                // ALIE rows
                let level1Format_alie = (ds.name).replaceAll("'", "");
                let groupClass_alie = (level1Format_alie).replaceAll(" ", "_");
                tableRows += `<tr class="alie"><td class="level1" id='${groupClass_alie}'><i class="fa-solid fa-minus icon"></i></td><td class="plHeading">${ds.name}</td>${generated_td}
                <td class="budget numbers" value="${INR(alie_budget_total)}" style="font-weight:bold;">${INR(alie_budget_total)}</td><td class="actual numbers" value="${INR(alie_actual_total)}"  style="font-weight:bold;">${INR(alie_actual_total)}</td><td class="variance numbers" value="${INR(alie_variance_total)}"  style="font-weight:bold;">${INR(alie_variance_total)}</td>
                </tr>`;

                for (let classKey in ds.classification) {
                    let cls = ds.classification[classKey];
                    let classification_td = "";

                    let [cls_budget_total, cls_actual_total, cls_variance_total] = [0, 0, 0];
                    dynamicMonthColumns.map((monthNum) => {
                        if (monthNum.data != "name") {
                            if (cls.hasOwnProperty(monthNum.data)) {
                                let clsvariance = cls[monthNum.data].budget - cls[monthNum.data].actual;
                                let varianceClass;
                                if (clsvariance < 0) {
                                    varianceClass = 'negative-variance';
                                } else if (clsvariance > 0) {
                                    varianceClass = 'positive-variance';
                                } else {
                                    varianceClass = '';
                                }

                                let actualClass = cls[monthNum.data].actual > cls[monthNum.data].budget ? 'red-actual' : 'green-actual';
                                let clsActual = cls[monthNum.data].actual;
                                let formattedclsActuals = INR(clsActual);
                                if (clsActual < 0) {
                                    formattedclsActuals = `(-)${INR(-clsActual)}`;
                                }
                                let clsformattedvariance = INR(clsvariance);
                                if (clsvariance < 0) {
                                    clsformattedvariance = `(-)${INR(-clsvariance)}`;
                                }
                                classification_td += `<td class="budget numbers" value="${INR(cls[monthNum.data].budget)}">${INR(cls[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedclsActuals}">${formattedclsActuals}</td><td class="variance ${varianceClass} numbers" value="${clsformattedvariance}">${clsformattedvariance}</td>`;

                                cls_budget_total += cls[monthNum.data].budget;
                                cls_actual_total += clsActual;
                                cls_variance_total += clsvariance;
                            } else {
                                classification_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                            }
                        }

                    });
                    // Classification rows
                    let level1Format_classification = (classKey).replaceAll("'", "");
                    let groupClass_classification = (level1Format_classification).replaceAll(" ", "_");
                    tableRows += `<tr class="classification ${groupClass_alie}"><td class='level2' id="${groupClass_classification}"><i class="fa-solid fa-minus icon"></i></td><td class="plClassify">${classKey}</td>${classification_td}
                        <td class="budget numbers" value="${INR(cls_budget_total)}">${INR(cls_budget_total)}</td><td class="actual numbers" value="${INR(cls_actual_total)}">${INR(cls_actual_total)}</td><td class="variance numbers" value="${INR(cls_variance_total)}">${INR(cls_variance_total)}</td>
                    </tr>`;

                    for (let headKey in cls) {
                        if (!(rejectedKeys.includes(headKey))) {

                            let head = cls[headKey];
                            let head_td = "";

                            let [head_budget_total, head_actual_total, head_variance_total] = [0, 0, 0];
                            dynamicMonthColumns.map((monthNum) => {
                                if (monthNum.data != "name") {
                                    if (head.hasOwnProperty(monthNum.data)) {
                                        let head_variance = head[monthNum.data].budget - head[monthNum.data].actual;
                                        let varianceClass;
                                        if (head_variance < 0) {
                                            varianceClass = 'negative-variance';
                                        } else if (head_variance > 0) {
                                            varianceClass = 'positive-variance';
                                        } else {
                                            varianceClass = '';
                                        }

                                        let actualClass = head[monthNum.data].actual > head[monthNum.data].budget ? 'red-actual' : 'green-actual';
                                        let headActual = head[monthNum.data].actual;
                                        let formattedheadActuals = INR(headActual);
                                        if (headActual < 0) {
                                            formattedheadActuals = `(-)${INR(-headActual)}`;
                                        }
                                        let head_formattedvariance = INR(head_variance);
                                        if (head_variance < 0) {
                                            head_formattedvariance = `(-)${INR(-head_variance)}`;
                                        }
                                        head_td += `<td class="budget numbers" value="${INR(head[monthNum.data].budget)}">${INR(head[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedheadActuals}">${formattedheadActuals}</td><td class="variance ${varianceClass} numbers" value="${head_formattedvariance}">${head_formattedvariance}</td>`;

                                        head_budget_total += head[monthNum.data].budget;
                                        head_actual_total += headActual;
                                        head_variance_total += head_variance;
                                    } else {
                                        head_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                                    }
                                }
                            });
                            // Head rows
                            let level1Format_head = (headKey).replaceAll("'", "");
                            let groupClass_head = (level1Format_head).replaceAll(" ", "_");
                            tableRows += `<tr class="head ${groupClass_alie} ${groupClass_classification}"><td class='level3' id="${groupClass_head}"><i class="fa-solid fa-minus icon"></i></td><i class="fa-solid fa-minus icon"></i><td class="plClassify">${headKey}</td>${head_td}
                            <td class="budget numbers" value="${INR(head_budget_total)}">${INR(head_budget_total)}</td><td class="actual numbers" value="${INR(head_actual_total)}">${INR(head_actual_total)}</td><td class="variance numbers" value="${INR(head_variance_total)}">${INR(head_variance_total)}</td>
                        </tr>`;


                            for (let subheadKey in head) {
                                if (!(rejectedKeys.includes(subheadKey))) {

                                    let subhead = head[subheadKey];
                                    let subhead_td = "";
                                    let [subhead_budget_total, subhead_actual_total, subhead_variance_total] = [0, 0, 0];
                                    dynamicMonthColumns.map((monthNum) => {
                                        if (monthNum.data != "name") {
                                            if (subhead.hasOwnProperty(monthNum.data)) {
                                                let subhead_variance = subhead[monthNum.data].budget - subhead[monthNum.data].actual;
                                                let varianceClass;
                                                if (subhead_variance < 0) {
                                                    varianceClass = 'negative-variance';
                                                } else if (subhead_variance > 0) {
                                                    varianceClass = 'positive-variance';
                                                } else {
                                                    varianceClass = '';
                                                }

                                                let actualClass = subhead[monthNum.data].actual > subhead[monthNum.data].budget ? 'red-actual' : 'green-actual';
                                                let subheadActual = subhead[monthNum.data].actual;
                                                let formattedsubheadActuals = INR(subheadActual);
                                                if (subheadActual < 0) {
                                                    formattedsubheadActuals = `(-)${INR(-subheadActual)}`;
                                                }
                                                let subhead_formattedvariance = INR(subhead_variance);
                                                if (subhead_variance < 0) {
                                                    subhead_formattedvariance = `(-)${INR(-subhead_variance)}`;
                                                }
                                                subhead_td += `<td class="budget numbers" value="${INR(subhead[monthNum.data].budget)}">${INR(subhead[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedsubheadActuals}">${formattedsubheadActuals}</td><td class="variance ${varianceClass} numbers" value="${subhead_formattedvariance}">${subhead_formattedvariance}</td>`;

                                                subhead_budget_total += subhead[monthNum.data].budget;
                                                subhead_actual_total += subheadActual;
                                                subhead_variance_total += subhead_variance;
                                            } else {
                                                subhead_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                                            }
                                        }
                                    });


                                    // SubHead rows
                                    let level1Format_subhead = (subheadKey).replaceAll("'", "");
                                    let groupClass_subhead = (level1Format_subhead).replaceAll(" ", "_");
                                    tableRows += `<tr class="subhead ${groupClass_alie} ${groupClass_classification} ${groupClass_head}"><td class='level4' id="${groupClass_subhead}"><i class="fa-solid fa-minus icon"></i></td><i class="fa-solid fa-minus icon"></i><td>${subheadKey}</td>${subhead_td}
                                    <td class="budget numbers" value="${INR(subhead_budget_total)}">${INR(subhead_budget_total)}</td><td class="actual numbers" value="${INR(subhead_actual_total)}">${INR(subhead_actual_total)}</td><td class="variance numbers" value="${INR(subhead_variance_total)}">${INR(subhead_variance_total)}</td>
                                </tr>`;

                                    for (let particularsKey in subhead) {
                                        if (!(rejectedKeys.includes(particularsKey))) {

                                            let particulars = subhead[particularsKey];
                                            let particulars_td = "";

                                            let [particulars_budget_total, particulars_actual_total, particulars_variance_total] = [0, 0, 0];
                                            dynamicMonthColumns.map((monthNum) => {
                                                if (monthNum.data != "name") {
                                                    if (particulars.hasOwnProperty(monthNum.data)) {
                                                        let particular_variance = particulars[monthNum.data].budget - particulars[monthNum.data].actual;
                                                        let varianceClass;
                                                        if (particular_variance < 0) {
                                                            varianceClass = 'negative-variance';
                                                        } else if (particular_variance > 0) {
                                                            varianceClass = 'positive-variance';
                                                        } else {
                                                            varianceClass = '';
                                                        }

                                                        let actualClass = particulars[monthNum.data].actual > particulars[monthNum.data].budget ? 'red-actual' : 'green-actual';
                                                        let particularActual = particulars[monthNum.data].actual;
                                                        let formattedparticularActuals = INR(particularActual);
                                                        if (particularActual < 0) {
                                                            formattedparticularActuals = `(-)${INR(-particularActual)}`;
                                                        }
                                                        let particular_formattedvariance = INR(particular_variance);
                                                        if (particular_variance < 0) {
                                                            particular_formattedvariance = `(-)${INR(-particular_variance)}`;
                                                        }
                                                        particulars_td += `<td class="budget numbers" value="${INR(particulars[monthNum.data].budget)}">${INR(particulars[monthNum.data].budget)}</td><td class="actual voucherLevel ${actualClass} numbers" month="${monthNum.data}" ledger="${particularsKey}" value="${formattedparticularActuals}">${formattedparticularActuals}</td><td class="variance ${varianceClass} numbers" value="${particular_formattedvariance}">${particular_formattedvariance}</td>`;

                                                        particulars_budget_total += particulars[monthNum.data].budget;
                                                        particulars_actual_total += particularActual;
                                                        particulars_variance_total += particular_variance;
                                                    } else {
                                                        particulars_td += `<td class="budget numbers" value="0">0</td><td class="actual voucherLevel numbers" month="${monthNum.data}" ledger="${particularsKey}">0</td><td class="variance numbers" value="0">0</td>`;
                                                    }
                                                }
                                            });
                                            // Particulars rows
                                            let level1Format_particulars = (particularsKey).replaceAll("'", "");
                                            let groupClass_particulars = (level1Format_particulars).replaceAll(" ", "_");
                                            tableRows += `<tr class="particulars ${groupClass_alie} ${groupClass_classification} ${groupClass_head} ${groupClass_subhead}"><td class='level5' id="${groupClass_particulars}"></td><i class="fa-solid fa-minus icon"></i><td>${particularsKey}</td>${particulars_td}
                                            <td class="budget numbers" value="${INR(particulars_budget_total)}">${INR(particulars_budget_total)}</td><td class="actual numbers" value="${INR(particulars_actual_total)}">${INR(particulars_actual_total)}</td><td class="variance numbers" value="${INR(particulars_variance_total)}">${INR(particulars_variance_total)}</td>
                                        </tr>`;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            });


            // EBITDA Row creation start


            let ebitda = plExceptionalSet.ebitda;

            // if (Object.keys(ebitda).length != 0) {

            let income = profit_loss[0];
            let expense = profit_loss[1];



            let ebitda_td = "";
            let totalBudget = 0;
            let totalActuals = 0;
            let totalvariance = 0;
            dynamicMonthColumns.map((monthNum) => {
                if (monthNum.data != "name") {
                    if (income.hasOwnProperty(monthNum.data) && expense.hasOwnProperty(monthNum.data)) {
                        let ebitda_budget = (income[monthNum.data].budget) + (expense[monthNum.data].budget);
                        let ebitda_actual = (income[monthNum.data].actual) + (expense[monthNum.data].actual);
                        let ebitda_variance = ebitda_budget - ebitda_actual;
                        let varianceClass;

                        if (ebitda_variance < 0) {
                            varianceClass = 'negative-variance';
                        } else if (ebitda_variance > 0) {
                            varianceClass = 'positive-variance';
                        } else {
                            varianceClass = '';
                        }

                        let actualClass = ebitda_actual > ebitda_budget ? 'red-actual' : 'green-actual';
                        totalActuals = totalActuals + Math.round(ebitda_actual)
                        totalBudget = totalBudget + Math.round(ebitda_budget)
                        totalvariance = totalvariance + Math.round(ebitda_variance)
                        let formattedebitda_Actuals = INR(ebitda_actual);
                        if (ebitda_actual < 0) {
                            formattedebitda_Actuals = `(-)${INR(-ebitda_actual)}`;
                        }
                        let ebitda_formattedvariance = INR(ebitda_variance);
                        if (ebitda_variance < 0) {
                            ebitda_formattedvariance = `(-)${INR(-ebitda_variance)}`;
                        }
                        ebitda_td += `<td class="budget numbers" value="${INR(ebitda_budget)}" style="font-weight:bold;">${INR(ebitda_budget)}</td><td class="actual ${actualClass} numbers" style="font-weight:bold;" value="${formattedebitda_Actuals}">${formattedebitda_Actuals}</td><td class="variance ${varianceClass} numbers" style="font-weight:bold;" value="${ebitda_formattedvariance}">${ebitda_formattedvariance}</td>`;

                        if (ebitda.hasOwnProperty(monthNum.data)) {
                            ebitda[monthNum.data].budget = ebitda_budget;
                            ebitda[monthNum.data].actual = ebitda_actual;
                            ebitda[monthNum.data].variance = ebitda_variance;
                        } else {
                            ebitda[monthNum.data] = { "budget": 0, "actual": 0 };
                            ebitda[monthNum.data].budget = ebitda_budget;
                            ebitda[monthNum.data].actual = ebitda_actual;
                            ebitda[monthNum.data].variance = ebitda_variance;
                        }
                    } else {
                        ebitda_td += `<td class="budget numbers" value="0" style="font-weight:bold;">0</td><td class="actual numbers" value="0" style="font-weight:bold;">0</td><td class="variance numbers" value="0" style="font-weight:bold;">0</td>`;
                        if (ebitda.hasOwnProperty(monthNum.data)) {

                        } else {
                            ebitda[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                        }
                    }
                }
            });


            ebitda_td += `<td class="budget numbers" value="${INR(totalBudget)}">${INR(totalBudget)}</</td><td class="actual numbers" value="${INR(totalActuals)}">${INR(totalActuals)}</td><td class="variance numbers" value="${INR(totalvariance)}">${INR(totalvariance)}</td>`;
            tableRows += `<tr class="alie"><td class='level1' id="ebitda"><i class="fa-solid fa-minus icon"></i></td><td style="font-weight:bold;">EBITDA</td>${ebitda_td}</tr>`;
            // EBITDA Row creation end



            // EBITDA Head Row creation start

            let ebt = plExceptionalSet.ebt;
            let ebitda_head_obj = plExceptionalSet.head;

            let ebt_check_count = 0;
            let monthwise_headTotal = {};
            for (let ebitda_headKey in ebitda_head_obj) {
                ebt_check_count += 1;

                let ebitda_head = ebitda_head_obj[ebitda_headKey];
                let ebitda_head_td = "";
                let totalBudget = 0;
                let totalActuals = 0;
                let totalvariance = 0;

                dynamicMonthColumns.map((monthNum) => {
                    if (monthNum.data != "name") {
                        if (ebitda_head.hasOwnProperty(monthNum.data)) {
                            let ebitdahead_variance = (ebitda_head[monthNum.data].budget) - (ebitda_head[monthNum.data].actual);
                            let varianceClass;

                            if (ebitdahead_variance < 0) {
                                varianceClass = 'negative-variance';
                            } else if (ebitdahead_variance > 0) {
                                varianceClass = 'positive-variance';
                            } else {
                                varianceClass = '';
                            }

                            let actualClass = ebitda_head[monthNum.data].actual > ebitda_head[monthNum.data].budget ? 'red-actual' : 'green-actual';
                            let ebitda_headActual = ebitda_head[monthNum.data].actual;
                            totalActuals = totalActuals + Math.round(ebitda_headActual)
                            totalBudget = totalBudget + Math.round(ebitda_head[monthNum.data].budget)
                            totalvariance = totalvariance + Math.round(ebitdahead_variance)
                            let formattedebitda_headActuals = INR(ebitda_headActual);
                            if (ebitda_headActual < 0) {
                                formattedebitda_headActuals = `(-)${INR(-ebitda_headActual)}`;
                            }
                            let ebitdahead_formattedvariance = INR(ebitdahead_variance);
                            if (ebitdahead_variance < 0) {
                                ebitdahead_formattedvariance = `(-)${INR(-ebitdahead_variance)}`;
                            }
                            ebitda_head_td += `<td class="budget numbers" value="${INR(ebitda_head[monthNum.data].budget)}">${INR(ebitda_head[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedebitda_headActuals}">${formattedebitda_headActuals}</td><td class="variance ${varianceClass} numbers" value="${ebitdahead_formattedvariance}">${ebitdahead_formattedvariance}</td>`;


                            let ebt_budget, ebt_actual, ebt_variance;
                            ebt_budget = (ebitda_head[monthNum.data].budget);
                            ebt_actual = (ebitda_head[monthNum.data].actual);
                            // if (ebt_check_count == 1) {
                            //     ebt_budget = (ebitda[monthNum.data].budget) + (ebitda_head[monthNum.data].budget);
                            //     ebt_actual = (ebitda[monthNum.data].actual) + (ebitda_head[monthNum.data].actual);
                            //     ebt_variance = ebt_budget - ebt_actual;
                            // } else {
                            //     ebt_budget = (ebt[monthNum.data].budget) + (ebitda_head[monthNum.data].budget);
                            //     ebt_actual = (ebt[monthNum.data].actual) + (ebitda_head[monthNum.data].actual);
                            //     ebt_variance = ebt[monthNum.data].variance - ebt_actual;
                            // }

                            // if (ebt.hasOwnProperty(monthNum.data)) {
                            //     ebt[monthNum.data].budget += ebt_budget;
                            //     ebt[monthNum.data].actual = ebt[monthNum.data].actual + ebt_actual;
                            //     ebt[monthNum.data].variance += ebt_variance;
                            // }
                            // else {
                            //     ebt[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            //     ebt[monthNum.data].budget += ebt_budget;
                            //     ebt[monthNum.data].actual = ebt[monthNum.data].actual + ebt_actual;
                            //     ebt[monthNum.data].variance += ebt_variance;

                            // }

                            if (monthwise_headTotal.hasOwnProperty(monthNum.data)) {
                                monthwise_headTotal[monthNum.data].budget += ebt_budget;
                                monthwise_headTotal[monthNum.data].actual += ebt_actual;
                                monthwise_headTotal[monthNum.data].variance += ebt_variance;
                            }
                            else {
                                monthwise_headTotal[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                                monthwise_headTotal[monthNum.data].budget += ebt_budget;
                                monthwise_headTotal[monthNum.data].actual += ebt_actual;
                                monthwise_headTotal[monthNum.data].variance += ebt_variance;

                            }

                        } else {
                            ebitda_head_td += `<td class="budget numbers" value="0" style="font-weight:bold;">0</td><td class="actual numbers" value="0" style="font-weight:bold;">0</td><td class="variance numbers" style="font-weight:bold;" value="0">0</td>`;
                            if (monthwise_headTotal.hasOwnProperty(monthNum.data)) {

                            } else {
                                monthwise_headTotal[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            }

                        }
                    }
                });

                // EBITDA Head rows
                ebitda_head_td += `<td class="budget numbers" value="${INR(totalBudget)}">${INR(totalBudget)}</td><td class="actual numbers" value="${INR(totalActuals)}">${INR(totalActuals)}</td><td class="variance numbers" value="${INR(totalvariance)}">${INR(totalvariance)}</td>`;
                tableRows += `<tr class="ebitda_head ebitda"><td class='level2'></td><td>${ebitda_headKey}</td>${ebitda_head_td}</tr>`;

            }

            let ebitda_check = plExceptionalSet.ebitda;

            dynamicMonthColumns.map((monthNum) => {
                if (monthNum.data != "name") {
                    if (monthwise_headTotal.hasOwnProperty(monthNum.data)) {

                        if (ebt.hasOwnProperty(monthNum.data)) {
                            ebt[monthNum.data].budget += monthwise_headTotal[monthNum.data].budget + ebitda_check[monthNum.data].budget;
                            ebt[monthNum.data].actual = monthwise_headTotal[monthNum.data].actual + ebitda_check[monthNum.data].actual;
                            ebt[monthNum.data].variance = (monthwise_headTotal[monthNum.data].budget + ebitda_check[monthNum.data].budget) - (monthwise_headTotal[monthNum.data].actual + ebitda_check[monthNum.data].actual);
                        }
                        else {
                            ebt[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            ebt[monthNum.data].budget += monthwise_headTotal[monthNum.data].budget + ebitda_check[monthNum.data].budget;
                            ebt[monthNum.data].actual = monthwise_headTotal[monthNum.data].actual + ebitda_check[monthNum.data].actual;
                            ebt[monthNum.data].variance = (monthwise_headTotal[monthNum.data].budget + ebitda_check[monthNum.data].budget) - (monthwise_headTotal[monthNum.data].actual + ebitda_check[monthNum.data].actual);
                        }
                    }
                }
            });
            // EBITDA Head Row creation end



            // EBT Creation start
            let ebt_td = "";
            let totalBudgetEbt = 0;
            let totalActualsEbt = 0;
            let totalvarianceEbt = 0;
            dynamicMonthColumns.map((monthNum) => {
                if (monthNum.data != "name") {
                    let ebtActual = 0;

                    if (ebt.hasOwnProperty(monthNum.data)) {
                        let ebthead_variance = ebt[monthNum.data].budget - ebt[monthNum.data].actual;
                        let varianceClass, ebtActual;

                        if (ebthead_variance < 0) {
                            varianceClass = 'negative-variance';
                        } else if (ebthead_variance > 0) {
                            varianceClass = 'positive-variance';
                        } else {
                            varianceClass = '';
                        }

                        ebtActual = ebt[monthNum.data].actual;
                        let actualClass = ebt[monthNum.data].actual > ebt[monthNum.data].budget ? 'red-actual' : 'green-actual';
                        let formattedebtActuals = INR(ebtActual);
                        totalActualsEbt = totalActualsEbt + Math.round(ebtActual)
                        totalBudgetEbt = totalBudgetEbt + Math.round(ebt[monthNum.data].budget)
                        totalvarianceEbt = totalvarianceEbt + Math.round(ebthead_variance)
                        if (ebtActual < 0) {
                            formattedebtActuals = `(-)${INR(-ebtActual)}`;
                        }
                        let ebthead_formattedvariance = INR(ebthead_variance);
                        if (ebthead_variance < 0) {
                            ebthead_formattedvariance = `(-)${INR(-ebthead_variance)}`;
                        }
                        ebt_td += `<td class="budget numbers" value="${INR(ebt[monthNum.data].budget)}" style="font-weight:bold;">${INR(ebt[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" style="font-weight:bold;" value="${formattedebtActuals}">${formattedebtActuals}</td><td class="variance ${varianceClass} numbers" style="font-weight:bold;" value="${ebthead_formattedvariance}">${ebthead_formattedvariance}</td>`;
                    } else {
                        let ebt_budget = 0;
                        let ebt_actual = 0;
                        let ebt_variance = 0;
                        totalActualsEbt += ebtActual + (income[monthNum.data].actual) + (expense[monthNum.data].actual);

                        ebt_td += `<td class="budget numbers value="0" style="font-weight:bold;">0</td><td class="actual numbers" value="${INR(ebtActual + (income[monthNum.data].actual) + (expense[monthNum.data].actual))}" style="font-weight:bold;">${INR(ebtActual + (income[monthNum.data].actual) + (expense[monthNum.data].actual))}</td><td class="variance numbers" style="font-weight:bold;" value="0">0</td>`;

                        if (ebt.hasOwnProperty(monthNum.data)) {
                            ebt[monthNum.data].budget = ebt_budget;
                            ebt[monthNum.data].actual = ebt_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual);
                            ebt[monthNum.data].variance = ebt_variance;
                        } else {
                            ebt[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            ebt[monthNum.data].budget = ebt_budget;
                            ebt[monthNum.data].actual = ebt_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual);
                            ebt[monthNum.data].variance = ebt_variance;
                        }
                    }
                }
            });

            ebt_td += `<td class="budget numbers" value="${INR(totalBudgetEbt)}">${INR(totalBudgetEbt)}</</td><td class="actual numbers" value="${INR(totalActualsEbt)}">${INR(totalActualsEbt)}</td><td class="variance numbers" value="${INR(totalvarianceEbt)}">${INR(totalvarianceEbt)}</td>`;
            tableRows += `<tr class="alie"><td class='level1' id="ebt"><i class="fa-solid fa-minus icon"></i></td><td style="font-weight:bold;">EBT</td>${ebt_td}</tr>`;
            // EBT creation end


            // EBT SubHead Row creation start
            let ebt_subhead_obj = plExceptionalSet.subhead;
            let totalTax = plExceptionalSet.totalTax;

            for (let ebt_subheadKey in ebt_subhead_obj) {


                let ebt_subhead = ebt_subhead_obj[ebt_subheadKey];
                let ebt_subhead_td = "";
                let totalBudget = 0;
                let totalActuals = 0;
                let totalvariance = 0;

                dynamicMonthColumns.map((monthNum) => {
                    if (monthNum.data != "name") {
                        if (ebt_subhead.hasOwnProperty(monthNum.data) && ebt.hasOwnProperty(monthNum.data)) {
                            let ebtsubhead_variance = ebt_subhead[monthNum.data].budget - ebt_subhead[monthNum.data].actual;
                            let varianceClass;

                            if (ebtsubhead_variance < 0) {
                                varianceClass = 'negative-variance';
                            } else if (ebtsubhead_variance > 0) {
                                varianceClass = 'positive-variance';
                            } else {
                                varianceClass = '';
                            }

                            let actualClass = ebt_subhead[monthNum.data].actual > ebt_subhead[monthNum.data].budget ? 'red-actual' : 'green-actual';
                            let ebt_subheadActual = ebt_subhead[monthNum.data].actual;
                            let formattedebt_subheadActuals = INR(ebt_subheadActual);
                            totalActuals = totalActuals + Math.round(ebt_subheadActual)
                            totalBudget = totalBudget + Math.round(ebt_subhead[monthNum.data].budget)
                            totalvariance = totalvariance + Math.round(ebtsubhead_variance)
                            if (ebt_subheadActual < 0) {
                                formattedebt_subheadActuals = `(-)${INR(-ebt_subheadActual)}`;
                            }
                            let ebtsubhead_formattedvariance = INR(ebtsubhead_variance);
                            if (ebtsubhead_variance < 0) {
                                ebtsubhead_formattedvariance = `(-)${INR(-ebtsubhead_variance)}`;
                            }
                            ebt_subhead_td += `<td class="budget numbers" value="${INR(ebt_subhead[monthNum.data].budget)}">${INR(ebt_subhead[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedebt_subheadActuals}">${formattedebt_subheadActuals}</td><td class="variance ${varianceClass} numbers" value="${ebtsubhead_formattedvariance}">${ebtsubhead_formattedvariance}</td>`;
                            let totalTax_budget = ebt_subhead[monthNum.data].budget;
                            let totalTax_actual = ebt_subhead[monthNum.data].actual;
                            let totalTax_variance = totalTax_budget - totalTax_actual;

                            if (totalTax.hasOwnProperty(monthNum.data) == true) {
                                totalTax[monthNum.data].budget += totalTax_budget;
                                totalTax[monthNum.data].actual += totalTax_actual;
                                totalTax[monthNum.data].variance += totalTax_variance;
                            } else {
                                totalTax[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                                totalTax[monthNum.data].budget += totalTax_budget;
                                totalTax[monthNum.data].actual += totalTax_actual;
                                totalTax[monthNum.data].variance += totalTax_variance;
                            }
                        } else {
                            ebt_subhead_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;

                            if (totalTax.hasOwnProperty(monthNum.data)) {

                            } else {
                                totalTax[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            }
                        }
                    }
                });
                // EBT SubHead Rows
                if (ebt_subheadKey != "nodata") {
                    ebt_subhead_td += `<td class="budget numbers" value="${INR(totalBudget)}">${INR(totalBudget)}</</td><td class="actual numbers" value="${INR(totalActuals)}">${INR(totalActuals)}</td><td class="variance numbers" value="0">${INR(totalvariance)}</td>`;
                    tableRows += `<tr class="ebt_subhead ebt"><td class='level2'></td><td>${ebt_subheadKey}</td>${ebt_subhead_td}</tr>`;
                }
            }
            // EBT SubHead Row creation end



            // Total Tax Creation start
            let totalTax_td = "";
            let totalBudgetTax = 0;
            let totalActualsTax = 0;
            let totalvarianceTax = 0;
            dynamicMonthColumns.map((monthNum) => {
                if (monthNum.data != "name") {
                    if (totalTax.hasOwnProperty(monthNum.data)) {
                        let totalTax_variance = totalTax[monthNum.data].variance;
                        let varianceClass;

                        if (totalTax_variance < 0) {
                            varianceClass = 'negative-variance';
                        } else if (totalTax_variance > 0) {
                            varianceClass = 'positive-variance';
                        } else {
                            varianceClass = '';
                        }

                        let actualClass = totalTax[monthNum.data].actual > totalTax[monthNum.data].budget ? 'red-actual' : 'green-actual';
                        let totalTaxActual = totalTax[monthNum.data].actual;
                        let formattedtotalTaxActuals = INR(totalTaxActual);
                        totalActualsTax = totalActualsTax + Math.round(totalTaxActual)
                        totalBudgetTax = totalBudgetTax + Math.round(totalTax[monthNum.data].budget)
                        totalvarianceTax = totalvarianceTax + Math.round(totalTax_variance)
                        if (totalTaxActual < 0) {
                            formattedtotalTaxActuals = `(-)${INR(-totalTaxActual)}`;
                        }
                        let totalTax_formattedvariance = INR(totalTax_variance);
                        if (totalTax_variance < 0) {
                            totalTax_formattedvariance = `(-)${INR(-totalTax_variance)}`;
                        }
                        totalTax_td += `<td class="budget numbers" value="${INR(totalTax[monthNum.data].budget)}">${INR(totalTax[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedtotalTaxActuals}">${formattedtotalTaxActuals}</td><td class="variance ${varianceClass} numbers" value="${totalTax_formattedvariance}">${totalTax_formattedvariance}</td>`;
                    } else {
                        totalTax_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                    }
                }
            });
            totalTax_td += `<td class="budget numbers" value="${INR(totalBudgetTax)}">${INR(totalBudgetTax)}</</td><td class="actual numbers" value="${INR(totalActualsTax)}">${INR(totalActualsTax)}</td><td class="variance numbers" value="${INR(totalvarianceTax)}">${INR(totalvarianceTax)}</td>`;
            tableRows += `<tr class="alie"><td class='level1' id="ebt"></td><td>Total Tax</td>${totalTax_td}</tr>`;
            // Total Tax creation end



            // EAT Row creation start
            let eat = plExceptionalSet.eat;
            let exc_ebt = plExceptionalSet.ebt;
            let exc_totalTax = plExceptionalSet.totalTax;


            let eat_td = "";
            let totalBudgetEat = 0;
            let totalActualsEat = 0;
            let totalvarianceEat = 0;
            dynamicMonthColumns.map((monthNum) => {
                if (monthNum.data != "name") {
                    if (exc_ebt.hasOwnProperty(monthNum.data) && exc_totalTax.hasOwnProperty(monthNum.data) == true) {
                        let eat_budget = (exc_ebt[monthNum.data].budget) + (exc_totalTax[monthNum.data].budget);
                        let eat_actual = (exc_ebt[monthNum.data].actual) + (exc_totalTax[monthNum.data].actual);
                        let eat_variance = eat_budget - eat_actual;
                        let varianceClass;

                        if (eat_variance < 0) {
                            varianceClass = 'negative-variance';
                        } else if (eat_variance > 0) {
                            varianceClass = 'positive-variance';
                        } else {
                            varianceClass = '';
                        }

                        let actualClass = eat_actual > eat_budget ? 'red-actual' : 'green-actual';
                        let formattedeat_Actuals = INR(eat_actual);
                        totalActualsEat = totalActualsEat + Math.round(eat_actual)
                        totalBudgetEat = totalBudgetEat + Math.round(eat_budget)
                        totalvarianceEat = totalvarianceEat + Math.round(eat_variance)
                        if (eat_actual < 0) {
                            formattedeat_Actuals = `(-)${INR(-eat_actual)}`;
                        }
                        let eat_formattedvariance = INR(eat_variance);
                        if (eat_variance < 0) {
                            eat_formattedvariance = `(-)${INR(-eat_variance)}`;
                        }
                        eat_td += `<td class="budget numbers">${INR(eat_budget)}</td><td class="actual ${actualClass} numbers" value="${formattedeat_Actuals}">${formattedeat_Actuals}</td><td class="variance ${varianceClass} numbers" value="${eat_formattedvariance}">${eat_formattedvariance}</td>`;

                        if (eat.hasOwnProperty(monthNum.data)) {
                            eat[monthNum.data].budget = eat_budget;
                            eat[monthNum.data].actual = eat_actual;
                            eat[monthNum.data].variance = eat_variance;
                        } else {
                            eat[monthNum.data] = { "budget": 0, "actual": 0 };
                            eat[monthNum.data].budget = eat_budget;
                            eat[monthNum.data].actual = eat_actual;
                            eat[monthNum.data].variance = eat_variance;
                        }
                    } else {

                        let eat_budget = 0;
                        let eat_actual = 0;
                        let eat_variance = 0;
                        totalActualsEat += eat_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual);

                        eat_td += `<td class="budget numbers">0</td><td class="actual numbers" value="${INR(eat_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual))}">${INR(eat_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual))}</td><td class="variance numbers" value="0">0</td>`;

                        if (eat.hasOwnProperty(monthNum.data)) {
                            eat[monthNum.data].budget = eat_budget;
                            eat[monthNum.data].actual = eat_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual);
                            eat[monthNum.data].variance = eat_variance;
                        } else {
                            eat[monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                            eat[monthNum.data].budget = eat_budget;
                            eat[monthNum.data].actual = eat_actual + (income[monthNum.data].actual) + (expense[monthNum.data].actual);
                            eat[monthNum.data].variance = eat_variance;
                        }
                    }
                }
            });
            eat_td += `<td class="budget numbers">${INR(totalBudgetEat)}</</td><td class="actual numbers" value="${INR(totalActualsEat)}">${INR(totalActualsEat)}</td><td class="variance numbers" value="${INR(totalvarianceEat)}">${INR(totalvarianceEat)}</td>`;
            tableRows += `<tr class="alie"><td class='level1' id="eat"></td><td>EAT</td>${eat_td}</tr>`;
            // EAT Row creation end
            // }

            tableRow = tableRows
            // $("#profitAndLoss>tbody").html(`<tr>${tableRows}</tr>`);
            profitAndLossJson = profit_loss


            // **************************************** Balance Sheet Start ****************************************

            let balanceSheet = [
                {
                    "name": "Asset",
                    "classification": {

                    }
                },
                {
                    "name": "Liabilities",
                    "classification": {

                    }
                }
            ]
            // let rejectedParticulars = ["Current Year Earnings", "Retained Earnings"]
            // balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Other reserves']

            let rejectedParticulars = [] // "Differences in opening and closing balances"

            balanceSheet.map((ds) => {
                tbData1.map((tb) => {
                    if (tb.alie == ds.name) {
                        let cb = Number(tb.closingbalance) / amountFormat;
                        if (tb.subhead != "Profit and Loss") {
                            ds[tb.monthNo] = (ds[tb.monthNo] || 0) + cb;
                        }
                        // Classification Creation
                        if (ds.classification.hasOwnProperty(tb.classification)) {
                            let cls = ds.classification[tb.classification];
                            if (tb.subhead != "Profit and Loss") {
                                cls[tb.monthNo] = (cls[tb.monthNo] || 0) + cb;
                            }

                            // Head Creation
                            if (cls.hasOwnProperty(tb.head)) {
                                let head = cls[tb.head];
                                if (tb.subhead != "Profit and Loss") {
                                    head[tb.monthNo] = (head[tb.monthNo] || 0) + cb;
                                }

                                // SubHead Creation
                                if (head.hasOwnProperty(tb.subhead)) {
                                    let subhead = head[tb.subhead];
                                    if (tb.subhead != "Profit and Loss") {
                                        subhead[tb.monthNo] = (subhead[tb.monthNo] || 0) + cb;
                                    }

                                    // Particulars Creation
                                    if (subhead.hasOwnProperty(tb.particulars)) {
                                        if (tb.subhead == "Profit and Loss") {
                                            rejectedParticulars.push(tb.particulars)
                                        }
                                        // if (!rejectedParticulars.includes(tb.particulars)) {
                                        let particulars = subhead[tb.particulars];
                                        particulars[tb.monthNo] = (particulars[tb.monthNo] || 0) + cb;
                                        // }
                                    } else {

                                        ds.classification[tb.classification][tb.head][tb.subhead][tb.particulars] = {};
                                        if (tb.subhead == "Profit and Loss") {
                                            rejectedParticulars.push(tb.particulars)
                                        }
                                        // if (!rejectedParticulars.includes(tb.particulars)) {
                                        let particulars = subhead[tb.particulars];
                                        particulars[tb.monthNo] = (particulars[tb.monthNo] || 0) + cb;
                                        // }
                                    }

                                } else {
                                    ds.classification[tb.classification][tb.head][tb.subhead] = {};
                                    let subhead = head[tb.subhead];
                                    if (tb.subhead != "Profit and Loss") {
                                        subhead[tb.monthNo] = (subhead[tb.monthNo] || 0) + cb;
                                    }
                                }

                            } else {
                                ds.classification[tb.classification][tb.head] = {};
                                let head = cls[tb.head];
                                if (tb.subhead != "Profit and Loss") {
                                    head[tb.monthNo] = (head[tb.monthNo] || 0) + cb;
                                }
                            }

                        } else {
                            ds.classification[tb.classification] = {};
                            let cls = ds.classification[tb.classification];
                            if (tb.subhead != "Profit and Loss") {
                                cls[tb.monthNo] = (cls[tb.monthNo] || 0) + cb;
                            }
                        }
                    }
                });
            });



            if (balanceSheet[1]['classification']['Equity and Shareholders funds'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']) {
                balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'] = {}
                balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'] = {}
                balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'] = {}
            }



            let uniqueParticulars = Array.from(new Set(rejectedParticulars));

            if (balanceSheet[1]['classification']['Equity and Shareholders funds'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']) {

                dynamicMonthColumns.map((monthNum) => {

                    // if (monthNum.data != "name") {




                    //     balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Current Year Earnings'][monthNum.data] = (plExceptionalSet['eat'][monthNum.data]['actual']) * -1
                    //     let retained_total = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][monthNum.data] + balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Current Year Earnings'][monthNum.data]
                    //     balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data] = retained_total

                    //     if (Number(monthNum.data) + 1 != 13 && Number(monthNum.data) + 1 != 4) {
                    //         balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][Number(monthNum.data) + 1] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data]
                    //     }
                    //     // balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data]

                    //     // balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data]
                    //     // balanceSheet[1]['classification']['Equity and Shareholders funds'][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data]
                    //     // balanceSheet[1][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data]



                    //     // let retained_total_new = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][monthNum.data] + balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Current Year Earnings'][monthNum.data]
                    //     // balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Retained Earnings'][monthNum.data] = retained_total_new
                    // }

                    if (monthNum.data != "name") {
                        let uniqueParticulars_total = 0;
                        uniqueParticulars.map((item) => {
                            uniqueParticulars_total += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][item][monthNum.data] || 0
                        })

                        if (!balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][monthNum.data]) {
                            balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][monthNum.data] = uniqueParticulars_total;
                        }

                        balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'][monthNum.data] = ((plExceptionalSet['eat'][monthNum.data]['actual']) * -1)
                        balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][monthNum.data] + balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'][monthNum.data]

                        if (Number(monthNum.data) + 1 != 13 && Number(monthNum.data) + 1 != 4) {
                            balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][Number(monthNum.data) + 1] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][monthNum.data]
                        }

                        balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][monthNum.data]
                        balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][monthNum.data]
                        balanceSheet[1]['classification']['Equity and Shareholders funds'][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][monthNum.data]
                        balanceSheet[1][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][monthNum.data]
                    }
                });
            }

            uniqueParticulars.map((item) => {
                delete balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][item]
            })




            let tableRows_bs = "";
            balanceSheet.map((ds) => {
                let generated_td = "";
                dynamicMonthColumns.map((monthNum) => {
                    if (monthNum.data != "name") {
                        if (ds.hasOwnProperty(monthNum.data) && ds[monthNum.data] != null) {
                            let ds_m = ds[monthNum.data];
                            let balanceClass;

                            if (ds_m < 0) {
                                balanceClass = 'negative-variance';
                            } else if (ds_m > 0) {
                                balanceClass = 'positive-variance';
                            } else {
                                balanceClass = '';
                            }

                            let formattedDs_month = INR(ds_m);
                            if (ds_m < 0) {
                                formattedDs_month = `(-)${INR(-ds_m)}`;
                            }
                            generated_td += `<td class="${balanceClass} numbers" id="levelVariance" style="text-align:right;" value="${formattedDs_month}">${formattedDs_month}</td>`;
                        } else {
                            generated_td += `<td class="blVariannce numbers" id="levelVariance" style="text-align:right;" value="0">0</td>`;
                        }
                    }
                });
                // ALIE rows
                let level1Format_alie = (ds.name).replaceAll("'", "");
                let groupClass_alie = (level1Format_alie).replaceAll(" ", "_");
                tableRows_bs += `<tr class="alie"><td class="level1" id='${groupClass_alie}'><i class="fa-solid fa-minus icon"></i></td><td class="blHeading">${ds.name}</td>${generated_td}</tr>`;

                for (let classKey in ds.classification) {
                    let cls = ds.classification[classKey];
                    let classification_td = "";

                    dynamicMonthColumns.map((monthNum) => {
                        if (monthNum.data != "name") {
                            if (cls.hasOwnProperty(monthNum.data)) {
                                let cls_m = cls[monthNum.data];
                                let balanceClass;

                                if (cls_m < 0) {
                                    balanceClass = 'negative-variance';
                                } else if (cls_m > 0) {
                                    balanceClass = 'positive-variance';
                                } else {
                                    balanceClass = '';
                                }

                                let formattedcls_month = INR(cls_m);
                                if (cls_m < 0) {
                                    formattedcls_month = `(-)${INR(-cls_m)}`;
                                }
                                classification_td += `<td class="${balanceClass} numbers" id="level1Variance" style="text-align:right;" value="${formattedcls_month}" >${formattedcls_month}</td>`;
                            } else {
                                classification_td += `<td class="blVariannce numbers" value="0" style="text-align:right;">0</td>`;
                            }
                        }

                    });
                    // Classification rows
                    let level1Format_classification = (classKey).replaceAll("'", "");
                    let groupClass_classification = (level1Format_classification).replaceAll(" ", "_");
                    tableRows_bs += `<tr class="classification ${groupClass_alie}"><td class='level2' id="${groupClass_classification}"><i class="fa-solid fa-minus icon"></i></td><td class="blClassify">${classKey}</td>${classification_td}</tr>`;

                    for (let headKey in cls) {
                        if (!(rejectedKeys.includes(headKey))) {

                            let head = cls[headKey];
                            let head_td = "";

                            dynamicMonthColumns.map((monthNum) => {
                                if (monthNum.data != "name") {
                                    if (head.hasOwnProperty(monthNum.data)) {
                                        let head_m = head[monthNum.data];
                                        let balanceClass;

                                        if (head_m < 0) {
                                            balanceClass = 'negative-variance';
                                        } else if (head_m > 0) {
                                            balanceClass = 'positive-variance';
                                        } else {
                                            balanceClass = '';
                                        }

                                        let formattedhead_month = INR(head_m);
                                        if (head_m < 0) {
                                            formattedhead_month = `(-)${INR(-head_m)}`;
                                        }
                                        head_td += `<td class="${balanceClass} numbers" id="balanceVariance" style="text-align:right;" value="${formattedhead_month}">${formattedhead_month}</td>`;
                                    } else {
                                        head_td += `<td class="blVariannce numbers" value="0" style="text-align:right;" value="0">0</td>`;
                                    }
                                }
                            });
                            // Head rows
                            let level1Format_head = (headKey).replaceAll("'", "");
                            let groupClass_head = (level1Format_head).replaceAll(" ", "_");
                            tableRows_bs += `<tr class="head ${groupClass_alie} ${groupClass_classification}"><td class='level3' id="${groupClass_head}"><i class="fa-solid fa-minus icon"></i></td><i class="fa-solid fa-minus icon"></i><td class="blHead">${headKey}</td>${head_td}</tr>`;


                            for (let subheadKey in head) {
                                if (!(rejectedKeys.includes(subheadKey))) {

                                    let subhead = head[subheadKey];
                                    let subhead_td = "";

                                    dynamicMonthColumns.map((monthNum) => {
                                        if (monthNum.data != "name") {
                                            if (subhead.hasOwnProperty(monthNum.data)) {
                                                let subhead_m = subhead[monthNum.data];
                                                let balanceClass;

                                                if (subhead_m < 0) {
                                                    balanceClass = 'negative-variance';
                                                } else if (subhead_m > 0) {
                                                    balanceClass = 'positive-variance';
                                                } else {
                                                    balanceClass = '';
                                                }

                                                let formattedsubhead_month = INR(subhead_m);
                                                if (subhead_m < 0) {
                                                    formattedsubhead_month = `(-)${INR(-subhead_m)}`;
                                                }
                                                subhead_td += `<td class="${balanceClass} numbers" style="text-align:right;" value="${formattedsubhead_month}">${formattedsubhead_month}</td>`;
                                            } else {
                                                subhead_td += `<td class="blVariannce numbers" style="text-align:right;" value="0">0</td>`;
                                            }
                                        }
                                    });


                                    // SubHead rows
                                    let level1Format_subhead = (subheadKey).replaceAll("'", "");
                                    let groupClass_subhead = (level1Format_subhead).replaceAll(" ", "_");
                                    tableRows_bs += `<tr class="subhead ${groupClass_alie} ${groupClass_classification} ${groupClass_head}"><td class='level4' id="${groupClass_subhead}"><i class="fa-solid fa-minus icon"></i></td><i class="fa-solid fa-minus icon"></i><td class="blSubhead">${subheadKey}</td>${subhead_td}</tr>`;

                                    for (let particularsKey in subhead) {
                                        if (!(rejectedKeys.includes(particularsKey))) {

                                            let particulars = subhead[particularsKey];
                                            let particulars_td = "";

                                            dynamicMonthColumns.map((monthNum) => {
                                                if (monthNum.data != "name") {
                                                    if (particulars.hasOwnProperty(monthNum.data)) {
                                                        let particular_m = particulars[monthNum.data];
                                                        let balanceClass;

                                                        if (particular_m < 0) {
                                                            balanceClass = 'negative-variance';
                                                        } else if (particular_m > 0) {
                                                            balanceClass = 'positive-variance';
                                                        } else {
                                                            balanceClass = '';
                                                        }

                                                        let formattedparticular_month = INR(particular_m);
                                                        if (particular_m < 0) {
                                                            formattedparticular_month = `(-)${INR(-particular_m)}`;
                                                        }
                                                        particulars_td += `<td class="voucherLevel ${balanceClass} numbers" month="${monthNum.data}" ledger="${particularsKey}" style="text-align:right;" value="${formattedparticular_month}">${formattedparticular_month}</td>`;
                                                    } else {
                                                        particulars_td += `<td class="voucherLevel numbers" month="${monthNum.data}" ledger="${particularsKey}" class="blVariannce" style="text-align:right;" value="0">0</td>`;
                                                    }
                                                }
                                            });
                                            // Particulars rows
                                            let level1Format_particulars = (particularsKey).replaceAll("'", "");
                                            let groupClass_particulars = (level1Format_particulars).replaceAll(" ", "_");
                                            tableRows_bs += `<tr class="particulars ${groupClass_alie} ${groupClass_classification} ${groupClass_head} ${groupClass_subhead}"><td class='level5' id="${groupClass_particulars}"></td><i class="fa-solid fa-minus icon"></i><td class="blParticulars">${particularsKey}</td>${particulars_td}</tr>`;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            });
            tableRow_bs = tableRows_bs
        }
        return {
            synctimestamp: timeSyncstamp,
            tableRow_bs: tableRow_bs,
            tableRow: tableRow,
            column: column,
            subColumn: subColumn,
            balanceSheet_column: balanceSheet_column,
            closingTotal: closingTotal,
            closingTotalPyFun: closingTotalPyFun,
            tbData1: tbData1.length
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}


async function adv_misTable({ groupid, company, year, amount, segment, advFilter }) {
    try {

        let companyid = "";
        groupid.map((item) => {
            companyid += `${item},`
        })
        companyid = companyid.substring(0, companyid.length - 1);

        // groupid
        let client = groupid[0];
        let split1 = year.split("-")
        // let startYear = split1[0];
        // let endYear = Number((split1[0])) + 1;

        let company_fe = await fetchTable(`select * from syf_companymaster where lid=${client}`)
        let companyData = company_fe[0];
        let financialMonth = Number(companyData.financialstartmonth)

        let startYear = Number(advFilter.startYear.split("-")[0]);
        let endYear = Number(advFilter.endYear.split("-")[0]) + 1;
        let monthType = Number(advFilter.monthType);
        let ytd = Number(advFilter.ytd);
        let monthDuration = 12 / monthType;
        let monthList = { "Jan": "1", "Feb": "2", "Mar": "3", "Apr": "4", "May": "5", "Jun": "6", "Jul": "7", "Aug": "8", "Sep": "9", "Oct": "10", "Nov": "11", "Dec": "12" };
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let yearDuration = endYear - startYear;
        let amountFormat = amount;



        let date = new Date(`${startYear}-${financialMonth}-01`);
        let dynamicMonthColumns = [{ title: "Particulars", data: "name" }];
        let dynamicMonthNames = [];


        monthNames.map((month) => {
            let monthName = monthNames[date.getMonth()]
            let monthNumber = monthList[monthName];
            date = date.add(1).month();
            dynamicMonthColumns.push({ title: monthName, data: monthNumber })
            dynamicMonthNames.push(monthName);
        });

        // Dynamic MIS column creation
        let [head_start, head_end] = [0, monthDuration];
        let adv_dynamicColumns = [];
        for (let j = 0; j < monthType; j++) {
            let split1 = dynamicMonthNames.slice(head_start, head_end);
            let monthColumnName = `${split1[0]}-${split1[split1.length - 1]}`;
            (monthType != 1) ? adv_dynamicColumns.push(monthColumnName) : "false";

            split1.map((month) => {
                adv_dynamicColumns.push(month);
            });

            head_start = head_end;
            head_end += monthDuration;
        }

        // **************************************** Fetch trialbalances for the selected period start ****************************************
        let endDate = date;
        endDate.setMonth(date.getMonth() - 12);
        let endMonth = endDate.getMonth()
        if (endMonth <= 9) {
            endMonth = `0${endMonth}`;
        }
        let closingTotalPyFun;
        let closingTotal;
        let tableRow;
        let tableRow_bs;



        // let tbData1 = {}
        // for (let i = 0; i <= yearDuration; i++) {
        //     let year = Number(startYear + i);
        //     let nextYear = Number(year + 1);

        //     let data = {
        //         "companyIdList": companyid,
        //         "startYear": year.toString(),
        //         "endYear": nextYear.toString(),
        //         "startMonth": companyData.financialstartmonth,
        //         "endMonth": endMonth
        //     }

        //     let result = await workPaper(data, "feMonthlyTbGroup")
        //     tbData1 = { ...tbData1, ...result.res };
        // }

        // let y1 = Number(startYear.split("-")[1]);
        // let y2 = Number(endYear.split("-")[1]);

        let tbData1 = [];
        let yearList = [];

        for (let i = startYear; i < endYear; i++) {
            let sy = i;
            let ey = i + 1;

            let ey_formatted = ey.toString().substring(2, 4);
            let yearHead = `${sy}-${ey_formatted}`;
            yearList.push(yearHead);

            let data = {
                "companyIdList": companyid,
                "startYear": sy, //startYear.toString()
                "endYear": ey, //endYear.toString()
                "startMonth": companyData.financialstartmonth,
                "endMonth": endMonth
            }
            let result = await workPaper(data, "feMonthlyTbGroup")
            let response = result.res;
            response.filter((item) => {
                tbData1.push(item)
            })
        }




        // if (segment != null && segment !== "") {
        //     tbData1 = tbData1.filter((item) => item.a == segment)
        // }

        // return { "data": tbData1 };
        // **************************************** Fetch trialbalances for the selected period end ****************************************


        if (tbData1.length !== 0) {
            timeSyncstamp = tbData1[0].synctimestamp;
            let rejectedHead = ["Finance cost", "Depreciation and amortisation"]; //Depreciation and amortisation
            let rejectedSubHead = ["Deferred tax", "Current tax"];
            let exceptionalMonth = [1, 2, 3];

            let plExceptionalSet = {
                "ebitda": {},
                "ebt": {},
                "head": {},
                "subhead": {},
                "totalTax": {},
                "eat": {}
            };



            let closingCheck = 0;
            let tbCheck = await pfFunTotalCheck();
            let tbData2 = tbData1.filter((item) => {
                let cb = Number(item.closingbalance) / amountFormat;
                closingCheck += cb;

                let fullYear = new Date(item.fromdate).getFullYear();
                let followingYear = (`${Number(fullYear) + 1}`).substring(2, 4);
                let year = `${fullYear}`;
                // let year = `${fullYear}-${followingYear}`;

                if (exceptionalMonth.includes(item.monthNo)) {
                    let fullYear_exception = Number(fullYear) - 1;
                    let followingYear_exception = (`${fullYear}`).substring(2, 4);
                    year = `${fullYear_exception}-${followingYear_exception}`;
                    year = `${fullYear_exception}`;
                }

                if (!rejectedHead.includes(item.head)) {
                    return item;
                }
                if (!plExceptionalSet.head.hasOwnProperty(item.head)) {
                    plExceptionalSet.head[item.head] = {};
                }
                let ds = plExceptionalSet.head[item.head];

                if (!ds.hasOwnProperty(year)) {
                    ds[year] = {};
                }
                if (!ds[year].hasOwnProperty(item.monthNo)) {
                    ds[year][item.monthNo] = { "budget": 0, "actual": 0 };
                }
                if (item.a == "Budget") {
                    ds[year][item.monthNo].budget += (cb * -1);
                } else {
                    ds[year][item.monthNo].actual += (cb * -1);
                }
            });




            // Closing balance total updation
            // $(".closingTotal_pyFun").text(`PY Function Total : ${INR(closingCheck)}`);
            // $(".closingTotal").text(`TB Data Total : ${INR(tbCheck)}`);
            closingTotalPyFun = (INR(closingCheck))
            closingTotal = (INR(tbCheck))

            // if (closingTotalPyFun <= 0 && closingTotal <= 0) {
            //     $(".status-icon").show().css("color", "green").text("TBTotal ✔"); // Green tick
            // } else {
            //     $(".status-icon").show().css("color", "red").text("TBTotal ❌"); // Red cross
            // }

            // (closingCheck == 0 && tbCheck == 0) ? $(".cb_status").html(`<i class="fa-solid fa-check"></i>`) : $(".cb_status").html(`<i class="fa-solid fa-xmark"></i>`);


            let tbData = tbData2.filter((item, inx) => {
                let cb = Number(item.closingbalance) / amountFormat;


                let fullYear = new Date(item.fromdate).getFullYear();
                let followingYear = (`${Number(fullYear) + 1}`).substring(2, 4);
                let year = `${fullYear}`;

                if (exceptionalMonth.includes(item.monthNo)) {
                    let fullYear_exception = Number(fullYear) - 1;
                    let followingYear_exception = (`${fullYear}`).substring(2, 4);
                    year = `${fullYear_exception}-${followingYear_exception}`;
                    year = `${fullYear_exception}`;
                }

                if (!rejectedSubHead.includes(item.subhead)) {
                    return item;
                }
                if (!plExceptionalSet.subhead.hasOwnProperty(item.subhead)) {
                    plExceptionalSet.subhead[item.subhead] = {};
                }

                let ds = plExceptionalSet.subhead[item.subhead];
                if (!ds.hasOwnProperty(year)) {
                    ds[year] = {};
                }
                if (!ds[year].hasOwnProperty(item.monthNo)) {
                    ds[year][item.monthNo] = { "budget": 0, "actual": 0 };
                }
                if (item.a == "Budget") {
                    ds[year][item.monthNo].budget += (cb * -1);
                } else {
                    ds[year][item.monthNo].actual += (cb * -1);
                }

            });

            let subhead_length = Object.keys(plExceptionalSet.subhead)
            if (subhead_length.length == 0) {
                plExceptionalSet.subhead["nodata"] = {};
                let exceptional_subhead = plExceptionalSet.subhead["nodata"];

                for (let i = 0; i < yearDuration; i++) {
                    let year = startYear + i;


                    let exceptional_subhead_start = 0;
                    let exceptional_subhead_end = monthDuration;
                    if (!exceptional_subhead.hasOwnProperty(year)) {
                        exceptional_subhead[year] = {}
                    }
                    let [exceptional_subhead_year_budget, exceptional_subhead_year_actual, exceptional_subhead_year_variance] = [0, 0, 0];
                    for (let j = 0; j < monthType; j++) {
                        let split1 = dynamicMonthNames.slice(exceptional_subhead_start, exceptional_subhead_end);
                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                        let [exceptional_subhead_CumulativeMonth_budget, exceptional_subhead_CumulativeMonth_actual, exceptional_subhead_CumulativeMonth_variance] = [0, 0, 0];
                        split1.map((month) => {
                            let monthNum = monthList[month];
                            (exceptional_subhead[year][monthNum] == undefined) ? exceptional_subhead[year][monthNum] = { "budget": 0, "actual": 0 } : exceptional_subhead[year][monthNum] = exceptional_subhead[year][monthNum];
                            let exceptional_subhead_month_budget = exceptional_subhead[year][monthNum]["budget"];
                            let exceptional_subhead_month_actual = exceptional_subhead[year][monthNum]["actual"];
                            let exceptional_subhead_month_variance = exceptional_subhead_month_budget - exceptional_subhead_month_actual;

                            // Cumulative month total Calculation start
                            exceptional_subhead_CumulativeMonth_budget += exceptional_subhead_month_budget;
                            exceptional_subhead_CumulativeMonth_actual += exceptional_subhead_month_actual;
                            exceptional_subhead_CumulativeMonth_variance += exceptional_subhead_month_variance;
                            // Cumulative month total Calculation end

                        });


                        exceptional_subhead_start = exceptional_subhead_end;
                        exceptional_subhead_end = exceptional_subhead_end + monthDuration;

                    }
                }



                // dynamicMonthColumns.map((monthNum) => {
                //     if (monthNum.data != "name") {

                //         if (plExceptionalSet.subhead.hasOwnProperty(monthNum.data)) {
                //             plExceptionalSet.subhead["nodata"][monthNum.data].budget = 0;
                //             plExceptionalSet.subhead["nodata"][monthNum.data].actual = 0;
                //             plExceptionalSet.subhead["nodata"][monthNum.data].variance = 0;
                //         } else {
                //             plExceptionalSet.subhead["nodata"][monthNum.data] = { "budget": 0, "actual": 0, "variance": 0 };
                //             plExceptionalSet.subhead["nodata"][monthNum.data].budget = 0;
                //             plExceptionalSet.subhead["nodata"][monthNum.data].actual = 0;
                //             plExceptionalSet.subhead["nodata"][monthNum.data].variance = 0;
                //         }
                //     }
                // });
            }



            const profit_loss = [
                {
                    "name": "Income",
                    "classification": {

                    }
                },
                {
                    "name": "Expense",
                    "classification": {

                    }
                }
            ]

            // let febTotal = 0;
            // // profit_loss.map((ds) => {
            // tbData.map((tb) => {
            //     let cb = Number(tb.closingbalance);

            //     if (tb.alie == "Expense") {
            //         if (tb.monthNo == 3) {
            //             febTotal += cb;
            //         }
            //     }
            // });
            // // });


            let income_t = 0, expense_t = 0;
            // profit_loss.map((ds) => {
            //     tbData.map((tb) => {
            //         if (tb.alie == ds.name) {
            //             let cb = ((Number(tb.closingbalance)) / amountFormat) * -1; // / amountFormat) * -1
            //             let year = new Date(tb.fromdate).getFullYear();

            //             // ************************ ALIE Creation ************************
            //             if (!ds.hasOwnProperty(year)) {
            //                 ds[year] = {};
            //             }
            //             if (!ds[year].hasOwnProperty(tb.monthNo)) {
            //                 ds[year][tb.monthNo] = { "budget": 0, "actual": 0 };
            //             }
            //             if (tb.a === "Budget") {
            //                 ds[year][tb.monthNo].budget += cb;
            //             } else {
            //                 ds[year][tb.monthNo].actual += cb;
            //             }
            //         }
            //     });
            // });

            profit_loss.map((ds) => {
                tbData.map((tb) => {
                    if (tb.alie == ds.name) {
                        let cb = ((Number(tb.closingbalance)) / amountFormat) * -1; // / amountFormat) * -1
                        let fullYear = new Date(tb.fromdate).getFullYear();
                        let followingYear = (`${Number(fullYear) + 1}`).substring(2, 4);
                        let year = `${fullYear}`;
                        // let year = `${fullYear}-${followingYear}`;

                        if (exceptionalMonth.includes(tb.monthNo)) {
                            let fullYear_exception = Number(fullYear) - 1;
                            let followingYear_exception = (`${fullYear}`).substring(2, 4);
                            year = `${fullYear_exception}-${followingYear_exception}`;
                            year = `${fullYear_exception}`;
                        }

                        // ************************ ALIE Creation ************************
                        if (!ds.hasOwnProperty(year)) {
                            ds[year] = {};
                        }
                        if (!ds[year].hasOwnProperty(tb.monthNo)) {
                            ds[year][tb.monthNo] = { "budget": 0, "actual": 0 };
                        }
                        if (tb.a === "Budget") {
                            ds[year][tb.monthNo].budget += cb;
                        } else {
                            ds[year][tb.monthNo].actual += cb;
                        }

                        // ************************ Classification Creation ************************
                        if (!(ds.classification.hasOwnProperty(tb.classification))) {
                            ds.classification[tb.classification] = {};
                        }
                        let cls = ds.classification[tb.classification];
                        if (!cls.hasOwnProperty(year)) {
                            cls[year] = {};
                        }
                        if (!cls[year].hasOwnProperty(tb.monthNo)) {
                            cls[year][tb.monthNo] = { "budget": 0, "actual": 0 };
                        }
                        if (tb.a === "Budget") {
                            cls[year][tb.monthNo].budget += cb;
                        } else {
                            cls[year][tb.monthNo].actual += cb;
                        }

                        // ************************ Head Creation ************************
                        if (!(cls.hasOwnProperty(tb.head))) {
                            ds.classification[tb.classification][tb.head] = {};
                        }
                        let head = cls[tb.head];
                        if (!head.hasOwnProperty(year)) {
                            head[year] = {};
                        }
                        if (!head[year].hasOwnProperty(tb.monthNo)) {
                            head[year][tb.monthNo] = { "budget": 0, "actual": 0 };
                        }
                        if (tb.a == "Budget") {
                            head[year][tb.monthNo].budget += cb;
                        } else {
                            head[year][tb.monthNo].actual += cb;
                        }
                        // ************************ SubHead Creation ************************
                        if (!(head.hasOwnProperty(tb.subhead))) {
                            ds.classification[tb.classification][tb.head][tb.subhead] = {};
                        }
                        let subhead = head[tb.subhead];
                        if (!subhead.hasOwnProperty(year)) {
                            subhead[year] = {};
                        }
                        if (!subhead[year].hasOwnProperty(tb.monthNo)) {
                            subhead[year][tb.monthNo] = { "budget": 0, "actual": 0 };
                        }
                        if (tb.a == "Budget") {
                            subhead[year][tb.monthNo].budget += cb;
                        } else {
                            subhead[year][tb.monthNo].actual += cb;
                        }
                        // ************************ Particulars Creation ************************
                        if (!(subhead.hasOwnProperty(tb.particulars))) {
                            ds.classification[tb.classification][tb.head][tb.subhead][tb.particulars] = {};
                        }
                        let particulars = subhead[tb.particulars];
                        if (!particulars.hasOwnProperty(year)) {
                            particulars[year] = {};
                        }
                        if (!particulars[year].hasOwnProperty(tb.monthNo)) {
                            particulars[year][tb.monthNo] = { "budget": 0, "actual": 0 };
                        }
                        if (tb.a == "Budget") {
                            particulars[year][tb.monthNo].budget += cb;
                        } else {
                            particulars[year][tb.monthNo].actual += cb;
                        }
                    }
                });
            });

            // return profit_loss;


            let rejectedKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "name"];

            let tableRows = "";

            if (ytd) {
                profit_loss.map((ds) => {

                    let year_td = "";
                    for (let i = 0; i <= yearDuration; i++) {
                        let year = startYear + i;
                        rejectedKeys.push(year.toString())

                        let alie_start = 0;
                        let alie_end = monthDuration;
                        let cumulative_month_td = "";

                        let [alie_year_budget, alie_year_actual, alie_year_variance] = [0, 0, 0];
                        for (let j = 0; j < monthType; j++) {
                            let split1 = dynamicMonthNames.slice(alie_start, alie_end);
                            let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                            let month_td = "";
                            let [alie_CumulativeMonth_budget, alie_CumulativeMonth_actual, alie_CumulativeMonth_variance] = [0, 0, 0];
                            split1.map((month) => {
                                let monthNum = monthList[month];
                                if (ds.hasOwnProperty(year)) {
                                    (ds[year][monthNum] == undefined) ? ds[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                    let alie_month_budget = ds[year][monthNum]["budget"];
                                    let alie_month_actual = ds[year][monthNum]["actual"];
                                    let alie_month_variance = alie_month_budget - alie_month_actual;

                                    // Cumulative month total Calculation start
                                    alie_CumulativeMonth_budget += alie_month_budget;
                                    alie_CumulativeMonth_actual += alie_month_actual;
                                    alie_CumulativeMonth_variance += alie_month_variance;
                                    // Cumulative month total Calculation end

                                    month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(alie_month_budget)}" style="font-weight:bold;">${INR(alie_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers" value="${INR(alie_month_actual)}" style="font-weight:bold;">${INR(alie_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${INR(alie_month_variance)}" style="font-weight:bold;">${INR(alie_month_variance)}</td>`;
                                } else {
                                    month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>`;
                                }
                            });

                            if (ds.hasOwnProperty(year)) {
                                cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(alie_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(alie_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(alie_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(alie_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(alie_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(alie_CumulativeMonth_variance)}</td>
                                    ${month_td}
                                `;
                            }
                            else {
                                cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                    ${month_td}
                                `;
                            }

                            // Yearly total Calculation start
                            alie_year_budget += alie_CumulativeMonth_budget;
                            alie_year_actual += alie_CumulativeMonth_actual;
                            alie_year_variance += alie_CumulativeMonth_variance;
                            // Yearly total Calculation end


                            alie_start = alie_end;
                            alie_end = alie_end + monthDuration;

                        }
                        year_td += `<td class="mis_year_column budget numbers" value="${INR(alie_year_budget)}" style="font-weight:bold;">${INR(alie_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(alie_year_actual)}" style="font-weight:bold;">${INR(alie_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(alie_year_variance)}" style="font-weight:bold;">${INR(alie_year_variance)}</td>
                            ${cumulative_month_td}
                        `;
                    }
                    let level1Format_alie = (ds.name).replaceAll("'", "");
                    let groupClass_alie = (level1Format_alie).replaceAll(" ", "_");

                    // ALIE rows
                    tableRows += `<tr class="alie">
                        <td class="level1" id='${groupClass_alie}'><i class="fa-solid fa-minus icon"></i></td>
                        <td class="plHeading">${ds.name}</td>
                        ${year_td}
                    </tr>`;



                    // *********************** Classification Row creation start ***********************
                    for (let classKey in ds.classification) {
                        let cls = ds.classification[classKey];

                        let cls_year_td = "";
                        for (let i = 0; i <= yearDuration; i++) {
                            let year = startYear + i;

                            let cls_start = 0;
                            let cls_end = monthDuration;
                            let cls_cumulative_month_td = "";

                            let [cls_year_budget, cls_year_actual, cls_year_variance] = [0, 0, 0];
                            for (let j = 0; j < monthType; j++) {
                                let split1 = dynamicMonthNames.slice(cls_start, cls_end);
                                let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                let cls_month_td = "";
                                let [cls_CumulativeMonth_budget, cls_CumulativeMonth_actual, cls_CumulativeMonth_variance] = [0, 0, 0];
                                split1.map((month) => {
                                    let monthNum = monthList[month];
                                    if (cls.hasOwnProperty(year)) {
                                        (cls[year][monthNum] == undefined) ? cls[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                        let cls_month_budget = cls[year][monthNum]["budget"];
                                        let cls_month_actual = cls[year][monthNum]["actual"];
                                        let cls_month_variance = cls_month_budget - cls_month_actual;

                                        // Cumulative month total Calculation start
                                        cls_CumulativeMonth_budget += cls_month_budget;
                                        cls_CumulativeMonth_actual += cls_month_actual;
                                        cls_CumulativeMonth_variance += cls_month_variance;
                                        // Cumulative month total Calculation end

                                        cls_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(cls_month_budget)}" style="font-weight:bold;">${INR(cls_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers" value="${INR(cls_month_actual)}" style="font-weight:bold;">${INR(cls_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${INR(cls_month_variance)}" style="font-weight:bold;">${INR(cls_month_variance)}</td>`;
                                    } else {
                                        cls_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>`;
                                    }
                                });

                                if (ds.hasOwnProperty(year)) {
                                    cls_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(cls_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(cls_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(cls_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(cls_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(cls_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(cls_CumulativeMonth_variance)}</td>
                                    ${cls_month_td}
                                `;
                                }
                                else {
                                    cls_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                    ${cls_month_td}
                                `;
                                }

                                // Yearly total Calculation start
                                cls_year_budget += cls_CumulativeMonth_budget;
                                cls_year_actual += cls_CumulativeMonth_actual;
                                cls_year_variance += cls_CumulativeMonth_variance;
                                // Yearly total Calculation end


                                cls_start = cls_end;
                                cls_end = cls_end + monthDuration;

                            }
                            cls_year_td += `<td class="mis_year_column budget numbers" value="${INR(cls_year_budget)}" style="font-weight:bold;">${INR(cls_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(cls_year_actual)}" style="font-weight:bold;">${INR(cls_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(cls_year_variance)}" style="font-weight:bold;">${INR(cls_year_variance)}</td>
                                ${cls_cumulative_month_td}
                            `;
                        }

                        // Classification rows
                        let level1Format_classification = (classKey).replaceAll("'", "");
                        let groupClass_classification = (level1Format_classification).replaceAll(" ", "_");
                        tableRows += `<tr class="classification ${groupClass_alie}">
                            <td class='level2' id="${groupClass_classification}"><i class="fa-solid fa-minus icon"></i></td>
                            <td class="plClassify particulars">${classKey}</td>
                            ${cls_year_td}
                        </tr>`;
                        // *********************** Classification Row creation end ***********************

                        // *********************** Head Row creation start ***********************
                        for (let headKey in cls) {
                            if (!(rejectedKeys.includes(headKey))) {

                                let head = cls[headKey];
                                let head_year_td = "";
                                for (let i = 0; i <= yearDuration; i++) {
                                    let year = startYear + i;

                                    let head_start = 0;
                                    let head_end = monthDuration;
                                    let head_cumulative_month_td = "";

                                    let [head_year_budget, head_year_actual, head_year_variance] = [0, 0, 0];
                                    for (let j = 0; j < monthType; j++) {
                                        let split1 = dynamicMonthNames.slice(head_start, head_end);
                                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                        let head_month_td = "";
                                        let [head_CumulativeMonth_budget, head_CumulativeMonth_actual, head_CumulativeMonth_variance] = [0, 0, 0];
                                        split1.map((month) => {
                                            let monthNum = monthList[month];
                                            if (head.hasOwnProperty(year)) {
                                                (head[year][monthNum] == undefined) ? head[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                                let head_month_budget = head[year][monthNum]["budget"];
                                                let head_month_actual = head[year][monthNum]["actual"];
                                                let head_month_variance = head_month_budget - head_month_actual;

                                                // Cumulative month total Calculation start
                                                head_CumulativeMonth_budget += head_month_budget;
                                                head_CumulativeMonth_actual += head_month_actual;
                                                head_CumulativeMonth_variance += head_month_variance;
                                                // Cumulative month total Calculation end

                                                head_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(head_month_budget)}" style="font-weight:bold;">${INR(head_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers" value="${INR(head_month_actual)}" style="font-weight:bold;">${INR(head_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${INR(head_month_variance)}" style="font-weight:bold;">${INR(head_month_variance)}</td>`;
                                            } else {
                                                head_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>`;
                                            }
                                        });

                                        if (ds.hasOwnProperty(year)) {
                                            head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(head_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(head_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(head_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(head_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(head_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(head_CumulativeMonth_variance)}</td>
                                                ${head_month_td}
                                            `;
                                        }
                                        else {
                                            head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                                ${head_month_td}
                                            `;
                                        }

                                        // Yearly total Calculation start
                                        head_year_budget += head_CumulativeMonth_budget;
                                        head_year_actual += head_CumulativeMonth_actual;
                                        head_year_variance += head_CumulativeMonth_variance;
                                        // Yearly total Calculation end


                                        head_start = head_end;
                                        head_end = head_end + monthDuration;

                                    }
                                    head_year_td += `<td class="mis_year_column budget numbers" value="${INR(head_year_budget)}" style="font-weight:bold;">${INR(head_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(head_year_actual)}" style="font-weight:bold;">${INR(head_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(head_year_variance)}" style="font-weight:bold;">${INR(head_year_variance)}</td>
                                        ${head_cumulative_month_td}
                                    `;
                                }
                                // Head rows
                                let level1Format_head = (headKey).replaceAll("'", "");
                                let groupClass_head = (level1Format_head).replaceAll(" ", "_");
                                tableRows += `<tr class="head ${groupClass_alie} ${groupClass_classification}">
                                <td class='level3' id="${groupClass_head}"><i class="fa-solid fa-minus icon"></i></td><td class="plClassify">${headKey}</td>
                                ${head_year_td}
                                </tr>`;

                                // *********************** Head Row creation end ***********************


                                // *********************** SubHead Row creation start ***********************

                                for (let subheadKey in head) {
                                    if (!(rejectedKeys.includes(subheadKey))) {

                                        let subhead = head[subheadKey];
                                        let subhead_year_td = "";
                                        for (let i = 0; i <= yearDuration; i++) {
                                            let year = startYear + i;

                                            let subhead_start = 0;
                                            let subhead_end = monthDuration;
                                            let subhead_cumulative_month_td = "";

                                            let [subhead_year_budget, subhead_year_actual, subhead_year_variance] = [0, 0, 0];
                                            for (let j = 0; j < monthType; j++) {
                                                let split1 = dynamicMonthNames.slice(subhead_start, subhead_end);
                                                let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                                let subhead_month_td = "";
                                                let [subhead_CumulativeMonth_budget, subhead_CumulativeMonth_actual, subhead_CumulativeMonth_variance] = [0, 0, 0];
                                                split1.map((month) => {
                                                    let monthNum = monthList[month];
                                                    if (subhead.hasOwnProperty(year)) {
                                                        (subhead[year][monthNum] == undefined) ? subhead[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                                        let subhead_month_budget = subhead[year][monthNum]["budget"];
                                                        let subhead_month_actual = subhead[year][monthNum]["actual"];
                                                        let subhead_month_variance = subhead_month_budget - subhead_month_actual;

                                                        // Cumulative month total Calculation start
                                                        subhead_CumulativeMonth_budget += subhead_month_budget;
                                                        subhead_CumulativeMonth_actual += subhead_month_actual;
                                                        subhead_CumulativeMonth_variance += subhead_month_variance;
                                                        // Cumulative month total Calculation end

                                                        subhead_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(subhead_month_budget)}" style="font-weight:bold;">${INR(subhead_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers" value="${INR(subhead_month_actual)}" style="font-weight:bold;">${INR(subhead_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${INR(subhead_month_variance)}" style="font-weight:bold;">${INR(subhead_month_variance)}</td>`;
                                                    } else {
                                                        subhead_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>`;
                                                    }
                                                });

                                                if (ds.hasOwnProperty(year)) {
                                                    subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(subhead_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(subhead_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(subhead_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth_variance)}</td>
                                                        ${subhead_month_td}
                                                    `;
                                                }
                                                else {
                                                    subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                                        ${subhead_month_td}
                                                    `;
                                                }

                                                // Yearly total Calculation start
                                                subhead_year_budget += subhead_CumulativeMonth_budget;
                                                subhead_year_actual += subhead_CumulativeMonth_actual;
                                                subhead_year_variance += subhead_CumulativeMonth_variance;
                                                // Yearly total Calculation end


                                                subhead_start = subhead_end;
                                                subhead_end = subhead_end + monthDuration;

                                            }
                                            subhead_year_td += `<td class="mis_year_column budget numbers" value="${INR(subhead_year_budget)}" style="font-weight:bold;">${INR(subhead_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(subhead_year_actual)}" style="font-weight:bold;">${INR(subhead_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(subhead_year_variance)}" style="font-weight:bold;">${INR(subhead_year_variance)}</td>
                                                ${subhead_cumulative_month_td}
                                            `;
                                        }

                                        // SubHead rows
                                        let level1Format_subhead = (subheadKey).replaceAll("'", "");
                                        let groupClass_subhead = (level1Format_subhead).replaceAll(" ", "_");
                                        tableRows += `<tr class="subhead ${groupClass_alie} ${groupClass_classification} ${groupClass_head}"><td class='level4' id="${groupClass_subhead}"><i class="fa-solid fa-minus icon"></i></td>
                                            <td>${subheadKey}</td>
                                            ${subhead_year_td}
                                        </tr>`;

                                        for (let particularsKey in subhead) {
                                            if (!(rejectedKeys.includes(particularsKey))) {

                                                let particulars = subhead[particularsKey];
                                                let particulars_year_td = "";
                                                for (let i = 0; i <= yearDuration; i++) {
                                                    let year = startYear + i;

                                                    let particulars_start = 0;
                                                    let particulars_end = monthDuration;
                                                    let particulars_cumulative_month_td = "";

                                                    let [particulars_year_budget, particulars_year_actual, particulars_year_variance] = [0, 0, 0];
                                                    for (let j = 0; j < monthType; j++) {
                                                        let split1 = dynamicMonthNames.slice(particulars_start, particulars_end);
                                                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                                        let particulars_month_td = "";
                                                        let [particulars_CumulativeMonth_budget, particulars_CumulativeMonth_actual, particulars_CumulativeMonth_variance] = [0, 0, 0];
                                                        split1.map((month) => {
                                                            let monthNum = monthList[month];
                                                            if (particulars.hasOwnProperty(year)) {
                                                                (particulars[year][monthNum] == undefined) ? particulars[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                                                let particulars_month_budget = particulars[year][monthNum]["budget"];
                                                                let particulars_month_actual = particulars[year][monthNum]["actual"];
                                                                let particulars_month_variance = particulars_month_budget - particulars_month_actual;

                                                                // Cumulative month total Calculation start
                                                                particulars_CumulativeMonth_budget += particulars_month_budget;
                                                                particulars_CumulativeMonth_actual += particulars_month_actual;
                                                                particulars_CumulativeMonth_variance += particulars_month_variance;
                                                                // Cumulative month total Calculation end

                                                                particulars_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(particulars_month_budget)}" style="font-weight:bold;">${INR(particulars_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers" value="${INR(particulars_month_actual)}" style="font-weight:bold;">${INR(particulars_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${INR(particulars_month_variance)}" style="font-weight:bold;">${INR(particulars_month_variance)}</td>`;
                                                            } else {
                                                                particulars_month_td += `<td class="${year} ${monthColumnClass} budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>`;
                                                            }
                                                        });

                                                        if (ds.hasOwnProperty(year)) {
                                                            particulars_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(particulars_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(particulars_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(particulars_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth_variance)}</td>
                                                            ${particulars_month_td}
                                                        `;
                                                        }
                                                        else {
                                                            particulars_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                                                ${particulars_month_td}
                                                            `;
                                                        }

                                                        // Yearly total Calculation start
                                                        particulars_year_budget += particulars_CumulativeMonth_budget;
                                                        particulars_year_actual += particulars_CumulativeMonth_actual;
                                                        particulars_year_variance += particulars_CumulativeMonth_variance;
                                                        // Yearly total Calculation end


                                                        particulars_start = particulars_end;
                                                        particulars_end = particulars_end + monthDuration;

                                                    }
                                                    particulars_year_td += `<td class="mis_year_column budget numbers" value="${INR(particulars_year_budget)}" style="font-weight:bold;">${INR(particulars_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(particulars_year_actual)}" style="font-weight:bold;">${INR(particulars_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(particulars_year_variance)}" style="font-weight:bold;">${INR(particulars_year_variance)}</td>
                                                        ${particulars_cumulative_month_td}
                                                    `;
                                                }
                                                // Particulars rows
                                                let level1Format_particulars = (particularsKey).replaceAll("'", "");
                                                let groupClass_particulars = (level1Format_particulars).replaceAll(" ", "_");
                                                tableRows += `<tr class="particulars ${groupClass_alie} ${groupClass_classification} ${groupClass_head} ${groupClass_subhead}"><td class='level5' id="${groupClass_particulars}"></td>
                                                    <td>${particularsKey}</td>
                                                    ${particulars_year_td}
                                                </tr>`;
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }






                    // let keys_level1 = Object.keys(ds);
                    // let rejectedKeys_level1 = ["classification", "name"];
                    // keys_level1.map((year) => {
                    //     if (!rejectedKeys_level1.includes(year)) {
                    //         generated_td += ``;
                    //         dynamicMonthColumns.map((monthNum) => {
                    //             if (monthNum.data != "name") {
                    //                 if (ds[year].hasOwnProperty(monthNum.data)) {

                    //                     let variance = ds[year][monthNum.data].budget - ds[year][monthNum.data].actual;
                    //                     let varianceClass;
                    //                     if (variance < 0) {
                    //                         varianceClass = 'negative-variance';
                    //                     } else if (variance > 0) {
                    //                         varianceClass = 'positive-variance';
                    //                     } else {
                    //                         varianceClass = '';
                    //                     }

                    //                     let actualClass = ds[year][monthNum.data].actual > ds[year][monthNum.data].budget ? 'red-actual' : 'green-actual';
                    //                     let Actuals = ds[year][monthNum.data].actual;
                    //                     let formattedActuals = INR(Actuals);
                    //                     if (Actuals < 0) {
                    //                         formattedActuals = `(-)${INR(-Actuals)}`;
                    //                     }
                    //                     let formattedvariance = INR(variance);
                    //                     if (variance < 0) {
                    //                         formattedvariance = `(-)${INR(-variance)}`;
                    //                     }
                    //                     generated_td += `<td class="budget numbers" value="${INR(ds[year][monthNum.data].budget)}" style="font-weight:bold;">${INR(ds[year][monthNum.data].budget)}</td><td class="actual numbers ${actualClass}" value="${formattedActuals}" style="font-weight:bold;">${formattedActuals}</td><td class="variance ${varianceClass} numbers" value="${formattedvariance}" style="font-weight:bold;">${formattedvariance}</td>`;

                    //                     alie_budget_total += ds[year][monthNum.data].budget;
                    //                     alie_actual_total += Actuals;
                    //                     alie_variance_total += variance;
                    //                 } else {
                    //                     generated_td += `<td class="budget numbers" value="0" style="font-weight:bold;">0</td><td class="actual numbers" style="font-weight:bold;" value="0">0</td><td class="variance numbers" style="font-weight:bold;" value="0">0</td>`;
                    //                 }
                    //             }
                    //         });
                    //     }
                    // })

                    // // dynamicMonthColumns.map((monthNum) => {
                    // //     if (monthNum.data != "name") {
                    // //         if (ds.hasOwnProperty(monthNum.data)) {

                    // //             let variance = ds[monthNum.data].budget - ds[monthNum.data].actual;
                    // //             let varianceClass;
                    // //             if (variance < 0) {
                    // //                 varianceClass = 'negative-variance';
                    // //             } else if (variance > 0) {
                    // //                 varianceClass = 'positive-variance';
                    // //             } else {
                    // //                 varianceClass = '';
                    // //             }

                    // //             let actualClass = ds[monthNum.data].actual > ds[monthNum.data].budget ? 'red-actual' : 'green-actual';
                    // //             let Actuals = ds[monthNum.data].actual;
                    // //             let formattedActuals = INR(Actuals);
                    // //             if (Actuals < 0) {
                    // //                 formattedActuals = `(-)${INR(-Actuals)}`;
                    // //             }
                    // //             let formattedvariance = INR(variance);
                    // //             if (variance < 0) {
                    // //                 formattedvariance = `(-)${INR(-variance)}`;
                    // //             }
                    // //             generated_td += `<td class="budget numbers" value="${INR(ds[monthNum.data].budget)}" style="font-weight:bold;">${INR(ds[monthNum.data].budget)}</td><td class="actual numbers ${actualClass}" value="${formattedActuals}" style="font-weight:bold;">${formattedActuals}</td><td class="variance ${varianceClass} numbers" value="${formattedvariance}" style="font-weight:bold;">${formattedvariance}</td>`;

                    // //             alie_budget_total += ds[monthNum.data].budget;
                    // //             alie_actual_total += Actuals;
                    // //             alie_variance_total += variance;
                    // //         } else {
                    // //             generated_td += `<td class="budget numbers" value="0" style="font-weight:bold;">0</td><td class="actual numbers" style="font-weight:bold;" value="0">0</td><td class="variance numbers" style="font-weight:bold;" value="0">0</td>`;
                    // //         }
                    // //     }

                    // // });
                    // // ALIE rows
                    // let level1Format_alie = (ds.name).replaceAll("'", "");
                    // let groupClass_alie = (level1Format_alie).replaceAll(" ", "_");
                    // tableRows += `<tr class="alie"><td class="level1" id='${groupClass_alie}'><i class="fa-solid fa-minus icon"></i></td><td class="plHeading">${ds.name}</td>
                    // <td class="budget numbers" value="${INR(alie_budget_total)}" style="font-weight:bold;">${INR(alie_budget_total)}</td><td class="actual numbers" value="${INR(alie_actual_total)}"  style="font-weight:bold;">${INR(alie_actual_total)}</td><td class="variance numbers" value="${INR(alie_variance_total)}"  style="font-weight:bold;">${INR(alie_variance_total)}</td>
                    // ${generated_td}
                    // </tr>`;

                    // for (let classKey in ds.classification) {
                    //     let cls = ds.classification[classKey];
                    //     let classification_td = "";

                    //     let [cls_budget_total, cls_actual_total, cls_variance_total] = [0, 0, 0];
                    //     dynamicMonthColumns.map((monthNum) => {
                    //         if (monthNum.data != "name") {
                    //             if (cls.hasOwnProperty(monthNum.data)) {
                    //                 let clsvariance = cls[monthNum.data].budget - cls[monthNum.data].actual;
                    //                 let varianceClass;
                    //                 if (clsvariance < 0) {
                    //                     varianceClass = 'negative-variance';
                    //                 } else if (clsvariance > 0) {
                    //                     varianceClass = 'positive-variance';
                    //                 } else {
                    //                     varianceClass = '';
                    //                 }

                    //                 let actualClass = cls[monthNum.data].actual > cls[monthNum.data].budget ? 'red-actual' : 'green-actual';
                    //                 let clsActual = cls[monthNum.data].actual;
                    //                 let formattedclsActuals = INR(clsActual);
                    //                 if (clsActual < 0) {
                    //                     formattedclsActuals = `(-)${INR(-clsActual)}`;
                    //                 }
                    //                 let clsformattedvariance = INR(clsvariance);
                    //                 if (clsvariance < 0) {
                    //                     clsformattedvariance = `(-)${INR(-clsvariance)}`;
                    //                 }
                    //                 classification_td += `<td class="budget numbers" value="${INR(cls[monthNum.data].budget)}">${INR(cls[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedclsActuals}">${formattedclsActuals}</td><td class="variance ${varianceClass} numbers" value="${clsformattedvariance}">${clsformattedvariance}</td>`;

                    //                 cls_budget_total += cls[monthNum.data].budget;
                    //                 cls_actual_total += clsActual;
                    //                 cls_variance_total += clsvariance;
                    //             } else {
                    //                 classification_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                    //             }
                    //         }

                    //     });
                    //     // Classification rows
                    //     let level1Format_classification = (classKey).replaceAll("'", "");
                    //     let groupClass_classification = (level1Format_classification).replaceAll(" ", "_");
                    //     tableRows += `<tr class="classification ${groupClass_alie}"><td class='level2' id="${groupClass_classification}"><i class="fa-solid fa-minus icon"></i></td><td class="plClassify">${classKey}</td>${classification_td}
                    // <td class="budget numbers" value="${INR(cls_budget_total)}">${INR(cls_budget_total)}</td><td class="actual numbers" value="${INR(cls_actual_total)}">${INR(cls_actual_total)}</td><td class="variance numbers" value="${INR(cls_variance_total)}">${INR(cls_variance_total)}</td>
                    // </tr>`;

                    //     for (let headKey in cls) {
                    //         if (!(rejectedKeys.includes(headKey))) {

                    //             let head = cls[headKey];
                    //             let head_td = "";

                    //             let [head_budget_total, head_actual_total, head_variance_total] = [0, 0, 0];
                    //             dynamicMonthColumns.map((monthNum) => {
                    //                 if (monthNum.data != "name") {
                    //                     if (head.hasOwnProperty(monthNum.data)) {
                    //                         let head_variance = head[monthNum.data].budget - head[monthNum.data].actual;
                    //                         let varianceClass;
                    //                         if (head_variance < 0) {
                    //                             varianceClass = 'negative-variance';
                    //                         } else if (head_variance > 0) {
                    //                             varianceClass = 'positive-variance';
                    //                         } else {
                    //                             varianceClass = '';
                    //                         }

                    //                         let actualClass = head[monthNum.data].actual > head[monthNum.data].budget ? 'red-actual' : 'green-actual';
                    //                         let headActual = head[monthNum.data].actual;
                    //                         let formattedheadActuals = INR(headActual);
                    //                         if (headActual < 0) {
                    //                             formattedheadActuals = `(-)${INR(-headActual)}`;
                    //                         }
                    //                         let head_formattedvariance = INR(head_variance);
                    //                         if (head_variance < 0) {
                    //                             head_formattedvariance = `(-)${INR(-head_variance)}`;
                    //                         }
                    //                         head_td += `<td class="budget numbers" value="${INR(head[monthNum.data].budget)}">${INR(head[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedheadActuals}">${formattedheadActuals}</td><td class="variance ${varianceClass} numbers" value="${head_formattedvariance}">${head_formattedvariance}</td>`;

                    //                         head_budget_total += head[monthNum.data].budget;
                    //                         head_actual_total += headActual;
                    //                         head_variance_total += head_variance;
                    //                     } else {
                    //                         head_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                    //                     }
                    //                 }
                    //             });
                    //             // Head rows
                    //             let level1Format_head = (headKey).replaceAll("'", "");
                    //             let groupClass_head = (level1Format_head).replaceAll(" ", "_");
                    //             tableRows += `<tr class="head ${groupClass_alie} ${groupClass_classification}"><td class='level3' id="${groupClass_head}"><i class="fa-solid fa-minus icon"></i></td><i class="fa-solid fa-minus icon"></i><td class="plClassify">${headKey}</td>${head_td}
                    //             <td class="budget numbers" value="${INR(head_budget_total)}">${INR(head_budget_total)}</td><td class="actual numbers" value="${INR(head_actual_total)}">${INR(head_actual_total)}</td><td class="variance numbers" value="${INR(head_variance_total)}">${INR(head_variance_total)}</td>
                    //         </tr>`;


                    //             for (let subheadKey in head) {
                    //                 if (!(rejectedKeys.includes(subheadKey))) {

                    //                     let subhead = head[subheadKey];
                    //                     let subhead_td = "";
                    //                     let [subhead_budget_total, subhead_actual_total, subhead_variance_total] = [0, 0, 0];
                    //                     dynamicMonthColumns.map((monthNum) => {
                    //                         if (monthNum.data != "name") {
                    //                             if (subhead.hasOwnProperty(monthNum.data)) {
                    //                                 let subhead_variance = subhead[monthNum.data].budget - subhead[monthNum.data].actual;
                    //                                 let varianceClass;
                    //                                 if (subhead_variance < 0) {
                    //                                     varianceClass = 'negative-variance';
                    //                                 } else if (subhead_variance > 0) {
                    //                                     varianceClass = 'positive-variance';
                    //                                 } else {
                    //                                     varianceClass = '';
                    //                                 }

                    //                                 let actualClass = subhead[monthNum.data].actual > subhead[monthNum.data].budget ? 'red-actual' : 'green-actual';
                    //                                 let subheadActual = subhead[monthNum.data].actual;
                    //                                 let formattedsubheadActuals = INR(subheadActual);
                    //                                 if (subheadActual < 0) {
                    //                                     formattedsubheadActuals = `(-)${INR(-subheadActual)}`;
                    //                                 }
                    //                                 let subhead_formattedvariance = INR(subhead_variance);
                    //                                 if (subhead_variance < 0) {
                    //                                     subhead_formattedvariance = `(-)${INR(-subhead_variance)}`;
                    //                                 }
                    //                                 subhead_td += `<td class="budget numbers" value="${INR(subhead[monthNum.data].budget)}">${INR(subhead[monthNum.data].budget)}</td><td class="actual ${actualClass} numbers" value="${formattedsubheadActuals}">${formattedsubheadActuals}</td><td class="variance ${varianceClass} numbers" value="${subhead_formattedvariance}">${subhead_formattedvariance}</td>`;

                    //                                 subhead_budget_total += subhead[monthNum.data].budget;
                    //                                 subhead_actual_total += subheadActual;
                    //                                 subhead_variance_total += subhead_variance;
                    //                             } else {
                    //                                 subhead_td += `<td class="budget numbers" value="0">0</td><td class="actual numbers" value="0">0</td><td class="variance numbers" value="0">0</td>`;
                    //                             }
                    //                         }
                    //                     });


                    //                     // SubHead rows
                    //                     let level1Format_subhead = (subheadKey).replaceAll("'", "");
                    //                     let groupClass_subhead = (level1Format_subhead).replaceAll(" ", "_");
                    //                     tableRows += `<tr class="subhead ${groupClass_alie} ${groupClass_classification} ${groupClass_head}"><td class='level4' id="${groupClass_subhead}"><i class="fa-solid fa-minus icon"></i></td><i class="fa-solid fa-minus icon"></i><td>${subheadKey}</td>${subhead_td}
                    //                     <td class="budget numbers" value="${INR(subhead_budget_total)}">${INR(subhead_budget_total)}</td><td class="actual numbers" value="${INR(subhead_actual_total)}">${INR(subhead_actual_total)}</td><td class="variance numbers" value="${INR(subhead_variance_total)}">${INR(subhead_variance_total)}</td>
                    //                 </tr>`;

                    //                     for (let particularsKey in subhead) {
                    //                         if (!(rejectedKeys.includes(particularsKey))) {

                    //                             let particulars = subhead[particularsKey];
                    //                             let particulars_td = "";

                    //                             let [particulars_budget_total, particulars_actual_total, particulars_variance_total] = [0, 0, 0];
                    //                             dynamicMonthColumns.map((monthNum) => {
                    //                                 if (monthNum.data != "name") {
                    //                                     if (particulars.hasOwnProperty(monthNum.data)) {
                    //                                         let particular_variance = particulars[monthNum.data].budget - particulars[monthNum.data].actual;
                    //                                         let varianceClass;
                    //                                         if (particular_variance < 0) {
                    //                                             varianceClass = 'negative-variance';
                    //                                         } else if (particular_variance > 0) {
                    //                                             varianceClass = 'positive-variance';
                    //                                         } else {
                    //                                             varianceClass = '';
                    //                                         }

                    //                                         let actualClass = particulars[monthNum.data].actual > particulars[monthNum.data].budget ? 'red-actual' : 'green-actual';
                    //                                         let particularActual = particulars[monthNum.data].actual;
                    //                                         let formattedparticularActuals = INR(particularActual);
                    //                                         if (particularActual < 0) {
                    //                                             formattedparticularActuals = `(-)${INR(-particularActual)}`;
                    //                                         }
                    //                                         let particular_formattedvariance = INR(particular_variance);
                    //                                         if (particular_variance < 0) {
                    //                                             particular_formattedvariance = `(-)${INR(-particular_variance)}`;
                    //                                         }
                    //                                         particulars_td += `<td class="budget numbers" value="${INR(particulars[monthNum.data].budget)}">${INR(particulars[monthNum.data].budget)}</td><td class="actual voucherLevel ${actualClass} numbers" month="${monthNum.data}" ledger="${particularsKey}" value="${formattedparticularActuals}">${formattedparticularActuals}</td><td class="variance ${varianceClass} numbers" value="${particular_formattedvariance}">${particular_formattedvariance}</td>`;

                    //                                         particulars_budget_total += particulars[monthNum.data].budget;
                    //                                         particulars_actual_total += particularActual;
                    //                                         particulars_variance_total += particular_variance;
                    //                                     } else {
                    //                                         particulars_td += `<td class="budget numbers" value="0">0</td><td class="actual voucherLevel numbers" month="${monthNum.data}" ledger="${particularsKey}">0</td><td class="variance numbers" value="0">0</td>`;
                    //                                     }
                    //                                 }
                    //                             });
                    //                             // Particulars rows
                    //                             let level1Format_particulars = (particularsKey).replaceAll("'", "");
                    //                             let groupClass_particulars = (level1Format_particulars).replaceAll(" ", "_");
                    //                             tableRows += `<tr class="particulars ${groupClass_alie} ${groupClass_classification} ${groupClass_head} ${groupClass_subhead}"><td class='level5' id="${groupClass_particulars}"></td><i class="fa-solid fa-minus icon"></i><td>${particularsKey}</td>${particulars_td}
                    //                             <td class="budget numbers" value="${INR(particulars_budget_total)}">${INR(particulars_budget_total)}</td><td class="actual numbers" value="${INR(particulars_actual_total)}">${INR(particulars_actual_total)}</td><td class="variance numbers" value="${INR(particulars_variance_total)}">${INR(particulars_variance_total)}</td>
                    //                         </tr>`;
                    //                         }
                    //                     }

                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                });
            } else {
                profit_loss.map((ds) => {

                    let year_td = "";
                    for (let i = 0; i < yearDuration; i++) {
                        let year = startYear + i;
                        rejectedKeys.push(year.toString())
                        let year1 = startYear + i;
                        let ey = (year1 + 1).toString().substring(2, 4)
                        let yearHead = `${year1}-${ey}`

                        let alie_start = 0;
                        let alie_end = monthDuration;
                        let cumulative_month_td = "";
                        // ds[year] = {};
                        let [alie_year_budget, alie_year_actual, alie_year_variance] = [0, 0, 0];
                        for (let j = 0; j < monthType; j++) {
                            let split1 = dynamicMonthNames.slice(alie_start, alie_end);
                            let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                            let month_td = "";
                            let [alie_CumulativeMonth_budget, alie_CumulativeMonth_actual, alie_CumulativeMonth_variance] = [0, 0, 0];
                            split1.map((month) => {
                                let monthNum = monthList[month];
                                if (ds.hasOwnProperty(year)) {
                                    (ds[year][monthNum] == undefined) ? ds[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                    let alie_month_budget = ds[year][monthNum]["budget"];
                                    let alie_month_actual = ds[year][monthNum]["actual"];
                                    let alie_month_variance = alie_month_budget - alie_month_actual;

                                    // Cumulative month total Calculation start
                                    alie_CumulativeMonth_budget += alie_month_budget;
                                    alie_CumulativeMonth_actual += alie_month_actual;
                                    alie_CumulativeMonth_variance += alie_month_variance;
                                    // Cumulative month total Calculation end

                                    month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(alie_month_budget)}" style="font-weight:bold;">${INR(alie_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(alie_month_actual)}" style="font-weight:bold;">${INR(alie_month_actual)}</td><td class="${year} ${monthColumnClass} variance mis_month_column ${0} numbers" value="${INR(alie_month_variance)}" style="font-weight:bold;">${INR(alie_month_variance)}</td>`;
                                } else {
                                    month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance mis_month_column ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>`;
                                }
                            });

                            if (ds.hasOwnProperty(year)) {
                                cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(alie_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(alie_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(alie_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(alie_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(alie_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(alie_CumulativeMonth_variance)}</td>
                                    ${month_td}
                                `;
                            }
                            else {
                                cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                    ${month_td}
                                `;
                            }

                            // Yearly total Calculation start
                            alie_year_budget += alie_CumulativeMonth_budget;
                            alie_year_actual += alie_CumulativeMonth_actual;
                            alie_year_variance += alie_CumulativeMonth_variance;
                            // Yearly total Calculation end


                            alie_start = alie_end;
                            alie_end = alie_end + monthDuration;

                        }
                        year_td += `<td class="mis_year_column budget numbers" value="${INR(alie_year_budget)}" style="font-weight:bold;">${INR(alie_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(alie_year_actual)}" style="font-weight:bold;">${INR(alie_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(alie_year_variance)}" style="font-weight:bold;">${INR(alie_year_variance)}</td>
                            ${cumulative_month_td}
                        `;
                    }
                    let level1Format_alie = (ds.name).replaceAll("'", "");
                    let groupClass_alie = (level1Format_alie).replaceAll(" ", "_");



                    // ALIE rows
                    tableRows += `<tr class="alie">
                        <td class="level1" id='${groupClass_alie}'><i class="fa-solid fa-minus icon"></i></td>
                        <td class="plHeading">${ds.name}</td>
                        ${year_td}
                    </tr>`;



                    // *********************** Classification Row creation start ***********************
                    for (let classKey in ds.classification) {
                        let cls = ds.classification[classKey];

                        let cls_year_td = "";
                        for (let i = 0; i < yearDuration; i++) {
                            let year = startYear + i;

                            let cls_start = 0;
                            let cls_end = monthDuration;
                            let cls_cumulative_month_td = "";

                            let [cls_year_budget, cls_year_actual, cls_year_variance] = [0, 0, 0];
                            for (let j = 0; j < monthType; j++) {
                                let split1 = dynamicMonthNames.slice(cls_start, cls_end);
                                let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                let cls_month_td = "";
                                let [cls_CumulativeMonth_budget, cls_CumulativeMonth_actual, cls_CumulativeMonth_variance] = [0, 0, 0];
                                split1.map((month) => {
                                    let monthNum = monthList[month];
                                    if (cls.hasOwnProperty(year)) {
                                        (cls[year][monthNum] == undefined) ? cls[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                        let cls_month_budget = cls[year][monthNum]["budget"];
                                        let cls_month_actual = cls[year][monthNum]["actual"];
                                        let cls_month_variance = cls_month_budget - cls_month_actual;

                                        // Cumulative month total Calculation start
                                        cls_CumulativeMonth_budget += cls_month_budget;
                                        cls_CumulativeMonth_actual += cls_month_actual;
                                        cls_CumulativeMonth_variance += cls_month_variance;
                                        // Cumulative month total Calculation end

                                        cls_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(cls_month_budget)}" style="font-weight:bold;">${INR(cls_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(cls_month_actual)}" style="font-weight:bold;">${INR(cls_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(cls_month_variance)}" style="font-weight:bold;">${INR(cls_month_variance)}</td>`;
                                    } else {
                                        cls_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                                    }
                                });

                                if (ds.hasOwnProperty(year)) {
                                    cls_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(cls_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(cls_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(cls_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(cls_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(cls_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(cls_CumulativeMonth_variance)}</td>
                                    ${cls_month_td}
                                `;
                                }
                                else {
                                    cls_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                    ${cls_month_td}
                                `;
                                }

                                // Yearly total Calculation start
                                cls_year_budget += cls_CumulativeMonth_budget;
                                cls_year_actual += cls_CumulativeMonth_actual;
                                cls_year_variance += cls_CumulativeMonth_variance;
                                // Yearly total Calculation end


                                cls_start = cls_end;
                                cls_end = cls_end + monthDuration;

                            }
                            cls_year_td += `<td class="mis_year_column budget numbers" value="${INR(cls_year_budget)}" style="font-weight:bold;">${INR(cls_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(cls_year_actual)}" style="font-weight:bold;">${INR(cls_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(cls_year_variance)}" style="font-weight:bold;">${INR(cls_year_variance)}</td>
                                ${cls_cumulative_month_td}
                            `;
                        }

                        // Classification rows
                        let level1Format_classification = (classKey).replaceAll("'", "");
                        let groupClass_classification = (level1Format_classification).replaceAll(" ", "_");
                        tableRows += `<tr class="classification ${groupClass_alie}">
                            <td class='level2' id="${groupClass_classification}"><i class="fa-solid fa-minus icon"></i></td>
                            <td class="plClassify plHeading">${classKey}</td>
                            ${cls_year_td}
                        </tr>`;
                        // *********************** Classification Row creation end ***********************

                        // *********************** Head Row creation start ***********************

                        for (let headKey in cls) {

                            if (!(rejectedKeys.includes(headKey))) {

                                let head = cls[headKey];
                                let head_year_td = "";
                                for (let i = 0; i < yearDuration; i++) {
                                    let year = startYear + i;

                                    let head_start = 0;
                                    let head_end = monthDuration;
                                    let head_cumulative_month_td = "";

                                    let [head_year_budget, head_year_actual, head_year_variance] = [0, 0, 0];
                                    for (let j = 0; j < monthType; j++) {
                                        let split1 = dynamicMonthNames.slice(head_start, head_end);
                                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                        let head_month_td = "";
                                        let [head_CumulativeMonth_budget, head_CumulativeMonth_actual, head_CumulativeMonth_variance] = [0, 0, 0];
                                        split1.map((month) => {
                                            let monthNum = monthList[month];
                                            if (head.hasOwnProperty(year)) {
                                                (head[year][monthNum] == undefined) ? head[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                                let head_month_budget = head[year][monthNum]["budget"];
                                                let head_month_actual = head[year][monthNum]["actual"];
                                                let head_month_variance = head_month_budget - head_month_actual;

                                                // Cumulative month total Calculation start
                                                head_CumulativeMonth_budget += head_month_budget;
                                                head_CumulativeMonth_actual += head_month_actual;
                                                head_CumulativeMonth_variance += head_month_variance;
                                                // Cumulative month total Calculation end

                                                head_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(head_month_budget)}" style="font-weight:bold;">${INR(head_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(head_month_actual)}" style="font-weight:bold;">${INR(head_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(head_month_variance)}" style="font-weight:bold;">${INR(head_month_variance)}</td>`;
                                            } else {
                                                head_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                                            }
                                        });

                                        if (ds.hasOwnProperty(year)) {
                                            head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(head_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(head_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(head_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(head_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(head_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(head_CumulativeMonth_variance)}</td>
                                                ${head_month_td}
                                            `;
                                        }
                                        else {
                                            head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                                ${head_month_td}
                                            `;
                                        }

                                        // Yearly total Calculation start
                                        head_year_budget += head_CumulativeMonth_budget;
                                        head_year_actual += head_CumulativeMonth_actual;
                                        head_year_variance += head_CumulativeMonth_variance;
                                        // Yearly total Calculation end


                                        head_start = head_end;
                                        head_end = head_end + monthDuration;

                                    }
                                    head_year_td += `<td class="mis_year_column budget numbers" value="${INR(head_year_budget)}" style="font-weight:bold;">${INR(head_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(head_year_actual)}" style="font-weight:bold;">${INR(head_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(head_year_variance)}" style="font-weight:bold;">${INR(head_year_variance)}</td>
                                        ${head_cumulative_month_td}
                                    `;
                                }
                                // Head rows
                                let level1Format_head = (headKey).replaceAll("'", "");
                                let groupClass_head = (level1Format_head).replaceAll(" ", "_");
                                tableRows += `<tr class="head ${groupClass_alie} ${groupClass_classification}">
                                <td class='level3' id="${groupClass_head}"><i class="fa-solid fa-minus icon"></i></td><td class="plClassify plHeading">${headKey}</td>
                                ${head_year_td}
                                </tr>`;

                                // *********************** Head Row creation end ***********************


                                // *********************** SubHead Row creation start ***********************

                                for (let subheadKey in head) {
                                    if (!(rejectedKeys.includes(subheadKey))) {

                                        let subhead = head[subheadKey];
                                        let subhead_year_td = "";
                                        for (let i = 0; i < yearDuration; i++) {
                                            let year = startYear + i;

                                            let subhead_start = 0;
                                            let subhead_end = monthDuration;
                                            let subhead_cumulative_month_td = "";

                                            let [subhead_year_budget, subhead_year_actual, subhead_year_variance] = [0, 0, 0];
                                            for (let j = 0; j < monthType; j++) {
                                                let split1 = dynamicMonthNames.slice(subhead_start, subhead_end);
                                                let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                                let subhead_month_td = "";
                                                let [subhead_CumulativeMonth_budget, subhead_CumulativeMonth_actual, subhead_CumulativeMonth_variance] = [0, 0, 0];
                                                split1.map((month) => {
                                                    let monthNum = monthList[month];
                                                    if (subhead.hasOwnProperty(year)) {
                                                        (subhead[year][monthNum] == undefined) ? subhead[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                                        let subhead_month_budget = subhead[year][monthNum]["budget"];
                                                        let subhead_month_actual = subhead[year][monthNum]["actual"];
                                                        let subhead_month_variance = subhead_month_budget - subhead_month_actual;

                                                        // Cumulative month total Calculation start
                                                        subhead_CumulativeMonth_budget += subhead_month_budget;
                                                        subhead_CumulativeMonth_actual += subhead_month_actual;
                                                        subhead_CumulativeMonth_variance += subhead_month_variance;
                                                        // Cumulative month total Calculation end

                                                        subhead_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(subhead_month_budget)}" style="font-weight:bold;">${INR(subhead_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(subhead_month_actual)}" style="font-weight:bold;">${INR(subhead_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(subhead_month_variance)}" style="font-weight:bold;">${INR(subhead_month_variance)}</td>`;
                                                    } else {
                                                        subhead_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                                                    }
                                                });

                                                if (ds.hasOwnProperty(year)) {
                                                    subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(subhead_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(subhead_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(subhead_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth_variance)}</td>
                                                        ${subhead_month_td}
                                                    `;
                                                }
                                                else {
                                                    subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                                        ${subhead_month_td}
                                                    `;
                                                }

                                                // Yearly total Calculation start
                                                subhead_year_budget += subhead_CumulativeMonth_budget;
                                                subhead_year_actual += subhead_CumulativeMonth_actual;
                                                subhead_year_variance += subhead_CumulativeMonth_variance;
                                                // Yearly total Calculation end


                                                subhead_start = subhead_end;
                                                subhead_end = subhead_end + monthDuration;

                                            }
                                            subhead_year_td += `<td class="mis_year_column budget numbers" value="${INR(subhead_year_budget)}" style="font-weight:bold;">${INR(subhead_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(subhead_year_actual)}" style="font-weight:bold;">${INR(subhead_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(subhead_year_variance)}" style="font-weight:bold;">${INR(subhead_year_variance)}</td>
                                                ${subhead_cumulative_month_td}
                                            `;
                                        }

                                        // SubHead rows
                                        let level1Format_subhead = (subheadKey).replaceAll("'", "");
                                        let groupClass_subhead = (level1Format_subhead).replaceAll(" ", "_");
                                        tableRows += `<tr class="subhead ${groupClass_alie} ${groupClass_classification} ${groupClass_head}"><td class='level4' id="${groupClass_subhead}"><i class="fa-solid fa-minus icon"></i></td>
                                            <td class="plHeading">${subheadKey}</td>
                                            ${subhead_year_td}
                                        </tr>`;

                                        for (let particularsKey in subhead) {
                                            if (!(rejectedKeys.includes(particularsKey))) {

                                                let particulars = subhead[particularsKey];
                                                let particulars_year_td = "";
                                                for (let i = 0; i < yearDuration; i++) {
                                                    let year = startYear + i;

                                                    let particulars_start = 0;
                                                    let particulars_end = monthDuration;
                                                    let particulars_cumulative_month_td = "";

                                                    let [particulars_year_budget, particulars_year_actual, particulars_year_variance] = [0, 0, 0];
                                                    for (let j = 0; j < monthType; j++) {
                                                        let split1 = dynamicMonthNames.slice(particulars_start, particulars_end);
                                                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                                        let particulars_month_td = "";
                                                        let [particulars_CumulativeMonth_budget, particulars_CumulativeMonth_actual, particulars_CumulativeMonth_variance] = [0, 0, 0];
                                                        split1.map((month) => {
                                                            let monthNum = monthList[month];
                                                            if (particulars.hasOwnProperty(year)) {
                                                                (particulars[year][monthNum] == undefined) ? particulars[year][monthNum] = { "budget": 0, "actual": 0 } : ds[year][monthNum] = ds[year][monthNum];
                                                                let particulars_month_budget = particulars[year][monthNum]["budget"];
                                                                let particulars_month_actual = particulars[year][monthNum]["actual"];
                                                                let particulars_month_variance = particulars_month_budget - particulars_month_actual;

                                                                // Cumulative month total Calculation start
                                                                particulars_CumulativeMonth_budget += particulars_month_budget;
                                                                particulars_CumulativeMonth_actual += particulars_month_actual;
                                                                particulars_CumulativeMonth_variance += particulars_month_variance;
                                                                // Cumulative month total Calculation end

                                                                particulars_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(particulars_month_budget)}" style="font-weight:bold;">${INR(particulars_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(particulars_month_actual)}" style="font-weight:bold;">${INR(particulars_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(particulars_month_variance)}" style="font-weight:bold;">${INR(particulars_month_variance)}</td>`;
                                                            } else {
                                                                particulars_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                                                            }
                                                        });

                                                        if (ds.hasOwnProperty(year)) {
                                                            particulars_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(particulars_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(particulars_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(particulars_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth_variance)}</td>
                                                            ${particulars_month_td}
                                                        `;
                                                        }
                                                        else {
                                                            particulars_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                                                ${particulars_month_td}
                                                            `;
                                                        }

                                                        // Yearly total Calculation start
                                                        particulars_year_budget += particulars_CumulativeMonth_budget;
                                                        particulars_year_actual += particulars_CumulativeMonth_actual;
                                                        particulars_year_variance += particulars_CumulativeMonth_variance;
                                                        // Yearly total Calculation end


                                                        particulars_start = particulars_end;
                                                        particulars_end = particulars_end + monthDuration;

                                                    }
                                                    particulars_year_td += `<td class="mis_year_column budget numbers" value="${INR(particulars_year_budget)}" style="font-weight:bold;">${INR(particulars_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(particulars_year_actual)}" style="font-weight:bold;">${INR(particulars_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(particulars_year_variance)}" style="font-weight:bold;">${INR(particulars_year_variance)}</td>
                                                        ${particulars_cumulative_month_td}
                                                    `;
                                                }
                                                // Particulars rows
                                                let level1Format_particulars = (particularsKey).replaceAll("'", "");
                                                let groupClass_particulars = (level1Format_particulars).replaceAll(" ", "_");
                                                tableRows += `<tr class="particulars ${groupClass_alie} ${groupClass_classification} ${groupClass_head} ${groupClass_subhead}"><td class='level5' id="${groupClass_particulars}"></td>
                                                    <td class="plHeading">${particularsKey}</td>
                                                    ${particulars_year_td}
                                                </tr>`;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }


            // ***************************** EBITDA Row creation start *****************************
            let ebitda = plExceptionalSet.ebitda;
            let income = profit_loss[0];
            let expense = profit_loss[1];

            let ebitda_year_td = "";
            for (let i = 0; i < yearDuration; i++) {
                let year = startYear + i;

                let ebitda_start = 0;
                let ebitda_end = monthDuration;
                let ebitda_cumulative_month_td = "";
                ebitda[year] = {};
                let [ebitda_year_budget, ebitda_year_actual, ebitda_year_variance] = [0, 0, 0];
                for (let j = 0; j < monthType; j++) {
                    let split1 = dynamicMonthNames.slice(ebitda_start, ebitda_end);
                    let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                    let ebitda_month_td = "";
                    let [ebitda_CumulativeMonth_budget, ebitda_CumulativeMonth_actual, ebitda_CumulativeMonth_variance] = [0, 0, 0];
                    split1.map((month) => {
                        let monthNum = monthList[month];
                        if (income.hasOwnProperty(year) && expense.hasOwnProperty(year)) {
                            (income[year][monthNum] == undefined) ? income[year][monthNum] = { "budget": 0, "actual": 0 } : income[year][monthNum] = income[year][monthNum];
                            (expense[year][monthNum] == undefined) ? expense[year][monthNum] = { "budget": 0, "actual": 0 } : expense[year][monthNum] = expense[year][monthNum];
                            let ebitda_month_budget = income[year][monthNum]["budget"] + expense[year][monthNum]["budget"];
                            let ebitda_month_actual = income[year][monthNum]["actual"] + expense[year][monthNum]["actual"];
                            let ebitda_month_variance = ebitda_month_budget - ebitda_month_actual;


                            // Cumulative month total Calculation start
                            ebitda_CumulativeMonth_budget += ebitda_month_budget;
                            ebitda_CumulativeMonth_actual += ebitda_month_actual;
                            ebitda_CumulativeMonth_variance += ebitda_month_variance;
                            // Cumulative month total Calculation end


                            (ebitda[year][monthNum] == undefined) ? ebitda[year][monthNum] = { "budget": 0, "actual": 0 } : ebitda[year][monthNum] = ebitda[year][monthNum];
                            ebitda[year][monthNum].budget = ebitda_month_budget;
                            ebitda[year][monthNum].actual = ebitda_month_actual;
                            ebitda[year][monthNum].variance = ebitda_month_variance;


                            ebitda_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(ebitda_month_budget)}" style="font-weight:bold;">${INR(ebitda_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(ebitda_month_actual)}" style="font-weight:bold;">${INR(ebitda_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(ebitda_month_variance)}" style="font-weight:bold;">${INR(ebitda_month_variance)}</td>`;
                        } else {
                            ebitda_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                        }
                    });


                    if (ebitda.hasOwnProperty(year)) {
                        ebitda_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(ebitda_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(ebitda_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(ebitda_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(ebitda_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(ebitda_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(ebitda_CumulativeMonth_variance)}</td>
                                ${ebitda_month_td}
                            `;
                    }
                    else {
                        ebitda_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                    ${ebitda_month_td}
                                `;
                    }

                    // Yearly total Calculation start
                    ebitda_year_budget += ebitda_CumulativeMonth_budget;
                    ebitda_year_actual += ebitda_CumulativeMonth_actual;
                    ebitda_year_variance += ebitda_CumulativeMonth_variance;
                    // Yearly total Calculation end


                    ebitda_start = ebitda_end;
                    ebitda_end = ebitda_end + monthDuration;

                }
                ebitda_year_td += `<td class="mis_year_column budget numbers" value="${INR(ebitda_year_budget)}" style="font-weight:bold;">${INR(ebitda_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(ebitda_year_actual)}" style="font-weight:bold;">${INR(ebitda_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(ebitda_year_variance)}" style="font-weight:bold;">${INR(ebitda_year_variance)}</td>
                            ${ebitda_cumulative_month_td}
                `;
            }

            // EBITDA rows
            tableRows += `<tr class="alie">
                <td class='level1' id="ebitda"><i class="fa-solid fa-minus icon"></i></td>
                <td class="plAlie plHeading">EBITDA</td>
                ${ebitda_year_td}
            </tr>`;
            // ***************************** EBITDA Row creation end *****************************



            // ***************************** EBITDA Head Row creation start *****************************
            let ebt = plExceptionalSet.ebt;
            let ebitda_head_obj = plExceptionalSet.head;

            let ebt_check_count = 0;
            let monthwise_headTotal = {};
            for (let ebitda_headKey in ebitda_head_obj) {
                ebt_check_count += 1;

                let ebitda_head = ebitda_head_obj[ebitda_headKey];
                let ebitda_head_year_td = "";
                for (let i = 0; i < yearDuration; i++) {
                    let year = startYear + i;

                    let ebitda_head_start = 0;
                    let ebitda_head_end = monthDuration;
                    let ebitda_head_cumulative_month_td = "";
                    if (monthwise_headTotal[year] == undefined) { monthwise_headTotal[year] = {} }

                    let [ebitda_head_year_budget, ebitda_head_year_actual, ebitda_head_year_variance] = [0, 0, 0];
                    for (let j = 0; j < monthType; j++) {
                        let split1 = dynamicMonthNames.slice(ebitda_head_start, ebitda_head_end);
                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                        let ebitda_head_month_td = "";
                        let [ebitda_head_CumulativeMonth_budget, ebitda_head_CumulativeMonth_actual, ebitda_head_CumulativeMonth_variance] = [0, 0, 0];
                        split1.map((month) => {
                            let monthNum = monthList[month];
                            if (ebitda_head.hasOwnProperty(year)) {
                                (ebitda_head[year][monthNum] == undefined) ? ebitda_head[year][monthNum] = { "budget": 0, "actual": 0 } : ebitda_head[year][monthNum] = ebitda_head[year][monthNum];
                                let ebitda_head_month_budget = ebitda_head[year][monthNum]["budget"];
                                let ebitda_head_month_actual = ebitda_head[year][monthNum]["actual"];
                                let ebitda_head_month_variance = ebitda_head_month_budget - ebitda_head_month_actual;


                                // Cumulative month total Calculation start
                                ebitda_head_CumulativeMonth_budget += ebitda_head_month_budget;
                                ebitda_head_CumulativeMonth_actual += ebitda_head_month_actual;
                                ebitda_head_CumulativeMonth_variance += ebitda_head_month_variance;
                                // Cumulative month total Calculation end


                                (monthwise_headTotal[year][monthNum] == undefined) ? monthwise_headTotal[year][monthNum] = { "budget": 0, "actual": 0 } : monthwise_headTotal[year][monthNum] = monthwise_headTotal[year][monthNum];

                                monthwise_headTotal[year][monthNum].budget += ebitda_head_month_budget;
                                monthwise_headTotal[year][monthNum].actual += ebitda_head_month_actual;
                                monthwise_headTotal[year][monthNum].variance += ebitda_head_month_variance;


                                ebitda_head_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(ebitda_head_month_budget)}" style="font-weight:bold;">${INR(ebitda_head_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(ebitda_head_month_actual)}" style="font-weight:bold;">${INR(ebitda_head_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(ebitda_head_month_variance)}" style="font-weight:bold;">${INR(ebitda_head_month_variance)}</td>`;
                            } else {
                                ebitda_head_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                            }
                        });


                        if (ebitda_head.hasOwnProperty(year)) {
                            ebitda_head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(ebitda_head_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(ebitda_head_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(ebitda_head_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(ebitda_head_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(ebitda_head_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(ebitda_head_CumulativeMonth_variance)}</td>
                                ${ebitda_head_month_td}
                            `;
                        }
                        else {
                            ebitda_head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                ${ebitda_head_month_td}
                            `;
                        }

                        // Yearly total Calculation start
                        ebitda_head_year_budget += ebitda_head_CumulativeMonth_budget;
                        ebitda_head_year_actual += ebitda_head_CumulativeMonth_actual;
                        ebitda_head_year_variance += ebitda_head_CumulativeMonth_variance;
                        // Yearly total Calculation end


                        ebitda_head_start = ebitda_head_end;
                        ebitda_head_end = ebitda_head_end + monthDuration;

                    }
                    ebitda_head_year_td += `<td class="mis_year_column budget numbers" value="${INR(ebitda_head_year_budget)}" style="font-weight:bold;">${INR(ebitda_head_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(ebitda_head_year_actual)}" style="font-weight:bold;">${INR(ebitda_head_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(ebitda_head_year_variance)}" style="font-weight:bold;">${INR(ebitda_head_year_variance)}</td>
                        ${ebitda_head_cumulative_month_td}
                    `;
                }

                // EBITDA Head rows
                tableRows += `<tr class="ebitda_head ebitda">
                    <td class='level2' id="ebitda"><i class="fa-solid fa-minus icon"></i></td>
                    <td class="plAlie plHeading">${ebitda_headKey}</td>
                    ${ebitda_head_year_td}
                </tr>`;
            }



            // EBT Value Calculation start
            let ebitda_check = plExceptionalSet.ebitda;
            for (let i = 0; i < yearDuration; i++) {
                let year = startYear + i;

                let ebitda_check_start = 0;
                let ebitda_check_end = monthDuration;
                ebt[year] = {};
                for (let j = 0; j < monthType; j++) {
                    let split1 = dynamicMonthNames.slice(ebitda_check_start, ebitda_check_end);


                    split1.map((month) => {
                        let monthNum = monthList[month];
                        (ebt[year][monthNum] == undefined) ? ebt[year][monthNum] = { "budget": 0, "actual": 0 } : ebt[year][monthNum] = ebt[year][monthNum];
                        (monthwise_headTotal[year][monthNum] == undefined) ? monthwise_headTotal[year][monthNum] = { "budget": 0, "actual": 0 } : monthwise_headTotal[year][monthNum] = monthwise_headTotal[year][monthNum];
                        (ebitda_check[year][monthNum] == undefined) ? ebitda_check[year][monthNum] = { "budget": 0, "actual": 0 } : ebitda_check[year][monthNum] = ebitda_check[year][monthNum];
                        ebt[year][monthNum].budget = monthwise_headTotal[year][monthNum].budget + ebitda_check[year][monthNum].budget;
                        ebt[year][monthNum].actual = monthwise_headTotal[year][monthNum].actual + ebitda_check[year][monthNum].actual;
                        ebt[year][monthNum].variance = (monthwise_headTotal[year][monthNum].budget + ebitda_check[year][monthNum].budget) - (monthwise_headTotal[year][monthNum].actual + ebitda_check[year][monthNum].actual);
                    });

                    ebitda_check_start = ebitda_check_end;
                    ebitda_check_end = ebitda_check_end + monthDuration;
                }
            }


            // EBT Value Calculation end

            // ***************************** EBITDA Head Row creation end *****************************


            // ******************************** EBT Creation start ********************************
            let ebt_year_td = "";
            for (let i = 0; i < yearDuration; i++) {
                let year = startYear + i;

                let ebt_start = 0;
                let ebt_end = monthDuration;
                let ebt_cumulative_month_td = "";
                let [ebt_year_budget, ebt_year_actual, ebt_year_variance] = [0, 0, 0];
                for (let j = 0; j < monthType; j++) {
                    let split1 = dynamicMonthNames.slice(ebt_start, ebt_end);
                    let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                    let ebt_month_td = "";
                    let [ebt_CumulativeMonth_budget, ebt_CumulativeMonth_actual, ebt_CumulativeMonth_variance] = [0, 0, 0];
                    split1.map((month) => {
                        let monthNum = monthList[month];

                        if (ebt.hasOwnProperty(year)) {

                            // (ebt[year][monthNum] == undefined) ? ebt[year][monthNum] = { "budget": 0, "actual": 0 } : ebt[year][monthNum] = ebt[year][monthNum];
                            let ebt_month_budget = ebt[year][monthNum]["budget"];
                            let ebt_month_actual = ebt[year][monthNum]["actual"];
                            let ebt_month_variance = ebt_month_budget - ebt_month_actual;


                            // Cumulative month total Calculation start
                            ebt_CumulativeMonth_budget += ebt_month_budget;
                            ebt_CumulativeMonth_actual += ebt_month_actual;
                            ebt_CumulativeMonth_variance += ebt_month_variance;
                            // Cumulative month total Calculation end

                            ebt_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(ebt_month_budget)}" style="font-weight:bold;">${INR(ebt_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(ebt_month_actual)}" style="font-weight:bold;">${INR(ebt_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(ebt_month_variance)}" style="font-weight:bold;">${INR(ebt_month_variance)}</td>`;
                        } else {
                            ebt_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                        }
                    });


                    if (ebt.hasOwnProperty(year)) {
                        ebt_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(ebt_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(ebt_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(ebt_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(ebt_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(ebt_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(ebt_CumulativeMonth_variance)}</td>
                                ${ebt_month_td}
                            `;
                    }
                    else {
                        ebt_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                ${ebt_month_td}
                            `;
                    }

                    // Yearly total Calculation start
                    ebt_year_budget += ebt_CumulativeMonth_budget;
                    ebt_year_actual += ebt_CumulativeMonth_actual;
                    ebt_year_variance += ebt_CumulativeMonth_variance;
                    // Yearly total Calculation end


                    ebt_start = ebt_end;
                    ebt_end = ebt_end + monthDuration;

                }

                ebt_year_td += `<td class="mis_year_column budget numbers" value="${INR(ebt_year_budget)}" style="font-weight:bold;">${INR(ebt_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(ebt_year_actual)}" style="font-weight:bold;">${INR(ebt_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(ebt_year_variance)}" style="font-weight:bold;">${INR(ebt_year_variance)}</td>
                    ${ebt_cumulative_month_td}
                `;


            }

            // EBT rows
            tableRows += `<tr class="alie">
                <td class='level1' id="ebt"></td>
                <td class="plAlie plHeading">EBT</td>
                ${ebt_year_td}
            </tr>`;


            // ******************************** EBT Creation end ********************************

            // ***************************** EBT SubHead Row creation start *****************************
            let totalTax = plExceptionalSet.totalTax;
            let ebt_subhead_obj = plExceptionalSet.subhead;

            for (let ebt_subheadKey in ebt_subhead_obj) {

                let ebt_subhead = ebt_subhead_obj[ebt_subheadKey];
                let ebt_subhead_year_td = "";
                for (let i = 0; i <= yearDuration; i++) {
                    let year = startYear + i;

                    let ebt_subhead_start = 0;
                    let ebt_subhead_end = monthDuration;
                    let ebt_subhead_cumulative_month_td = "";
                    if (totalTax[year] == undefined) { totalTax[year] = {} }


                    let [ebt_subhead_year_budget, ebt_subhead_year_actual, ebt_subhead_year_variance] = [0, 0, 0];
                    for (let j = 0; j < monthType; j++) {
                        let split1 = dynamicMonthNames.slice(ebt_subhead_start, ebt_subhead_end);
                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                        let ebt_subhead_month_td = "";
                        let [ebt_subhead_CumulativeMonth_budget, ebt_subhead_CumulativeMonth_actual, ebt_subhead_CumulativeMonth_variance] = [0, 0, 0];
                        split1.map((month) => {
                            let monthNum = monthList[month];
                            if (ebt_subhead.hasOwnProperty(year)) {
                                (ebt_subhead[year][monthNum] == undefined) ? ebt_subhead[year][monthNum] = { "budget": 0, "actual": 0 } : ebt_subhead[year][monthNum] = ebt_subhead[year][monthNum];
                                let ebt_subhead_month_budget = ebt_subhead[year][monthNum]["budget"];
                                let ebt_subhead_month_actual = ebt_subhead[year][monthNum]["actual"];
                                let ebt_subhead_month_variance = ebt_subhead_month_budget - ebt_subhead_month_actual;


                                // Cumulative month total Calculation start
                                ebt_subhead_CumulativeMonth_budget += ebt_subhead_month_budget;
                                ebt_subhead_CumulativeMonth_actual += ebt_subhead_month_actual;
                                ebt_subhead_CumulativeMonth_variance += ebt_subhead_month_variance;
                                // Cumulative month total Calculation end


                                (totalTax[year][monthNum] == undefined) ? totalTax[year][monthNum] = { "budget": 0, "actual": 0 } : totalTax[year][monthNum] = totalTax[year][monthNum];
                                totalTax[year][monthNum].budget += ebt_subhead_month_budget;
                                totalTax[year][monthNum].actual += ebt_subhead_month_actual;
                                totalTax[year][monthNum].variance += ebt_subhead_month_variance;


                                ebt_subhead_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(ebt_subhead_month_budget)}" style="font-weight:bold;">${INR(ebt_subhead_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(ebt_subhead_month_actual)}" style="font-weight:bold;">${INR(ebt_subhead_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(ebt_subhead_month_variance)}" style="font-weight:bold;">${INR(ebt_subhead_month_variance)}</td>`;
                            } else {
                                ebt_subhead_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                            }
                        });


                        if (ebt_subhead.hasOwnProperty(year)) {
                            ebt_subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(ebt_subhead_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(ebt_subhead_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(ebt_subhead_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(ebt_subhead_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(ebt_subhead_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(ebt_subhead_CumulativeMonth_variance)}</td>
                                ${ebt_subhead_month_td}
                            `;
                        }
                        else {
                            ebt_subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                                ${ebt_subhead_month_td}
                            `;
                        }

                        // Yearly total Calculation start
                        ebt_subhead_year_budget += ebt_subhead_CumulativeMonth_budget;
                        ebt_subhead_year_actual += ebt_subhead_CumulativeMonth_actual;
                        ebt_subhead_year_variance += ebt_subhead_CumulativeMonth_variance;
                        // Yearly total Calculation end


                        ebt_subhead_start = ebt_subhead_end;
                        ebt_subhead_end = ebt_subhead_end + monthDuration;

                    }
                    ebt_subhead_year_td += `<td class="mis_year_column budget numbers" value="${INR(ebt_subhead_year_budget)}" style="font-weight:bold;">${INR(ebt_subhead_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(ebt_subhead_year_actual)}" style="font-weight:bold;">${INR(ebt_subhead_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(ebt_subhead_year_variance)}" style="font-weight:bold;">${INR(ebt_subhead_year_variance)}</td>
                        ${ebt_subhead_cumulative_month_td}
                    `;
                }

                // EBT SubHead rows
                if (ebt_subheadKey != "nodata") {
                    tableRows += `<tr class="ebt_subhead ebt">
                        <td class='level2'></td>
                        <td class="plAlie plHeading">${ebt_subheadKey}</td>
                        ${ebt_subhead_year_td}
                    </tr>`;
                }
            }
            // ***************************** EBT SubHead Row creation end *****************************


            // ***************************** Total Tax Row creation start *****************************
            let totalTax_year_td = "";
            for (let i = 0; i < yearDuration; i++) {
                let year = startYear + i;

                let totalTax_start = 0;
                let totalTax_end = monthDuration;
                let totalTax_cumulative_month_td = "";
                let [totalTax_year_budget, totalTax_year_actual, totalTax_year_variance] = [0, 0, 0];
                for (let j = 0; j < monthType; j++) {
                    let split1 = dynamicMonthNames.slice(totalTax_start, totalTax_end);
                    let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                    let totalTax_month_td = "";
                    let [totalTax_CumulativeMonth_budget, totalTax_CumulativeMonth_actual, totalTax_CumulativeMonth_variance] = [0, 0, 0];
                    split1.map((month) => {
                        let monthNum = monthList[month];
                        if (totalTax.hasOwnProperty(year)) {
                            (totalTax[year][monthNum] == undefined) ? totalTax[year][monthNum] = { "budget": 0, "actual": 0 } : totalTax[year][monthNum] = totalTax[year][monthNum];
                            let totalTax_month_budget = totalTax[year][monthNum]["budget"];
                            let totalTax_month_actual = totalTax[year][monthNum]["actual"];
                            let totalTax_month_variance = totalTax_month_budget - totalTax_month_actual;


                            // Cumulative month total Calculation start
                            totalTax_CumulativeMonth_budget += totalTax_month_budget;
                            totalTax_CumulativeMonth_actual += totalTax_month_actual;
                            totalTax_CumulativeMonth_variance += totalTax_month_variance;
                            // Cumulative month total Calculation end

                            totalTax_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(totalTax_month_budget)}" style="font-weight:bold;">${INR(totalTax_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(totalTax_month_actual)}" style="font-weight:bold;">${INR(totalTax_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(totalTax_month_variance)}" style="font-weight:bold;">${INR(totalTax_month_variance)}</td>`;
                        } else {
                            totalTax_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                        }
                    });


                    if (totalTax.hasOwnProperty(year)) {
                        totalTax_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(totalTax_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(totalTax_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(totalTax_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(totalTax_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(totalTax_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(totalTax_CumulativeMonth_variance)}</td>
                            ${totalTax_month_td}
                        `;
                    }
                    else {
                        totalTax_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                            ${totalTax_month_td}
                        `;
                    }

                    // Yearly total Calculation start
                    totalTax_year_budget += totalTax_CumulativeMonth_budget;
                    totalTax_year_actual += totalTax_CumulativeMonth_actual;
                    totalTax_year_variance += totalTax_CumulativeMonth_variance;
                    // Yearly total Calculation end


                    totalTax_start = totalTax_end;
                    totalTax_end = totalTax_end + monthDuration;

                }
                totalTax_year_td += `<td class="mis_year_column budget numbers" value="${INR(totalTax_year_budget)}" style="font-weight:bold;">${INR(totalTax_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(totalTax_year_actual)}" style="font-weight:bold;">${INR(totalTax_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(totalTax_year_variance)}" style="font-weight:bold;">${INR(totalTax_year_variance)}</td>
                    ${totalTax_cumulative_month_td}
                `;
            }

            // totalTax rows
            tableRows += `<tr class="alie">
                <td class='level1' id="totalTax"><i class="fa-solid fa-minus icon"></i></td>
                <td class="plAlie plHeading">Total Tax</td>
                ${totalTax_year_td}
            </tr>`;
            // ***************************** Total Tax Row creation end *****************************



            // ***************************** EAT Row creation start *****************************
            let eat = plExceptionalSet.eat;
            let exc_ebt = plExceptionalSet.ebt;
            let exc_totalTax = plExceptionalSet.totalTax;

            let eat_year_td = "";
            for (let i = 0; i < yearDuration; i++) {
                let year = startYear + i;

                let eat_start = 0;
                let eat_end = monthDuration;
                let eat_cumulative_month_td = "";
                let [eat_year_budget, eat_year_actual, eat_year_variance] = [0, 0, 0];
                eat[year] = {};
                for (let j = 0; j < monthType; j++) {
                    let split1 = dynamicMonthNames.slice(eat_start, eat_end);
                    let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                    let eat_month_td = "";
                    let [eat_CumulativeMonth_budget, eat_CumulativeMonth_actual, eat_CumulativeMonth_variance] = [0, 0, 0];
                    split1.map((month) => {
                        let monthNum = monthList[month];
                        if (eat.hasOwnProperty(year)) {
                            (eat[year][monthNum] == undefined) ? eat[year][monthNum] = { "budget": 0, "actual": 0 } : eat[year][monthNum] = eat[year][monthNum];
                            let eat_month_budget = (exc_ebt[year][monthNum].budget) + (exc_totalTax[year][monthNum].budget || 0);
                            let eat_month_actual = (exc_ebt[year][monthNum].actual) + (exc_totalTax[year][monthNum].actual || 0);
                            let eat_month_variance = eat_month_budget - eat_month_actual;


                            // Cumulative month total Calculation start
                            eat_CumulativeMonth_budget += eat_month_budget;
                            eat_CumulativeMonth_actual += eat_month_actual;
                            eat_CumulativeMonth_variance += eat_month_variance;
                            // Cumulative month total Calculation end

                            eat[year][monthNum].budget = eat_month_budget;
                            eat[year][monthNum].actual = eat_month_actual;
                            eat[year][monthNum].variance = eat_month_variance;


                            eat_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(eat_month_budget)}" style="font-weight:bold;">${INR(eat_month_budget)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column" value="${INR(eat_month_actual)}" style="font-weight:bold;">${INR(eat_month_actual)}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${INR(eat_month_variance)}" style="font-weight:bold;">${INR(eat_month_variance)}</td>`;
                        } else {
                            eat_month_td += `<td class="${year} ${monthColumnClass} budget numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} ${monthColumnClass} actual numbers mis_month_column ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} ${monthColumnClass} variance ${0} numbers mis_month_column" value="${0}" style="font-weight:bold;">${0}</td>`;
                        }
                    });


                    if (eat.hasOwnProperty(year)) {
                        eat_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(eat_CumulativeMonth_budget)}" style="font-weight:bold;">${INR(eat_CumulativeMonth_budget)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${INR(eat_CumulativeMonth_actual)}" style="font-weight:bold;">${INR(eat_CumulativeMonth_actual)}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${INR(eat_CumulativeMonth_variance)}" style="font-weight:bold;">${INR(eat_CumulativeMonth_variance)}</td>
                            ${eat_month_td}
                        `;
                    }
                    else {
                        eat_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column budget numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td><td class="${year} mis_cumulativeMonth_column actual numbers ${0}" value="${0}" style="font-weight:bold;">${0}</td><td class="${year} mis_cumulativeMonth_column variance ${0} numbers" value="${0}" style="font-weight:bold;">${0}</td>
                            ${eat_month_td}
                        `;
                    }

                    // Yearly total Calculation start
                    eat_year_budget += eat_CumulativeMonth_budget;
                    eat_year_actual += eat_CumulativeMonth_actual;
                    eat_year_variance += eat_CumulativeMonth_variance;
                    // Yearly total Calculation end


                    eat_start = eat_end;
                    eat_end = eat_end + monthDuration;

                }
                eat_year_td += `<td class="mis_year_column budget numbers" value="${INR(eat_year_budget)}" style="font-weight:bold;">${INR(eat_year_budget)}</td><td class="mis_year_column actual numbers ${0}" value="${INR(eat_year_actual)}" style="font-weight:bold;">${INR(eat_year_actual)}</td><td class="mis_year_column variance ${0} numbers" value="${INR(eat_year_variance)}" style="font-weight:bold;">${INR(eat_year_variance)}</td>
                    ${eat_cumulative_month_td}
                `;
            }

            // eat rows
            tableRows += `<tr class="alie">
                <td class='level1' id="eat"><i class="fa-solid fa-minus icon"></i></td>
                <td class="plAlie plHeading">EAT</td>
                ${eat_year_td}
            </tr>`;
            // ***************************** EAT Row creation end *****************************

            tableRow = tableRows;



            // ****************************** Balance Sheet creation start ******************************

            let balanceSheet = [
                {
                    "name": "Asset",
                    "classification": {

                    }
                },
                {
                    "name": "Liabilities",
                    "classification": {

                    }
                }
            ]

            let rejectedParticulars = []

            balanceSheet.map((ds) => {
                tbData1.map((tb) => {
                    if (tb.alie == ds.name) {
                        let cb = ((Number(tb.closingbalance)) / amountFormat); // / amountFormat) * -1
                        let fullYear = new Date(tb.fromdate).getFullYear();
                        let followingYear = (`${Number(fullYear) + 1}`).substring(2, 4);
                        let year = `${fullYear}`;
                        // let year = `${fullYear}-${followingYear}`;

                        if (exceptionalMonth.includes(tb.monthNo)) {
                            let fullYear_exception = Number(fullYear) - 1;
                            let followingYear_exception = (`${fullYear}`).substring(2, 4);
                            year = `${fullYear_exception}-${followingYear_exception}`;
                            year = `${fullYear_exception}`;
                        }

                        // ************************ ALIE Creation ************************
                        if (!ds.hasOwnProperty(year)) {
                            ds[year] = {};
                        }
                        if (tb.subhead != "Profit and Loss") {
                            ds[year][tb.monthNo] = (ds[year][tb.monthNo] || 0) + cb;
                        }

                        // ************************ Classification Creation ************************
                        if (!(ds.classification.hasOwnProperty(tb.classification))) {
                            ds.classification[tb.classification] = {};
                        }
                        let cls = ds.classification[tb.classification];
                        if (!cls.hasOwnProperty(year)) {
                            cls[year] = {};
                        }
                        if (tb.subhead != "Profit and Loss") {
                            cls[year][tb.monthNo] = (cls[year][tb.monthNo] || 0) + cb;
                        }

                        // ************************ Head Creation ************************
                        if (!(cls.hasOwnProperty(tb.head))) {
                            ds.classification[tb.classification][tb.head] = {};
                        }
                        let head = cls[tb.head];
                        if (!head.hasOwnProperty(year)) {
                            head[year] = {};
                        }
                        if (tb.subhead != "Profit and Loss") {
                            head[year][tb.monthNo] = (head[year][tb.monthNo] || 0) + cb;
                        }
                        // ************************ SubHead Creation ************************
                        if (!(head.hasOwnProperty(tb.subhead))) {
                            ds.classification[tb.classification][tb.head][tb.subhead] = {};
                        }
                        let subhead = head[tb.subhead];
                        if (!subhead.hasOwnProperty(year)) {
                            subhead[year] = {};
                        }
                        if (tb.subhead != "Profit and Loss") {
                            subhead[year][tb.monthNo] = (subhead[year][tb.monthNo] || 0) + cb;
                        }
                        // ************************ Particulars Creation ************************
                        if (!(subhead.hasOwnProperty(tb.particulars))) {
                            ds.classification[tb.classification][tb.head][tb.subhead][tb.particulars] = {};
                        }
                        let particulars = subhead[tb.particulars];
                        if (!particulars.hasOwnProperty(year)) {
                            particulars[year] = {};
                        }
                        if (tb.subhead == "Profit and Loss") {
                            rejectedParticulars.push(tb.particulars)
                        }
                        particulars[year][tb.monthNo] = (particulars[year][tb.monthNo] || 0) + cb;
                    }
                });
            });

            // return balanceSheet;

            for (let i = 0; i < yearDuration; i++) {
                let year = startYear + i;

                if (balanceSheet[1]['classification']['Equity and Shareholders funds'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']) {
                    let openingPandL = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'] = {};
                    openingPandL[year] = {};

                    let eat = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'] = {};
                    eat[year] = {};

                    let closingPandL = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'] = {};
                    closingPandL[year] = {};

                }
            }


            let uniqueParticulars = Array.from(new Set(rejectedParticulars));

            if (balanceSheet[1]['classification']['Equity and Shareholders funds'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'] && balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']) {
                for (let i = 0; i < yearDuration; i++) {
                    let year = startYear + i;
                    let PandL = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'];
                    let opening_PandL = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'];
                    let closing_PandL = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'];
                    let eat = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'];

                    // console.log(PandL,opening_PandL,closing_PandL,eat)


                    if (PandL[year] == undefined) { PandL[year] = {} }
                    if (opening_PandL[year] == undefined) { opening_PandL[year] = {} }
                    if (closing_PandL[year] == undefined) { closing_PandL[year] = {} }
                    if (eat[year] == undefined) { eat[year] = {} }
                    if (balanceSheet[1][year] == undefined) { balanceSheet[1][year] = {} }
                    if (balanceSheet[1]['classification']['Equity and Shareholders funds'][year] == undefined) { balanceSheet[1]['classification']['Equity and Shareholders funds'][year] = {} }
                    if (balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][year] == undefined) { balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][year] = {} }



                    dynamicMonthColumns.map((monthNum) => {
                        if (monthNum.data != "name") {
                            let uniqueParticulars_total = 0;
                            uniqueParticulars.map((item) => {
                                if (PandL[item][year] == undefined) { PandL[item][year] = {} };
                                if (PandL[item][year][monthNum.data] == undefined) { PandL[item][year][monthNum.data] = 0 };
                                uniqueParticulars_total += PandL[item][year][monthNum.data];
                                // uniqueParticulars_total += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][item][year][monthNum.data] || 0
                            })

                            if (opening_PandL[year][monthNum.data] == undefined) { opening_PandL[year][monthNum.data] = 0 }
                            if (closing_PandL[year][monthNum.data] == undefined) { closing_PandL[year][monthNum.data] = 0 }
                            if (eat[year][monthNum.data] == undefined) { eat[year][monthNum.data] = 0 }
                            if (balanceSheet[1][year][monthNum.data] == undefined) { balanceSheet[1][year][monthNum.data] = 0 }
                            if (balanceSheet[1]['classification']['Equity and Shareholders funds'][year][monthNum.data] == undefined) { balanceSheet[1]['classification']['Equity and Shareholders funds'][year][monthNum.data] = 0 }
                            if (balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][year][monthNum.data] == undefined) { balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][year][monthNum.data] = 0 }

                            if (!balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][year][monthNum.data]) {
                                balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][year][monthNum.data] = uniqueParticulars_total;
                            }

                            balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'][year][monthNum.data] = ((plExceptionalSet['eat'][year][monthNum.data]['actual']) * -1)
                            balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][year][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][year][monthNum.data] + balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['EAT'][year][monthNum.data]

                            if (Number(monthNum.data) + 1 != 13 && Number(monthNum.data) + 1 != 4) {
                                balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Opening P&L'][year][Number(monthNum.data) + 1] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][year][monthNum.data]
                            }

                            balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][year][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][year][monthNum.data]
                            balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus'][year][monthNum.data] = balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][year][monthNum.data]
                            balanceSheet[1]['classification']['Equity and Shareholders funds'][year][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][year][monthNum.data]
                            balanceSheet[1][year][monthNum.data] += balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss']['Closing P&L'][year][monthNum.data]
                        }
                    });
                }
            }

            // return (balanceSheet);

            uniqueParticulars.map((item) => {
                delete balanceSheet[1]['classification']['Equity and Shareholders funds']['Reserves and surplus']['Profit and Loss'][item]
            })


            let tableRows_bs = "";
            balanceSheet.map((ds) => {
                // *********************** ALIE Row creation start ***********************

                let year_td = "";
                for (let i = 0; i < yearDuration; i++) {
                    let year = startYear + i;
                    rejectedKeys.push(year.toString())
                    let year1 = startYear + i;
                    let ey = (year1 + 1).toString().substring(2, 4)
                    let yearHead = `${year1}-${ey}`

                    let alie_start = 0;
                    let alie_end = monthDuration;
                    let cumulative_month_td = "";
                    // ds[year] = {};
                    let alie_year = 0;
                    for (let j = 0; j < monthType; j++) {
                        let split1 = dynamicMonthNames.slice(alie_start, alie_end);
                        let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                        let month_td = "";
                        let alie_CumulativeMonth = 0;
                        split1.map((month) => {
                            let monthNum = monthList[month];
                            if (ds.hasOwnProperty(year)) {
                                (ds[year][monthNum] == undefined) ? ds[year][monthNum] = 0 : ds[year][monthNum] = ds[year][monthNum];
                                let alie_month = ds[year][monthNum];

                                // Cumulative month total Calculation start
                                alie_CumulativeMonth += alie_month;
                                // Cumulative month total Calculation end

                                month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(alie_month)}" style="font-weight:bold;">${INR(alie_month)}</td>`;
                            } else {
                                month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>`;
                            }
                        });

                        if (ds.hasOwnProperty(year)) {
                            cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(alie_CumulativeMonth)}" style="font-weight:bold;">${INR(alie_CumulativeMonth)}</td>
                                ${month_td}
                            `;
                        }
                        else {
                            cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>
                                    ${month_td}
                                `;
                        }


                        // Yearly total Calculation start
                        alie_year += alie_CumulativeMonth;
                        // Yearly total Calculation end


                        alie_start = alie_end;
                        alie_end = alie_end + monthDuration;

                    }
                    year_td += `<td class="mis_year_column numbers" value="${INR(alie_year)}" style="font-weight:bold;">${INR(alie_year)}</td>
                        ${cumulative_month_td}
                    `;
                }
                let level1Format_alie = (ds.name).replaceAll("'", "");
                let groupClass_alie = (level1Format_alie).replaceAll(" ", "_");



                // ALIE rows
                tableRows_bs += `<tr class="alie">
                        <td class="level1" id='${groupClass_alie}'><i class="fa-solid fa-minus icon"></i></td>
                        <td class="plHeading">${ds.name}</td>
                        ${year_td}
                    </tr>`;

                // *********************** ALIE Row creation end ***********************


                // *********************** Classification Row creation start ***********************
                for (let classKey in ds.classification) {
                    let cls = ds.classification[classKey];

                    let cls_year_td = "";
                    for (let i = 0; i < yearDuration; i++) {
                        let year = startYear + i;

                        let cls_start = 0;
                        let cls_end = monthDuration;
                        let cls_cumulative_month_td = "";

                        let cls_year = 0;
                        for (let j = 0; j < monthType; j++) {
                            let split1 = dynamicMonthNames.slice(cls_start, cls_end);
                            let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                            let cls_month_td = "";
                            let cls_CumulativeMonth = 0;
                            split1.map((month) => {
                                let monthNum = monthList[month];
                                if (cls.hasOwnProperty(year)) {
                                    (cls[year][monthNum] == undefined) ? cls[year][monthNum] = 0 : ds[year][monthNum] = ds[year][monthNum];
                                    let cls_month = cls[year][monthNum];

                                    // Cumulative month total Calculation start
                                    cls_CumulativeMonth += cls_month;
                                    // Cumulative month total Calculation end

                                    cls_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(cls_month)}" style="font-weight:bold;">${INR(cls_month)}</td>`;
                                } else {
                                    cls_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>`;
                                }
                            });

                            if (ds.hasOwnProperty(year)) {
                                cls_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(cls_CumulativeMonth)}" style="font-weight:bold;">${INR(cls_CumulativeMonth)}</td>
                                    ${cls_month_td}
                                `;
                            }
                            else {
                                cls_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>
                                    ${cls_month_td}
                                `;
                            }

                            // Yearly total Calculation start
                            cls_year += cls_CumulativeMonth;
                            // Yearly total Calculation end


                            cls_start = cls_end;
                            cls_end = cls_end + monthDuration;

                        }
                        cls_year_td += `<td class="mis_year_column numbers" value="${INR(cls_year)}" style="font-weight:bold;">${INR(cls_year)}</td>
                                ${cls_cumulative_month_td}
                            `;
                    }

                    // Classification rows
                    let level1Format_classification = (classKey).replaceAll("'", "");
                    let groupClass_classification = (level1Format_classification).replaceAll(" ", "_");
                    tableRows_bs += `<tr class="classification ${groupClass_alie}">
                            <td class='level2' id="${groupClass_classification}"><i class="fa-solid fa-minus icon"></i></td>
                            <td class="plClassify plHeading">${classKey}</td>
                            ${cls_year_td}
                        </tr>`;
                    // *********************** Classification Row creation end ***********************

                    // *********************** Head Row creation start ***********************
                    for (let headKey in cls) {

                        if (!(rejectedKeys.includes(headKey))) {

                            let head = cls[headKey];
                            let head_year_td = "";
                            for (let i = 0; i < yearDuration; i++) {
                                let year = startYear + i;

                                let head_start = 0;
                                let head_end = monthDuration;
                                let head_cumulative_month_td = "";

                                let head_year = 0;
                                for (let j = 0; j < monthType; j++) {
                                    let split1 = dynamicMonthNames.slice(head_start, head_end);
                                    let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                    let head_month_td = "";
                                    let head_CumulativeMonth = 0;
                                    split1.map((month) => {
                                        let monthNum = monthList[month];
                                        if (head.hasOwnProperty(year)) {
                                            (head[year][monthNum] == undefined) ? head[year][monthNum] = 0 : ds[year][monthNum] = ds[year][monthNum];
                                            let head_month = head[year][monthNum];

                                            // Cumulative month total Calculation start
                                            head_CumulativeMonth += head_month;
                                            // Cumulative month total Calculation end

                                            head_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(head_month)}" style="font-weight:bold;">${INR(head_month)}</td>`;
                                        } else {
                                            head_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>`;
                                        }
                                    });

                                    if (ds.hasOwnProperty(year)) {
                                        head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(head_CumulativeMonth)}" style="font-weight:bold;">${INR(head_CumulativeMonth)}</td>
                                            ${head_month_td}
                                        `;
                                    }
                                    else {
                                        head_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>
                                            ${head_month_td}
                                        `;
                                    }

                                    // Yearly total Calculation start
                                    head_year += head_CumulativeMonth;
                                    // Yearly total Calculation end


                                    head_start = head_end;
                                    head_end = head_end + monthDuration;

                                }
                                head_year_td += `<td class="mis_year_column numbers" value="${INR(head_year)}" style="font-weight:bold;">${INR(head_year)}</td>
                                        ${head_cumulative_month_td}
                                    `;
                            }
                            // Head rows
                            let level1Format_head = (headKey).replaceAll("'", "");
                            let groupClass_head = (level1Format_head).replaceAll(" ", "_");
                            tableRows_bs += `<tr class="head ${groupClass_alie} ${groupClass_classification}">
                                <td class='level3' id="${groupClass_head}"><i class="fa-solid fa-minus icon"></i></td><td class="plClassify plHeading">${headKey}</td>
                                ${head_year_td}
                                </tr>`;
                            // *********************** Head Row creation end ***********************


                            // *********************** SubHead Row creation start ***********************
                            for (let subheadKey in head) {
                                if (!(rejectedKeys.includes(subheadKey))) {

                                    let subhead = head[subheadKey];
                                    let subhead_year_td = "";
                                    for (let i = 0; i < yearDuration; i++) {
                                        let year = startYear + i;

                                        let subhead_start = 0;
                                        let subhead_end = monthDuration;
                                        let subhead_cumulative_month_td = "";

                                        let subhead_year = 0;
                                        for (let j = 0; j < monthType; j++) {
                                            let split1 = dynamicMonthNames.slice(subhead_start, subhead_end);
                                            let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                            let subhead_month_td = "";
                                            let subhead_CumulativeMonth = 0;
                                            split1.map((month) => {
                                                let monthNum = monthList[month];
                                                if (subhead.hasOwnProperty(year)) {
                                                    (subhead[year][monthNum] == undefined) ? subhead[year][monthNum] = 0 : ds[year][monthNum] = ds[year][monthNum];
                                                    let subhead_month = subhead[year][monthNum];

                                                    // Cumulative month total Calculation start
                                                    subhead_CumulativeMonth += subhead_month;
                                                    // Cumulative month total Calculation end

                                                    subhead_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(subhead_month)}" style="font-weight:bold;">${INR(subhead_month)}</td>`;
                                                } else {
                                                    subhead_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>`;
                                                }
                                            });

                                            if (ds.hasOwnProperty(year)) {
                                                subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(subhead_CumulativeMonth)}" style="font-weight:bold;">${INR(subhead_CumulativeMonth)}</td>
                                                    ${subhead_month_td}
                                                `;
                                            }
                                            else {
                                                subhead_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>
                                                    ${subhead_month_td}
                                                `;
                                            }

                                            // Yearly total Calculation start
                                            subhead_year += subhead_CumulativeMonth;
                                            // Yearly total Calculation end


                                            subhead_start = subhead_end;
                                            subhead_end = subhead_end + monthDuration;

                                        }
                                        subhead_year_td += `<td class="mis_year_column numbers" value="${INR(subhead_year)}" style="font-weight:bold;">${INR(subhead_year)}</td>
                                            ${subhead_cumulative_month_td}
                                        `;
                                    }

                                    // SubHead rows
                                    let level1Format_subhead = (subheadKey).replaceAll("'", "");
                                    let groupClass_subhead = (level1Format_subhead).replaceAll(" ", "_");
                                    tableRows_bs += `<tr class="subhead ${groupClass_alie} ${groupClass_classification} ${groupClass_head}"><td class='level4' id="${groupClass_subhead}"><i class="fa-solid fa-minus icon"></i></td>
                                            <td class="plHeading">${subheadKey}</td>
                                            ${subhead_year_td}
                                        </tr>`;

                                    // *********************************** Particulars start ***********************************
                                    for (let particularsKey in subhead) {
                                        if (!(rejectedKeys.includes(particularsKey))) {

                                            let particulars = subhead[particularsKey];
                                            let particulars_year_td = "";
                                            for (let i = 0; i < yearDuration; i++) {
                                                let year = startYear + i;

                                                let particulars_start = 0;
                                                let particulars_end = monthDuration;
                                                let particulars_cumulative_month_td = "";

                                                let particulars_year = 0;
                                                for (let j = 0; j < monthType; j++) {
                                                    let split1 = dynamicMonthNames.slice(particulars_start, particulars_end);
                                                    let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;

                                                    let particulars_month_td = "";
                                                    let particulars_CumulativeMonth = 0;
                                                    split1.map((month) => {
                                                        let monthNum = monthList[month];
                                                        if (particulars.hasOwnProperty(year)) {
                                                            (particulars[year][monthNum] == undefined) ? particulars[year][monthNum] = 0 : ds[year][monthNum] = ds[year][monthNum];
                                                            let particulars_month = particulars[year][monthNum];


                                                            // Cumulative month total Calculation start
                                                            particulars_CumulativeMonth += particulars_month;
                                                            // Cumulative month total Calculation end

                                                            particulars_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(particulars_month)}" style="font-weight:bold;">${INR(particulars_month)}</td>`;
                                                        } else {
                                                            particulars_month_td += `<td class="${year} ${monthColumnClass} numbers mis_month_column" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>`;
                                                        }
                                                    });

                                                    if (ds.hasOwnProperty(year)) {
                                                        particulars_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(particulars_CumulativeMonth)}" style="font-weight:bold;">${INR(particulars_CumulativeMonth)}</td>
                                                            ${particulars_month_td}
                                                        `;
                                                    }
                                                    else {
                                                        particulars_cumulative_month_td += `<td class="${year} mis_cumulativeMonth_column numbers" value="${INR(0)}" style="font-weight:bold;">${INR(0)}</td>
                                                                ${particulars_month_td}
                                                            `;
                                                    }

                                                    // Yearly total Calculation start
                                                    particulars_year += particulars_CumulativeMonth;
                                                    // Yearly total Calculation end


                                                    particulars_start = particulars_end;
                                                    particulars_end = particulars_end + monthDuration;

                                                }
                                                particulars_year_td += `<td class="mis_year_column numbers" value="${INR(particulars_year)}" style="font-weight:bold;">${INR(particulars_year)}</td>
                                                        ${particulars_cumulative_month_td}
                                                    `;
                                            }
                                            // Particulars rows
                                            let level1Format_particulars = (particularsKey).replaceAll("'", "");
                                            let groupClass_particulars = (level1Format_particulars).replaceAll(" ", "_");
                                            tableRows_bs += `<tr class="particulars ${groupClass_alie} ${groupClass_classification} ${groupClass_head} ${groupClass_subhead}"><td class='level5' id="${groupClass_particulars}"></td>
                                                    <td class="plHeading">${particularsKey}</td>
                                                    ${particulars_year_td}
                                                </tr>`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            tableRow_bs = tableRows_bs;
            // ****************************** Balance Sheet creation end ******************************

        }

        let mis_thead_items = "<th class='particulars' colspan='2' rowspan='2'>Particulars</th>";
        let bs_thead_items = "<th class='particulars' colspan='2' rowspan='2'>Particulars</th>";
        let mis_thead_bav = "";


        for (let i = 0; i < yearDuration; i++) {
            let year = startYear + i;
            let year1 = startYear + i;
            let ey = (year1 + 1).toString().substring(2, 4)
            let yearHead = `${year1}-${ey}`

            // <th class="budget">B</th><th class="actual">A</th><th class="variance">V</th>

            mis_thead_items += `<th class="mis_year_column head" colspan="3">${yearHead} <button value="${year}" type="year">-</button></th>`;
            mis_thead_bav += `<th class="budget mis_year_column">B</th><th class="actual mis_year_column">A</th><th class="variance mis_year_column">V</th>`;
            bs_thead_items += `<th class="mis_year_column head">${yearHead} <button value="${year}" type="year">-</button></th>`;

            let start = 0;
            let end = monthDuration;


            for (let j = 0; j < monthType; j++) {
                let split1 = dynamicMonthNames.slice(start, end);
                let monthColumnName = `${split1[0]}-${split1[split1.length - 1]}`;
                let monthColumnClass = `${year}${split1[0]}-${split1[split1.length - 1]}`;
                mis_thead_items += `<th class="${year} mis_cumulativeMonth_column head" colspan="3">${monthColumnName} <button value="${monthColumnClass}" type="month">+</button></th>`;
                mis_thead_bav += `<th class="budget ${year} mis_cumulativeMonth_column">B</th><th class="actual ${year} mis_cumulativeMonth_column">A</th><th class="variance ${year} mis_cumulativeMonth_column">V</th>`;
                bs_thead_items += `<th class="${year} mis_cumulativeMonth_column head">${monthColumnName} <button value="${monthColumnClass}" type="month">+</button></th>`;

                split1.map((month) => {

                    mis_thead_items += `<th class="${year} ${monthColumnClass} head mis_month_column" colspan="3">${month}</th>`;
                    mis_thead_bav += `<th class="mis_month_column budget ${year} ${monthColumnClass}">B</th><th class="mis_month_column actual ${year} ${monthColumnClass}">A</th><th class="mis_month_column variance ${year} ${monthColumnClass}">V</th>`;
                    bs_thead_items += `<th class="${year} ${monthColumnClass} head mis_month_column">${month}</th>`;
                });

                start = end;
                end = end + monthDuration;
            }
        }


        let misTemplate = `
            <table class="table" id="misTable">
                <thead>
                    <tr>
                        ${mis_thead_items}
                    </tr>
                    <tr>
                        ${mis_thead_bav}
                    </tr>
                </thead>

                <tbody>
                    ${tableRow}
                </tbody>
            </table>
        `;



        let bsTemplate = `
            <table class="table" id="bsTable">
                <thead>
                    <tr>
                        ${bs_thead_items}
                    </tr>
                </thead>

                <tbody>
                    ${tableRow_bs}
                </tbody>
            </table>
        `;


        return {
            "mis": misTemplate,
            "bs": bsTemplate
        }


    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}




async function pfFunTotalCheck(companyid, startYear, endYear) {

    let getTb = await fetchTable(`select closingbalance from tbl_tallyprime_trialbalances where companyid='${companyid}'`)
    let total = 0;
    getTb.map((item) => {
        total += Number(item.closingbalance)
    })
    return total;
}

async function pendingCoaCount({ companyid }) {
    try {
        let topbarClient = companyid;
        if (topbarClient != "") {

            let tallyLedgerMaster = await fetchTable(`SELECT * FROM coa_mapped WHERE companyid='${topbarClient}'`);


            let tbData = await fetchTable(`SELECT * FROM dbo.fnfetchUniqueCoa('${topbarClient}')`);



            // let data = {
            //     "companyId": topbarClient
            // }
            // let tbData = await workPaper(data, "feUniqCoa");

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

            return pendingCoaCount;
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }

}

async function voucherData({ company, year, ledger, month }) {
    try {
        let queryTransaction = await fetchTable(`SELECT * FROM dbo.fnFetchTransaction('${company}','${year}','${ledger}','${month}')`);
        return queryTransaction
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

module.exports = { fetchCompanyGroup, misTable, adv_misTable, pendingCoaCount, voucherData }