import React from "react";

export type TagOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type TagSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  options: TagOption[];
  error?: string;
  classNames?: string;
};
