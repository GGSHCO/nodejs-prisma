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
    catch(e){
        return { error: true, message: error.message, details: error };
    }
}






module.exports={getAllProjects,updateProjects}