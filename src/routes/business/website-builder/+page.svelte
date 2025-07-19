<script>
	import { onMount } from 'svelte';
	import { builderModules, selectedModule } from '$lib/stores.js';
	import { generateId } from '$lib/utils.js';
	import { 
		Type, 
		Image as ImageIcon, 
		Video, 
		MousePointer, 
		Columns, 
		Info, 
		FileText,
		Move,
		Edit3,
		Trash2,
		Eye,
		Save,
		Undo,
		Redo
	} from 'lucide-svelte';

	let draggedModule = null;
	let dragOverIndex = null;
	let editingModule = null;
	let previewMode = false;
	let saveStatus = '';

	const moduleTypes = [
		{
			type: 'text',
			name: 'Basic Text Block',
			icon: Type,
			defaultContent: {
				text: 'Click to edit this text. You can add headings, paragraphs, and format your content.',
				fontSize: '16px',
				textAlign: 'left',
				fontWeight: 'normal'
			}
		},
		{
			type: 'image',
			name: 'Media (Image/Video)',
			icon: ImageIcon,
			defaultContent: {
				src: 'https://via.placeholder.com/400x200?text=Your+Image',
				alt: 'Image placeholder',
				caption: 'Add your image caption here',
				width: '100%'
			}
		},
		{
			type: 'video',
			name: 'Video Embed',
			icon: Video,
			defaultContent: {
				src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
				title: 'Video Title',
				width: '100%',
				height: '315px'
			}
		},
		{
			type: 'cta',
			name: 'Call-to-Action Button',
			icon: MousePointer,
			defaultContent: {
				text: 'Click Here',
				href: '#',
				backgroundColor: '#3b82f6',
				textColor: '#ffffff',
				borderRadius: '8px',
				padding: '12px 24px'
			}
		},
		{
			type: 'columns',
			name: 'Two-Column Layout',
			icon: Columns,
			defaultContent: {
				leftContent: 'Left column content goes here. You can add text, images, or other elements.',
				rightContent: 'Right column content goes here. Perfect for side-by-side layouts.'
			}
		},
		{
			type: 'info',
			name: 'Info Box',
			icon: Info,
			defaultContent: {
				title: 'Information Box',
				content: 'This is an information box. Use it to highlight important content or announcements.',
				backgroundColor: '#eff6ff',
				borderColor: '#3b82f6',
				iconColor: '#3b82f6'
			}
		},
		{
			type: 'posts',
			name: 'Posts Feed',
			icon: FileText,
			defaultContent: {
				title: 'Latest Posts',
				count: 3,
				showExcerpt: true,
				showDate: true
			}
		}
	];

	// Save to localStorage whenever modules change
	$: if ($builderModules && typeof window !== 'undefined') {
		try {
			localStorage.setItem('websiteBuilder', JSON.stringify($builderModules));
			saveStatus = 'Saved';
			setTimeout(() => { saveStatus = ''; }, 2000);
		} catch (error) {
			console.error('Failed to save website data:', error);
			saveStatus = 'Save failed';
			setTimeout(() => { saveStatus = ''; }, 3000);
		}
	}

	onMount(() => {
		// Load from localStorage on mount
		const saved = localStorage.getItem('websiteBuilder');
		if (saved) {
			try {
				const parsedData = JSON.parse(saved);
				if (Array.isArray(parsedData) && parsedData.length > 0) {
					builderModules.set(parsedData);
					return;
				}
			} catch (error) {
				console.error('Failed to load saved website data:', error);
				// Initialize with default content on error
			}
		}
		
		// Initialize with default content if no saved data or loading failed
		builderModules.set([
			{
				id: generateId(),
				type: 'text',
				content: {
					text: 'Welcome to My Author Website',
					fontSize: '32px',
					textAlign: 'center',
					fontWeight: 'bold'
				}
			},
			{
				id: generateId(),
				type: 'text',
				content: {
					text: 'Discover my latest books and join the literary journey.',
					fontSize: '18px',
					textAlign: 'center',
					fontWeight: 'normal'
				}
			}
		]);
	});

	function startDrag(event, moduleType) {
		draggedModule = moduleType;
		event.dataTransfer.effectAllowed = 'copy';
	}

	function handleDragOver(event, index) {
		event.preventDefault();
		dragOverIndex = index;
	}

	function handleDrop(event, index) {
		event.preventDefault();
		
		if (draggedModule) {
			const newModule = {
				id: generateId(),
				type: draggedModule.type,
				content: { ...draggedModule.defaultContent }
			};

			builderModules.update(modules => {
				const newModules = [...modules];
				newModules.splice(index, 0, newModule);
				return newModules;
			});
		}

		draggedModule = null;
		dragOverIndex = null;
	}

	function selectModule(moduleId) {
		if (previewMode) return;
		
		selectedModule.set(moduleId);
		const module = $builderModules.find(m => m.id === moduleId);
		if (module) {
			editingModule = { ...module };
		}
	}

	function updateModule() {
		if (!editingModule) return;

		builderModules.update(modules =>
			modules.map(m => m.id === editingModule.id ? { ...editingModule } : m)
		);
		
		editingModule = null;
		selectedModule.set(null);
	}

	function deleteModule(moduleId) {
		builderModules.update(modules => modules.filter(m => m.id !== moduleId));
		if ($selectedModule === moduleId) {
			selectedModule.set(null);
			editingModule = null;
		}
	}

	function moveModule(fromIndex, toIndex) {
		builderModules.update(modules => {
			const newModules = [...modules];
			const [movedModule] = newModules.splice(fromIndex, 1);
			newModules.splice(toIndex, 0, movedModule);
			return newModules;
		});
	}

	function togglePreview() {
		previewMode = !previewMode;
		if (previewMode) {
			selectedModule.set(null);
			editingModule = null;
		}
	}

	function saveWebsite() {
		// Simulate saving
		alert('Website saved successfully! In a real application, this would save to your account.');
	}
</script>

<svelte:head>
	<title>Website Builder - BookWorm</title>
</svelte:head>

<div class="builder-container">
	<!-- Builder Header -->
	<div class="builder-header">
		<h1 class="builder-title">Website Builder</h1>
		<div class="builder-actions">
			<button class="btn btn-outline btn-sm" disabled>
				<Undo size={14} />
				Undo
			</button>
			<button class="btn btn-outline btn-sm" disabled>
				<Redo size={14} />
				Redo
			</button>
			<button class="btn btn-outline btn-sm" on:click={togglePreview}>
				<Eye size={14} />
				{previewMode ? 'Edit' : 'Preview'}
			</button>
			<button class="btn btn-primary btn-sm" on:click={saveWebsite}>
				<Save size={14} />
				Save
			</button>
		</div>
	</div>

	<div class="builder-layout">
		<!-- Toolbox -->
		{#if !previewMode}
			<div class="toolbox">
				<h2 class="toolbox-title">Standard Modules</h2>
				<div class="module-list">
					{#each moduleTypes as moduleType}
						<div 
							class="module-item"
							draggable="true"
							on:dragstart={(e) => startDrag(e, moduleType)}
							on:keydown={(e) => e.key === 'Enter' && startDrag(e, moduleType)}
							role="button"
							tabindex="0"
							aria-label="Add {moduleType.name} module"
							title="Drag to add {moduleType.name} to your page"
						>
							<div class="module-icon">
								<svelte:component this={moduleType.icon} size={20} />
							</div>
							<span class="module-name">{moduleType.name}</span>
						</div>
					{/each}
				</div>

				<!-- Module Editor -->
				{#if editingModule}
					<div class="module-editor">
						<h3 class="editor-title">Edit Module</h3>
						
						{#if editingModule.type === 'text'}
							<div class="form-group">
								<label class="form-label" for="text-content">Text Content</label>
								<textarea 
									id="text-content"
									class="form-input" 
									bind:value={editingModule.content.text}
									rows="4"
								></textarea>
							</div>
							<div class="form-row">
								<div class="form-group">
									<label class="form-label" for="font-size">Font Size</label>
									<select id="font-size" class="form-select" bind:value={editingModule.content.fontSize}>
										<option value="14px">Small</option>
										<option value="16px">Normal</option>
										<option value="18px">Large</option>
										<option value="24px">Heading</option>
										<option value="32px">Title</option>
									</select>
								</div>
								<div class="form-group">
									<label class="form-label" for="text-align">Alignment</label>
									<select id="text-align" class="form-select" bind:value={editingModule.content.textAlign}>
										<option value="left">Left</option>
										<option value="center">Center</option>
										<option value="right">Right</option>
									</select>
								</div>
							</div>
						{:else if editingModule.type === 'image'}
							<div class="form-group">
								<label class="form-label" for="image-url">Image URL</label>
								<input 
									id="image-url"
									type="url" 
									class="form-input" 
									bind:value={editingModule.content.src}
								>
							</div>
							<div class="form-group">
								<label class="form-label" for="image-alt">Alt Text</label>
								<input 
									id="image-alt"
									type="text" 
									class="form-input" 
									bind:value={editingModule.content.alt}
								>
							</div>
							<div class="form-group">
								<label class="form-label" for="image-caption">Caption</label>
								<input 
									id="image-caption"
									type="text" 
									class="form-input" 
									bind:value={editingModule.content.caption}
								>
							</div>
						{:else if editingModule.type === 'cta'}
							<div class="form-group">
								<label class="form-label" for="cta-text">Button Text</label>
								<input 
									id="cta-text"
									type="text" 
									class="form-input" 
									bind:value={editingModule.content.text}
								>
							</div>
							<div class="form-group">
								<label class="form-label" for="cta-url">Link URL</label>
								<input 
									id="cta-url"
									type="url" 
									class="form-input" 
									bind:value={editingModule.content.href}
								>
							</div>
							<div class="form-row">
								<div class="form-group">
									<label class="form-label" for="cta-bg">Background</label>
									<input 
										id="cta-bg"
										type="color" 
										class="form-input" 
										bind:value={editingModule.content.backgroundColor}
									>
								</div>
								<div class="form-group">
									<label class="form-label" for="cta-color">Text Color</label>
									<input 
										id="cta-color"
										type="color" 
										class="form-input" 
										bind:value={editingModule.content.textColor}
									>
								</div>
							</div>
						{:else if editingModule.type === 'info'}
							<div class="form-group">
								<label class="form-label" for="info-title">Title</label>
								<input 
									id="info-title"
									type="text" 
									class="form-input" 
									bind:value={editingModule.content.title}
								>
							</div>
							<div class="form-group">
								<label class="form-label" for="info-content">Content</label>
								<textarea 
									id="info-content"
									class="form-input" 
									bind:value={editingModule.content.content}
									rows="3"
								></textarea>
							</div>
						{/if}

						<div class="editor-actions">
							<button class="btn btn-primary btn-sm" on:click={updateModule}>
								<Edit3 size={14} />
								Update
							</button>
							<button class="btn btn-secondary btn-sm" on:click={() => { editingModule = null; selectedModule.set(null); }}>
								Cancel
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Canvas -->
		<div class="canvas" class:preview={previewMode}>
			<div class="canvas-header">
				<h2>Live Preview</h2>
				<p>Drag modules from the toolbox to add them to your page</p>
			</div>

			<div class="canvas-content">
				{#if $builderModules.length === 0}
					<div 
						class="drop-zone empty"
						role="region"
						aria-label="Drop zone for new modules"
						on:dragover={(e) => handleDragOver(e, 0)}
						on:drop={(e) => handleDrop(e, 0)}
					>
						<p>Drag your first module here to get started</p>
					</div>
				{:else}
					{#each $builderModules as module, index (module.id)}
						<!-- Drop zone before each module -->
						{#if !previewMode}
							<div 
								class="drop-zone"
								role="region"
								aria-label="Drop zone before module {index + 1}"
								class:drag-over={dragOverIndex === index}
								on:dragover={(e) => handleDragOver(e, index)}
								on:drop={(e) => handleDrop(e, index)}
							></div>
						{/if}

						<!-- Module -->
						<div 
							class="canvas-module"
							role="button"
							tabindex="0"
							aria-label="Edit {module.type} module"
							class:selected={$selectedModule === module.id}
							class:preview={previewMode}
							on:click={() => selectModule(module.id)}
							on:keydown={(e) => e.key === 'Enter' && selectModule(module.id)}
						>
							{#if !previewMode}
								<div class="module-controls">
									<button 
										class="control-btn"
										on:click|stopPropagation={() => selectModule(module.id)}
									>
										<Edit3 size={14} />
									</button>
									<button 
										class="control-btn"
										on:click|stopPropagation={() => deleteModule(module.id)}
									>
										<Trash2 size={14} />
									</button>
									<button class="control-btn drag-handle">
										<Move size={14} />
									</button>
								</div>
							{/if}

							<!-- Module Content -->
							{#if module.type === 'text'}
								<div 
									class="text-module"
									style="font-size: {module.content.fontSize}; text-align: {module.content.textAlign}; font-weight: {module.content.fontWeight};"
								>
									{module.content.text}
								</div>
							{:else if module.type === 'image'}
								<div class="image-module">
									<img 
										src={module.content.src} 
										alt={module.content.alt}
										style="width: {module.content.width};"
									>
									{#if module.content.caption}
										<p class="image-caption">{module.content.caption}</p>
									{/if}
								</div>
							{:else if module.type === 'video'}
								<div class="video-module">
									<iframe 
										src={module.content.src}
										title={module.content.title}
										width="100%"
										height={module.content.height}
										frameborder="0"
										allowfullscreen
									></iframe>
								</div>
							{:else if module.type === 'cta'}
								<div class="cta-module">
									<a 
										href={module.content.href}
										class="cta-button"
										style="background-color: {module.content.backgroundColor}; color: {module.content.textColor}; border-radius: {module.content.borderRadius}; padding: {module.content.padding};"
									>
										{module.content.text}
									</a>
								</div>
							{:else if module.type === 'columns'}
								<div class="columns-module">
									<div class="column">
										{module.content.leftContent}
									</div>
									<div class="column">
										{module.content.rightContent}
									</div>
								</div>
							{:else if module.type === 'info'}
								<div 
									class="info-module"
									style="background-color: {module.content.backgroundColor}; border-left: 4px solid {module.content.borderColor};"
								>
									<h4 style="color: {module.content.iconColor};">{module.content.title}</h4>
									<p>{module.content.content}</p>
								</div>
							{:else if module.type === 'posts'}
								<div class="posts-module">
									<h3>{module.content.title}</h3>
									<div class="posts-list">
										<article class="post-item">
											<h4>Getting Started with BookWorm</h4>
											{#if module.content.showDate}
												<span class="post-date">July 15, 2025</span>
											{/if}
											{#if module.content.showExcerpt}
												<p>Learn how to make the most of our platform...</p>
											{/if}
										</article>
										<article class="post-item">
											<h4>Building Literary Communities</h4>
											{#if module.content.showDate}
												<span class="post-date">July 10, 2025</span>
											{/if}
											{#if module.content.showExcerpt}
												<p>Tips for growing engaged reading groups...</p>
											{/if}
										</article>
									</div>
								</div>
							{/if}
						</div>
					{/each}

					<!-- Final drop zone -->
					{#if !previewMode}
						<div 
							class="drop-zone"
							role="region"
							aria-label="Drop zone at end of page"
							class:drag-over={dragOverIndex === $builderModules.length}
							on:dragover={(e) => handleDragOver(e, $builderModules.length)}
							on:drop={(e) => handleDrop(e, $builderModules.length)}
						></div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.builder-container {
		height: calc(100vh - 4rem);
		display: flex;
		flex-direction: column;
		background: #f9fafb;
	}

	.builder-header {
		background: white;
		padding: 1rem 2rem;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}

	.builder-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.builder-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.builder-layout {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* Toolbox */
	.toolbox {
		width: 20rem;
		background: white;
		border-right: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.toolbox-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		padding: 1.5rem 1.5rem 1rem;
		margin: 0;
		border-bottom: 1px solid #f3f4f6;
	}

	.module-list {
		padding: 1rem;
	}

	.module-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
		cursor: grab;
		transition: all 0.2s ease;
		background: white;
	}

	.module-item:hover {
		border-color: #3b82f6;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.module-item:active {
		cursor: grabbing;
	}

	.module-icon {
		width: 2rem;
		height: 2rem;
		background: #f3f4f6;
		border-radius: 0.375rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6b7280;
	}

	.module-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: #1f2937;
	}

	/* Module Editor */
	.module-editor {
		border-top: 1px solid #e5e7eb;
		padding: 1.5rem;
		background: #f9fafb;
	}

	.editor-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.editor-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	/* Canvas */
	.canvas {
		flex: 1;
		background: white;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.canvas.preview {
		background: #f9fafb;
	}

	.canvas-header {
		padding: 1.5rem 2rem 1rem;
		border-bottom: 1px solid #f3f4f6;
		text-align: center;
	}

	.canvas.preview .canvas-header {
		display: none;
	}

	.canvas-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.canvas-header p {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.canvas-content {
		flex: 1;
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}

	.canvas.preview .canvas-content {
		padding: 0;
		max-width: none;
		background: white;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		margin: 2rem;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	/* Drop Zones */
	.drop-zone {
		min-height: 2rem;
		border: 2px dashed transparent;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.5rem 0;
	}

	.drop-zone.empty {
		min-height: 8rem;
		color: #6b7280;
		font-size: 0.875rem;
		text-align: center;
	}

	.drop-zone.drag-over {
		border-color: #3b82f6;
		background: #eff6ff;
	}

	/* Canvas Modules */
	.canvas-module {
		position: relative;
		margin: 1rem 0;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.canvas-module:not(.preview):hover {
		border-color: #e5e7eb;
	}

	.canvas-module.selected {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.canvas-module.preview {
		margin: 0;
		border: none;
	}

	.module-controls {
		position: absolute;
		top: -2rem;
		right: 0;
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 0.2s ease;
		z-index: 10;
	}

	.canvas-module:hover .module-controls {
		opacity: 1;
	}

	.control-btn {
		width: 1.75rem;
		height: 1.75rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
	}

	.control-btn:hover {
		background: #2563eb;
	}

	/* Module Styles */
	.text-module {
		padding: 1rem;
		line-height: 1.6;
		word-wrap: break-word;
	}

	.image-module {
		text-align: center;
		padding: 1rem;
	}

	.image-module img {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}

	.image-caption {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
		font-style: italic;
	}

	.video-module {
		padding: 1rem;
	}

	.cta-module {
		text-align: center;
		padding: 2rem 1rem;
	}

	.cta-button {
		display: inline-block;
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.2s ease;
	}

	.cta-button:hover {
		opacity: 0.9;
		text-decoration: none;
	}

	.columns-module {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding: 1rem;
	}

	.column {
		line-height: 1.6;
	}

	.info-module {
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin: 1rem;
	}

	.info-module h4 {
		margin-bottom: 0.5rem;
		font-size: 1.125rem;
	}

	.info-module p {
		margin: 0;
		line-height: 1.6;
	}

	.posts-module {
		padding: 1rem;
	}

	.posts-module h3 {
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
		color: #1f2937;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.post-item {
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 1rem;
	}

	.post-item:last-child {
		border-bottom: none;
	}

	.post-item h4 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.post-date {
		font-size: 0.875rem;
		color: #6b7280;
		display: block;
		margin-bottom: 0.5rem;
	}

	.post-item p {
		color: #4b5563;
		line-height: 1.6;
		margin: 0;
	}

	@media (max-width: 768px) {
		.builder-layout {
			flex-direction: column;
		}

		.toolbox {
			width: 100%;
			height: 50vh;
			border-right: none;
			border-bottom: 1px solid #e5e7eb;
		}

		.canvas {
			height: 50vh;
		}

		.columns-module {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
