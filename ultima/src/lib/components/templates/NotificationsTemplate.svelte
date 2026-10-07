<div class="screen">
  <slot name="header" />
  <main>
    <slot />
  </main>
</div>

<style>
  .screen {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    background: #f2f4f7;
  }
  main {
    padding: 1rem;
  }
</style>
