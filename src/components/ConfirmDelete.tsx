// ConfirmDelete.tsx
import React, { useCallback, useMemo, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

type ConfirmDeleteProps = {
  onConfirm: () => Promise<void> | void;

  // Copy
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;

  // Modal sizing
  width?: string;

  // Control (optional)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Loading/Disabled (optional)
  loading?: boolean; // if provided, confirm button uses this (spinner)
  disabled?: boolean; // disables trigger (+ confirm while loading)

  autoCloseOnSuccess?: boolean;

  // NEW: pass a ready-made trigger from parent
  trigger?: React.ReactElement; // e.g. <Button variant="destructive" icon={<Trash/>}>Delete</Button>

  // or: render prop (gives you open + state)
  renderTrigger?: (ctx: {
    open: () => void;
    loading: boolean;
    disabled: boolean;
  }) => React.ReactNode;

  // Fallback default trigger text (used only if trigger/renderTrigger not provided)
  triggerLabel?: string;

  className?: string; // extra classes for default trigger
};

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  onConfirm,
  title = "Delete item?",
  message = "This action cannot be undone.",
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
        {triggerLabel}
      </Button>
    ),
    [openModal, disabled, isLoading, className, triggerLabel],
  );

  // Final trigger node (priority: renderTrigger > trigger element > default)
  const TriggerNode = useMemo(() => {
    if (renderTrigger) {
      return renderTrigger({
        open: openModal,
        loading: isLoading,
        disabled: disabled || isLoading,
      });
    }
    if (trigger) {
      const originalOnClick = (trigger.props as any)?.onClick as
        | React.MouseEventHandler<any>
        | undefined;
      const mergedOnClick: React.MouseEventHandler<any> = (e) => {
        originalOnClick?.(e);
        if (!e.defaultPrevented) openModal();
      };

      return React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: mergedOnClick,
        disabled: (trigger.props as any)?.disabled ?? (disabled || isLoading),
        // If your trigger is the shared Button, it will pick these up:
        loading: (trigger.props as any)?.loading ?? isLoading,
        "aria-busy": isLoading || undefined,
      });
    }
    return DefaultTrigger;
  }, [renderTrigger, trigger, openModal, isLoading, disabled, DefaultTrigger]);

  return (
    <>
      {TriggerNode}

      <Modal isOpen={open} onClose={closeModal} title={title} width={width}>
        <div className="space-y-4">
          <div className="text-sm text-gray-700">{message}</div>

          {err && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outlined"
              onClick={closeModal}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirm}
              loading={isLoading} // spinner from parent if controlled, else internal
              disabled={isLoading}
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
