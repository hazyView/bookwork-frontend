<script lang="ts">
	import { validateFormData } from '$lib/validation.js';
	import { createEventDispatcher } from 'svelte';
	import type { ValidationSchema, ValidationResult } from '$lib/validation.js';

	/**
	 * ValidatedForm component props interface
	 */
	interface ValidatedFormProps {
		/**
		 * Validation schema for form fields
		 */
		schema?: ValidationSchema;
		
		/**
		 * Initial form values
		 */
		initialValues?: Record<string, any>;
		
		/**
		 * Submit button label
		 */
		submitLabel?: string;
		
		/**
		 * Whether the form is disabled
		 */
		disabled?: boolean;
		
		/**
		 * Whether to validate on field change
		 */
		validateOnChange?: boolean;
		
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	// Component props with defaults
	let {
		schema = {},
		initialValues = {},
		submitLabel = 'Submit',
		disabled = false,
		validateOnChange = true,
		class: className = ''
	}: ValidatedFormProps = $props();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		submit: { formData: Record<string, any>; isValid: boolean };
		input: { field: string; value: any; formData: Record<string, any> };
		validate: { isValid: boolean; errors: Record<string, string[]> };
	}>();

	let formData: Record<string, any> = $state({ ...initialValues });
	let errors: Record<string, string[]> = $state({});
	let isValid: boolean = $state(true);
	let touched: Record<string, boolean> = $state({});

	// Validate form whenever data changes
	$: if (validateOnChange && Object.keys(touched).length > 0) {
		const validation = validateFormData(formData, schema);
		errors = validation.errors;
		isValid = validation.isValid;
		if (validation.isValid && validation.sanitized) {
			formData = validation.sanitized;
		}
		dispatch('validate', { isValid, errors });
	}

	function handleInput(field: string): void {
		touched[field] = true;
		if (validateOnChange) {
			const fieldSchema = schema[field];
			if (fieldSchema) {
				const validation = validateFormData({ [field]: formData[field] }, { [field]: fieldSchema });
				if (validation.errors[field]) {
					errors[field] = validation.errors[field];
				} else {
					delete errors[field];
					if (validation.sanitized?.[field] !== undefined) {
						formData[field] = validation.sanitized[field];
					}
				}
				errors = { ...errors };
			}
		}
		dispatch('input', { field, value: formData[field], formData });
	}

	function handleSubmit(event: Event): void {
		event.preventDefault();
		
		// Mark all fields as touched
		Object.keys(schema).forEach(field => {
			touched[field] = true;
		});

		const validation = validateFormData(formData, schema);
		errors = validation.errors;
		isValid = validation.isValid;

		if (validation.isValid && validation.sanitized) {
			formData = validation.sanitized;
			dispatch('submit', {
				formData: validation.sanitized,
				isValid: true
			});
		} else {
			dispatch('submit', {
				formData,
				isValid: false
			});
		}
		
		dispatch('validate', { isValid, errors });
	}

	function resetForm(): void {
		formData = { ...initialValues };
		errors = {};
		touched = {};
		isValid = true;
	}

	// Expose reset function to parent
	export { resetForm };
</script>

<form on:submit={handleSubmit} novalidate class={className}>
	<slot 
		{formData}
		{errors}
		{isValid}
		{touched}
		{handleInput}
		bind:formData
	/>
	
	<div class="form-actions">
		<button 
			type="submit" 
			class="btn btn-primary"
			disabled={disabled || !isValid}
		>
			{submitLabel}
		</button>
		
		<button 
			type="button" 
			class="btn btn-secondary"
			on:click={resetForm}
			disabled={disabled}
		>
			Reset
		</button>
	</div>
</form>

<style>
	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.btn {
		padding: 0.5rem 1rem;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background-color: var(--primary-color);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: var(--primary-color-hover);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--text-color);
		border-color: var(--border-color);
	}

	.btn-secondary:hover {
		background-color: var(--bg-hover);
	}
</style>
