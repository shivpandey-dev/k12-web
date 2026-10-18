import { createStore } from 'zustand/vanilla';

export type ToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  action?: ToastAction;
}

export interface Toast extends ToastOptions {
  id: number;
  message: string;
  severity: ToastSeverity;
}

interface ToastStore {
  /** Waiting toasts; the first one is on screen. Toasts show one at a time. */
  queue: Toast[];
  push: (toast: Omit<Toast, 'id'>) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const toastStore = createStore<ToastStore>()((set) => ({
  queue: [],
  push: (toast) => {
    const id = nextId++;
    set((state) => ({ queue: [...state.queue, { ...toast, id }] }));
    return id;
  },
  dismiss: (id) => set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),
}));

const show = (severity: ToastSeverity) => (message: string, options?: ToastOptions) =>
  toastStore.getState().push({ message, severity, ...options });

/** Shows a short confirmation at the bottom-left. Returns the toast id. */
export const toast = {
  success: show('success'),
  info: show('info'),
  warning: show('warning'),
  error: show('error'),
  dismiss: (id: number) => toastStore.getState().dismiss(id),
};

export function resetToastStoreForTests() {
  toastStore.setState({ queue: [] });
}
