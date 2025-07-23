<!--
  SelectInput component - Focused on dropdown/select inputs
-->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface SelectOption {
		value: string | number;
		label: string;
		disabled?: boolean;
	}

	interface SelectInputProps {
		value?: string | number;
		placeholder?: string;
		label?: string;
		error?: string | string[];
		required?: boolean;
		disabled?: boolean;
		id?: string;
		name?: string;
		options?: SelectOption[];
		class?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Select an option...',
		label = '',
		error = '',
		required = false,
		disabled = false,
		id = undefined,
		name = undefined,
		options = [],
		class: className = ''
	}: SelectInputProps = $props();

	const dispatch = createEventDispatcher<{
		input: { value: string | number };
		blur: { value: string | number };
		focus: { value: string | number };
	}>();

	let selectElement: HTMLSelectElement | null = null;
	let touched: boolean = $state(false);

	function handleInput(event: Event): void {
		touched = true;
		const target = event.target as HTMLSelectElement;
		const newValue = target.value;
		value = newValue;
		dispatch('input', { value: newValue });
	}

	function handleBlur(event: FocusEvent): void {
		touched = true;
		const target = event.target as HTMLSelectElement;
		dispatch('blur', { value: target.value });
	}

	function handleFocus(event: FocusEvent): void {
		const target = event.target as HTMLSelectElement;
		dispatch('focus', { value: target.value });
	}

	// Computed properties
	const hasError = $derived(Array.isArray(error) ? error.length > 0 : Boolean(error));
	const errorMessages = $derived(Array.isArray(error) ? error : error ? [error] : []);
	const selectId = $derived(id || `select-input-${Math.random().toString(36).substring(7)}`);
</script>

<div class="select-input-wrapper {className}">
	{#if label}
		<label for={selectId} class="select-input-label">
			{label}
			{#if required}<span class="required">*</span>{/if}
		</label>
	{/if}
	
	<select
		bind:this={selectElement}
		{value}
		{required}
		{disabled}
		{name}
		id={selectId}
		class="select-input {hasError ? 'error' : ''} {touched ? 'touched' : ''}"
		oninput={handleInput}
		onblur={handleBlur}
		onfocus={handleFocus}
	>
		{#if placeholder && !value}
			<option value="" disabled selected>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>
	
	{#if hasError && touched}
		<div class="error-messages">
			{#each errorMessages as errorMsg}
				<span class="error-message">{errorMsg}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.select-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.select-input-label {
		font-weight: 500;
		color: var(--color-text, #374151);
		font-size: 0.875rem;
	}

	.required {
		color: var(--color-error, #ef4444);
		margin-left: 0.125rem;
	}

	.select-input {
		padding: 0.75rem;
		border: 1px solid var(--color-border, #d1d5db);
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		background: var(--color-input-bg, white);
		color: var(--color-text, #374151);
		cursor: pointer;
	}

	.select-input:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px var(--color-primary-light, rgba(59, 130, 246, 0.1));
	}

	.select-input.error {
		border-color: var(--color-error, #ef4444);
	}

	.select-input.error:focus {
		border-color: var(--color-error, #ef4444);
		box-shadow: 0 0 0 3px var(--color-error-light, rgba(239, 68, 68, 0.1));
	}

	.select-input:disabled {
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
