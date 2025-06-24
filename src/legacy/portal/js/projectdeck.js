const {
  fetchTable,
  queryGet,
  dateTimeGeneration,
  exeQuery,
  workPaper,
} = require("../../config");

const getObservstionDetail = async (params) => {
  try {
    let Project = await fetchTable(`select * from AllObservations where companyid='${params.companyid}' AND projectCode='${params.projectCode}' AND type='observation'`);
    return Project;
  } catch (e) {
    return { error: e };
  }
};
const getMilestoneDetails = async (params) => {
  try {
    let Milestones = await fetchTable(`select * from AllObservations where companyid='${params.companyid}' AND projectCode='${params.projectCode}' AND type='Milestone'`);
    return Milestones;
  } catch (e) {
    return { error: e };
  }
};

module.exports = { getObservstionDetail, getMilestoneDetails };