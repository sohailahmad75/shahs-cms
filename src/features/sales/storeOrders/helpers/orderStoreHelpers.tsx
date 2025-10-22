import type { Meta } from "../../../../types"

export interface StoreOrderItem {
    id: string
    storeOrderId: string
    productId: string
    quantity: string
    unitPrice: string
    createdAt: string
    updatedAt: string
    product: {
        id: string
        name: string
        itemCode: string
        uom: string
    }
}

export interface OrderStore {
    id: string
    storeId: string
    createdBy: string | null
    statusId: number
    notes: string
    requestedDeliveryDate: string
    createdAt: string
    updatedAt: string
    items: StoreOrderItem[]

    displayId?: string
    totalAmount?: number
    itemCount?: number
}

export interface OrderStoreListResponse {
    data: OrderStore[]
    meta: Meta
}

export interface newOrderStore {
    id: string
    displayId: string
    provider: string
    totalAmount: number
    state: string
    createdAt: string
    items: any
    orderNumber: string
    customer: {
        firstName: string
        lastName: string
        email: string
        phone: string
    }
}