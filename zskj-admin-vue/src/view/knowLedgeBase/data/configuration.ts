export const reportColumns = [
    {
        title: 'ID',
        colKey: 'id',
        align:'center',
    },
    {
        title: '名称',
        colKey: 'name',
        align:'center',
    },
    {
        title: '分类',
        colKey: 'mealTypeName',
        align:'center',
    },
    {
        title: '主图',
        colKey: 'picUrl',
        slots: { customRender: 'picUrl' },
        align:'center'
    },
    {
        title: '操作时间',
        colKey: 'createTime',
        align:'center'
    },
    {
        title: '操作',
        colKey: 'action',
        slots: { customRender: 'action' },
        align:'center'
    },
]

export const foodsColumns = [
    {
        title: '编码',
        colKey: 'id',
        align:'center',
    },
    {
        title: '名称',
        colKey: 'name',
        align:'center',
    },
    {
        title: '分类',
        colKey: 'categoryName',
        align:'center',
    },
    {
        title: '重量/份',
        colKey: 'categoryName',
    },
    {
        title: '主图',
        colKey: 'imgUrl',
        slots: { customRender: 'imgUrl' },
        align:'center'
    },
    {
        title: '创建时间',
        colKey: 'updateTime',
        align:'center'
    },
    {
        title: '操作',
        colKey: 'action',
        slots: { customRender: 'action' },
        align:'center'
    },
]
export const sportColumns = [
    {
        title: '编码',
        colKey: 'id',
        align:'center'
    },
    {
        title: '名称',
        colKey: 'name',
        align:'center'
    },
    {
        title: '分类',
        colKey: 'categoryName',
        align:'center'
    },
    {
        title: '主图',
        colKey: 'imgUrl',
        cell: 'type-slot-name',
        align:'center'
    },
    {
        title: '运动风险系数',
        colKey: 'sportRisk',
        align:'center'
    },
    {
        title: '操作时间',
        colKey: 'updateTime',
        align:'center'
    },
    {
        title: '操作',
        colKey: 'action',
        align:'center',
        slots: { customRender: 'action' },
    },
]


