<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar class="q-py-xs q-px-sm q-px-md-md row no-wrap items-center">

      <!-- LOGO Y NOMBRE DE LA TIENDA -->
      <div
        class="row items-center cursor-pointer q-mr-xs q-mr-sm-md"
        @click="$router.push('/')"
      >
        <img
          src="../assets/logo5_large.png"
          alt="Ebay CellPhone Logo"
          :style="{ height: $q.screen.xs ? '18px' : '42px', width: 'auto', objectFit: 'contain' }"
        />
      </div>

      <q-space v-if="!$q.screen.xs" />

      <!-- BARRA DE BÚSQUEDA RESPONSIVA -->
      <div class="search-container q-mx-xs q-mx-sm-sm col">
        <q-input
          v-model="textoBusqueda"
          bg-color="white"
          rounded
          outlined
          dense
          clearable
          :placeholder="$q.screen.xs ? 'Buscar...' : 'Buscar (min. 3 letras)...'"
          class="full-width"
          @keydown.enter="ejecutarBusqueda"
          @clear="limpiarBusqueda"
        >
          <template #append>
            <q-icon
              name="search"
              class="cursor-pointer text-grey-7"
              @click="ejecutarBusqueda"
            />
          </template>
        </q-input>
      </div>

      <q-space v-if="!$q.screen.xs" />

      <!-- BOTONES DE NAVEGACIÓN Y ACCIONES -->
      <div class="row items-center no-wrap q-gutter-xs">

        <!-- NAVEGACIÓN ESCRITORIO (md / sm) -->
        <q-btn
          flat
          no-caps
          icon="home"
          label="Inicio"
          to="/"
          class="gt-xs"
        />

        <q-btn
          flat
          no-caps
          icon="bar_chart"
          label="Estadísticas"
          to="/stats"
          class="gt-xs"
        />

        <!-- MENÚ DESPLEGABLE MÓVIL (Sustituye botones Inicio/Estadísticas en xs) -->
        <q-btn
          v-if="$q.screen.xs"
          flat
          round
          dense
          icon="more_vert"
          aria-label="Menú de navegación"
        >
          <q-menu auto-close>
            <q-list style="min-width: 150px">
              <q-item clickable to="/">
                <q-item-section avatar min-width="32px">
                  <q-icon name="home" color="primary" size="20px" />
                </q-item-section>
                <q-item-section>Inicio</q-item-section>
              </q-item>

              <q-item clickable to="/stats">
                <q-item-section avatar min-width="32px">
                  <q-icon name="bar_chart" color="primary" size="20px" />
                </q-item-section>
                <q-item-section>Estadísticas</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- BOTÓN ANUNCIAR (Formato compacto en móvil) -->
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="add_circle"
          :label="$q.screen.xs ? '' : 'Anunciar'"
          :round="$q.screen.xs"
          :dense="$q.screen.xs"
          text-color="white"
          class="text-bold"
          to="/newDevice"
        />

        <!-- CARRITO Y VISTA PREVIA -->
        <q-btn
          flat
          round
          dense
          icon="shopping_cart"
          aria-label="Abrir vista previa del carrito"
        >
          <q-badge
            v-if="carrito.counter > 0"
            color="negative"
            floating
          >
            {{ carrito.counter }}
          </q-badge>

          <q-menu
            anchor="bottom right"
            self="top right"
            :offset="[0, 8]"
          >
            <q-card style="width: 320px; max-width: 88vw;">

              <!-- ENCABEZADO DEL MENÚ -->
              <q-card-section class="row items-center justify-between q-pa-md q-pb-sm">
                <div class="text-subtitle1 text-weight-bold">Mi carrito</div>

                <q-badge color="primary">
                  {{ carrito.counter }} unidades
                </q-badge>
              </q-card-section>

              <q-separator />

              <!-- CARRITO VACÍO -->
              <q-card-section
                v-if="carrito.items.length === 0"
                class="column items-center q-pa-lg text-center"
              >
                <q-icon
                  name="shopping_cart"
                  size="40px"
                  color="grey-5"
                />

                <div class="text-caption text-grey-7 q-mt-sm">
                  Tu carrito está vacío
                </div>
              </q-card-section>

              <!-- LISTADO PREVIO DE PRODUCTOS -->
              <q-card-section
                v-else
                class="q-pa-xs"
                style="max-height: 280px; overflow-y: auto;"
              >
                <q-item
                  v-for="item in carrito.items"
                  :key="item.id"
                  class="q-px-sm"
                >
                  <q-item-section avatar min-width="48px">
                    <q-img
                      v-if="item.imagen"
                      :src="item.imagen"
                      fit="contain"
                      style="width: 44px; height: 44px;"
                    />

                    <q-icon
                      v-else
                      name="phone_iphone"
                      size="32px"
                      color="grey-5"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1" class="text-weight-bold text-caption">
                      {{ item.marca }} {{ item.modelo }}
                    </q-item-label>

                    <q-item-label caption>
                      Cant: {{ item.quantity }}
                    </q-item-label>

                    <q-item-label class="text-caption text-weight-bold text-primary">
                      ${{ (item.precio * item.quantity).toFixed(2) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>

              <!-- TOTAL -->
              <template v-if="carrito.items.length > 0">
                <q-separator />

                <q-card-section class="row items-center justify-between q-pa-md">
                  <span class="text-weight-bold">Total</span>

                  <span class="text-subtitle1 text-weight-bold text-primary">
                    ${{ carrito.totalPrice.toFixed(2) }}
                  </span>
                </q-card-section>
              </template>

              <!-- BOTÓN COMPRAR -->
              <q-card-actions class="q-pa-sm q-pa-md-md">
                <q-btn
                  color="primary"
                  icon="shopping_bag"
                  label="Comprar"
                  no-caps
                  unelevated
                  class="full-width"
                  :disable="carrito.items.length === 0"
                  @click="irAlCarrito"
                />
              </q-card-actions>

            </q-card>
          </q-menu>
        </q-btn>

      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const router = useRouter()
const route = useRoute()

// Store compartido de Pinia
const carrito = useCounterStore()

// Búsqueda
const textoBusqueda = ref(route.query.search || '')

watch(
  () => route.query.search,
  (newQuery) => {
    textoBusqueda.value = newQuery || ''
  }
)

const ejecutarBusqueda = () => {
  const queryLimpia = textoBusqueda.value
    ? textoBusqueda.value.trim()
    : ''

  if (queryLimpia.length >= 3) {
    router.push({
      path: '/',
      query: { search: queryLimpia }
    })
  } else if (queryLimpia.length === 0) {
    limpiarBusqueda()
  }
}

const limpiarBusqueda = () => {
  textoBusqueda.value = ''

  router.push({ path: '/' })
}

// Navegar a la página del carrito
const irAlCarrito = () => {
  router.push('/productosCarritos')
}
</script>

<style scoped>
.cursor-pointer {
  transition: opacity 0.2s ease;
}

.cursor-pointer:hover {
  opacity: 0.85;
}

.search-container {
  max-width: 450px;
}
</style>
