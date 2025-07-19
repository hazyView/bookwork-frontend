<script>
	import { BookOpen, Users, Calendar, MessageCircle, Building2, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
	<title>BookWorm - Connect Readers Through Local Book Clubs</title>
	<meta name="description" content="Join local book clubs and connect with fellow readers. Organize meetings, track events, and build a community around your love of books." />
</svelte:head>

<div class="hero">
	<div class="container">
		<div class="hero-content">
			<h1 class="hero-title">Connect Readers Through Local Book Clubs</h1>
			<p class="hero-description">
				Join vibrant local book clubs, organize meetings, and build lasting friendships 
				through the power of shared reading experiences.
			</p>
			<div class="hero-actions">
				<a href="/clubs" class="btn btn-primary btn-lg">
					<Users size={20} />
					Join a Club
				</a>
				<a href="/business" class="btn btn-outline btn-lg">
					<Building2 size={20} />
					For Business
				</a>
			</div>
		</div>
	</div>
</div>

<section class="features">
	<div class="container">
		<h2 class="section-title">Why Choose BookWorm?</h2>
		<div class="features-grid">
			<div class="feature-card card">
				<div class="card-body">
					<div class="feature-icon">
						<Users size={32} />
					</div>
					<h3 class="feature-title">Club Management</h3>
					<p class="feature-description">
						Easily manage your book club roster, track member participation, 
						and maintain organized records of all your club activities.
					</p>
				</div>
			</div>

			<div class="feature-card card">
				<div class="card-body">
					<div class="feature-icon">
						<Calendar size={32} />
					</div>
					<h3 class="feature-title">Smart Scheduling</h3>
					<p class="feature-description">
						Schedule meetings, track availability, and coordinate with members 
						to find the perfect time for everyone to gather and discuss.
					</p>
				</div>
			</div>

			<div class="feature-card card">
				<div class="card-body">
					<div class="feature-icon">
						<BookOpen size={32} />
					</div>
					<h3 class="feature-title">Reading Tracking</h3>
					<p class="feature-description">
						Keep track of books read, upcoming selections, and member contributions 
						to create a rich history of your club's literary journey.
					</p>
				</div>
			</div>

			<div class="feature-card card">
				<div class="card-body">
					<div class="feature-icon">
						<MessageCircle size={32} />
					</div>
					<h3 class="feature-title">Community Support</h3>
					<p class="feature-description">
						Get help when you need it with our comprehensive support system, 
						including chat support and extensive documentation.
					</p>
				</div>
			</div>

			<div class="feature-card card">
				<div class="card-body">
					<div class="feature-icon">
						<Building2 size={32} />
					</div>
					<h3 class="feature-title">Business Tools</h3>
					<p class="feature-description">
						Publishers and authors can leverage our platform to connect with 
						readers and build their community presence.
					</p>
				</div>
			</div>

			<div class="feature-card card">
				<div class="card-body">
					<div class="feature-icon">
						<Sparkles size={32} />
					</div>
					<h3 class="feature-title">Website Builder</h3>
					<p class="feature-description">
						Create professional websites with our intuitive drag-and-drop 
						builder designed specifically for the literary community.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="cta">
	<div class="container">
		<div class="cta-content">
			<h2 class="cta-title">Ready to Start Your Book Club Journey?</h2>
			<p class="cta-description">
				Join thousands of readers already connecting through BookWorm. 
				Find your perfect book club today.
			</p>
			<a href="/clubs" class="btn btn-primary btn-lg">
				Get Started Today
			</a>
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

	.features {
		padding: 5rem 0;
		background: white;
	}

	.section-title {
		text-align: center;
		margin-bottom: 3rem;
		font-size: 2.5rem;
		color: #1f2937;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.feature-icon {
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

	.feature-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.feature-description {
		color: #6b7280;
		line-height: 1.6;
	}

	.cta {
		background: #f9fafb;
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
		color: #1f2937;
	}

	.cta-description {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}

		.hero-description {
			font-size: 1.125rem;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
		}

		.cta-title {
			font-size: 2rem;
		}
	}
</style>
