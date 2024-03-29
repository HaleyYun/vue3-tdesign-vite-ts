export const couponColumns = [
    {
        title: '券名称',
        colKey: 'couponName',
        align: 'center',
        width: '220px',
    },
    {
        title: '使用渠道',
        colKey: 'channelName',
        align: 'center',
        width: '230px',
    },
    {
        title: '券类型',
        colKey: 'couponType',
        align: 'center',
        width: '130px',// 1折扣 2满减
        slots: { customRender: 'couponType' },
    },
    {
        title: '优惠内容',
        colKey: 'offerContent',
        align: 'center',
        width: '190px',

    },
    {
        title: '券状态',
        colKey: 'status',
        align: 'center',
        width: '150px',
        slots: { customRender: 'status' },
    },

    {
        title: '已发放数量(张)',
        colKey: 'released',
        align: 'center',
        width: '220px',
    },

    {
        title: '剩余数量(张)',
        colKey: 'stock',
        align: 'center',
        width: '180px',
    },
    {
        title: '有效期',
        colKey: 'beginTime',
        align: 'center',
        width: '230px',
        slots: { customRender: 'beginTime' },
    },

    {
        title: '操作时间',
        colKey: 'updateTime',
        align: 'center',
        width: '180px'
    },
    {
        title: '操作人',
        colKey: 'updateUser',
        align: 'center',
        width: '180px',
    },
    {
        title: '操作',
        colKey: 'action',
        align: 'center',
        width: '140px', fixed: 'right',
        slots: { customRender: 'action' },
    },


]

//x新增绑定产品
export const productColumns = [
    {
        colKey: 'row-select',
        type: 'single',

        // checkProps: (data: any) => ({ disabled: isDetails.value }),
        width: 50
    },
    {
        title: '服务产品',
        colKey: 'prodName',
        align: 'center',
        // width: '220px',
    },
    {
        title: '服务类型',
        colKey: 'serviceType',
        align: 'center',
        slots: { customRender: 'serviceType' },
    },
    {
        title: '销售端口',
        colKey: 'channelName',
        align: 'center',
        // width: '140px',
    },
    {
        title: '价格',
        colKey: 'prodPrice',
        align: 'center',
        // width: '130px',
        slots: { customRender: 'ticketType' },
    },
    {
        title: '库存',
        colKey: 'stock',
        align: 'center',
        // width: '120px',

    },
    {
        title: '支付方式',
        colKey: 'prodStatus',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'prodStatus' },
    },
]
//详情
export const detailsColumns = [
    {
        colKey: 'row-select',
        type: 'single',

        checkProps: (data: any) => ({ disabled: true }),
        width: 50
    },
    {
        title: '服务产品',
        colKey: 'prodName',
        align: 'center',
        // width: '220px',
    },
    {
        title: '服务类型',
        colKey: 'serviceType',
        align: 'center',
        // width: '220px',
        slots: { customRender: 'serviceType' },
    },
    {
        title: '销售端口',
        colKey: 'channelName',
        align: 'center',
        // width: '140px',
    },
    {
        title: '价格',
        colKey: 'prodPrice',
        align: 'center',
        // width: '130px',
        slots: { customRender: 'ticketType' },
    },
    {
        title: '库存',
        colKey: 'stock',
        align: 'center',
        // width: '120px',

    },
    {
        title: '支付方式',
        colKey: 'prodStatus',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'prodStatus' },
    },

]

//使用情况
export const conditionColumns = [
    {
        title: '券编码',
        colKey: 'couponCode',
        align: 'center',
        // width: '220px',
    },
    {
        title: '发放账户',
        colKey: 'releaseAccount',
        align: 'center',
        // width: '140px',
    },
    {
        title: '发放时间',
        colKey: 'createTime',
        align: 'center',
        // width: '130px',
        slots: { customRender: 'createTime' },
    },
    {
        title: '使用账户',
        colKey: 'useAccount',
        align: 'center',
        // width: '120px',

    },
    {
        title: '市场价',
        colKey: 'price',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'prodStatus' },
    },
    {
        title: '优惠价',
        colKey: 'preferentialAmount',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'prodStatus' },
    },
    {
        title: '使用状态',
        colKey: 'status',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'status' },
    },
    {
        title: '实付金额',
        colKey: 'afterDiscountPrice',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'afterDiscountPrice' },
    },
    {
        title: '关联产品',
        colKey: 'productName',
        align: 'center',
        // width: '120px',默认线上
        slots: { customRender: 'productName' },
    },
    {
        title: '使用有效期',
        colKey: 'beginTime',
        align: 'center',
        width: '250px',
        slots: { customRender: 'beginTime' },
    },

]
//营销活动列表
export const eventsColumns = [
    {
        title: '序号',
        colKey: 'serial-number',
        align: 'center',
        width: '100px',
        slots: { customRender: 'serialNumber' },
    },
    {
        title: '活动名称',
        colKey: 'activityName',
        align: 'center',
        width: '220px',
    },
    {
        title: '活动ID',
        colKey: 'activityId',
        align: 'center',
        width: '200px',
    },
    {
        title: '状态',
        colKey: 'status',
        align: 'center',
        width: '130px',
        slots: { customRender: 'status' },
    },
    {
        title: '活动渠道',
        colKey: 'prodCode',
        align: 'center',
        width: '190px',
        slots: { customRender: 'prodCode' },
    },

    {
        title: '操作时间',
        colKey: 'updateTime',
        align: 'center',
        width: '180px'
    },
    {
        title: '操作人',
        colKey: 'updateUser',
        align: 'center',
        width: '180px',
    },
    {
        title: '操作',
        colKey: 'action',
        align: 'center',
        width: '140px', fixed: 'right',
        slots: { customRender: 'action' },
    },


]

//q渠道
export const channelColumns = [
    {
        title: '序号',
        colKey: 'serial-number',
        align: 'center',
        width: '100px',
        slots: { customRender: 'serialNumber' },
    },
    {
        title: '渠道名称',
        colKey: 'channelName',
        align: 'center',
        width: '220px',
    },

    {
        title: '活动二维码',
        colKey: 'qrCode',
        align: 'center',
        width: '130px',
        slots: { customRender: 'qrCode' },
    },
    {
        title: '活动地址',
        colKey: 'wechatUrl',
        align: 'center',
        width: '190px',
        slots: { customRender: 'wechatUrlTime' },
    },




]

//活动参与
export const joinLogColumns = [
    {
        title: '序号',
        colKey: 'serial-number',
        align: 'center',
        width: '100px',
        slots: { customRender: 'serialNumber' },
    },
    {
        title: '服务单号',
        colKey: 'ticketsCode',
        align: 'center',
        width: '220px',
    },

    {
        title: '客户姓名',
        colKey: 'name',
        align: 'center',
        width: '130px',
    },
    {
        title: '联系电话',
        colKey: 'phone',
        align: 'center',
        width: '190px',

    },
    {
        title: '状态',
        colKey: 'status',
        align: 'center',
        width: '190px',
        slots: { customRender: 'status' },
    },
    {
        title: '活动渠道',
        colKey: 'channelName',
        align: 'center',
        width: '190px',
    },
    {
        title: '操作时间',
        colKey: 'updateTime',
        align: 'center',
        width: '190px',
    },




]