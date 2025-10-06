import React, { useCallback, useMemo, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { X } from "lucide-react";

type ConfirmDeleteProps = {
onConfirm: () => Promise<void> | void;
title?: string;
message?: React.ReactNode;
confirmLabel?: string;
cancelLabel?: string;
width?: string;
open?: boolean;
onOpenChange?: (open: boolean) => void;
loading?: boolean;
disabled?: boolean;
autoCloseOnSuccess?: boolean;
trigger?: React.ReactElement;
renderTrigger?: (ctx: {
open: () => void;
loading: boolean;
disabled: boolean;
}) => React.ReactNode;
triggerLabel?: string;
className?: string;
};

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
onConfirm,
title = "Are you sure?",
message = "Do you really want to delete these records? This process cannot be undone.",
confirmLabel = "Delete",
cancelLabel = "Cancel",
width = "max-w-md",
open: controlledOpen,
onOpenChange,
loading: controlledLoading,
disabled = false,
autoCloseOnSuccess = true,
trigger,
renderTrigger,
triggerLabel = "Delete",
className = "",
}) => {
const [unOpen, setUnOpen] = useState(false);
const [unLoading, setUnLoading] = useState(false);
const [err, setErr] = useState<string | null>(null);

const open = controlledOpen ?? unOpen;
const setOpen = onOpenChange ?? setUnOpen;
const isLoading = controlledLoading ?? unLoading;

const openModal = useCallback(() => {
if (disabled) return;
setErr(null);
setOpen(true);
}, [disabled, setOpen]);

const closeModal = useCallback(() => {
if (isLoading) return;
setOpen(false);
setErr(null);
}, [isLoading, setOpen]);

const handleConfirm = useCallback(async () => {
if (controlledLoading === undefined) setUnLoading(true);
await onConfirm?.();
if (autoCloseOnSuccess) closeModal();
}, [onConfirm, autoCloseOnSuccess, closeModal, controlledLoading]);

const DefaultTrigger = useMemo(
() => (
<Button
variant="destructive"
onClick={openModal}
disabled={disabled || isLoading}
className={className}
>
{triggerLabel} </Button>
),
[openModal, disabled, isLoading, className, triggerLabel],
);

const TriggerNode = useMemo(() => {
if (renderTrigger) {
return renderTrigger({
open: openModal,
loading: isLoading,
disabled: disabled || isLoading,
});
}
if (trigger) {
const originalOnClick = (trigger.props as any)?.onClick;
const mergedOnClick: React.MouseEventHandler<any> = (e) => {
originalOnClick?.(e);
if (!e.defaultPrevented) openModal();
};
return React.cloneElement(trigger as React.ReactElement<any>, {
onClick: mergedOnClick,
disabled: (trigger.props as any)?.disabled ?? (disabled || isLoading),
loading: (trigger.props as any)?.loading ?? isLoading,
});
}
return DefaultTrigger;
}, [renderTrigger, trigger, openModal, isLoading, disabled, DefaultTrigger]);

return (
<>
{TriggerNode}

  <Modal isOpen={open} onClose={closeModal} width={width} hideHeader>
    <div className="flex flex-col items-center text-center space-y-4 p-6">

      <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-red-400 bg-red-50 text-red-500">
        <X className="w-10 h-10" />
      </div>


      <h2 className="text-lg font-semibold text-gray">{title}</h2>


      <p className="text-sm text-gray-600">{message}</p>

      {err && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 w-full">
          {err}
        </div>
      )}


      <div className="flex justify-center gap-3 pt-2 w-full">
        <Button
          variant="outlined"
          onClick={closeModal}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {cancelLabel}
        </Button>

        <Button
          variant="destructive"
          onClick={handleConfirm}
          loading={isLoading}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
</>


);
};

export default ConfirmDelete;
