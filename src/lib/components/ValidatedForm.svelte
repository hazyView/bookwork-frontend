<script>
	import { validateFormData } from '$lib/validation.js';
	import { createEventDispatcher } from 'svelte';

	export let schema = {};
	export let initialValues = {};
	export let submitLabel = 'Submit';
	export let disabled = false;
	export let validateOnChange = true;

	const dispatch = createEventDispatcher();

	let formData = { ...initialValues };
	let errors = {};
	let isValid = true;
	let touched = {};

	// Validate form whenever data changes
	$: if (validateOnChange && Object.keys(touched).length > 0) {
		const validation = validateFormData(formData, schema);
		errors = validation.errors;
		isValid = validation.isValid;
		if (validation.isValid) {
			formData = validation.sanitized;
		}
	}

	function handleInput(field) {
		touched[field] = true;
		if (validateOnChange) {
			const validation = validateFormData({ [field]: formData[field] }, { [field]: schema[field] });
			if (validation.errors[field]) {
				errors[field] = validation.errors[field];
			} else {
				delete errors[field];
				formData[field] = validation.sanitized[field];
			}
			errors = { ...errors };
		}
		dispatch('input', { field, value: formData[field], formData });
	}

	function handleSubmit(event) {
		event.preventDefault();
		
		// Mark all fields as touched
		Object.keys(schema).forEach(field => {
			touched[field] = true;
		});

		const validation = validateFormData(formData, schema);
		errors = validation.errors;
		isValid = validation.isValid;

		if (validation.isValid) {
			dispatch('submit', {
				formData: validation.sanitized,
				originalData: formData
			});
		} else {
			dispatch('error', {
				errors: validation.errors,
				formData
			});
		}
	}

	function resetForm() {
		formData = { ...initialValues };
		errors = {};
		touched = {};
		isValid = true;
		dispatch('reset');
	}

	// Export functions for parent component
	export { resetForm };
</script>

<form on:submit={handleSubmit} novalidate>
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
			{disabled}
		>
			{submitLabel}
		</button>
		
		<button 
			type="button" 
			class="btn btn-secondary"
			on:click={resetForm}
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
