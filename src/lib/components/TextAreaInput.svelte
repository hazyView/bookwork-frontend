<!--
  TextAreaInput component - Focused on multi-line text inputs
-->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { sanitizeHTML } from '../validation';

	interface TextAreaInputProps {
		value?: string;
		placeholder?: string;
		label?: string;
		error?: string | string[];
		required?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		name?: string;
		rows?: number;
		cols?: number;
		maxlength?: number;
		minlength?: number;
		resize?: 'none' | 'vertical' | 'horizontal' | 'both';
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
		rows = 4,
		cols = undefined,
		maxlength = undefined,
		minlength = undefined,
		resize = 'vertical',
		class: className = ''
	}: TextAreaInputProps = $props();

	const dispatch = createEventDispatcher<{
		input: { value: string };
		blur: { value: string };
		focus: { value: string };
	}>();

	let textareaElement: HTMLTextAreaElement | null = null;
	let touched: boolean = $state(false);

	function handleInput(event: Event): void {
		touched = true;
		const target = event.target as HTMLTextAreaElement;
		const newValue = target.value;
		value = newValue;
		dispatch('input', { value: newValue });
		
		// Auto-resize textarea if needed
		if (resize === 'vertical' || resize === 'both') {
			autoResize();
		}
	}

	function handleBlur(event: FocusEvent): void {
		touched = true;
		const target = event.target as HTMLTextAreaElement;
		dispatch('blur', { value: target.value });
	}

	function handleFocus(event: FocusEvent): void {
		const target = event.target as HTMLTextAreaElement;
		dispatch('focus', { value: target.value });
	}

	function autoResize(): void {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}
	}

	// Computed properties
	const hasError = $derived(Array.isArray(error) ? error.length > 0 : Boolean(error));
	const errorMessages = $derived(Array.isArray(error) ? error : error ? [error] : []);
	const textareaId = $derived(id || `textarea-input-${Math.random().toString(36).substring(7)}`);
	const characterCount = $derived(value ? value.length : 0);
	const showCharacterCount = $derived(Boolean(maxlength));
</script>

<div class="textarea-input-wrapper {className}">
	{#if label}
		<label for={textareaId} class="textarea-input-label">
			{label}
			{#if required}<span class="required">*</span>{/if}
		</label>
	{/if}
	
	<textarea
		bind:this={textareaElement}
		bind:value
		{placeholder}
		{required}
		{disabled}
		{readonly}
		{name}
		{rows}
		{cols}
		{maxlength}
		{minlength}
		id={textareaId}
		class="textarea-input {hasError ? 'error' : ''} {touched ? 'touched' : ''}"
		style="resize: {resize};"
		oninput={handleInput}
		onblur={handleBlur}
		onfocus={handleFocus}
	></textarea>
	
	{#if showCharacterCount}
		<div class="character-count">
			<span class="count {characterCount === maxlength ? 'limit-reached' : ''}">
				{characterCount}{#if maxlength}/{maxlength}{/if}
			</span>
		</div>
	{/if}
	
	{#if hasError && touched}
		<div class="error-messages">
			{#each errorMessages as errorMsg}
				<span class="error-message">{@html sanitizeHTML(errorMsg)}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.textarea-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.textarea-input-label {
		font-weight: 500;
		color: var(--color-text, #374151);
		font-size: 0.875rem;
	}

	.required {
		color: var(--color-error, #ef4444);
		margin-left: 0.125rem;
	}

	.textarea-input {
		padding: 0.75rem;
		border: 1px solid var(--color-border, #d1d5db);
		border-radius: 0.375rem;
		font-size: 1rem;
		font-family: inherit;
		line-height: 1.5;
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		background: var(--color-input-bg, white);
		color: var(--color-text, #374151);
		min-height: 100px;
	}

	.textarea-input:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px var(--color-primary-light, rgba(59, 130, 246, 0.1));
	}

	.textarea-input.error {
		border-color: var(--color-error, #ef4444);
	}

	.textarea-input.error:focus {
		border-color: var(--color-error, #ef4444);
		box-shadow: 0 0 0 3px var(--color-error-light, rgba(239, 68, 68, 0.1));
	}

	.textarea-input:disabled {
		background-color: var(--color-disabled-bg, #f9fafb);
		color: var(--color-disabled-text, #9ca3af);
		cursor: not-allowed;
	}

	.textarea-input:read-only {
		background-color: var(--color-readonly-bg, #f3f4f6);
		cursor: default;
	}

	.character-count {
		display: flex;
		justify-content: flex-end;
		margin-top: -0.25rem;
	}

	.count {
		font-size: 0.75rem;
		color: var(--color-text-muted, #6b7280);
	}

	.count.limit-reached {
		color: var(--color-error, #ef4444);
		font-weight: 500;
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
