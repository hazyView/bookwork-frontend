<script>
	import { 
		BookOpen, 
		Users, 
		Heart, 
		Target,
		Award,
		Globe,
		TrendingUp,
		Lightbulb,
		ArrowRight,
		Star,
		CheckCircle,
		Calendar,
		MessageCircle
	} from 'lucide-svelte';

	const highlights = [
		{
			icon: Users,
			number: '2,500+',
			label: 'Authors & Publishers',
			description: 'Creative professionals building their careers'
		},
		{
			icon: BookOpen,
			number: '500+',
			label: 'Active Book Clubs',
			description: 'Passionate reading communities worldwide'
		},
		{
			icon: Globe,
			number: '25+',
			label: 'Countries',
			description: 'Global reach connecting literary minds'
		},
		{
			icon: TrendingUp,
			number: '15,000+',
			label: 'Books Promoted',
			description: 'Stories that found their perfect audience'
		}
	];

	const features = [
		{
			icon: Users,
			title: 'Community Building',
			description: 'Connect with 500+ active book clubs and thousands of passionate readers who are actively seeking their next great read.',
			benefits: [
				'Direct access to club leaders',
				'Geographic targeting options',
				'Member engagement analytics',
				'Community event coordination'
			]
		},
		{
			icon: Target,
			title: 'Targeted Marketing',
			description: 'Reach the right readers with precision targeting based on genre preferences, reading history, and engagement patterns.',
			benefits: [
				'Genre-specific campaigns',
				'Behavioral targeting',
				'A/B testing capabilities',
				'ROI tracking and optimization'
			]
		},
		{
			icon: BookOpen,
			title: 'Author Services',
			description: 'Comprehensive suite of tools and services designed specifically for authors and publishers to maximize their reach.',
			benefits: [
				'Professional website builder',
				'Event hosting platform',
				'Marketing automation',
				'Sales analytics dashboard'
			]
		}
	];

	const testimonials = [
		{
			quote: "BookWorm transformed how I connect with readers. In just 6 months, I've built relationships with 50+ book clubs and my sales have tripled.",
			author: "Sarah Mitchell",
			role: "Romance Author",
			rating: 5,
			image: "https://via.placeholder.com/80x80?text=SM"
		},
		{
			quote: "The analytics insights have revolutionized our marketing strategy. We now understand our audience better than ever before.",
			author: "David Chen",
			role: "Marketing Director, Horizon Publishing",
			rating: 5,
			image: "https://via.placeholder.com/80x80?text=DC"
		},
		{
			quote: "As a book club leader, BookWorm has made it incredibly easy to discover new authors and coordinate reading schedules with our members.",
			author: "Maria Rodriguez",
			role: "Book Club Leader",
			rating: 5,
			image: "https://via.placeholder.com/80x80?text=MR"
		}
	];

	const faqs = [
		{
			question: "What makes BookWorm different from other marketing platforms?",
			answer: "BookWorm is specifically designed for the literary community. We focus exclusively on connecting authors with passionate readers through established book clubs and reading communities, rather than generic social media advertising."
		},
		{
			question: "How do you ensure quality connections with book clubs?",
			answer: "All book clubs in our network are verified and actively moderated. We maintain strict quality standards and regularly review club activity to ensure authentic, engaged communities."
		},
		{
			question: "What types of authors and publishers do you work with?",
			answer: "We work with authors and publishers across all genres and career stages - from debut novelists to bestselling authors, independent publishers to major publishing houses."
		},
		{
			question: "How do you measure the success of marketing campaigns?",
			answer: "We provide comprehensive analytics including engagement rates, click-through rates, conversion tracking, and detailed audience insights to help you understand your campaign performance and ROI."
		},
		{
			question: "Can I target specific genres or reader demographics?",
			answer: "Absolutely! Our platform allows for precise targeting based on genre preferences, geographic location, reading history, engagement patterns, and demographic information."
		},
		{
			question: "What support do you provide to new users?",
			answer: "We offer comprehensive onboarding, dedicated account management for enterprise clients, 24/7 customer support, extensive documentation, and regular webinars and training sessions."
		}
	];

	let openFaqIndex = null;

	function toggleFaq(index) {
		openFaqIndex = openFaqIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>About BookWorm - Connecting Authors with Readers</title>
	<meta name="description" content="Learn how BookWorm is revolutionizing book marketing by connecting authors with passionate readers through our network of 500+ active book clubs.">
</svelte:head>

<div class="about-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div class="hero-content">
				<h1 class="hero-title">
					Revolutionizing How 
					<span class="gradient-text">Books Find Readers</span>
				</h1>
				<p class="hero-description">
					BookWorm is more than a platform—we're a bridge between literary creators and passionate readers. 
					Since 2020, we've been building the infrastructure that helps great stories find their perfect audience.
				</p>
				<div class="hero-highlights">
					{#each highlights as highlight}
						<div class="highlight-item">
							<div class="highlight-icon">
								<svelte:component this={highlight.icon} size={24} />
							</div>
							<div class="highlight-content">
								<div class="highlight-number">{highlight.number}</div>
								<div class="highlight-label">{highlight.label}</div>
								<div class="highlight-description">{highlight.description}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- The Problem -->
	<section class="problem">
		<div class="container">
			<div class="problem-content">
				<div class="problem-text">
					<h2>The Challenge Authors Face</h2>
					<p>
						In today's crowded literary marketplace, talented authors struggle to connect with readers who 
						would genuinely love their work. Traditional marketing often feels impersonal and expensive, 
						while organic discovery becomes increasingly difficult.
					</p>
					<p>
						Meanwhile, passionate readers and book clubs are constantly searching for their next great read, 
						but have limited ways to discover new authors beyond bestseller lists and algorithm-driven recommendations.
					</p>
				</div>
				<div class="problem-stats">
					<div class="stat-card">
						<div class="stat-number">87%</div>
						<div class="stat-label">Of authors struggle with marketing</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">73%</div>
						<div class="stat-label">Of readers want personalized recommendations</div>
					</div>
					<div class="stat-card">
						<div class="stat-number">65%</div>
						<div class="stat-label">Of book clubs seek new authors</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Our Solution -->
	<section class="solution">
		<div class="container">
			<div class="section-header">
				<h2>Our Solution</h2>
				<p>Connecting the dots between great stories and passionate readers</p>
			</div>

			<div class="features-grid">
				{#each features as feature}
					<div class="feature-card">
						<div class="feature-icon">
							<svelte:component this={feature.icon} size={32} />
						</div>
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-description">{feature.description}</p>
						<ul class="feature-benefits">
							{#each feature.benefits as benefit}
								<li>
									<CheckCircle size={16} />
									{benefit}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section class="how-it-works">
		<div class="container">
			<div class="section-header">
				<h2>How BookWorm Works</h2>
				<p>A simple, effective process that creates meaningful connections</p>
			</div>

			<div class="steps">
				<div class="step">
					<div class="step-number">1</div>
					<div class="step-content">
						<h3>Authors Join & Create Profiles</h3>
						<p>Authors and publishers create detailed profiles showcasing their books, genres, and target audience preferences.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">2</div>
					<div class="step-content">
						<h3>Smart Matching Algorithm</h3>
						<p>Our intelligent system matches authors with relevant book clubs and readers based on genre, style, and community preferences.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">3</div>
					<div class="step-content">
						<h3>Meaningful Connections</h3>
						<p>Authors connect directly with book clubs through our platform, scheduling visits, discussions, and promotional opportunities.</p>
					</div>
				</div>
				<div class="step">
					<div class="step-number">4</div>
					<div class="step-content">
						<h3>Track & Optimize</h3>
						<p>Comprehensive analytics help authors understand their audience and optimize their outreach for maximum impact.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Success Stories -->
	<section class="testimonials">
		<div class="container">
			<div class="section-header">
				<h2>Success Stories</h2>
				<p>Real results from authors, publishers, and book clubs</p>
			</div>

			<div class="testimonials-grid">
				{#each testimonials as testimonial}
					<div class="testimonial-card">
						<div class="testimonial-rating">
							{#each Array(testimonial.rating) as _}
								<Star size={16} fill="currentColor" />
							{/each}
						</div>
						<blockquote class="testimonial-quote">
							"{testimonial.quote}"
						</blockquote>
						<div class="testimonial-author">
							<img src={testimonial.image} alt={testimonial.author} class="author-image">
							<div class="author-info">
								<div class="author-name">{testimonial.author}</div>
								<div class="author-role">{testimonial.role}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="faq">
		<div class="container">
			<div class="section-header">
				<h2>Frequently Asked Questions</h2>
				<p>Everything you need to know about BookWorm</p>
			</div>

			<div class="faq-list">
				{#each faqs as faq, index}
					<div class="faq-item" class:open={openFaqIndex === index}>
						<button class="faq-question" on:click={() => toggleFaq(index)}>
							<span>{faq.question}</span>
							<div class="faq-icon" class:rotated={openFaqIndex === index}>
								<ArrowRight size={20} />
							</div>
						</button>
						<div class="faq-answer">
							<p>{faq.answer}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta">
		<div class="container">
			<div class="cta-content">
				<h2>Ready to Connect with Your Perfect Readers?</h2>
				<p>Join thousands of authors who are building meaningful relationships with passionate readers through BookWorm.</p>
				<div class="cta-actions">
					<button class="btn btn-primary btn-lg">
						Start Free Trial
						<ArrowRight size={20} />
					</button>
					<button class="btn btn-outline btn-lg">
						<Calendar size={20} />
						Schedule Demo
					</button>
				</div>
				<p class="cta-note">
					14-day free trial • No credit card required • Full access to all features
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.about-page {
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

	.hero-highlights {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.highlight-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 1.5rem;
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		text-align: left;
	}

	.highlight-icon {
		width: 3rem;
		height: 3rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.highlight-number {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.highlight-label {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.highlight-description {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	/* Problem Section */
	.problem {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.problem-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}

	.problem-text h2 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 2rem;
	}

	.problem-text p {
		color: #6b7280;
		line-height: 1.6;
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
	}

	.problem-stats {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.stat-card {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		color: #dc2626;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		color: #6b7280;
		font-weight: 500;
	}

	/* Solution Section */
	.solution {
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

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 1rem;
		transition: all 0.3s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		background: white;
	}

	.feature-icon {
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.feature-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.feature-description {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.feature-benefits {
		list-style: none;
		padding: 0;
	}

	.feature-benefits li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.feature-benefits li :global(svg) {
		color: #10b981;
		flex-shrink: 0;
	}

	/* How It Works */
	.how-it-works {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.steps {
		max-width: 800px;
		margin: 0 auto;
	}

	.step {
		display: flex;
		align-items: flex-start;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.step:last-child {
		margin-bottom: 0;
	}

	.step-number {
		width: 3rem;
		height: 3rem;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.125rem;
		flex-shrink: 0;
	}

	.step-content h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.step-content p {
		color: #6b7280;
		line-height: 1.6;
	}

	/* Testimonials */
	.testimonials {
		padding: 5rem 0;
		background: white;
	}

	.testimonials-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.testimonial-card {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 1rem;
		transition: all 0.3s ease;
	}

	.testimonial-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		background: white;
	}

	.testimonial-rating {
		display: flex;
		gap: 0.25rem;
		color: #fbbf24;
		margin-bottom: 1rem;
	}

	.testimonial-quote {
		font-size: 1.125rem;
		line-height: 1.6;
		color: #374151;
		margin-bottom: 1.5rem;
		font-style: italic;
	}

	.testimonial-author {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.author-image {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.author-name {
		font-weight: 600;
		color: #1f2937;
	}

	.author-role {
		font-size: 0.875rem;
		color: #6b7280;
	}

	/* FAQ Section */
	.faq {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.faq-list {
		max-width: 800px;
		margin: 0 auto;
	}

	.faq-item {
		background: white;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.faq-question {
		width: 100%;
		padding: 1.5rem 2rem;
		background: none;
		border: none;
		text-align: left;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: background-color 0.2s ease;
	}

	.faq-question:hover {
		background: #f9fafb;
	}

	.faq-icon {
		transition: transform 0.2s ease;
	}

	.faq-icon.rotated {
		transform: rotate(90deg);
	}

	.faq-answer {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.3s ease;
	}

	.faq-item.open .faq-answer {
		max-height: 500px;
	}

	.faq-answer p {
		padding: 0 2rem 1.5rem;
		color: #6b7280;
		line-height: 1.6;
		margin: 0;
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

		.hero-highlights {
			grid-template-columns: 1fr;
		}

		.highlight-item {
			text-align: center;
			flex-direction: column;
			align-items: center;
		}

		.problem-content {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.features-grid,
		.testimonials-grid {
			grid-template-columns: 1fr;
		}

		.step {
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: 1rem;
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

		.problem-text h2 {
			font-size: 2rem;
		}
	}
</style>
