import type { Meta } from "../../../types"

export interface Order {
    orderNumber: string
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



export interface ModifierOption {
  price: number
  optionId: string
  quantity: number
  optionName: string
  totalPrice: number
}

export interface Modifier {
  modifierId: string
  modifierName: string
  modifierType: string
  modifierOptions: ModifierOption[]
}

export interface CartItem {
  name: string
  price: number
  itemId: string
  quantity: number
  modifiers: Modifier[]
  finalPrice: number
}

export interface ExternalReference {
  provider: string
  syncStatus: string
  externalOrderId: string
}

export interface Customer {
  email: string
  phone: string
  lastName: string
  firstName: string
  marketingOptIn: boolean
}

export interface Order {
  id: string
  displayId: string
  provider: string
  externalReferences: ExternalReference[]
  storeId: string
  Customer: Customer
  address: string | null
  payment: string | null
  packaging: string | null
  cart: CartItem[]
  type: string
  state: string
  totalAmount: number
  placedAt: string
  estimatedReadyAt: string
  actualReadyAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  isDeleted: number
  extUberOrderId: string | null
  extDeliverooOrderId: string | null
  customerPhone: string | null
  customerEmail: string | null
}

export interface OrdersResponse {
  items: Order[]
}
