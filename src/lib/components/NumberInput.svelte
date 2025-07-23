<!--
  NumberInput component - Focused on numeric inputs
-->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { sanitizeHTML } from '../validation';

	interface NumberInputProps {
		value?: number | string;
		placeholder?: string;
		label?: string;
		error?: string | string[];
		required?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		name?: string;
		min?: number;
		max?: number;
		step?: number;
		class?: string;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		label = '',
		error = '',
		required = false,
		disabled = false,
		readonly = false,
		id = undefined,
		name = undefined,
		min = undefined,
		max = undefined,
		step = undefined,
		class: className = ''
	}: NumberInputProps = $props();

	const dispatch = createEventDispatcher<{
		input: { value: number | string };
		blur: { value: number | string };
		focus: { value: number | string };
	}>();

	let inputElement: HTMLInputElement | null = null;
	let touched: boolean = $state(false);

	function handleInput(event: Event): void {
		touched = true;
		const target = event.target as HTMLInputElement;
		const newValue = target.value;
		
		// For number inputs, try to convert to number or keep as string for empty/invalid
		if (newValue === '') {
			value = '';
		} else {
			const numValue = parseFloat(newValue);
			value = isNaN(numValue) ? newValue : numValue;
		}
		
		dispatch('input', { value });
	}

	function handleBlur(event: FocusEvent): void {
		touched = true;
		const target = event.target as HTMLInputElement;
		const targetValue = target.value;
		
		// Convert to number on blur if valid
		if (targetValue !== '') {
			const numValue = parseFloat(targetValue);
			if (!isNaN(numValue)) {
				value = numValue;
			}
		}
		
		dispatch('blur', { value });
	}

	function handleFocus(event: FocusEvent): void {
		const target = event.target as HTMLInputElement;
		dispatch('focus', { value: target.value });
	}

	function handleKeyPress(event: KeyboardEvent): void {
		// Allow: backspace, delete, tab, escape, enter
		if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
			// Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
			(event.keyCode === 65 && event.ctrlKey === true) ||
			(event.keyCode === 67 && event.ctrlKey === true) ||
			(event.keyCode === 86 && event.ctrlKey === true) ||
			(event.keyCode === 88 && event.ctrlKey === true) ||
			// Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
				return;
		}
		
		// Ensure that it is a number and stop the keypress
		if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
			(event.keyCode < 96 || event.keyCode > 105) &&
			event.keyCode !== 110 && event.keyCode !== 190) { // Allow decimal point
			event.preventDefault();
		}
	}

	// Computed properties
	const hasError = $derived(Array.isArray(error) ? error.length > 0 : Boolean(error));
	const errorMessages = $derived(Array.isArray(error) ? error : error ? [error] : []);
	const inputId = $derived(id || `number-input-${Math.random().toString(36).substring(7)}`);
	const displayValue = $derived(typeof value === 'number' ? value.toString() : value);
</script>

<div class="number-input-wrapper {className}">
	{#if label}
		<label for={inputId} class="number-input-label">
			{label}
			{#if required}<span class="required">*</span>{/if}
		</label>
	{/if}
	
	<input
		bind:this={inputElement}
		value={displayValue}
		type="number"
		{placeholder}
		{required}
		{disabled}
		{readonly}
		{name}
		{min}
		{max}
		{step}
		id={inputId}
		class="number-input {hasError ? 'error' : ''} {touched ? 'touched' : ''}"
		oninput={handleInput}
		onblur={handleBlur}
		onfocus={handleFocus}
		onkeypress={handleKeyPress}
	/>
	
	{#if hasError && touched}
		<div class="error-messages">
			{#each errorMessages as errorMsg}
				<span class="error-message">{@html sanitizeHTML(errorMsg)}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.number-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.number-input-label {
		font-weight: 500;
		color: var(--color-text, #374151);
		font-size: 0.875rem;
	}

	.required {
		color: var(--color-error, #ef4444);
		margin-left: 0.125rem;
	}

	.number-input {
		padding: 0.75rem;
		border: 1px solid var(--color-border, #d1d5db);
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		background: var(--color-input-bg, white);
		color: var(--color-text, #374151);
	}

	.number-input:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px var(--color-primary-light, rgba(59, 130, 246, 0.1));
	}

	.number-input.error {
		border-color: var(--color-error, #ef4444);
	}

	.number-input.error:focus {
		border-color: var(--color-error, #ef4444);
		box-shadow: 0 0 0 3px var(--color-error-light, rgba(239, 68, 68, 0.1));
	}

	.number-input:disabled {
		background-color: var(--color-disabled-bg, #f9fafb);
		color: var(--color-disabled-text, #9ca3af);
		cursor: not-allowed;
	}

	.number-input:read-only {
		background-color: var(--color-readonly-bg, #f3f4f6);
		cursor: default;
	}

	.error-messages {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.error-message {
		color: var(--color-error, #ef4444);
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Remove number input spinners in WebKit browsers */
	.number-input::-webkit-outer-spin-button,
	.number-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Remove number input spinners in Firefox */
	.number-input[type=number] {
		-moz-appearance: textfield;
	}
</style>
