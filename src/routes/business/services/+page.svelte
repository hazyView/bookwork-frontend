<script>
	import { 
		BookOpen, 
		Users, 
		Calendar, 
		BarChart3, 
		Target, 
		Megaphone,
		Globe,
		Zap,
		CheckCircle,
		ArrowRight,
		Star,
		TrendingUp
	} from 'lucide-svelte';

	const services = [
		{
			id: 'community',
			title: 'Community Building',
			description: 'Connect with passionate readers through our thriving book club network',
			icon: Users,
			features: [
				'Access to 500+ active book clubs',
				'Geographic targeting by city/region',
				'Member engagement analytics',
				'Direct messaging with club leaders',
				'Custom community challenges'
			],
			pricing: 'Starting at $299/month',
			popular: false
		},
		{
			id: 'marketing',
			title: 'Book Marketing & Promotion',
			description: 'Amplify your reach with targeted campaigns to engaged readers',
			icon: Megaphone,
			features: [
				'Featured book spotlights',
				'Newsletter promotions to 10K+ subscribers',
				'Social media campaign coordination',
				'Author interview opportunities',
				'Launch event coordination'
			],
			pricing: 'Starting at $499/month',
			popular: true
		},
		{
			id: 'events',
			title: 'Author Events & Readings',
			description: 'Schedule and manage virtual or in-person author events',
			icon: Calendar,
			features: [
				'Event scheduling and management',
				'Virtual event hosting platform',
				'Audience registration system',
				'Recording and replay capabilities',
				'Post-event engagement tracking'
			],
			pricing: 'Starting at $199/month',
			popular: false
		},
		{
			id: 'analytics',
			title: 'Reader Analytics & Insights',
			description: 'Understand your audience with detailed reading behavior data',
			icon: BarChart3,
			features: [
				'Reader demographics and preferences',
				'Book popularity trending',
				'Geographic reading patterns',
				'Engagement rate analysis',
				'Competitive market insights'
			],
			pricing: 'Starting at $399/month',
			popular: false
		},
		{
			id: 'website',
			title: 'Author Website Builder',
			description: 'Create a professional author website with our drag-and-drop builder',
			icon: Globe,
			features: [
				'Professional website templates',
				'Drag-and-drop editor',
				'Mobile-responsive designs',
				'SEO optimization tools',
				'Integrated book sales widgets'
			],
			pricing: 'Starting at $99/month',
			popular: false
		},
		{
			id: 'targeting',
			title: 'Audience Targeting',
			description: 'Reach the right readers with precision targeting tools',
			icon: Target,
			features: [
				'Genre-based reader targeting',
				'Reading history analysis',
				'Behavioral pattern matching',
				'Custom audience creation',
				'A/B testing capabilities'
			],
			pricing: 'Starting at $349/month',
			popular: false
		}
	];

	const packages = [
		{
			name: 'Starter',
			price: '$299',
			period: 'per month',
			description: 'Perfect for new authors looking to build their first community',
			features: [
				'Community Building access',
				'Basic analytics dashboard',
				'Email support',
				'Up to 5 book listings',
				'Standard website template'
			],
			cta: 'Start Free Trial',
			highlighted: false
		},
		{
			name: 'Professional',
			price: '$799',
			period: 'per month',
			description: 'Comprehensive solution for established authors and small publishers',
			features: [
				'All Starter features',
				'Book Marketing & Promotion',
				'Author Events & Readings',
				'Advanced analytics',
				'Priority support',
				'Custom website builder',
				'Up to 25 book listings'
			],
			cta: 'Most Popular',
			highlighted: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: 'pricing',
			description: 'Tailored solutions for publishers and large-scale operations',
			features: [
				'All Professional features',
				'Dedicated account manager',
				'Custom integrations',
				'White-label options',
				'Unlimited book listings',
				'Advanced reporting',
				'SLA guarantee'
			],
			cta: 'Contact Sales',
			highlighted: false
		}
	];

	const testimonials = [
		{
			name: 'Sarah Mitchell',
			role: 'Romance Author',
			company: 'Independent',
			content: 'BookWorm helped me connect with over 200 book clubs in just 3 months. My latest release saw a 300% increase in pre-orders.',
			rating: 5,
			image: 'https://via.placeholder.com/80x80?text=SM'
		},
		{
			name: 'David Chen',
			role: 'Marketing Director',
			company: 'Horizon Publishing',
			content: 'The analytics insights have transformed how we approach book launches. We now have a clear understanding of our target audience.',
			rating: 5,
			image: 'https://via.placeholder.com/80x80?text=DC'
		},
		{
			name: 'Maria Rodriguez',
			role: 'Thriller Author',
			company: 'Midnight Books',
			content: 'The author event platform made my virtual book tour seamless. Engaged with readers from 15 different countries in one week.',
			rating: 5,
			image: 'https://via.placeholder.com/80x80?text=MR'
		}
	];

	const stats = [
		{ label: 'Authors & Publishers', value: '2,500+', icon: BookOpen },
		{ label: 'Book Clubs Reached', value: '500+', icon: Users },
		{ label: 'Events Hosted', value: '1,200+', icon: Calendar },
		{ label: 'Books Promoted', value: '15,000+', icon: TrendingUp }
	];
</script>

<svelte:head>
	<title>Services for Authors & Publishers - BookWorm</title>
	<meta name="description" content="Comprehensive marketing and community-building services for authors and publishers. Connect with readers, promote your books, and grow your audience.">
</svelte:head>

<div class="services-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div class="hero-content">
				<h1 class="hero-title">
					Services Designed for 
					<span class="gradient-text">Literary Success</span>
				</h1>
				<p class="hero-description">
					Comprehensive marketing, community-building, and analytics services 
					to help authors and publishers connect with passionate readers and grow their audience.
				</p>
				<div class="hero-stats">
					{#each stats as stat}
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
			</div>
		</div>
	</section>

	<!-- Services Grid -->
	<section class="services">
		<div class="container">
			<div class="section-header">
				<h2>Complete Service Portfolio</h2>
				<p>Everything you need to succeed in today's competitive literary market</p>
			</div>

			<div class="services-grid">
				{#each services as service}
					<div class="service-card" class:popular={service.popular}>
						{#if service.popular}
							<div class="popular-badge">
								<Star size={16} />
								Most Popular
							</div>
						{/if}
						
						<div class="service-icon">
							<svelte:component this={service.icon} size={32} />
						</div>
						
						<h3 class="service-title">{service.title}</h3>
						<p class="service-description">{service.description}</p>
						
						<ul class="service-features">
							{#each service.features as feature}
								<li>
									<CheckCircle size={16} />
									{feature}
								</li>
							{/each}
						</ul>
						
						<div class="service-footer">
							<div class="service-pricing">{service.pricing}</div>
							<button class="btn btn-outline">
								Learn More
								<ArrowRight size={16} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Packages -->
	<section class="packages">
		<div class="container">
			<div class="section-header">
				<h2>Service Packages</h2>
				<p>Choose the perfect combination of services for your needs</p>
			</div>

			<div class="packages-grid">
				{#each packages as pkg}
					<div class="package-card" class:highlighted={pkg.highlighted}>
						{#if pkg.highlighted}
							<div class="package-badge">
								<Zap size={16} />
								Most Popular
							</div>
						{/if}
						
						<div class="package-header">
							<h3 class="package-name">{pkg.name}</h3>
							<div class="package-price">
								<span class="price">{pkg.price}</span>
								<span class="period">{pkg.period}</span>
							</div>
							<p class="package-description">{pkg.description}</p>
						</div>
						
						<ul class="package-features">
							{#each pkg.features as feature}
								<li>
									<CheckCircle size={16} />
									{feature}
								</li>
							{/each}
						</ul>
						
						<button class="btn" class:btn-primary={pkg.highlighted} class:btn-outline={!pkg.highlighted}>
							{pkg.cta}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="testimonials">
		<div class="container">
			<div class="section-header">
				<h2>Success Stories</h2>
				<p>See how authors and publishers are thriving with BookWorm</p>
			</div>

			<div class="testimonials-grid">
				{#each testimonials as testimonial}
					<div class="testimonial-card">
						<div class="testimonial-rating">
							{#each Array(testimonial.rating) as _}
								<Star size={16} fill="currentColor" />
							{/each}
						</div>
						
						<blockquote class="testimonial-content">
							"{testimonial.content}"
						</blockquote>
						
						<div class="testimonial-author">
							<img src={testimonial.image} alt={testimonial.name} class="author-image">
							<div class="author-info">
								<div class="author-name">{testimonial.name}</div>
								<div class="author-role">{testimonial.role}</div>
								<div class="author-company">{testimonial.company}</div>
							</div>
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
				<h2>Ready to Grow Your Literary Business?</h2>
				<p>Join thousands of authors and publishers who are building successful careers with BookWorm.</p>
				<div class="cta-actions">
					<button class="btn btn-primary btn-lg">
						Start Free Trial
						<ArrowRight size={20} />
					</button>
					<button class="btn btn-outline btn-lg">
						Schedule Demo
					</button>
				</div>
				<p class="cta-note">
					14-day free trial • No credit card required • Cancel anytime
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.services-page {
		min-height: 100vh;
		background: white;
	}

	/* Hero Section */
	.hero {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 4rem 0;
	}

	.hero-content {
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-title {
		font-size: 3rem;
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
		gap: 2rem;
		margin-top: 3rem;
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

	/* Services Section */
	.services {
		padding: 5rem 0;
		background: #f9fafb;
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

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
	}

	.service-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.service-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.service-card.popular {
		border-color: #3b82f6;
		transform: scale(1.02);
	}

	.popular-badge {
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

	.service-icon {
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

	.service-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.service-description {
		color: #6b7280;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.service-features {
		list-style: none;
		padding: 0;
		margin-bottom: 2rem;
	}

	.service-features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		color: #374151;
	}

	.service-features li :global(svg) {
		color: #10b981;
		flex-shrink: 0;
	}

	.service-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.service-pricing {
		font-size: 1.125rem;
		font-weight: 600;
		color: #3b82f6;
	}

	/* Packages Section */
	.packages {
		padding: 5rem 0;
		background: white;
	}

	.packages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.package-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 1rem;
		padding: 2rem;
		position: relative;
		transition: all 0.3s ease;
	}

	.package-card.highlighted {
		border-color: #3b82f6;
		transform: scale(1.05);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.package-badge {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
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

	.package-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.package-name {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.package-price {
		margin-bottom: 1rem;
	}

	.price {
		font-size: 3rem;
		font-weight: 700;
		color: #1f2937;
	}

	.period {
		font-size: 1rem;
		color: #6b7280;
	}

	.package-description {
		color: #6b7280;
		line-height: 1.6;
	}

	.package-features {
		list-style: none;
		padding: 0;
		margin-bottom: 2rem;
	}

	.package-features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0;
		color: #374151;
	}

	.package-features li :global(svg) {
		color: #10b981;
		flex-shrink: 0;
	}

	/* Testimonials Section */
	.testimonials {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.testimonials-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.testimonial-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.testimonial-rating {
		display: flex;
		gap: 0.25rem;
		color: #fbbf24;
		margin-bottom: 1rem;
	}

	.testimonial-content {
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

	.author-company {
		font-size: 0.875rem;
		color: #3b82f6;
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
			font-size: 2rem;
		}

		.hero-stats {
			grid-template-columns: 1fr;
		}

		.services-grid {
			grid-template-columns: 1fr;
		}

		.packages-grid {
			grid-template-columns: 1fr;
		}

		.package-card.highlighted {
			transform: none;
		}

		.testimonials-grid {
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
	}
</style>
