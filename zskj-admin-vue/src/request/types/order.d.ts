export interface BookingOrderType {
    clientName?: string
    createTimeBegn?: string
    createTimeEnd?: string
    pageNum?: number
    pageSize?: number
    status?: number
    ticketsBookingId?: string
    phone?: string,
    clientId?: string,
    userId?: string | number
}

export interface MealOrderType {
    bookingServ?: string
    clientId?: number | string
    purchaser?: string
    clientResource?: number
    createTimeBegn?: string
    createTimeEnd?: string
    pageNum?: number
    pageSize?: number
    purchaserPhone?: string
    status?: number
    ticketsServiceId?: string
    userId?: string | number
}

export interface RightsInterestsOrderType {
    createTime?: string
    clientName?: string
    phone?: string
    ticketsEquityCode?: string
    status?: number
    updateTime?: string
    pageNum?: number
    pageSize?: number
    clientId?: string
    userId?: string | number
}

export interface RecordsType {
    id?: any
    ticketsTypeId?: number,
    pageNum?: number,
    pageSize?: number,
}

export interface RefundModel {
    clientName?: string
    refundCode?: string
    refundMoneyMax?: number
    refundMoneyMin?: number
    status?: number
    ticketsCode?: string
    ticketsType?: number
    pageNum: number
    pageSize: number
}

export interface RefundUpdateModel {
    id?: number
    clientName?: string
    money?: number
    refundCode?: string
    refundMoneyMin?: number
    reson?: string
    status?: number
    ticketsId?: number
    ticketsType?: number
}