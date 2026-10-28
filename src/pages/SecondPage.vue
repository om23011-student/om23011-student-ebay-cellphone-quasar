<template>
  <div>
    <!-- Option 1 -->
    <div>Direct store</div>
    <!-- Read the state value directly -->
    <div>{{ store.counter }}</div>
    <!-- Use getter directly -->
    <div>{{ store.doubleCount }}</div>

    <!-- Manipulate state directly -->
    <q-btn @click="store.counter--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="store.increment()">+</q-btn>
  </div>

  <div>
    <!-- Option 2 -->
    <div>Indirect store</div>
    <!-- Use the computed state -->
    <div>{{ count }}</div>
    <!-- Use the computed getter -->
    <div>{{ doubleCountValue }}</div>

    <!-- Use the exposed function -->
    <q-btn @click="decrementCount()">-</q-btn>
    <!-- Use the exposed function -->
    <q-btn @click="incrementCount()">+</q-btn>
  </div>

  <div>
    <!-- Option 3 -->
    <div>Destructured store</div>
    <!-- Use the destructured state -->
    <div>{{ counter }}</div>
    <!-- Use the destructured getter -->
    <div>{{ doubleCount }}</div>

    <!-- Manipulate state directly-->
    <q-btn @click="counter--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="increment()">+</q-btn>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCounterStore } from '@/stores/counter'

  const store = useCounterStore()

  // Option 2: use computed and functions to use the store
  const count = computed(() => store.counter)
  const doubleCountValue = computed(() => store.doubleCount)
  const incrementCount = () => store.increment() // use action
  const decrementCount = () => store.counter-- // manipulate directly

  // Option 3: use destructuring to use the store in the template
  const { counter, doubleCount } = storeToRefs(store) // state and getters need "storeToRefs"
  const { increment } = store // actions can be destructured directly
</script>
