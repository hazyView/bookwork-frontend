<script>
	import { 
		Users, 
		Heart, 
		Globe, 
		Award,
		TrendingUp,
		BookOpen,
		Target,
		Lightbulb,
		Shield,
		ArrowRight,
		Mail,
		MapPin,
		Building,
		Calendar
	} from 'lucide-svelte';

	const stats = [
		{ label: 'Founded', value: '2020' },
		{ label: 'Employees', value: '50+' },
		{ label: 'Authors Served', value: '2,500+' },
		{ label: 'Countries', value: '25+' }
	];

	const values = [
		{
			icon: Heart,
			title: 'Passion for Literature',
			description: 'We believe in the transformative power of books and the importance of connecting readers with stories that matter.'
		},
		{
			icon: Users,
			title: 'Community First',
			description: 'Building authentic relationships between authors, readers, and book clubs is at the heart of everything we do.'
		},
		{
			icon: Lightbulb,
			title: 'Innovation',
			description: 'We continuously evolve our platform to meet the changing needs of the literary community.'
		},
		{
			icon: Shield,
			title: 'Trust & Transparency',
			description: 'We maintain the highest standards of integrity in all our relationships and business practices.'
		}
	];

	const team = [
		{
			name: 'Sarah Johnson',
			role: 'CEO & Co-Founder',
			bio: 'Former publisher with 15+ years in the industry. Passionate about democratizing book marketing.',
			image: 'https://via.placeholder.com/300x300?text=SJ',
			linkedin: '#'
		},
		{
			name: 'Michael Chen',
			role: 'CTO & Co-Founder',
			bio: 'Tech entrepreneur with expertise in community platforms. Avid reader of sci-fi and fantasy.',
			image: 'https://via.placeholder.com/300x300?text=MC',
			linkedin: '#'
		},
		{
			name: 'Emily Rodriguez',
			role: 'Head of Community',
			bio: 'Community builder who has helped launch 200+ book clubs. Former librarian and book blogger.',
			image: 'https://via.placeholder.com/300x300?text=ER',
			linkedin: '#'
		},
		{
			name: 'David Thompson',
			role: 'Head of Marketing',
			bio: 'Marketing strategist specializing in literary brands. Has helped authors sell over 100K books.',
			image: 'https://via.placeholder.com/300x300?text=DT',
			linkedin: '#'
		}
	];

	const timeline = [
		{
			year: '2020',
			title: 'Company Founded',
			description: 'Started with a simple idea: make it easier for authors to connect with book clubs.',
			milestone: true
		},
		{
			year: '2021',
			title: 'First 100 Book Clubs',
			description: 'Reached our first major milestone with 100 active book clubs on the platform.',
			milestone: false
		},
		{
			year: '2022',
			title: 'Author Services Launch',
			description: 'Expanded beyond club connections to offer comprehensive marketing services.',
			milestone: true
		},
		{
			year: '2023',
			title: 'Website Builder Release',
			description: 'Launched our drag-and-drop website builder specifically designed for authors.',
			milestone: false
		},
		{
			year: '2024',
			title: 'Analytics Platform',
			description: 'Introduced advanced analytics to help authors understand their audience better.',
			milestone: true
		},
		{
			year: '2025',
			title: 'Global Expansion',
			description: 'Expanding to serve authors and book clubs in 25+ countries worldwide.',
			milestone: false
		}
	];

	const awards = [
		{
			year: '2024',
			title: 'Best Literary Platform',
			organization: 'BookTech Awards'
		},
		{
			year: '2023',
			title: 'Startup of the Year',
			organization: 'Publishing Innovation Awards'
		},
		{
			year: '2023',
			title: 'Community Builder Award',
			organization: 'Digital Marketing Institute'
		},
		{
			year: '2022',
			title: 'Rising Star',
			organization: 'Tech Entrepreneurs Association'
		}
	];

	const offices = [
		{
			city: 'San Francisco',
			address: '123 Literary Lane, San Francisco, CA 94102',
			type: 'Headquarters',
			employees: 30
		},
		{
			city: 'New York',
			address: '456 Publisher Plaza, New York, NY 10001',
			type: 'East Coast Office',
			employees: 15
		},
		{
			city: 'Austin',
			address: '789 Book Boulevard, Austin, TX 78701',
			type: 'Community Hub',
			employees: 8
		}
	];
</script>

<svelte:head>
	<title>About BookWorm - Our Company</title>
	<meta name="description" content="Learn about BookWorm's mission to connect authors with passionate readers through innovative technology and community building.">
</svelte:head>

<div class="company-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div class="hero-content">
				<h1 class="hero-title">
					Connecting Authors with 
					<span class="gradient-text">Passionate Readers</span>
				</h1>
				<p class="hero-description">
					Since 2020, we've been building bridges between literary creators and their audiences, 
					fostering communities that celebrate the written word and help authors thrive.
				</p>
				<div class="hero-stats">
					{#each stats as stat}
						<div class="stat-item">
							<div class="stat-value">{stat.value}</div>
							<div class="stat-label">{stat.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Mission & Vision -->
	<section class="mission">
		<div class="container">
			<div class="mission-grid">
				<div class="mission-card">
					<div class="card-icon">
						<Target size={40} />
					</div>
					<h3>Our Mission</h3>
					<p>
						To democratize book marketing by providing authors and publishers with the tools, 
						connections, and insights they need to reach passionate readers and build thriving literary communities.
					</p>
				</div>
				<div class="mission-card">
					<div class="card-icon">
						<Globe size={40} />
					</div>
					<h3>Our Vision</h3>
					<p>
						A world where every great story finds its audience, where authors can focus on creating 
						while we handle the connections, and where readers discover their next favorite book through trusted communities.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Our Values -->
	<section class="values">
		<div class="container">
			<div class="section-header">
				<h2>Our Values</h2>
				<p>The principles that guide everything we do</p>
			</div>

			<div class="values-grid">
				{#each values as value}
					<div class="value-card">
						<div class="value-icon">
							<svelte:component this={value.icon} size={32} />
						</div>
						<h3 class="value-title">{value.title}</h3>
						<p class="value-description">{value.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Our Story -->
	<section class="story">
		<div class="container">
			<div class="section-header">
				<h2>Our Story</h2>
				<p>The journey from idea to impact</p>
			</div>

			<div class="timeline">
				{#each timeline as event}
					<div class="timeline-item" class:milestone={event.milestone}>
						<div class="timeline-marker">
							<div class="timeline-year">{event.year}</div>
						</div>
						<div class="timeline-content">
							<h3 class="timeline-title">{event.title}</h3>
							<p class="timeline-description">{event.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Leadership Team -->
	<section class="team">
		<div class="container">
			<div class="section-header">
				<h2>Leadership Team</h2>
				<p>Meet the people building the future of literary connections</p>
			</div>

			<div class="team-grid">
				{#each team as member}
					<div class="team-card">
						<div class="member-image">
							<img src={member.image} alt={member.name}>
						</div>
						<div class="member-info">
							<h3 class="member-name">{member.name}</h3>
							<p class="member-role">{member.role}</p>
							<p class="member-bio">{member.bio}</p>
							<a href={member.linkedin} class="linkedin-link">
								Connect on LinkedIn
								<ArrowRight size={16} />
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Awards & Recognition -->
	<section class="awards">
		<div class="container">
			<div class="section-header">
				<h2>Awards & Recognition</h2>
				<p>Honored to be recognized by industry leaders</p>
			</div>

			<div class="awards-grid">
				{#each awards as award}
					<div class="award-card">
						<div class="award-icon">
							<Award size={32} />
						</div>
						<div class="award-content">
							<h3 class="award-title">{award.title}</h3>
							<p class="award-organization">{award.organization}</p>
							<span class="award-year">{award.year}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Offices -->
	<section class="offices">
		<div class="container">
			<div class="section-header">
				<h2>Our Offices</h2>
				<p>Where our team creates magic every day</p>
			</div>

			<div class="offices-grid">
				{#each offices as office}
					<div class="office-card">
						<div class="office-header">
							<div class="office-icon">
								<Building size={24} />
							</div>
							<div>
								<h3 class="office-city">{office.city}</h3>
								<p class="office-type">{office.type}</p>
							</div>
						</div>
						<div class="office-details">
							<div class="office-address">
								<MapPin size={16} />
								{office.address}
							</div>
							<div class="office-employees">
								<Users size={16} />
								{office.employees} employees
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Join Us -->
	<section class="join-us">
		<div class="container">
			<div class="join-content">
				<h2>Join Our Mission</h2>
				<p>
					We're always looking for passionate people who believe in the power of books 
					and want to help authors connect with their perfect readers.
				</p>
				<div class="join-actions">
					<button class="btn btn-primary btn-lg">
						View Open Positions
						<ArrowRight size={20} />
					</button>
					<button class="btn btn-outline btn-lg">
						<Mail size={20} />
						Get in Touch
					</button>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.company-page {
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
		max-width: 800px;
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
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.stat-item {
		text-align: center;
		background: rgba(255, 255, 255, 0.1);
		padding: 2rem 1rem;
		border-radius: 1rem;
		backdrop-filter: blur(10px);
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		opacity: 0.8;
	}

	/* Mission Section */
	.mission {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.mission-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.mission-card {
		background: white;
		padding: 3rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.card-icon {
		width: 5rem;
		height: 5rem;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 2rem;
	}

	.mission-card h3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.mission-card p {
		color: #6b7280;
		line-height: 1.6;
		font-size: 1.125rem;
	}

	/* Values Section */
	.values {
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

	.values-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.value-card {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 1rem;
		text-align: center;
		transition: all 0.3s ease;
	}

	.value-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		background: white;
	}

	.value-icon {
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

	.value-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.value-description {
		color: #6b7280;
		line-height: 1.6;
	}

	/* Story Section */
	.story {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.timeline {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		height: 100%;
		background: #e5e7eb;
		top: 0;
	}

	.timeline-item {
		display: flex;
		align-items: center;
		margin-bottom: 3rem;
		position: relative;
	}

	.timeline-item:nth-child(odd) {
		flex-direction: row-reverse;
	}

	.timeline-marker {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
	}

	.timeline-year {
		background: white;
		border: 3px solid #3b82f6;
		border-radius: 50%;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: #3b82f6;
		font-size: 0.875rem;
	}

	.timeline-item.milestone .timeline-year {
		background: #3b82f6;
		color: white;
	}

	.timeline-content {
		width: 45%;
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.timeline-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.timeline-description {
		color: #6b7280;
		line-height: 1.6;
	}

	/* Team Section */
	.team {
		padding: 5rem 0;
		background: white;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.team-card {
		background: #f9fafb;
		border-radius: 1rem;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.team-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.member-image {
		width: 100%;
		height: 300px;
		overflow: hidden;
	}

	.member-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-info {
		padding: 2rem;
	}

	.member-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.member-role {
		color: #3b82f6;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.member-bio {
		color: #6b7280;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.linkedin-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.linkedin-link:hover {
		color: #1d4ed8;
	}

	/* Awards Section */
	.awards {
		padding: 5rem 0;
		background: #f9fafb;
	}

	.awards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.award-card {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.award-icon {
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: white;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.award-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.award-organization {
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.award-year {
		font-size: 0.875rem;
		background: #e0f2fe;
		color: #0277bd;
		padding: 0.25rem 0.75rem;
		border-radius: 2rem;
		font-weight: 500;
	}

	/* Offices Section */
	.offices {
		padding: 5rem 0;
		background: white;
	}

	.offices-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.office-card {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 1rem;
		transition: all 0.3s ease;
	}

	.office-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		background: white;
	}

	.office-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.office-icon {
		width: 3rem;
		height: 3rem;
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.office-city {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.office-type {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.office-details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.office-address,
	.office-employees {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #374151;
		font-size: 0.875rem;
	}

	/* Join Us Section */
	.join-us {
		padding: 5rem 0;
		background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
		color: white;
	}

	.join-content {
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
	}

	.join-us h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.join-us p {
		font-size: 1.125rem;
		margin-bottom: 2rem;
		opacity: 0.9;
		line-height: 1.6;
	}

	.join-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}

		.hero-stats {
			grid-template-columns: repeat(2, 1fr);
		}

		.mission-grid {
			grid-template-columns: 1fr;
		}

		.values-grid,
		.team-grid,
		.awards-grid,
		.offices-grid {
			grid-template-columns: 1fr;
		}

		.timeline::before {
			left: 2rem;
		}

		.timeline-item {
			flex-direction: row !important;
			padding-left: 4rem;
		}

		.timeline-marker {
			left: 2rem;
		}

		.timeline-content {
			width: 100%;
		}

		.join-actions {
			flex-direction: column;
			align-items: center;
		}

		.section-header h2 {
			font-size: 2rem;
		}

		.join-us h2 {
			font-size: 2rem;
		}
	}
</style>
