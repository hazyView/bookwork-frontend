<!--
  TextInput component - Focused on text-based inputs
  Handles: text, email, password, url, search inputs
-->
<script lang="ts">
	import { sanitizeHTML } from '$lib/validation';
	import { createEventDispatcher } from 'svelte';

	interface TextInputProps {
		type?: 'text' | 'email' | 'password' | 'url' | 'search';
		value?: string;
		placeholder?: string;
		label?: string;
		error?: string | string[];
		required?: boolean;
		disabled?: boolean;
		maxlength?: number;
		minlength?: number;
		pattern?: string;
		autocomplete?: string;
		id?: string;
		name?: string;
		class?: string;
		sanitize?: boolean;
	}

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
		class: className = '',
		sanitize = true
	}: TextInputProps = $props();

	const dispatch = createEventDispatcher<{
		input: { value: string };
		blur: { value: string };
		focus: { value: string };
	}>();

	let inputElement: HTMLInputElement | null = null;
	let touched: boolean = $state(false);

	function handleInput(event: Event): void {
		touched = true;
		const target = event.target as HTMLInputElement;
		let newValue = target.value;
		
		if (sanitize && (type === 'text' || type === 'search')) {
			newValue = sanitizeHTML(newValue);
		}
		
		value = newValue;
		dispatch('input', { value: newValue });
	}

	function handleBlur(event: FocusEvent): void {
		touched = true;
		const target = event.target as HTMLInputElement;
		dispatch('blur', { value: target.value });
	}

	function handleFocus(event: FocusEvent): void {
		const target = event.target as HTMLInputElement;
		dispatch('focus', { value: target.value });
	}

	// Computed properties
	const hasError = $derived(Array.isArray(error) ? error.length > 0 : Boolean(error));
	const errorMessages = $derived(Array.isArray(error) ? error : error ? [error] : []);
	const inputId = $derived(id || `text-input-${Math.random().toString(36).substring(7)}`);
</script>

<div class="text-input-wrapper {className}">
	{#if label}
		<label for={inputId} class="text-input-label">
			{label}
			{#if required}<span class="required">*</span>{/if}
		</label>
	{/if}
	
	<input
		bind:this={inputElement}
		{type}
		{value}
		{placeholder}
		{required}
		{disabled}
		{maxlength}
		{minlength}
		{pattern}
		{autocomplete}
		{name}
		id={inputId}
		class="text-input {hasError ? 'error' : ''} {touched ? 'touched' : ''}"
		oninput={handleInput}
		onblur={handleBlur}
		onfocus={handleFocus}
	/>
	
	{#if hasError && touched}
		<div class="error-messages">
			{#each errorMessages as errorMsg}
				<span class="error-message">{errorMsg}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.text-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.text-input-label {
		font-weight: 500;
		color: var(--color-text, #374151);
		font-size: 0.875rem;
	}

	.required {
		color: var(--color-error, #ef4444);
		margin-left: 0.125rem;
	}

	.text-input {
		padding: 0.75rem;
		border: 1px solid var(--color-border, #d1d5db);
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		background: var(--color-input-bg, white);
		color: var(--color-text, #374151);
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px var(--color-primary-light, rgba(59, 130, 246, 0.1));
	}

	.text-input.error {
		border-color: var(--color-error, #ef4444);
	}

	.text-input.error:focus {
		border-color: var(--color-error, #ef4444);
		box-shadow: 0 0 0 3px var(--color-error-light, rgba(239, 68, 68, 0.1));
	}

	.text-input:disabled {
		background-color: var(--color-disabled-bg, #f9fafb);
		color: var(--color-disabled-text, #9ca3af);
		cursor: not-allowed;
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
</style>
