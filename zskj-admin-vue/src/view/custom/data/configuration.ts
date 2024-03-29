export const tableColumns = [
    {
        title: '内容',
        colKey: 'content',
    },
    {
        title: '原信息',
        colKey: 'newValueDesc',
  
    },
    {
        title: '修改信息',
        colKey: 'oldValueDesc',
    },
    {
        title: '操作人',
        colKey: 'createBy',
    },
    {
        title: '所属机构',
        colKey: 'organName',
        width: '120px',
        slots: { customRender: 'estimateServerType' },
    },

    {
        title: '操作时间',
        colKey: 'createAt',

    },

]