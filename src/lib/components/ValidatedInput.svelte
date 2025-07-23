<!--
  ValidatedInput - Orchestration component delegating to specialized input components
  This component serves as a facade/adapter for the specialized input components
-->
<script lang="ts">
	import TextInput from './TextInput.svelte';
	import NumberInput from './NumberInput.svelte';
	import TextAreaInput from './TextAreaInput.svelte';
	import SelectInput from './SelectInput.svelte';
	import { createEventDispatcher } from 'svelte';

	interface SelectOption {
		value: string | number;
		label: string;
		disabled?: boolean;
	}

	interface ValidatedInputProps {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select';
		value?: string | number;
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
		min?: number;
		max?: number;
		step?: number;
		pattern?: string;
		autocomplete?: string;
		options?: SelectOption[];
		class?: string;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		label = '',
		error = '',
		required = false,
		disabled = false,
		readonly = false,
		maxlength = undefined,
		minlength = undefined,
		min = undefined,
		max = undefined,
		step = undefined,
		pattern = undefined,
		autocomplete = undefined,
		id = undefined,
		name = undefined,
		rows = 4,
		cols = undefined,
		options = [],
		class: className = ''
	}: ValidatedInputProps = $props();

	const dispatch = createEventDispatcher<{
		input: { value: string | number };
		blur: { value: string | number };
		focus: { value: string | number };
	}>();

	function handleInput(event: CustomEvent): void {
		dispatch('input', event.detail);
	}

	function handleBlur(event: CustomEvent): void {
		dispatch('blur', event.detail);
	}

	function handleFocus(event: CustomEvent): void {
		dispatch('focus', event.detail);
	}
</script>

<!-- Delegation to specialized components based on type -->
{#if type === 'number'}
	<NumberInput
		bind:value
		{placeholder}
		{label}
		{error}
		{required}
		{disabled}
		{readonly}
		{id}
		{name}
		{min}
		{max}
		{step}
		class={className}
		on:input={handleInput}
		on:blur={handleBlur}
		on:focus={handleFocus}
	/>
{:else if type === 'textarea'}
	<TextAreaInput
		bind:value={value}
		{placeholder}
		{label}
		{error}
		{required}
		{disabled}
		{readonly}
		{id}
		{name}
		{rows}
		{cols}
		{maxlength}
		{minlength}
		class={className}
		on:input={handleInput}
		on:blur={handleBlur}
		on:focus={handleFocus}
	/>
{:else if type === 'select'}
	<SelectInput
		bind:value
		{placeholder}
		{label}
		{error}
		{required}
		{disabled}
		{id}
		{name}
		{options}
		class={className}
		on:input={handleInput}
		on:blur={handleBlur}
		on:focus={handleFocus}
	/>
{:else}
	<!-- Default to TextInput for text, email, password, tel, url, search -->
	<TextInput
		bind:value={value}
		{type}
		{placeholder}
		{label}
		{error}
		{required}
		{disabled}
		{readonly}
		{id}
		{name}
		{maxlength}
		{minlength}
		{pattern}
		{autocomplete}
		class={className}
		on:input={handleInput}
		on:blur={handleBlur}
		on:focus={handleFocus}
	/>
{/if}
