const { fetchTable, exeQuery, dateTimeGeneration } = require("../../config");

const fetchKpiMaster = async (params) => {
    try {
        let kpi = await fetchTable(`select * from kpimaster where companyid='${params.companyid}'`);
        return kpi

    } catch (error) {
        return { error: error }
    }
}


const insertKpiMaster = async (data) => {
    try {
        let params = { "json": {} }
        params["user"] = data.user;
        params["type"] = data.type;
        params["companyid"] = data.companyid;
        params["companyname"] = data.companyname;
        (data.json.hasOwnProperty("dimension")) ? params["json"]["dimension"] = data.json.dimension.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("department")) ? params["json"]["department"] = data.json.department.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("theme")) ? params["json"]["theme"] = data.json.theme.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("goal")) ? params["json"]["goal"] = data.json.goal.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("kpi")) ? params["json"]["kpi"] = data.json.kpi.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("subkpi")) ? params["json"]["subkpi"] = data.json.subkpi.replaceAll("'", "''") : 1;


        let addedTime = dateTimeGeneration(new Date());
        let query;
        if (params.type == "dimension") {
            query = `insert into kpimaster 
            (dimension,functiondep,theme,goals,kpi,addedUser,addedTime,companyid,companyname) values 
            ('dimension_${addedTime}','department_${addedTime}','theme_${addedTime}','goal_${addedTime}','kpi_${addedTime}','${params.user}','${addedTime}','${params.companyid}','${params.companyname}')`;
        } else if (params.type == "department") {
            query = `insert into kpimaster 
            (dimension,functiondep,theme,goals,kpi,addedUser,addedTime,companyid,companyname) values 
            ('${params["json"]["dimension"]}','department_${addedTime}','theme_${addedTime}','goal_${addedTime}','kpi_${addedTime}','${params.user}','${addedTime}','${params.companyid}','${params.companyname}')`;
        } else if (params.type == "theme") {
            query = `insert into kpimaster 
            (dimension,functiondep,theme,goals,kpi,addedUser,addedTime,companyid,companyname) values 
            ('${params["json"]["dimension"]}','${params["json"]["department"]}','theme_${addedTime}','goal_${addedTime}','kpi_${addedTime}','${params.user}','${addedTime}','${params.companyid}','${params.companyname}')`;
        } else if (params.type == "goal") {
            query = `insert into kpimaster 
            (dimension,functiondep,theme,goals,kpi,addedUser,addedTime,companyid,companyname) values 
            ('${params["json"]["dimension"]}','${params["json"]["department"]}','${params["json"]["theme"]}','goal_${addedTime}','kpi_${addedTime}','${params.user}','${addedTime}','${params.companyid}','${params.companyname}')`;
        } else if (params.type == "kpi") {
            query = `insert into kpimaster 
            (dimension,functiondep,theme,goals,kpi,addedUser,addedTime,companyid,companyname) values 
            ('${params["json"]["dimension"]}','${params["json"]["department"]}','${params["json"]["theme"]}','${params["json"]["goal"]}','kpi_${addedTime}','${params.user}','${addedTime}','${params.companyid}','${params.companyname}')`;
        } else if (params.type == "subkpi") {
            query = `insert into kpimaster 
            (dimension,functiondep,theme,goals,kpi,subkpi,addedUser,addedTime,companyid,companyname) values 
            ('${params["json"]["dimension"]}','${params["json"]["department"]}','${params["json"]["theme"]}','${params["json"]["goal"]}','${params["json"]["kpi"]}','subkpi_${addedTime}','${params.user}','${addedTime}','${params.companyid}','${params.companyname}')`;
        }

        // else if (params.type == "kpi") {
        //     query = `update kpimaster set kpi='${params.value}' where kpi='${params.json.kpi}' and goals='${params.json.goal}'and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        // } else if (params.type == "subkpi") {
        //     query = `update kpimaster set subkpi='${params.value}' where subkpi='${params.json.subkpi}' and kpi='${params.json.kpi}' and goals='${params.json.goal}'and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        // }

        // let getKpi = await fetchTable(`select * from kpimaster where companyid='${params.companyid}' and dimension='${params.companyid}' and goal='${params.companyid}'`);
        // let kpi = await exeQuery(`select * from kpimaster where companyid='${params.companyid}'`);
        // return kpi

        let insertKpi = await exeQuery(query);
        return insertKpi

    } catch (error) {
        return { "error": error }
    }
}

const updateKpiMaster = async (data) => {
    try {
        let params = { "json": {} }
        params["type"] = data.type;
        params["value"] = data.value.replaceAll("'", "''");
        params["companyid"] = data.companyid;
        (data.json.hasOwnProperty("dimension")) ? params["json"]["dimension"] = data.json.dimension.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("department")) ? params["json"]["department"] = data.json.department.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("theme")) ? params["json"]["theme"] = data.json.theme.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("goal")) ? params["json"]["goal"] = data.json.goal.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("kpi")) ? params["json"]["kpi"] = data.json.kpi.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("subkpi")) ? params["json"]["subkpi"] = data.json.subkpi.replaceAll("'", "''") : 1;


        let query;
        if (params.type == "dimension") {
            query = `update kpimaster set dimension='${params.value}' where dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "department") {
            query = `update kpimaster set functiondep='${params.value}' where functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "theme") {
            query = `update kpimaster set theme='${params.value}' where theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "goal") {
            query = `update kpimaster set goals='${params.value}' where goals='${params.json.goal}' and theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "kpi") {
            query = `update kpimaster set kpi='${params.value}' where kpi='${params.json.kpi}' and goals='${params.json.goal}' and theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "subkpi") {
            query = `update kpimaster set subkpi='${params.value}' where subkpi='${params.json.subkpi}' and kpi='${params.json.kpi}' and goals='${params.json.goal}' and theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        }

        // let getKpi = await fetchTable(`select * from kpimaster where companyid='${params.companyid}' and dimension='${params.companyid}' and goal='${params.companyid}'`);
        let updateKpi = await exeQuery(query);
        return updateKpi

    } catch (error) {
        return { "error": error }
    }
}

const deleteKpiMaster =  async (data) => {
    try {
        let params = { "json": {} }
        params["type"] = data.type;
        params["companyid"] = data.companyid;
        (data.json.hasOwnProperty("dimension")) ? params["json"]["dimension"] = data.json.dimension.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("department")) ? params["json"]["department"] = data.json.department.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("theme")) ? params["json"]["theme"] = data.json.theme.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("goal")) ? params["json"]["goal"] = data.json.goal.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("kpi")) ? params["json"]["kpi"] = data.json.kpi.replaceAll("'", "''") : 1;
        (data.json.hasOwnProperty("subkpi")) ? params["json"]["subkpi"] = data.json.subkpi.replaceAll("'", "''") : 1;

        let query;
        if (params.type == "dimension") {
            query = `delete from kpimaster where dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "department") {
            query = `delete from kpimaster where functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "theme") {
            query = `delete from kpimaster where theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "goal") {
            query = `delete from kpimaster  where goals='${params.json.goal}' and theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "kpi") {
            query = `delete from kpimaster where kpi='${params.json.kpi}' and goals='${params.json.goal}' and theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        } else if (params.type == "subkpi") {
            query = `delete from kpimaster where subkpi='${params.json.subkpi}' and kpi='${params.json.kpi}' and goals='${params.json.goal}' and theme='${params.json.theme}' and functiondep='${params.json.department}' and dimension='${params.json.dimension}' and companyid='${params.companyid}'`;
        }
        // let getKpi = await fetchTable(`select * from kpimaster where companyid='${params.companyid}' and dimension='${params.companyid}' and goal='${params.companyid}'`);
        let updateKpi = await exeQuery(query);
        return updateKpi

    } catch (error) {
        return { "error": error }
    }
}

module.exports = { fetchKpiMaster, insertKpiMaster, updateKpiMaster,deleteKpiMaster }

