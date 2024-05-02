
<script>
  import Icon from '@iconify/svelte';
  export let pulse = true;
  export let pulseClasses = pulse ? ' animate-pulse-fast text-amber-400' : 'text-amber-400';
</script>

<div {...$$props} class="magic | {$$props.class}" >
  <Icon class="{`w-6 h-6 ${pulseClasses}`}" icon="ph:sparkle-duotone" />
</div>
