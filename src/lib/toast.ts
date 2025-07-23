import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
}

function createToastStore() {
	const { subscribe, set, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (toast: Omit<Toast, 'id'>) => {
			const id = Math.random().toString(36).substring(2, 9);
			const newToast: Toast = { ...toast, id };
			
			update(toasts => [...toasts, newToast]);

			// Auto-remove toast after duration
			setTimeout(() => {
				update(toasts => toasts.filter(t => t.id !== id));
			}, toast.duration || 3000);

			return id;
		},
		remove: (id: string) => {
			update(toasts => toasts.filter(t => t.id !== id));
		},
		clear: () => set([])
	};
}

export const toasts = createToastStore();
