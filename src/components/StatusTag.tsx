import React from "react";
import { StatusEnum, StatusLabels } from "../common/enums/status.enum";

interface StatusTagProps {
  status: StatusEnum;
}

const statusColors: Record<StatusEnum, string> = {
  [StatusEnum.ACTIVE]: "bg-green-100 text-green-800",
  [StatusEnum.INACTIVE]: "bg-gray-100 text-gray-800",
  [StatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
  [StatusEnum.SUSPENDED]: "bg-red-100 text-red-800",
  [StatusEnum.DELETED]: "bg-red-100 text-red-800",
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const label = StatusLabels[status] ?? "Unknown";
  const colorClass = statusColors[status] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
};

export default StatusTag;
