<script>
	import { Building2, Users, TrendingUp, Globe, BookOpen, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
	<title>For Business - BookWorm</title>
	<meta name="description" content="Grow your literary business with BookWorm. Connect with readers, build community, and expand your reach through our professional platform." />
</svelte:head>

<div class="hero">
	<div class="container">
		<div class="hero-content">
			<h1 class="hero-title">Grow Your Literary Business</h1>
			<p class="hero-description">
				Connect with passionate readers, build lasting communities, and expand your reach 
				through BookWorm's comprehensive business platform.
			</p>
			<div class="hero-actions">
				<a href="/business/services" class="btn btn-primary btn-lg">
					<Building2 size={20} />
					Explore Services
				</a>
				<a href="/business/website-builder" class="btn btn-outline btn-lg">
					<Sparkles size={20} />
					Try Website Builder
				</a>
			</div>
		</div>
	</div>
</div>

<section class="services-overview">
	<div class="container">
		<h2 class="section-title">Why Choose BookWorm for Business?</h2>
		<div class="services-grid">
			<div class="service-card card">
				<div class="card-body">
					<div class="service-icon">
						<Users size={32} />
					</div>
					<h3 class="service-title">Community Building</h3>
					<p class="service-description">
						Connect directly with your target audience through local book clubs 
						and reading communities. Build meaningful relationships with readers.
					</p>
					<a href="/business/community" class="service-link">Learn More</a>
				</div>
			</div>

			<div class="service-card card">
				<div class="card-body">
					<div class="service-icon">
						<TrendingUp size={32} />
					</div>
					<h3 class="service-title">Marketing Solutions</h3>
					<p class="service-description">
						Leverage our platform to promote your books, events, and services 
						to an engaged community of avid readers and book enthusiasts.
					</p>
					<a href="/business/services" class="service-link">Learn More</a>
				</div>
			</div>

			<div class="service-card card">
				<div class="card-body">
					<div class="service-icon">
						<Globe size={32} />
					</div>
					<h3 class="service-title">Website Builder</h3>
					<p class="service-description">
						Create professional websites with our intuitive drag-and-drop builder. 
						No coding required - perfect for authors and publishers.
					</p>
					<a href="/business/website-builder" class="service-link">Try Now</a>
				</div>
			</div>

			<div class="service-card card">
				<div class="card-body">
					<div class="service-icon">
						<BookOpen size={32} />
					</div>
					<h3 class="service-title">Content Platform</h3>
					<p class="service-description">
						Share your expertise through our blog platform and resource library. 
						Establish thought leadership in the literary community.
					</p>
					<a href="/blog" class="service-link">View Blog</a>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="stats-section">
	<div class="container">
		<h2 class="section-title">BookWorm by the Numbers</h2>
		<div class="stats-grid">
			<div class="stat-item">
				<span class="stat-number">10,000+</span>
				<span class="stat-label">Active Readers</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">500+</span>
				<span class="stat-label">Book Clubs</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">50,000+</span>
				<span class="stat-label">Books Discussed</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">25+</span>
				<span class="stat-label">Cities</span>
			</div>
		</div>
	</div>
</section>

<section class="testimonials">
	<div class="container">
		<h2 class="section-title">What Our Partners Say</h2>
		<div class="testimonials-grid">
			<div class="testimonial-card card">
				<div class="card-body">
					<p class="testimonial-text">
						"BookWorm has transformed how we connect with our readers. The community 
						engagement is incredible, and our book sales have increased by 40%."
					</p>
					<div class="testimonial-author">
						<strong>Sarah Chen</strong>
						<span>Publisher, Lighthouse Books</span>
					</div>
				</div>
			</div>

			<div class="testimonial-card card">
				<div class="card-body">
					<p class="testimonial-text">
						"The website builder is fantastic! I created a professional site for my 
						books in just one afternoon. The templates are perfect for authors."
					</p>
					<div class="testimonial-author">
						<strong>Marcus Rodriguez</strong>
						<span>Author of "The Digital Nomad"</span>
					</div>
				</div>
			</div>

			<div class="testimonial-card card">
				<div class="card-body">
					<p class="testimonial-text">
						"BookWorm's community features helped us organize successful book launch 
						events across multiple cities. The platform is invaluable for publishers."
					</p>
					<div class="testimonial-author">
						<strong>Emily Thompson</strong>
						<span>Marketing Director, Novel Press</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="cta">
	<div class="container">
		<div class="cta-content">
			<h2 class="cta-title">Ready to Grow Your Literary Business?</h2>
			<p class="cta-description">
				Join hundreds of authors and publishers who trust BookWorm to connect 
				them with passionate readers worldwide.
			</p>
			<div class="cta-actions">
				<a href="/business/services" class="btn btn-primary btn-lg">
					Get Started Today
				</a>
				<a href="/business/about" class="btn btn-outline btn-lg">
					Learn More About Us
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 6rem 0 4rem;
		text-align: center;
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-title {
		font-size: 3.5rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
		line-height: 1.1;
	}

	.hero-description {
		font-size: 1.25rem;
		margin-bottom: 2.5rem;
		opacity: 0.9;
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.services-overview {
		padding: 5rem 0;
		background: white;
	}

	.section-title {
		text-align: center;
		margin-bottom: 3rem;
		font-size: 2.5rem;
		color: #1f2937;
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.service-card {
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.service-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.service-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 1rem;
		margin-bottom: 1.5rem;
	}

	.service-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.service-description {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.service-link {
		color: #3b82f6;
		font-weight: 500;
		text-decoration: none;
	}

	.service-link:hover {
		text-decoration: underline;
	}

	.stats-section {
		background: #f9fafb;
		padding: 4rem 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		text-align: center;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-number {
		font-size: 3rem;
		font-weight: 700;
		color: #3b82f6;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.testimonials {
		padding: 5rem 0;
		background: white;
	}

	.testimonials-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.testimonial-card {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.testimonial-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
	}

	.testimonial-text {
		font-style: italic;
		color: #4b5563;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.testimonial-author strong {
		display: block;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.testimonial-author span {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.cta {
		background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
		color: white;
		padding: 4rem 0;
		text-align: center;
	}

	.cta-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.cta-title {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.cta-description {
		font-size: 1.125rem;
		margin-bottom: 2rem;
		opacity: 0.9;
		line-height: 1.6;
	}

	.cta-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}

		.hero-description {
			font-size: 1.125rem;
		}

		.hero-actions,
		.cta-actions {
			flex-direction: column;
			align-items: center;
		}

		.cta-title {
			font-size: 2rem;
		}

		.stat-number {
			font-size: 2.5rem;
		}
	}
</style>
