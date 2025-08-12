<script lang="ts">
  import { fly } from 'svelte/transition';
  const items = [
    {
      name: 'GitOps Pipeline',
      url: 'https://github.com/hazyView/bookwork-Gitops'
    },
    {
      name: 'Frontend',
      url: 'https://github.com/hazyView/bookwork-frontend'
    },
    {
      name: 'Infrastructure',
      url: 'https://github.com/hazyView/bookwork-infra-gcp'
    }
  ];
</script>

<div class="card-list" in:fly={{ y: 20, duration: 200 }}>
  <div class="card-list-header">
    <span class="card-list-title">GitHub Repositories</span>
  <a
    class="card-list-link"
    href="https://github.com/hazyView?tab=repositories"
    target="_blank"
    rel="noopener noreferrer"
  >View All</a>
  </div>
  <ul class="card-list-items">
    {#each items as item}
      <li class="card-list-item">
        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
.card-list {
  background: var(--color-surface, #fff);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  margin-top: 1rem;
  min-width: 260px;
  max-width: 400px;
}
.card-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.card-list-title {
  font-weight: 600;
  font-size: 1.1rem;
}
.card-list-link {
  font-size: 0.95rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.card-list-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
.card-list-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.card-list-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1rem;
}
.card-list-item:last-child {
  border-bottom: none;
}
</style>
