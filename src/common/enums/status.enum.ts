export enum StatusEnum {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING = 3,
  SUSPENDED = 4,
  DELETED = 5,
}

export const StatusLabels: Record<StatusEnum, string> = {
  [StatusEnum.ACTIVE]: "Active",
  [StatusEnum.INACTIVE]: "Inactive",
  [StatusEnum.PENDING]: "Pending",
  [StatusEnum.SUSPENDED]: "Suspended",
  [StatusEnum.DELETED]: "Deleted",
};

export enum StoreTypeEnum {
  SHOP = 1,
  FOOD_TRUCK = 2,
}

export const StoreTypeOptions = [
  { label: "Shop", value: StoreTypeEnum.SHOP.toString() },
  { label: "Food Truck", value: StoreTypeEnum.FOOD_TRUCK.toString() },
];
