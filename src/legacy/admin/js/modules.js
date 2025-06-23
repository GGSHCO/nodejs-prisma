const { fetchTable, exeQuery, fetchOptions, queryGet, INR, dateTimeGeneration } = require('../../config')

async function fetchModules() {

    try {
        let modules = await fetchTable(`select * from SYF_MODULEMASTER`)
        // return modules;
        if (modules.length == 0) {
            let addedTime = dateTimeGeneration(new Date());
            let category = `Category - ${addedTime}`;
            let subCategory = `Sub Category - ${addedTime}`;
            let moduleName = `Module - ${addedTime}`;

            await insertEmptyModule({ category, subCategory, moduleName, addedTime });
        }
        else {

            let categoryList = []
            modules.map((module) => {
                categoryList.push(module.category)
            });

            let uniqueCategory = Array.from(new Set(categoryList));

            let allModule = [];
            uniqueCategory.map((category) => {
                let subCategoryList = []
                modules.map((module) => {
                    if (category == module.category) {
                        subCategoryList.push(module.subcategory)
                    }
                })

                let uniqueSubCategory = Array.from(new Set(subCategoryList));

                let subCat_children = []
                uniqueSubCategory.map((subcategory) => {
                    let moduleList = [];
                    modules.map((module) => {
                        if (subcategory == module.subcategory) {
                            moduleList.push(module)
                        }
                    })
                    subCat_children.push(
                        {
                            "name": subcategory,
                            "children": moduleList
                        }
                    )
                })

                allModule.push(
                    {
                        "name": category,
                        "children": subCat_children
                    }
                )
            })



            let categoryAccordion = "";
            allModule.map((allmodule, cat_inx) => {
                let category = allmodule.name
                let cat_id = category.replaceAll(" ", "");
                cat_id = cat_id.replace(/[^\w\s]/gi, '');

                let subCategoryList = allmodule["children"];
                let subCategoryAccordion = "";
                subCategoryList.map((subCategory, subcat_inx) => {
                    let subcategory = subCategory.name
                    let moduleList = subCategory["children"]

                    let moduleRows = "";
                    moduleList.map((module) => {
                        moduleRows +=
                            `<tr id="${module.lid}">
                            <td style="vertical-align:middle;"><i class="fa-solid fa-delete-left icon delete"></i></td>
                            <td class="name"><input class="form-control" type="text" value="${module.name}"></td>
                            <td class="monthlypricing"><input class="form-control" type="number" value="${module.monthlypricing}"></td>
                            <td class="annualpricing"><input class="form-control" type="number" value="${module.annualpricing}"></td>
                            <td class="source"><input class="form-control" type="text" value="${module.source}"></td>
                        </tr>`
                    })

                    let subcat_id = subcategory.replaceAll(" ", "");
                    subcat_id = subcat_id.replace(/[^\w\s]/gi, '');

                    subCategoryAccordion +=
                        `<div class="accordion-item">
                        <h2 class="accordion-header" id="sch_${cat_id}${subcat_id}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#subcategory_${cat_id}${subcat_id}" aria-expanded="true" aria-controls="subcategory_${cat_id}${subcat_id}">
                                <b class="subcategory">${subcategory}</b>
                            </button>
                        </h2>
                        <div id="subcategory_${cat_id}${subcat_id}" class="accordion-collapse collapse show" aria-labelledby="sch_${cat_id}${subcat_id}"
                            data-bs-parent="#moduleSubCategoryAccordion${cat_id}">
                            <div class="accordion-body">

                                <div class="table-responsive">
                                    <table class="table modules_modulesList">
                                        <thead>
                                            <tr>
                                                <th>Action</th>
                                                <th>Name</th>
                                                <th>Monthly Pricing</th>
                                                <th>Annual Pricing</th>
                                                <th>Source</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${moduleRows}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="2"><button class="btn btn-primary module_addnew">Add new</button></td>
                                            </tr>
                                        </tfoot>

                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>`
                })
                subCategoryAccordion += `<button class="btn w-100 mt-3 border rounded module_addSubCategory">Add New Sub Category</button>`

                categoryAccordion +=
                    `<div class="accordion mt-2" id="moduleCategoryAccordion${cat_id}">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="ch_${cat_id}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#categorycollapse_${cat_id}" aria-expanded="true" aria-controls="categorycollapse_${cat_id}">
                                <b class="category">${category}</b>
                            </button>
                        </h2>
                        <div id="categorycollapse_${cat_id}" class="accordion-collapse collapse show" aria-labelledby="ch_${cat_id}"
                            data-bs-parent="#moduleCategoryAccordion${cat_id}">
                            <div class="accordion-body">
                                <div class="accordion mt-2" id="moduleSubCategoryAccordion${cat_id}">
                                    ${subCategoryAccordion}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`

            })
            return { categoryAccordion: categoryAccordion }
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }


}

async function insertEmptyModule({ category, subCategory, moduleName, addedTime }) {
    try {
        let insertEmptyModuleRes = await exeQuery(`insert into SYF_MODULEMASTER
        (
            category,subcategory,name,addedtime
        )
        values(
            '${category}','${subCategory}','${moduleName}','${addedTime}'
        )`
        );

        if (insertEmptyModuleRes.responseType == "SUCCESS") {
            let res = await fetchModules();
            return res
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function deleteModule({ lid }) {
    try {
        let res = await exeQuery(`delete from SYF_MODULEMASTER where lid='${lid}'`);
        return res
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function updateModule({ colName, value, lid }) {
    try {
        let getModule = await fetchTable(`select name from SYF_MODULEMASTER where lid='${lid}'`)

        if (getModule.length != 0) {
            let updatemoduleres = await exeQuery(`update SYF_MODULEMASTER set ${colName}='${value}' where lid='${lid}'`)
            return updatemoduleres
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}

async function updateModuleSubcategory({ subcategory, oldSubcategory, category }) {
    try {
        let updatemodule = await exeQuery(`update SYF_MODULEMASTER set 
            subcategory='${subcategory}' where subcategory='${oldSubcategory}' and category='${category}'`)
        return updatemodule
    }
    catch (error) {
        return { error: true, message: error.message, details: error }
    }
}




module.exports = { fetchModules, insertEmptyModule, deleteModule, updateModule, updateModuleSubcategory }