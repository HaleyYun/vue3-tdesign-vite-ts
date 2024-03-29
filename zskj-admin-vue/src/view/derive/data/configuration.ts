// 用户
export const userColumns = [
    {
        title: '档案编号',
        colKey: 'archivesNo',
        width: '320px',
        align: 'center'
    },
    {
        title: '姓名',
        colKey: 'archivesName',
        width: '120px',
        align: 'center'
    },
    {
        title: '性别',
        colKey: 'sex',
        width: '120px',
        align: 'center'
    },
    {
        title: '联系电话',
        colKey: 'phone',
        width: '180px',
        align: 'center'

    },
    {
        title: '出生日期',
        colKey: 'birthday',
        width: '180px',
        align: 'center'
    },
    {
        title: '学历',
        colKey: 'education',
        width: '150px',
        align: 'center'
    },
    {
        title: '建档时间',
        colKey: 'archivesCreateTime',
        width: '220px',
        align: 'center'
    },
    {
        title: '归属机构',
        colKey: 'organName',
        width: '220px',
        align: 'center'
    },
    {
        title: '评估编号',
        colKey: 'estimateNum',
        width: '220px',
        align: 'center'
    },
    {
        title: '服务产品名称',
        colKey: 'serviceProductName',
        width: '180px',
        align: 'center'
    },
    {
        title: '量表名称',
        colKey: 'estimateName',
        width: '280px',
        align: 'center'
    },
    {
        title: '评估分数',
        colKey: 'estimateScore',
        width: '100px',
        align: 'center'
    },
    {
        title: '评估结果',
        colKey: 'estimateResult',
        slots: { customRender: 'estimateResult' },
        width: '120px',
        align: 'center'
    },
    {
        title: 'BHI分数',
        colKey: 'bhi',
        width: '120px',
        align: 'center'
    },
    {
        title: 'BHI结果',
        colKey: 'riskType',
        slots: { customRender: 'riskType' },
        width: '120px',
        align: 'center'
    },
    {
        title: '评估员',
        colKey: 'assessorName',
        width: '150px',
        align: 'center'
    },
    {
        title: '评估时间',
        colKey: 'estimateTime',
        width: '220px',
        align: 'center'
    },
]
//员工
export const personColumns = [
    {
        title: '员工ID',
        colKey: 'id',
    },
    {
        title: '姓名',
        colKey: 'name',
    },
    {
        title: '性别',
        colKey: 'sex',
        slots: { customRender: 'sex' },
    },
    {
        title: '联系电话',
        colKey: 'phone',
    },
    {
        title: '登录账号',
        colKey: 'account',
    },
    {
        title: '岗位',
        colKey: 'posName',
    },
    {
        title: '归属机构',
        colKey: 'organName',
    },
    {
        title: '账号状态',
        colKey: 'status',
        slots: { customRender: 'status' },
    },
    {
        title: '渠道内排名',
        colKey: 'channelRank',
        width: '105px',
    },
    {
        title: '机构内排名',
        colKey: 'organRank',
        width: '105px',
    },
    {
        title: '评估人数',
        colKey: 'estimateCount',
        width: '105px',
    },
    {
        title: '建档人数',
        colKey: 'archivesNum',
    },

]
//机构
export const instiColumns = [
    {
        title: '机构名称',
        colKey: 'organName',
    },
    {
        title: '总评估数量',
        colKey: 'totalEstimateNum',
    },
    {
        title: '总评估员数量',
        colKey: 'totalEmployNum',
    },
    {
        title: '筛查评估员人数',
        colKey: 'assessorNum',
    },
    {
        title: '眼动正常人数',
        colKey: 'normal',
    },
    {
        title: '眼动低风险人数',
        colKey: 'lowRisk',
    },
    {
        title: '眼动中风险人数',
        colKey: 'mediumRisk',
    },
    {
        title: '眼动高风险人数',
        colKey: 'highRisk',
    },
    {
        title: 'BHI正常人数',
        colKey: 'bhiNormalCount',
    },
    {
        title: 'BHI低风险人数',
        colKey: 'bhiLowCount',
    },
    {
        title: 'BHI中风险人数',
        colKey: 'bhiMediumCount',
    },
    {
        title: 'BHI高风险人数',
        colKey: 'bhiHighCount',
    },
    {
        title: '归属城市',
        colKey: 'cityName',
    },

]