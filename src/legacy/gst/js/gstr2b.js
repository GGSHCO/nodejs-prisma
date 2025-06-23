const { fetchTable, exeQuery, fetchOptions, INR } = require("../../config");

const getGstin = async (params) => {
    try {
        let res = await fetchOptions(`select gstin from SYF_GSTMASTER where companyid='${params.companyid}'`, 'gstin', 'gstin')
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

const getGstr2bData = async (params) => {
    try {
        let year = params.filter
        let filter = []
        year.map((item) => {
            filter.push(`gstR2BMONTH in (${item.months.join(',')}) and gstR2BYEAR='${item.year}'`)
        })
        filter = filter.join(' or ')
        let b2b = await fetchTable(`select invDate,gstin,invno,invvalue,taxableval,rate,sgst,cgst,igst,suppliername,
            dateoffiling,supplierperiod,invoicetype,placeofsupply,revcharge,itcavl,reason,source,irn,irndate
             from gstr2b where companyid='${params.companyid}' and companygstin='${params.gstin}' and (${filter})`)
        let b2ba = await fetchTable(`select invoicedate,originvoicedate,invoicevalue,invoicenumber,originvoicenumber,tradename,suppliergstin,sgst,cgst,igst,cess,
            type,revcharge,itcavl,reason,supplyfilingdate,supplyperiod,placeofsupply,taxablevalue,rate
             from gstr2ba where companyid='${params.companyid}' and companygstin='${params.gstin}' and (${filter})`)
        let cdnr = await fetchTable(`select notedate,notevalue,notenumber,tradename,suppliergstin,sgst,cgst,igst,cess,
            notesupplytype,irn,srctype,irngendate,rate,notetype,revcharge,itcavl,reason,supplyfilingdate,supplyperiod,placeofsupply,taxablevalue
             from gstr2b_cdnr where companyid='${params.companyid}' and companygstin='${params.gstin}' and (${filter})`)
        let impg = await fetchTable(`select referencedate,billentrydate,portcode,billnumber,taxablevalue,igst,cess,
            isamended
             from gstr2b_impg where companyid='${params.companyid}' and companygstin='${params.gstin}' and (${filter})`)
        let impgsez = await fetchTable(`select referencedate,billentrydate,portcode,billnumber,taxablevalue,igst,cess,
            isamended,tradename,suppliergstin
             from gstr2b_impgsez where companyid='${params.companyid}' and companygstin='${params.gstin}' and (${filter})`)
        return {
            'B2B':b2b,'B2BA':b2ba,'CDNR':cdnr,'IMPG':impg,'IMPGSEZ':impgsez
        }
    }
    catch (error) {
        console.log(error)
        return { error: true, message: error.message, details: error };
    }
}

module.exports = { getGstin, getGstr2bData }
