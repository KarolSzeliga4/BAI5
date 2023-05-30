<template>
  <div class="wrapper">
    <Toast></Toast>
    <page-header></page-header>
    <page-nav></page-nav>
    <page-main>
      <router-view></router-view>
    </page-main>
    <page-footer></page-footer>
  </div>
</template>

<script setup>
import PageHeader from "./components/PageHeader.vue";
import PageFooter from "./components/PageFooter.vue";
import PageMain from "./components/PageMain.vue";
import PageNav from "./components/PageNav.vue";
import Toast from "./components/Toast.vue";
</script>
