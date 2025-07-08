export interface Store {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
}
export interface CreateStoreDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postcode?: string;
}

export type UpdateStoreDto = Partial<CreateStoreDto>;
