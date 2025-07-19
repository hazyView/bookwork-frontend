<script>
	import { sanitizeHTML } from '$lib/validation.js';

	export let type = 'text';
	export let value = '';
	export let placeholder = '';
	export let label = '';
	export let error = '';
	export let required = false;
	export let disabled = false;
	export let maxlength = undefined;
	export let minlength = undefined;
	export let pattern = undefined;
	export let autocomplete = undefined;
	export let id = undefined;
	export let name = undefined;

	// For textarea
	export let rows = undefined;
	export let cols = undefined;

	// For select
	export let options = [];

	let inputElement;
	let touched = false;

	function handleInput(event) {
		touched = true;
		let newValue = event.target.value;
		
		// Sanitize input for security
		if (type === 'text' || type === 'textarea') {
			newValue = sanitizeHTML(newValue);
		}
		
		value = newValue;
	}

	function handleBlur() {
		touched = true;
	}

	// Determine input class based on validation state
	$: inputClass = `form-input ${error && touched ? 'error' : ''} ${disabled ? 'disabled' : ''}`;
	$: showError = error && touched;
</script>

<div class="form-field">
	{#if label}
		<label class="form-label" for={id}>
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}

	{#if type === 'textarea'}
		<textarea
			bind:this={inputElement}
			{id}
			{name}
			{placeholder}
			{required}
			{disabled}
			{maxlength}
			{minlength}
			{rows}
			{cols}
			{autocomplete}
			class={inputClass}
			{value}
			on:input={handleInput}
			on:blur={handleBlur}
		></textarea>
	{:else if type === 'select'}
		<select
			bind:this={inputElement}
			{id}
			{name}
			{required}
			{disabled}
			class={inputClass}
			{value}
			on:change={handleInput}
			on:blur={handleBlur}
		>
			{#each options as option}
				<option value={option.value} selected={option.value === value}>
					{option.label}
				</option>
			{/each}
		</select>
	{:else}
		<input
			bind:this={inputElement}
			{type}
			{id}
			{name}
			{placeholder}
			{required}
			{disabled}
			{maxlength}
			{minlength}
			{pattern}
			{autocomplete}
			class={inputClass}
			{value}
			on:input={handleInput}
			on:blur={handleBlur}
		/>
	{/if}

	{#if showError}
		<div class="error-message" role="alert">
			{error}
		</div>
	{/if}
</div>

<style>
	.form-field {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text-color);
	}

	.required {
		color: var(--error-color);
	}

	.form-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-input.error {
		border-color: var(--error-color);
	}

	.form-input.error:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	.form-input.disabled {
		background-color: var(--bg-disabled);
		cursor: not-allowed;
	}

	.error-message {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: var(--error-color);
	}

	textarea.form-input {
		resize: vertical;
		min-height: 100px;
	}

	select.form-input {
		cursor: pointer;
	}

	select.form-input:disabled {
		cursor: not-allowed;
	}
</style>
