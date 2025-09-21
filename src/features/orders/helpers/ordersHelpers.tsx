import type { Meta } from "../../../types"

export interface Order {
    id: string
    displayId: string
    provider: string
    customer: {
        firstName: string
        lastName: string
        email: string
        phone: string
    }
    totalAmount: number
    state: string
    createdAt: string
}

export interface OrderListResponse {
    data: Order[]
    meta: Meta
}
