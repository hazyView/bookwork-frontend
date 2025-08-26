<div class="test-container">
  <h1>Test Page</h1>
  <p>If you can see this, the frontend is working!</p>
  <p>Current time: {new Date().toISOString()}</p>
</div>

<style>
  .test-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    color: var(--primary-color);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-primary);
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
</style>
