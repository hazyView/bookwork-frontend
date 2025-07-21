<script lang="ts">
	import { sanitizeHTML } from '$lib/validation.js';
	import { createEventDispatcher } from 'svelte';

	/**
	 * Select option interface
	 */
	interface SelectOption {
		value: string | number;
		label: string;
		disabled?: boolean;
	}

	/**
	 * ValidatedInput component props interface
	 */
	interface ValidatedInputProps {
		/**
		 * Input type
		 */
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select';
		
		/**
		 * Input value
		 */
		value?: string | number;
		
		/**
		 * Placeholder text
		 */
		placeholder?: string;
		
		/**
		 * Field label
		 */
		label?: string;
		
		/**
		 * Error message
		 */
		error?: string | string[];
		
		/**
		 * Whether field is required
		 */
		required?: boolean;
		
		/**
		 * Whether field is disabled
		 */
		disabled?: boolean;
		
		/**
		 * Maximum length
		 */
		maxlength?: number;
		
		/**
		 * Minimum length
		 */
		minlength?: number;
		
		/**
		 * Pattern for validation
		 */
		pattern?: string;
		
		/**
		 * Autocomplete attribute
		 */
		autocomplete?: string;
		
		/**
		 * Input ID
		 */
		id?: string;
		
		/**
		 * Input name
		 */
		name?: string;
		
		/**
		 * Textarea rows
		 */
		rows?: number;
		
		/**
		 * Textarea columns
		 */
		cols?: number;
		
		/**
		 * Select options
		 */
		options?: SelectOption[];
		
		/**
		 * Custom CSS class
		 */
		class?: string;
		
		/**
		 * Whether to sanitize input
		 */
		sanitize?: boolean;
	}

	// Component props with defaults
	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		label = '',
		error = '',
		required = false,
		disabled = false,
		maxlength = undefined,
		minlength = undefined,
		pattern = undefined,
		autocomplete = undefined,
		id = undefined,
		name = undefined,
		rows = undefined,
		cols = undefined,
		options = [],
		class: className = '',
		sanitize = true
	}: ValidatedInputProps = $props();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		input: { value: string | number };
		blur: { value: string | number };
		focus: { value: string | number };
	}>();

	let inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;
	let touched: boolean = $state(false);

	function handleInput(event: Event): void {
		touched = true;
		const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		let newValue: string | number = target.value;
		
		// Sanitize input for security if enabled
		if (sanitize && (type === 'text' || type === 'textarea' || type === 'search')) {
			newValue = sanitizeHTML(String(newValue));
		}
		
		// Convert to number for number inputs
		if (type === 'number' && newValue !== '') {
			const numValue = Number(newValue);
			if (!isNaN(numValue)) {
				newValue = numValue;
			}
		}
		
		value = newValue;
		dispatch('input', { value: newValue });
	}

	function handleBlur(event: Event): void {
		touched = true;
		const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		dispatch('blur', { value: target.value });
	}

	function handleFocus(event: Event): void {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		dispatch('focus', { value: target.value });
	}

	// Determine input class based on validation state
	$: inputClass = `form-input ${className} ${(error && touched) ? 'error' : ''} ${disabled ? 'disabled' : ''}`;
	$: showError = error && touched;
	$: errorMessage = Array.isArray(error) ? error.join(', ') : error;
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
			bind:value
			on:input={handleInput}
			on:blur={handleBlur}
			on:focus={handleFocus}
		></textarea>
	{:else if type === 'select'}
		<select
			bind:this={inputElement}
			{id}
			{name}
			{required}
			{disabled}
			class={inputClass}
			bind:value
			on:change={handleInput}
			on:blur={handleBlur}
			on:focus={handleFocus}
		>
			<option value="" disabled={required}>
				{placeholder || 'Select an option...'}
			</option>
			{#each options as option}
				<option 
					value={option.value} 
					disabled={option.disabled}
				>
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
			bind:value
			on:input={handleInput}
			on:blur={handleBlur}
			on:focus={handleFocus}
		/>
	{/if}

	{#if showError}
		<div class="error-message" role="alert" aria-live="polite">
			{errorMessage}
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
