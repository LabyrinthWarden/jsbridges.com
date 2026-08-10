<script>
</script>

<h1>Generators List Page</h1>
<div>
  <ul>
    <li>
      <a href="/lab/gens/realm">Realm Generator</a>
    </li>
    <li>
      <a
        href="/lab/gens/settlements"
        class="disabled"
        onclick={(e) => {
          e.preventDefault();
        }}>
        Settlement Generator
      </a>
    </li>
  </ul>
</div>

<style>
    h1 {
        font-size: 2rem;
    }
  ul {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  li {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
