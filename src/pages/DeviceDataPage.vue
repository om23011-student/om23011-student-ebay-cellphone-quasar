<template>
  <q-page class="bg-grey-2 q-pa-xs-sm q-pa-sm-md q-py-md-xl">
    <div class="container-anuncio">

      <!-- BOTÓN PARA VOLVER -->
      <q-btn
        flat
        color="primary"
        icon="arrow_back"
        label="Volver a explorar"
        no-caps
        class="q-mb-sm q-mb-md-md"
        @click="router.push('/')"
      />

      <!-- ANUNCIO SELECCIONADO -->
      <template v-if="dispositivo">

        <div class="row q-col-gutter-sm q-col-gutter-md-lg">

          <!-- FOTOS E INFORMACIÓN PRINCIPAL -->
          <div class="col-12 col-md-7">
            <q-card flat bordered class="rounded-borders">

              <!-- GALERÍA DE FOTOS -->
              <q-card-section class="q-pa-xs q-pa-sm-md">
                <q-carousel
                  v-if="fotos.length > 0"
                  v-model="fotoActual"
                  animated
                  arrows
                  navigation
                  swipeable
                  infinite
                  control-color="primary"
                  :height="$q.screen.xs ? '260px' : '380px'"
                  class="galeria-anuncio rounded-borders"
                >
                  <q-carousel-slide
                    v-for="(foto, index) in fotos"
                    :key="`${dispositivo.id}-${index}`"
                    :name="index"
                    class="flex flex-center bg-white q-pa-none"
                  >
                    <q-img
                      :src="foto"
                      fit="contain"
                      class="foto-anuncio"
                    />
                  </q-carousel-slide>
                </q-carousel>

                <div
                  v-else
                  class="foto-anuncio-vacia flex flex-center column"
                >
                  <q-icon
                    name="phone_iphone"
                    :size="$q.screen.xs ? '60px' : '90px'"
                    color="grey-5"
                  />

                  <div class="text-caption text-sm-body2 text-grey-6 q-mt-sm">
                    No hay fotos disponibles
                  </div>
                </div>
              </q-card-section>

              <!-- TÍTULO Y PRECIO -->
              <q-card-section class="q-pa-md q-pa-md-lg">
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold">
                  {{ dispositivo.marca }}
                </div>

                <div :class="$q.screen.xs ? 'text-h6 text-weight-bold text-grey-9 q-mt-xs' : 'text-h5 text-weight-bold text-grey-9 q-mt-xs'">
                  {{ dispositivo.titulo }}
                </div>

                <div :class="$q.screen.xs ? 'text-h5 text-weight-bold text-primary q-mt-sm' : 'text-h4 text-weight-bold text-primary q-mt-md'">
                  {{ formatoPrecio(dispositivo.precio) }}
                </div>

                <!-- AGREGAR AL CARRITO -->
                <q-btn
                  color="primary"
                  icon="shopping_cart"
                  label="Agregar al carrito"
                  no-caps
                  unelevated
                  :size="$q.screen.xs ? 'md' : 'lg'"
                  class="full-width q-mt-md q-mt-md-lg boton-carrito"
                  @click="agregarAlCarrito(dispositivo)"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- VENDEDOR Y RESUMEN -->
          <div class="col-12 col-md-5">

            <!-- INFORMACIÓN DEL VENDEDOR -->
            <q-card flat bordered class="rounded-borders">
              <q-card-section class="q-pa-md">
                <div class="text-subtitle1 text-sm-h6 text-weight-bold q-mb-sm q-mb-md-md">
                  Información del vendedor
                </div>

                <div class="row items-center no-wrap q-gutter-sm q-gutter-sm-md">
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="person"
                    :size="$q.screen.xs ? '44px' : '54px'"
                  />

                  <div class="col">
                    <div class="text-caption text-grey-6">
                      Vendedor
                    </div>

                    <div class="text-body1 text-sm-subtitle1 text-weight-bold">
                      {{ dispositivo.vendedor }}
                    </div>

                    <div class="row items-center q-gutter-xs text-grey-7 text-caption text-sm-body2 q-mt-xs">
                      <q-icon name="phone" size="16px" />
                      <span>
                        {{ dispositivo.telefono || 'Número no disponible' }}
                      </span>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- ESTADO DEL TELÉFONO -->
            <q-card flat bordered class="rounded-borders q-mt-sm q-mt-md-md">
              <q-card-section class="q-pa-md row items-center justify-between">
                <div class="text-subtitle1 text-sm-h6 text-weight-bold">
                  Estado del dispositivo
                </div>

                <q-badge
                  color="primary"
                  outline
                  class="q-pa-xs-xs q-pa-sm text-capitalize text-subtitle2"
                >
                  {{ dispositivo.estado }}
                </q-badge>
              </q-card-section>
            </q-card>

            <!-- ESPECIFICACIONES -->
            <q-card flat bordered class="rounded-borders q-mt-sm q-mt-md-md">
              <q-card-section class="q-pa-md">
                <div class="text-subtitle1 text-sm-h6 text-weight-bold q-mb-xs q-mb-md-md">
                  Especificaciones
                </div>

                <q-list :dense="$q.screen.xs" separator>
                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="36px">
                      <q-icon name="phone_iphone" color="primary" size="20px" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption>Marca</q-item-label>
                      <q-item-label class="text-weight-medium">
                        {{ dispositivo.marca }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="36px">
                      <q-icon name="devices" color="primary" size="20px" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption>Modelo</q-item-label>
                      <q-item-label class="text-weight-medium">
                        {{ dispositivo.modelo }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="36px">
                      <q-icon name="monitor" color="primary" size="20px" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption>Pantalla</q-item-label>
                      <q-item-label class="text-weight-medium">
                        {{ dispositivo.pantalla }}"
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="36px">
                      <q-icon name="memory" color="primary" size="20px" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption>Sistema operativo</q-item-label>
                      <q-item-label class="text-weight-medium">
                        {{ dispositivo.sistema }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="36px">
                      <q-icon name="developer_board" color="primary" size="20px" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption>Memoria RAM</q-item-label>
                      <q-item-label class="text-weight-medium">
                        {{ dispositivo.ram }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-px-none">
                    <q-item-section avatar min-width="36px">
                      <q-icon name="storage" color="primary" size="20px" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption>Almacenamiento</q-item-label>
                      <q-item-label class="text-weight-medium">
                        {{ dispositivo.rom }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- DESCRIPCIÓN DEL ANUNCIO -->
          <div class="col-12">
            <q-card flat bordered class="rounded-borders q-mt-xs q-mt-md-none">
              <q-card-section class="q-pa-md q-pa-md-lg">
                <div class="text-subtitle1 text-sm-h6 text-weight-bold q-mb-sm">
                  Descripción del anuncio
                </div>

                <div class="text-body2 text-sm-body1 texto-descripcion">
                  {{ dispositivo.descripcion }}
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </template>

      <!-- ESTADO SIN ANUNCIO SELECCIONADO -->
      <q-card
        v-else
        flat
        bordered
        class="rounded-borders"
      >
        <q-card-section class="column items-center text-center q-pa-md q-pa-md-xl">
          <q-icon
            name="inventory_2"
            :size="$q.screen.xs ? '60px' : '80px'"
            color="grey-5"
          />

          <div class="text-subtitle1 text-sm-h6 text-weight-bold q-mt-md">
            No hay ningún anuncio seleccionado
          </div>

          <div class="text-caption text-sm-body2 text-grey-7 q-mt-xs">
            Regresa al catálogo y selecciona un teléfono para ver sus detalles.
          </div>

          <q-btn
            color="primary"
            icon="search"
            label="Explorar anuncios"
            no-caps
            unelevated
            class="q-mt-lg"
            @click="router.push('/')"
          />
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<style scoped>
.container-anuncio {
  max-width: 1200px;
  margin: 0 auto;
}

.rounded-borders {
  border-radius: 12px;
}

.galeria-anuncio {
  background: #fff;
}

.foto-anuncio {
  width: 100%;
  height: 100%;
}

.foto-anuncio-vacia {
  width: 100%;
  height: 260px;
  background: #fafafa;
  border-radius: 8px;
}

.texto-descripcion {
  white-space: pre-line;
  overflow-wrap: anywhere;
  line-height: 1.6;
}

.boton-carrito {
  min-height: 46px;
  font-weight: 600;
  border-radius: 8px;
}

@media (min-width: 600px) {
  .foto-anuncio-vacia {
    height: 380px;
  }

  .texto-descripcion {
    line-height: 1.8;
  }
}
</style>


<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useDeviceDataStore } from '@/stores/dataDevice'
import { useCounterStore } from '@/stores/counter'

const router = useRouter()
const $q = useQuasar()

const deviceData = useDeviceDataStore()
const carrito = useCounterStore()

// ==================================================
// DISPOSITIVO SELECCIONADO
// ==================================================

const dispositivo = computed(() => deviceData.selectedDevice)

const fotos = computed(() => dispositivo.value?.fotos || [])

const fotoActual = ref(0)

watch(
  () => dispositivo.value?.id,
  () => {
    fotoActual.value = 0
  }
)

// ==================================================
// FORMATO DE PRECIO
// ==================================================

const formatoPrecio = (precio) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(precio) || 0)
}

// ==================================================
// CARRITO
// ==================================================

function agregarAlCarrito(producto) {
  if (!producto) return

  // Se conserva el comportamiento original del store:
  // false significa que el producto ya estaba agregado.
  const agregado = carrito.addToCart(producto)

  if (!agregado) {
    $q.notify({
      type: 'warning',
      message: 'Este teléfono ya está en tu carrito',
      caption: 'Cada publicación corresponde a un teléfono único.',
      icon: 'info',
      position: 'top',
      timeout: 2500
    })

    return
  }

  $q.notify({
    type: 'positive',
    message: `${producto.marca} ${producto.modelo} agregado al carrito`,
    icon: 'shopping_cart',
    position: 'top',
    timeout: 1500
  })
}
</script>

