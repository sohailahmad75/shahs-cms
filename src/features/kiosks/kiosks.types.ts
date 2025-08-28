import type { Store } from "../stores/store.types";
import type { Meta } from "../../types";

export interface Kiosk {
  id: string;
  name: string;
  model: string;
  deviceId: string;
  deviceType: string;
  status: number;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
  store?: Store;
}

export interface CreateKioskDto {
  deviceId: string;
  storeId?: string;
  deviceType: number;
}

export type KioskListResponse = {
  data: Kiosk[];
  meta: Meta;
};

export type UpdateKioskDto = CreateKioskDto;
