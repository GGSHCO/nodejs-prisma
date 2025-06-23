const { fetchTable, queryGet, fetchOptions, exeQuery } = require('../../config')

async function saveSop({ data }) {
    try {
        let res = await exeQuery(`INSERT INTO SOPTable(HEAD,HEADSEQUENCE,
            SUBHEAD,SUBHEADSEQUENCE,CONTENTHEAD,CONTENTHEADSEQUENCE,CONTENT,ADDEDUSER,
            ADDEDTIME) VALUES('${data.sophead}','${data.sopheadSequence}','${data.sopsubhead}',
            '${data.sopsubheadSequence}','${data.contenthead}','${data.contentHeadSequence}','${data.htmlContent}',
            '${data.loginUserName}','${data.addedTime}')`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function updateSop({ data }) {
    try {
        let res = await exeQuery(`UPDATE  SOPTable SET 
            HEAD='${data.sophead}',HEADSEQUENCE='${data.sopheadSequence}',
            SUBHEAD='${data.sopsubhead}',SUBHEADSEQUENCE='${data.sopsubheadSequence}',
            CONTENTHEAD='${data.contenthead}',CONTENTHEADSEQUENCE='${data.contentHeadSequence}',
            CONTENT='${data.htmlContent}',MODIFIEDUSER='${data.loginUserName}',MODIFIEDTIME='${data.addedTime}'
             WHERE LID='${data.decryptID}' `);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getSop({lid}){
    try{
        let res=await fetchTable(`select * from SOPTable where lid='${lid}'`)
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}


module.exports = { saveSop, updateSop,getSop }