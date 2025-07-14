const { fetchTable } = require('../../config')

async function getAllProjects(params){
    try {
        let res = await fetchTable(`select * from allProjects where companyid='${params.companyid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateProjects(params){
    try{
        let projectIds = []
        let query=[]
        params.projectCode.map((item) => { projectIds.push(`'${item.projectCode}'`) })
        let ids = projectIds.join(',')
        let projectQuery = `update allProjects set managerResponsible='${params.teamLead}', personResponsible1='${params.personResponsible1}',personResponsible2='${params.personResponsible2}',
    personResponsible3='${params.personResponsible3}',remarks='${params.remarks}' where projectCode in (${ids})`
        let project = Buffer.from(projectQuery).toString('base64');
        query.push(project)
        let invoiceQuery = `update allInvoices set remarks='${params.remarks}' where projectCode in (${ids})`
        let invoice = Buffer.from(invoiceQuery).toString('base64');
        query.push(invoice)
        let observation = `update allObservations set managerResponsible='${params.teamLead}', personResponsible1='${params.personResponsible1}',personResponsible2='${params.personResponsible2}',
    personResponsible3='${params.personResponsible3}',projectremarks='${params.remarks}' where projectCode in (${ids})`
        let ob = Buffer.from(observation).toString('base64');
        query.push(ob)
        let res=await queryGet(query)
        return res
    }
    catch(error){
        return { error: true, message: error.message, details: error };
    }
}

async function getClientProjects(params){
    console.log("params in getClientProjects", params);
    try{
        let res = await fetchTable(`select ap.*, ac.zohocontactid as contactid from allProjects ap
            join allcontracts ac on ap.contractid = ac.contractid
            where ap.contractid in (
            select contractid from allcontracts where zohocontactid in (
                select distinct c.contactid
                from zohocontacts c 
                join portal_clients pc on c.contactid = pc.zohocontactid 
                where pc.id in (
                select client_id from portal_usersPivot where user_id='${params.userid}'
                )
            ) and ap.companyid='${params.companyid}' and (ap.assignmentNature='120' or ap.assignmentNature='188')
            )`)
        // let res=await exeQuery(`select * from allProjects where contractid in 
        //     (select contractid from allcontracts where zohocontactid in (
        //                         select distinct c.contactid
        // from zohocontacts c 
        // join portal_clients pc on c.contactid = pc.zohocontactid 
        // where pc.id in 
        // (select client_id from portal_usersPivot where user_id='${params.userid}')
        // ) and companyid='${params.companyid}'
        // )`)
        // let query=`
        // SELECT 
        //         ap.*
        //     FROM 
        //         portal_usersPivot pup
        //     JOIN 
        //         portal_clients pc ON pup.client_id = pc.id
        //     JOIN 
        //         AllContracts ac ON pc.zohoContactId = ac.zohocontactID
        //     JOIN 
        //         AllProjects ap ON ac.contractID = ap.contractID
        //     WHERE 
        //         pup.user_id = '${params.userid}' and ac.companyid='${params.companyid}'
        // `;
        // console.log("Result from getClientProjects:", query);
        // let res = await fetchTable(query);
        // console.log("Result from getClientProjects:", res);
        return res

    }
    catch(error){
        return { error: true, message: error.message, details: error };
    }
}


// async function getClientContract(params) {
//     console.log("params in getClientContract", params);

//     try {
//         // Use parameterized queries to prevent SQL injection
//         const query = `
//             SELECT
//                 ac.contractID,
//                 an.assignmentName,
//                 can.assignmentNature AS assignmentLid
//             FROM
//                 AllContracts AS ac
//             LEFT JOIN
//                 ContractAssignmentNature AS can ON ac.contractID = can.contractID
//             LEFT JOIN
//                 AssignmentNature AS an ON can.assignmentNature = an.lid
//             WHERE
//                 ac.userid = ?
//         `;

//         // Assuming fetchTable supports parameterized queries
//         const res = await fetchTable(query, [params.user_lid]);

//         if (!res || res.length === 0) {
//             return { error: true, message: "No contract found for the user", details: null };
//         }

//         console.log("Result from single JOIN query:", res);
//         return res;

//     } catch (error) {
//         console.error("Error in getClientContract:", error);
//         return { error: true, message: error.message, details: error };
//     }
// }


async function getClientContract(params) {
    console.log("params in getClientContract", params);

    if (!params || !params.user_lid) {
        return { error: true, message: "Invalid or missing user_lid." };
    }

    try {
        // query = `
        // SELECT
        //     an.assignmentNature
        // FROM
        //     AllContracts ac
        // JOIN
        //     ContractAssignmentNature can ON ac.contractID = can.contractID
        // JOIN
        //     AssignmentNature an ON can.assignmentNature = an.lid
        // WHERE
        //     ac.userid = '${params.user_lid}'
        //     `;
        // query = `
        //     SELECT 
        //             ap.projectDescription, ap.contractID
        //         FROM 
        //             portal_usersPivot pup
        //         JOIN 
        //             portal_clients pc ON pup.client_id = pc.id
        //         JOIN 
        //             AllContracts ac ON pc.zohoContactId = ac.zohocontactID
        //         JOIN 
        //             AllProjects ap ON ac.contractID = ap.contractID
        //         WHERE 
        //             pup.user_id = '${params.user_lid}'
        // `;
        // query1=`select distinct c.contactid, c.contactname, pc.id as client_id 
        // from zohocontacts c 
        // join portal_clients pc on c.contactid = pc.zohocontactid 
        // where pc.id in (select client_id from portal_usersPivot where user_id='${params.user_lid}')`;
        query2=`SELECT DISTINCT
                    c.contactid,
                    c.contactname,
                    ac.contractID
                FROM
                    zohocontacts c
                JOIN
                    portal_clients pc ON c.contactid = pc.zohocontactid
                JOIN
                    portal_usersPivot pup ON pc.id = pup.client_id
                JOIN
                    AllContracts ac ON c.contactid = ac.zohoContactId
                WHERE
                    pup.user_id = '${params.user_lid}';
                `;

        console.log("Executing query:", query2);
        const results = await fetchTable(query2);
        console.log("Results from JOIN query:", results);

        // Check for the "no contracts at all" case
        if (!results || results.length === 0) {
            return { error: true, message: "No contracts found for this user." };
        }
        // let data=[]
        // const projectData = results.map((item) => {
        // // const formatted = {
        // //     "contractDescription": item.projectDescription,
        // //     "ContractId": item.contractID
        // // };
        // data.push(formatted);
        // return formatted;
        // });

        console.log("Processed results from JOIN query:", results);
        return results;

    } catch (error) {
        console.error("A critical error occurred in getClientContract:", error);
        return {
            error: true,
            message: "An unexpected error occurred while fetching contract data.",
            details: error
        };
    }
}

////////////////////////////////////////////////////
async function getProjectsWithContactInfo(params) {
    try {
        let query;

        if (params.role === 'team') {
            // This query is for the 'team' role - gets all projects
            query = `
                SELECT 
                    ap.*, 
                    ac.zohoContactId 
                FROM allProjects ap
                LEFT JOIN AllContracts ac ON ap.contractID = ac.contractID
                WHERE ap.companyid='${params.companyid}'
            `;
        } else if (params.role === 'client') {
            // This query is for the 'client' role - gets specific projects
            query = `
                SELECT 
                    ap.*,
                    ac.zohoContactId
                FROM 
                    allProjects ap
                INNER JOIN
                    AllContracts ac ON ap.contractID = ac.contractID
                WHERE 
                    ac.zohocontactid IN (
                        SELECT DISTINCT c.contactid
                        FROM zohocontacts c 
                        JOIN portal_clients pc ON c.contactid = pc.zohocontactid 
                        WHERE pc.id IN (
                            SELECT client_id FROM portal_usersPivot WHERE user_id='${params.userid}'
                        )
                    ) 
                    AND ap.companyid='${params.companyid}'
            `;
        } else {
            // If role is not provided, return an empty array
            return [];
        }

        let res = await fetchTable(query);
        return res;

    } catch (error) {
        console.error("Error in getProjectsWithContactInfo:", error);
        return { error: true, message: error.message, details: error };
    }
}




module.exports={getAllProjects,updateProjects,getClientProjects, getClientContract , getProjectsWithContactInfo}