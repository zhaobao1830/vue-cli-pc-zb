// api管理界面
const apiServiceConfig = {
  // 登录
  getPKey: 'apiPublic/getPKey', // 获取key
  login: 'webMBGL/doctorUserLogin', // 登录
  getDoctor: 'webMBGL/getDoctor', // 医生详情

  // 字典
  getFindOrg: 'webMBGL/findOrg', // 查询医疗机构
  getDictionaries: 'webMBGL/findDict', // 系统字典
  getBatchDictionaries: 'webMBGL/batchFindDict', // 批量查询系统字典列表

  // 文件上传统一接口
  upload64: 'webMBGL/upload64', // 图片base64上传

  getFindDept: 'webMBGL/findDept', // 查询科室

 // 慢病筛查
 queryPatientListPagination: 'webMBGL/findPatBasicDoc', // 患者列表
 queryPatientDetail: 'webMBGL/getPatBasicDoc', // 患者详情
 subPatDiagnose: 'webMBGL/subPatDiagnose', // 保存患者诊断信息
 findFileDoc: 'webMBGL/findDoc', // 慢病专档列表
 saveDoc: 'webMBGL/saveDoc', // 保存慢病专档
 getDoc: 'webMBGL/getDocmb', // 查询慢病专档信息
 delDoc: 'webMBGL/delDoc', // 查询慢病专档信息
 findPatDiagnose: 'webMBGL/findPatDiagnose', // 查询慢病专档信息

  // 健康评估
  findEvaluation: 'webMBGL/findEvaluation', // 查询评估指标信息列表
  subEvaluation: 'webMBGL/subEvaluation', // 增加/修改评估指标信息
  getEvaluation: 'webMBGL/getEvaluation', // 获取评估指标信息
  delEvaluation: 'webMBGL/delEvaluation', // 删除评估指标信息
  getPatHealthAssessDiseaseByPatId: 'webMBGL/getPatHealthAssessDiseaseByPatId', // 查询患者健康评估疾病列表
  getHealthAssessmentList: 'webMBGL/findPatBasicDoc', // 获取健康评估列表
  subPatHealthAssess: 'webMBGL/subPatHealthAssess', // 患者健康评估数据保存与修改
  subPatPatFollowPlan: 'webMBGL/subPatPatFollowPlan', // 患者随访规划数据保存与修改
  subPatCondition: 'webMBGL/subPatCondition', // 患者病情数据的保存与修改
  subPatDiseaseAnalysis: 'webMBGL/subPatDiseaseAnalysis', // 患者病情分析数据保存与修改
  getPatConditionByPatId: 'webMBGL/getPatConditionByPatIdPC', // 查询患者病情录入信息
  getPatDiseaseAnalysisByPatId: 'webMBGL/getPatDiseaseAnalysisByPatId', // 查询患者病情分析信息
  getPatHealthAssessByPatId: 'webMBGL/getPatHealthAssessByPatId', // 查询患者健康评估信息
  getPatFollowPlanByPatId: 'webMBGL/getPatFollowPlanByPatId', // 查询患者随访规划信息
  getPatFollowPlanLisByPlanId: 'webMBGL/getPatFollowPlanLisByPlanId', // 获取患者随访规划检查项

  // 治疗方案
  getPatientList: 'webMBGL/findPatBasicDoc', // 获取患者列表
  savePatBasicPatType: 'webMBGL/savePatBasicPatType', // 编辑患者分类
  findPatInterventionPlanys: '/webMBGL/findPatInterventionPlanys', // 查询干预方案列表
  saveInterventionPlan: 'webMBGL/saveInterventionPlan', // 增加/编辑干预方案信息
  deleteInterventionPlan: 'webMBGL/deleteInterventionPlan', // 删除干预方案信息
  findPatMedicalPlanys: 'webMBGL/findPatMedicalPlanys', // 查询治疗方案列表
  saveMedicalPlan: 'webMBGL/saveMedicalPlan', // 增加/编辑治疗方案信息
  deletePatpatMedicalPlan: 'webMBGL/deletePatpatMedicalPlan', // 删除治疗方案信息
  findDrug: 'webMBGL/findDrug', // 查询药品列表
  findFactory: 'webMBGL/findFactory', // 查询制造商列表
  findDoctor: 'webMBGL/findDoctor', // 查询系统医生列表
  getPatInterventionPlanys: 'webMBGL/getPatInterventionPlanys', // 查询干预方案信息
  getPatMedicalPlanys: 'webMBGL/getPatMedicalPlanys', // 查询治疗方案信息

  // 健康指导
  findEduDocDoctor: 'webMBGL/findEduDocDoctor', // 查询健康宣教列表
  subEduDoc: 'webMBGL/subEduDoc', // 新建/编辑健康宣教内容
  getEduDoc: 'webMBGL/getEduDoc', // 根据id查询健康教育详情
  deleteEduDoc: 'webMBGL/deleteEduDoc', // 删除健康宣教
  doRelease: 'webMBGL/doRelease', // 发布健康宣教
  searchDrug: 'webMBGL/searchDrug', // 查询用药未提醒列表
  findDrugRemindRecDoctor: 'webMBGL/findDrugRemindRecDoctor', // 查询用药已提醒列表
  subDrugRemindRec: 'webMBGL/subDrugRemindRec', // 用药提醒确认
  findFollowPlanTip: 'webMBGL/findFollowPlanTip', // 随访（复诊）提醒列表
  followPlanTipRemind: 'webMBGL/followPlanTipRemind', // 随访提醒信息提醒

  // 就医咨询
  findDoctorMedConsult: 'webMBGL/findDoctorMedConsult', // 查询医生留言列表
  getDoctorMedConsult: 'webMBGL/getDoctorMedConsult', // 查询医生留言信息
  replyDoctorMedConsult: 'webMBGL/replyDoctorMedConsult', // 留言回复

  // 健康教育及普及
  findHealthEdu: 'webMBGL/findHealthEdu', // 查询健康教育列表
  getHealthEdu: 'webMBGL/getHealthEdu', // 查询健康教育列表
  subHealthEdu: 'webMBGL/subHealthEdu', // 保存健康教育信息
  deleteHealthEdu: 'webMBGL/deleteHealthEdu', // 删除健康教育信息
  release: 'webMBGL/release', // 发布健康教育
  revoke: 'webMBGL/revoke', // 撤回健康教育

  // 远程医疗协助
  findRemoteMedAssis: 'webMBGL/findRemoteMedAssis', // 查询远程医疗协助列表
  subRemoteMedAssis: 'webMBGL/subRemoteMedAssis', // 保存远程医疗协助留言
  getRemoteMedAssis: 'webMBGL/getRemoteMedAssis', // 查询远程医疗协助详情
  replyRemoteMedAssis: 'webMBGL/replyRemoteMedAssis', // 回复远程医疗协助留言

  // 患者档案
  savePatBasic: 'webMBGL/savePatBasic', // 编辑患者信息
  queryUserHMTree: 'webMBGL/queryUserHMTree', // 查询患者健康监测列表
  queryUserHMData: 'webMBGL/queryUserHMData', // 查询患者健康监测详情

  // 历史随访记录
  getPatGuidanceByPatId: 'webMBGL/getPatGuidanceByPatId', // 查询健康指导列表
  getPatGuidanceys: 'webMBGL/getPatGuidanceys', // 查询健康指导信息
  getPatFollowRecordsPlanByPatId: 'webMBGL/getPatFollowRecordsPlanByPatId', // 查询随访规划列表
  getFollowPlanByPlanId: 'webMBGL/getFollowPlanByPlanId', // 查询随访规划信息
  getPatAssessmentByPatId: 'webMBGL/getPatAssessmentByPatId', // 查询定期评估列表
  getPatAssessmentys: 'webMBGL/getPatAssessmentys', // 查询定期评估信息
  getPatMonitorIndexByPatId: 'webMBGL/getPatMonitorIndexByPatId' // 查询患者预警机制
}

export default apiServiceConfig
