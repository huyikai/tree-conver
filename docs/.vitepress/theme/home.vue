<script setup lang="ts">
import VPDoc from 'vitepress/dist/client/theme-default/components/VPDoc.vue';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
</script>
<template>
  <div class="hero">
    <img
      class="logo"
      src="/static/logo.svg"
      alt="vitepress-custom"
    />
    <div class="name">Tree-Conver</div>
    <div class="text">Tree data conversion tool</div>

    <div class="buttons">
      <VPButton
        tag="a"
        size="medium"
        theme="brand"
        text="Docs"
        href="/Docs/1.Introduction.html"
      >
      </VPButton>
      <VPButton
        tag="a"
        size="medium"
        theme="sponsor"
        text="Example"
        href="/Example/arrayToTree.html"
      >
      </VPButton>
      <VPButton
        tag="a"
        size="medium"
        theme="alt"
        text="Github"
        href="https://github.com/huyikai/tree-conver.git"
      >
      </VPButton>
    </div>
  </div>
  <VPDoc />
</template>
<style lang="scss">
.hero {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding-top: 30px;

  .logo {
    display: block;
  }

  .name {
    line-height: 40px;
    font-size: 32px;
    font-weight: 700;
    white-space: pre-wrap;
    background: var(--vp-home-hero-name-background);
    background-clip: text;
    -webkit-text-fill-color: var(--vp-home-hero-name-color);
  }

  .text {
    color: var(--vp-c-text-2);
  }

  .buttons {
    display: flex;
    margin-top: 30px;
    flex-flow: row wrap;
    gap: 12px;
  }
}
</style>
