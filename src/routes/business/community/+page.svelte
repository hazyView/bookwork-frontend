<script lang="ts">
	import { 
		BookOpen, 
		Users, 
		MessageCircle, 
		Calendar,
		Award,
		TrendingUp,
		Heart,
		Share2,
		PlayCircle,
		Download,
		ArrowRight,
		Star,
		MapPin,
		Clock,
		Menu
	} from 'lucide-svelte';
	import { toasts } from '$lib/toast';
	import DrawerNavigation from '$lib/components/DrawerNavigation.svelte';

	// Drawer state
	let isDrawerOpen = false;

	function toggleDrawer() {
		isDrawerOpen = !isDrawerOpen;
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}

	const communityStats = [
		{ label: 'Active Authors', value: '2,500+', icon: Users },
		{ label: 'Monthly Events', value: '150+', icon: Calendar },
		{ label: 'Community Posts', value: '5,000+', icon: MessageCircle },
		{ label: 'Success Stories', value: '500+', icon: Award }
	];

	const featuredPosts = [
		{
			id: 1,
			title: 'How I Grew My Email List from 0 to 10,000 Subscribers',
			author: 'Sarah Mitchell',
			authorRole: 'Romance Author',
			authorImage: 'https://via.placeholder.com/50x50?text=SM',
			excerpt: 'A step-by-step guide to building an engaged email list using BookWorm\'s community features and targeted content strategies.',
			category: 'Marketing',
			readTime: '8 min read',
			likes: 234,
			comments: 45,
			publishedAt: '2 days ago',
			featured: true
		},
		{
			id: 2,
			title: 'Virtual Book Launch Success: My $50K Launch Strategy',
			author: 'David Chen',
			authorRole: 'Business Author',
			authorImage: 'https://via.placeholder.com/50x50?text=DC',
			excerpt: 'Learn how I leveraged BookWorm\'s event platform and community connections to generate $50,000 in pre-orders.',
			category: 'Sales',
			readTime: '12 min read',
			likes: 189,
			comments: 67,
			publishedAt: '1 week ago',
			featured: false
		},
		{
			id: 3,
			title: 'Building Authentic Relationships with Book Clubs',
			author: 'Maria Rodriguez',
			authorRole: 'Thriller Author',
			authorImage: 'https://via.placeholder.com/50x50?text=MR',
			excerpt: 'Discover the secrets to meaningful engagement with book clubs that leads to loyal readers and word-of-mouth marketing.',
			category: 'Community',
			readTime: '6 min read',
			likes: 156,
			comments: 23,
			publishedAt: '3 days ago',
			featured: false
		}
	];

	const upcomingEvents = [
		{
			id: 1,
			title: 'Monthly Author Mastermind',
			description: 'Join fellow authors for networking, idea sharing, and collaborative problem-solving',
			date: 'January 28, 2025',
			time: '2:00 PM EST',
			type: 'Virtual',
			attendees: 45,
			maxAttendees: 50,
			host: 'BookWorm Team',
			category: 'Networking'
		},
		{
			id: 2,
			title: 'Book Marketing Workshop: Social Media Strategies',
			description: 'Learn proven social media tactics that convert followers into book buyers',
			date: 'February 5, 2025',
			time: '7:00 PM EST',
			type: 'Virtual',
			attendees: 78,
			maxAttendees: 100,
			host: 'Jennifer Adams',
			category: 'Workshop'
		},
		{
			id: 3,
			title: 'Author Q&A: Publishing Industry Trends 2025',
			description: 'Get insights into the latest trends shaping the publishing landscape',
			date: 'February 12, 2025',
			time: '1:00 PM EST',
			type: 'Virtual',
			attendees: 23,
			maxAttendees: 75,
			host: 'Publishing Experts Panel',
			category: 'Education'
		}
	];

	const resources = [
		{
			id: 1,
			title: 'Author Marketing Toolkit',
			description: 'Complete guide with templates, checklists, and strategies for book promotion',
			type: 'PDF Guide',
			downloads: 1200,
			category: 'Marketing',
			featured: true
		},
		{
			id: 2,
			title: 'Book Launch Checklist',
			description: '90-day launch timeline with actionable tasks and milestone tracking',
			type: 'Checklist',
			downloads: 850,
			category: 'Launch',
			featured: false
		},
		{
			id: 3,
			title: 'Reader Engagement Templates',
			description: 'Email templates, social media posts, and newsletter formats that work',
			type: 'Templates',
			downloads: 645,
			category: 'Engagement',
			featured: false
		},
		{
			id: 4,
			title: 'Book Club Outreach Scripts',
			description: 'Proven scripts for reaching out to book clubs and scheduling visits',
			type: 'Scripts',
			downloads: 423,
			category: 'Outreach',
			featured: false
		}
	];

	const successStories = [
		{
			author: 'Lisa Thompson',
			role: 'Historical Fiction Author',
			image: 'https://via.placeholder.com/80x80?text=LT',
			achievement: 'Increased book sales by 400% in 6 months',
			story: 'Using BookWorm\'s community features and author events, Lisa connected with passionate historical fiction readers and built a loyal following.',
			metrics: {
				booksSold: '5,000+',
				emailSubscribers: '2,500+',
				clubConnections: '25+'
			}
		},
		{
			author: 'Michael Davis',
			role: 'Self-Help Author',
			image: 'https://via.placeholder.com/80x80?text=MD',
			achievement: 'Built a 6-figure author business',
			story: 'Michael leveraged BookWorm\'s marketing tools and community insights to transform his writing hobby into a full-time career.',
			metrics: {
				annualRevenue: '$125,000+',
				courseSales: '500+',
				speakingGigs: '15+'
			}
		}
	];

	function joinEvent(eventId: string) {
		toasts.add({
			message: 'Event registration feature coming soon! We\'ll notify you when it\'s available.',
			type: 'info',
			duration: 4000
		});
	}

	function downloadResource(resourceId: number) {
		toasts.add({
			message: 'Resource download feature is being prepared. Check back soon!',
			type: 'info',
			duration: 4000
		});
	}
</script>

<svelte:head>
	<title>Author Community - BookWorm</title>
	<meta name="description" content="Join a thriving community of authors and publishers. Access resources, attend events, and connect with like-minded literary professionals.">
</svelte:head>

<div class="community-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div class="header-controls">
				<button 
					class="menu-btn" 
					on:click={toggleDrawer}
					aria-label="Open navigation menu"
					aria-expanded={isDrawerOpen}
				>
					<Menu size={24} />
				</button>
			</div>
			<div class="hero-content">
				<h1 class="hero-title">
					Join the <span class="gradient-text">Author Community</span>
				</h1>
				<p class="hero-description">
					Connect with thousands of successful authors, access exclusive resources, 
					and accelerate your literary career through our supportive community.
				</p>
				<div class="hero-stats">
					{#each communityStats as stat}
						<div class="stat-item">
							<div class="stat-icon">
								<svelte:component this={stat.icon} size={24} />
							</div>
							<div class="stat-content">
								<div class="stat-value">{stat.value}</div>
								<div class="stat-label">{stat.label}</div>
							</div>
						</div>
					{/each}
				</div>
				<div class="hero-actions">
					<button class="btn btn-primary btn-lg">
						Join Community
						<ArrowRight size={20} />
					</button>
					<button class="btn btn-outline btn-lg">
						<PlayCircle size={20} />
						Watch Tour
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Posts -->
	<section class="featured-posts">
		<div class="container">
			<div class="section-header">
				<h2>Featured Community Posts</h2>
				<p>Learn from successful authors sharing their strategies and insights</p>
			</div>

			<div class="posts-grid">
				{#each featuredPosts as post}
					<article class="post-card" class:featured={post.featured}>
						{#if post.featured}
							<div class="featured-badge">
								<Star size={16} />
								Featured
							</div>
						{/if}
						
						<div class="post-category">{post.category}</div>
						<h3 class="post-title">{post.title}</h3>
						<p class="post-excerpt">{post.excerpt}</p>
						
						<div class="post-meta">
							<div class="author-info">
								<img src={post.authorImage} alt={post.author} class="author-avatar">
								<div>
									<div class="author-name">{post.author}</div>
									<div class="author-role">{post.authorRole}</div>
								</div>
							</div>
							<div class="post-stats">
								<span class="read-time">
									<Clock size={14} />
									{post.readTime}
								</span>
								<span class="likes">
									<Heart size={14} />
									{post.likes}
								</span>
								<span class="comments">
									<MessageCircle size={14} />
									{post.comments}
								</span>
							</div>
						</div>
						
						<div class="post-footer">
							<span class="published-date">{post.publishedAt}</span>
							<button class="btn btn-text">
								Read More
								<ArrowRight size={16} />
							</button>
						</div>
					</article>
				{/each}
			</div>

			<div class="section-footer">
				<button class="btn btn-outline">
					View All Posts
					<ArrowRight size={16} />
				</button>
			</div>
		</div>
	</section>

	<!-- Upcoming Events */
	<section class="upcoming-events">
		<div class="container">
			<div class="section-header">
				<h2>Upcoming Events</h2>
				<p>Join workshops, masterminds, and networking events designed for authors</p>
			</div>

			<div class="events-grid">
				{#each upcomingEvents as event}
					<div class="event-card">
						<div class="event-header">
							<div class="event-category">{event.category}</div>
							<div class="event-type">{event.type}</div>
						</div>
						
						<h3 class="event-title">{event.title}</h3>
						<p class="event-description">{event.description}</p>
						
						<div class="event-details">
							<div class="event-datetime">
								<Calendar size={16} />
								<span>{event.date} at {event.time}</span>
							</div>
							<div class="event-host">
								<Users size={16} />
								<span>Hosted by {event.host}</span>
							</div>
							<div class="event-attendees">
								<MapPin size={16} />
								<span>{event.attendees}/{event.maxAttendees} registered</span>
							</div>
						</div>
						
						<div class="event-progress">
							<div class="progress-bar">
								<div 
									class="progress-fill" 
									style="width: {(event.attendees / event.maxAttendees) * 100}%"
								></div>
							</div>
						</div>
						
						<button 
							class="btn btn-primary" 
							class:btn-secondary={event.attendees >= event.maxAttendees}
							disabled={event.attendees >= event.maxAttendees}
							on:click={() => joinEvent(event.id)}
						>
							{event.attendees >= event.maxAttendees ? 'Event Full' : 'Register Now'}
						</button>
					</div>
				{/each}
			</div>

			<div class="section-footer">
				<button class="btn btn-outline">
					View Event Calendar
					<Calendar size={16} />
				</button>
			</div>
		</div>
	</section>

	<!-- Resources -->
	<section class="resources">
		<div class="container">
			<div class="section-header">
				<h2>Free Resources</h2>
				<p>Download guides, templates, and tools to accelerate your author journey</p>
			</div>

			<div class="resources-grid">
				{#each resources as resource}
					<div class="resource-card" class:featured={resource.featured}>
						{#if resource.featured}
							<div class="featured-badge">
								<Star size={16} />
								Most Popular
							</div>
						{/if}
						
						<div class="resource-icon">
							<Download size={32} />
						</div>
						
						<div class="resource-category">{resource.category}</div>
						<h3 class="resource-title">{resource.title}</h3>
						<p class="resource-description">{resource.description}</p>
						
						<div class="resource-meta">
							<span class="resource-type">{resource.type}</span>
							<span class="resource-downloads">
								<TrendingUp size={14} />
								{resource.downloads} downloads
							</span>
						</div>
						
						<button 
							class="btn btn-primary"
							on:click={() => downloadResource(resource.id)}
						>
							<Download size={16} />
							Download Free
						</button>
					</div>
				{/each}
			</div>

			<div class="section-footer">
				<button class="btn btn-outline">
					Browse All Resources
					<ArrowRight size={16} />
				</button>
			</div>
		</div>
	</section>

	<!-- Success Stories -->
	<section class="success-stories">
		<div class="container">
			<div class="section-header">
				<h2>Success Stories</h2>
				<p>Real authors achieving extraordinary results with BookWorm</p>
			</div>

			<div class="stories-grid">
				{#each successStories as story}
					<div class="story-card">
						<div class="story-header">
							<img src={story.image} alt={story.author} class="story-avatar">
							<div class="story-author">
								<h3 class="author-name">{story.author}</h3>
								<p class="author-role">{story.role}</p>
							</div>
						</div>
						
						<div class="story-achievement">
							<Award size={20} />
							{story.achievement}
						</div>
						
						<p class="story-content">{story.story}</p>
						
						<div class="story-metrics">
							{#each Object.entries(story.metrics) as [key, value]}
								<div class="metric">
									<div class="metric-value">{value}</div>
									<div class="metric-label">
										{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
									</div>
								</div>
							{/each}
						</div>
						
						<button class="btn btn-outline">
							Read Full Story
							<ArrowRight size={16} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta">
		<div class="container">
			<div class="cta-content">
				<h2>Ready to Join Our Thriving Community?</h2>
				<p>Connect with like-minded authors, access exclusive resources, and accelerate your success.</p>
				<div class="cta-actions">
					<button class="btn btn-primary btn-lg">
						Join Free Today
						<ArrowRight size={20} />
					</button>
					<button class="btn btn-outline btn-lg">
						Learn More
					</button>
				</div>
				<p class="cta-note">
					Free to join • Instant access • No spam, ever
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.community-page {
		min-height: 100vh;
		background: white;
	}

	/* Hero Section */
	.hero {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 5rem 0;
	}

	.hero-content {
		text-align: center;
		max-width: 900px;
		margin: 0 auto;
	}

	.hero-title {
		font-size: 3.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	.gradient-text {
		background: linear-gradient(45deg, #fbbf24, #f59e0b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: 1.25rem;
		margin-bottom: 3rem;
		opacity: 0.9;
		line-height: 1.6;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 1.5rem;
		border-radius: 1rem;
		backdrop-filter: blur(10px);
	}

	.stat-icon {
		width: 3rem;
		height: 3rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.stat-label {
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	/* Section Styles */
	.featured-posts {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.upcoming-events {
		padding: 5rem 0;
		background: white;
	}

	.resources {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.success-stories {
		padding: 5rem 0;
		background: white;
	}

	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.section-header p {
		font-size: 1.125rem;
		color: #6b7280;
		max-width: 600px;
		margin: 0 auto;
	}

	.section-footer {
		text-align: center;
		margin-top: 3rem;
	}

	/* Posts Grid */
	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
	}

	.post-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.post-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.post-card.featured {
		border-color: #3b82f6;
	}

	.featured-badge {
		position: absolute;
		top: -12px;
		right: 2rem;
		background: #3b82f6;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.post-category {
		display: inline-block;
		background: #e0f2fe;
		color: #0277bd;
		padding: 0.25rem 0.75rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.post-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
		line-height: 1.4;
	}

	.post-excerpt {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.post-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.author-avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.author-name {
		font-weight: 500;
		color: #1f2937;
		font-size: 0.875rem;
	}

	.author-role {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.post-stats {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.post-stats span {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.published-date {
		font-size: 0.875rem;
		color: #6b7280;
	}

	/* Events Grid */
	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.event-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.event-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.event-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.event-category {
		background: #f3e8ff;
		color: #7c3aed;
		padding: 0.25rem 0.75rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.event-type {
		background: #ecfdf5;
		color: #059669;
		padding: 0.25rem 0.75rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.event-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.event-description {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.event-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.event-details > div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #374151;
	}

	.event-progress {
		margin-bottom: 1.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 0.5rem;
		background: #e5e7eb;
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #3b82f6;
		transition: width 0.3s ease;
	}

	/* Resources Grid */
	.resources-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.resource-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: all 0.3s ease;
		text-align: center;
		border: 2px solid transparent;
	}

	.resource-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.resource-card.featured {
		border-color: #10b981;
	}

	.resource-card .featured-badge {
		background: #10b981;
	}

	.resource-icon {
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1.5rem;
	}

	.resource-category {
		display: inline-block;
		background: #ecfdf5;
		color: #059669;
		padding: 0.25rem 0.75rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.resource-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.resource-description {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.resource-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.resource-downloads {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	/* Success Stories */
	.stories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
		gap: 2rem;
	}

	.story-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.story-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.story-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.story-avatar {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.story-achievement {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #fef3c7;
		color: #d97706;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.story-content {
		color: #374151;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.story-metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.metric {
		text-align: center;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
	}

	.metric-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}

	.metric-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	/* CTA Section */
	.cta {
		padding: 5rem 0;
		background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
		color: white;
	}

	.cta-content {
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.cta h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.cta p {
		font-size: 1.125rem;
		margin-bottom: 2rem;
		opacity: 0.9;
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.cta-note {
		font-size: 0.875rem;
		opacity: 0.7;
		margin: 0;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}

		.hero-stats {
			grid-template-columns: 1fr 1fr;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
		}

		.posts-grid,
		.events-grid,
		.resources-grid,
		.stories-grid {
			grid-template-columns: 1fr;
		}

		.cta-actions {
			flex-direction: column;
			align-items: center;
		}

		.section-header h2 {
			font-size: 2rem;
		}

		.cta h2 {
			font-size: 2rem;
		}

		.post-meta {
			flex-direction: column;
			align-items: flex-start;
		}

		.story-metrics {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Header controls styles */
	.header-controls {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
	}

	.menu-btn {
		background: none;
		border: none;
		padding: 0.5rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #374151;
		transition: all 0.2s ease;
	}

	.menu-btn:hover {
		background-color: #f3f4f6;
		color: #111827;
	}

	.menu-btn:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	@media (max-width: 768px) {
		.header-controls {
			top: 0.5rem;
			left: 0.5rem;
		}
		
		.menu-btn {
			padding: 0.375rem;
		}
	}
</style>

<DrawerNavigation {isDrawerOpen} on:close={closeDrawer} />
