<template>
  <q-layout view="lHh Lpr lFf">
    <main-header />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import MainHeader from '@/components/MainHeader.vue'

</script>
