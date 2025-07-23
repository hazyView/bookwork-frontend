<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { chatOpen, chatMessages } from '$lib/stores';
	import { MessageCircle, X, Send, Bot, User } from 'lucide-svelte';
	import type { ComponentEvents } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	/**
	 * Chat message interface
	 */
	interface ChatMessage {
		id: number;
		text: string;
		sender: 'user' | 'bot';
		timestamp: Date;
	}

	/**
	 * ChatWidget component props interface
	 */
	interface ChatWidgetProps {
		/**
		 * Custom CSS class for the chat widget
		 */
		class?: string;
		
		/**
		 * Initial chat messages
		 */
		initialMessages?: ChatMessage[];
		
		/**
		 * Whether to show typing indicators
		 */
		showTypingIndicator?: boolean;
		
		/**
		 * Maximum number of messages to keep in history
		 */
		maxMessages?: number;
		
		/**
		 * Bot response delay in milliseconds
		 */
		botResponseDelay?: number;
	}

	// Component props with defaults
	let {
		class: className = '',
		initialMessages = [],
		showTypingIndicator = true,
		maxMessages = 100,
		botResponseDelay = 1000
	}: ChatWidgetProps = $props();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		messagesSent: { message: ChatMessage };
		chatOpened: void;
		chatClosed: void;
		messagesCleared: void;
	}>();

	let messageInput: string = '';
	let chatModal: HTMLDivElement | null = null;
	let messageContainer: HTMLDivElement | null = null;
	let previouslyFocused: HTMLElement | null = null;
	let isTyping: boolean = false;

	function toggleChat(): void {
		if ($chatOpen) {
			closeChat();
		} else {
			openChat();
		}
	}

	function openChat(): void {
		previouslyFocused = document.activeElement as HTMLElement;
		chatOpen.set(true);
		dispatch('chatOpened');
		
		// Focus the chat input after the modal opens
		setTimeout(() => {
			const input = chatModal?.querySelector('input') as HTMLInputElement;
			if (input) input.focus();
		}, 100);
	}

	function closeChat(): void {
		chatOpen.set(false);
		dispatch('chatClosed');
		
		// Return focus to the previously focused element
		if (previouslyFocused) {
			previouslyFocused.focus();
		}
	}

	function sendMessage(): void {
		if (!messageInput.trim()) return;

		const userMessage: ChatMessage = {
			id: Date.now(),
			text: messageInput.trim(),
			sender: 'user',
			timestamp: new Date()
		};

		chatMessages.update(messages => {
			// Limit message history
			const updatedMessages = [...messages, userMessage];
			return updatedMessages.length > maxMessages 
				? updatedMessages.slice(-maxMessages) 
				: updatedMessages;
		});
		
		dispatch('messagesSent', { message: userMessage });
		messageInput = '';

		// Show typing indicator
		if (showTypingIndicator) {
			isTyping = true;
		}

		// Simulate bot response
		setTimeout(() => {
			const botResponse: ChatMessage = {
				id: Date.now() + 1,
				text: getBotResponse(userMessage.text),
				sender: 'bot',
				timestamp: new Date()
			};
			
			chatMessages.update(messages => {
				const updatedMessages = [...messages, botResponse];
				return updatedMessages.length > maxMessages 
					? updatedMessages.slice(-maxMessages) 
					: updatedMessages;
			});
			
			isTyping = false;
			
			// Scroll to bottom after bot response
			if (messageContainer) {
				messageContainer.scrollTop = messageContainer.scrollHeight;
			}
		}, botResponseDelay);
	}

	function getBotResponse(userMessage: string): string {
		const message = userMessage.toLowerCase();
		
		if (message.includes('hello') || message.includes('hi')) {
			return "Hello! I'm here to help you with BookWorm. How can I assist you today?";
		}
		
		if (message.includes('club') || message.includes('member')) {
			return "I can help you with club management, member roster, and organizing meetings. What specific information do you need?";
		}
		
		if (message.includes('schedule') || message.includes('meeting')) {
			return "For scheduling help, you can visit the Schedule page to view and add events. Need help with a specific scheduling task?";
		}
		
		if (message.includes('availability')) {
			return "You can set your availability for meetings on the Availability page. This helps other members know who's coming to events.";
		}
		
		if (message.includes('tracking') || message.includes('items')) {
			return "The Event Item Tracker helps coordinate what members bring to meetings. You can add items and see what others are bringing.";
		}
		
		if (message.includes('help') || message.includes('support')) {
			return "I'm here to help! You can ask me about club features, or visit our Support section for detailed guides and documentation.";
		}
		
		return "Thanks for your message! I'm a demo support bot. For real assistance, please visit our Support section or contact our team directly.";
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		} else if (event.key === 'Escape') {
			closeChat();
		}
	}

	function handleChatKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			closeChat();
		} else if (event.key === 'Tab') {
			// Trap focus within the modal
			if (!chatModal) return;
			
			const focusableElements = chatModal.querySelectorAll(
				'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
			) as NodeListOf<HTMLElement>;
			
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}

	function clearMessages(): void {
		chatMessages.set([]);
		dispatch('messagesCleared');
	}

	// Initialize messages on mount
	onMount(() => {
		// Add initial messages if provided
		if (initialMessages.length > 0) {
			chatMessages.set(initialMessages);
		} else if ($chatMessages.length === 0) {
			// Add welcome message if no messages exist
			chatMessages.set([
				{
					id: 1,
					text: "Welcome to BookWorm Support! I'm here to help you with any questions about using the platform. How can I assist you today?",
					sender: 'bot',
					timestamp: new Date()
				}
			]);
		}
	});

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (messageContainer && $chatMessages.length > 0) {
			setTimeout(() => {
				if (messageContainer) {
					messageContainer.scrollTop = messageContainer.scrollHeight;
				}
			}, 50);
		}
	});
</script>

<!-- Chat Toggle Button -->
{#if !$chatOpen}
	<button 
		class="chat-toggle {className}" 
		on:click={toggleChat} 
		aria-label="Open chat support"
		title="Open Chat Support"
	>
		<MessageCircle size={24} />
		<span class="chat-notification" aria-hidden="true">?</span>
	</button>
{/if}

<!-- Chat Widget -->
{#if $chatOpen}
	<div 
		class="chat-widget {className}"
		role="dialog"
		aria-labelledby="chat-title"
		aria-describedby="chat-description"
		aria-modal="true"
		bind:this={chatModal}
		on:keydown={handleChatKeydown}
	>
		<div class="chat-header">
			<div class="chat-title" id="chat-title">
				<Bot size={20} />
				<span>BookWorm Support</span>
			</div>
			<button 
				class="chat-close" 
				on:click={closeChat}
				aria-label="Close chat"
				title="Close Chat"
			>
				<X size={20} />
			</button>
		</div>

		<p id="chat-description" class="sr-only">
			Live chat support for BookWorm platform. Use arrow keys to navigate messages and Tab to move between interactive elements.
		</p>

		<div 
			class="chat-messages" 
			bind:this={messageContainer}
			role="log" 
			aria-live="polite"
			aria-label="Chat messages"
		>
			{#each $chatMessages as message (message.id)}
				<div class="message" class:user-message={message.sender === 'user'} class:bot-message={message.sender === 'bot'}>
					<div class="message-avatar">
						{#if message.sender === 'user'}
							<User size={16} />
						{:else}
							<Bot size={16} />
						{/if}
					</div>
					<div class="message-content">
						<p class="message-text">{message.text}</p>
						<span class="message-time">
							{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
						</span>
					</div>
				</div>
			{/each}
			
			{#if isTyping && showTypingIndicator}
				<div class="message bot-message typing-indicator">
					<div class="message-avatar">
						<Bot size={16} />
					</div>
					<div class="message-content">
						<div class="typing-animation">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div class="chat-input-container">
			<div class="chat-input-wrapper">
				<label for="chat-input" class="sr-only">Type your message</label>
				<textarea
					id="chat-input"
					bind:value={messageInput}
					on:keydown={handleKeydown}
					placeholder="Type your message..."
					rows="1"
					class="chat-input"
					aria-describedby="chat-input-help"
				></textarea>
				<div id="chat-input-help" class="sr-only">
					Press Enter to send, Shift+Enter for new line, Escape to close chat
				</div>
				<button 
					class="send-button" 
					on:click={sendMessage}
					disabled={!messageInput.trim()}
					aria-label="Send message"
					title="Send message"
				>
					<Send size={16} />
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.chat-toggle {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 3.5rem;
		height: 3.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		z-index: 1000;
		position: relative;
	}

	.chat-toggle:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	.chat-notification {
		position: absolute;
		top: -5px;
		right: -5px;
		width: 1.5rem;
		height: 1.5rem;
		background: #ef4444;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.chat-widget {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 24rem;
		height: 32rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		z-index: 1000;
		overflow: hidden;
	}

	.chat-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chat-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
	}

	.chat-close {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;
	}

	.chat-close:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.chat-messages {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.message {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.user-message {
		flex-direction: row-reverse;
	}

	.message-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.user-message .message-avatar {
		background: #3b82f6;
		color: white;
	}

	.bot-message .message-avatar {
		background: #f3f4f6;
		color: #6b7280;
	}

	.message-content {
		max-width: 70%;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.user-message .message-content {
		align-items: flex-end;
	}

	.bot-message .message-content {
		align-items: flex-start;
	}

	.message-text {
		background: #f3f4f6;
		padding: 0.75rem;
		border-radius: 1rem;
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.4;
		word-wrap: break-word;
	}

	.user-message .message-text {
		background: #3b82f6;
		color: white;
		border-bottom-right-radius: 0.25rem;
	}

	.bot-message .message-text {
		border-bottom-left-radius: 0.25rem;
	}

	.message-time {
		font-size: 0.75rem;
		color: #6b7280;
		padding: 0 0.5rem;
	}

	.chat-input-container {
		padding: 1rem;
		border-top: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.chat-input-wrapper {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
	}

	.chat-input {
		flex: 1;
		border: 1px solid #d1d5db;
		border-radius: 1rem;
		padding: 0.75rem;
		font-size: 0.875rem;
		resize: none;
		outline: none;
		transition: border-color 0.2s ease;
		max-height: 6rem;
		min-height: 2.5rem;
	}

	.chat-input:focus {
		border-color: #3b82f6;
	}

	.send-button {
		width: 2.5rem;
		height: 2.5rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
		flex-shrink: 0;
	}

	.send-button:hover:not(:disabled) {
		background: #2563eb;
	}

	.send-button:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	@media (max-width: 480px) {
		.chat-widget {
			bottom: 0;
			right: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			border-radius: 0;
		}

		.chat-toggle {
			bottom: 1rem;
			right: 1rem;
		}
	}

	/* Screen reader only class */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Typing indicator animation */
	.typing-indicator .message-content {
		padding: 0.5rem 0.75rem;
	}

	.typing-animation {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		height: 1rem;
	}

	.typing-animation span {
		width: 0.5rem;
		height: 0.5rem;
		background: #9ca3af;
		border-radius: 50%;
		animation: typing-bounce 1.4s infinite ease-in-out both;
	}

	.typing-animation span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-animation span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes typing-bounce {
		0%, 80%, 100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
