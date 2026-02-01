
import { toast as sonnerToast } from "sonner";
import { useState, useEffect } from "react";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

// Create a store to track toasts
let toasts: ToastProps[] = [];
let listeners: ((toasts: ToastProps[]) => void)[] = [];

const addToast = (toast: ToastProps) => {
  const id = toast.id || String(Math.random());
  const newToast = { ...toast, id };
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener(toasts));

  // Also show the toast in sonner
  sonnerToast(toast.title, {
    id,
    description: toast.description,
    action: toast.action,
    className: toast.variant === "destructive" ? "destructive" : undefined,
  });

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    dismissToast(id);
  }, 5000);

  return id;
};

const dismissToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener(toasts));
  // Use the dismiss method from the toast function directly
  sonnerToast.dismiss(id);
};

export function toast(props: ToastProps) {
  return addToast(props);
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<ToastProps[]>(toasts);

  useEffect(() => {
    const listener = (updatedToasts: ToastProps[]) => {
      setLocalToasts([...updatedToasts]);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return {
    toast,
    toasts: localToasts,
    dismiss: dismissToast
  };
}
