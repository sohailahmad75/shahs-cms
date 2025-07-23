import type { Store } from "../stores/types";

export interface Kiosk {
  id: string;
  name: string;
  model: string;
  deviceId: string;
  status: number;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
  store?: Store;
}

export interface CreateKioskDto {
  deviceId: string;
  storeId?: string;
}
export interface UpdateKioskDto extends Partial<CreateKioskDto> {
  id: string;
}
