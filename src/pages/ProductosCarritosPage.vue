<template>
  <q-page class="bg-grey-2 q-pa-xs-sm q-pa-sm-md q-py-md-xl">
    <div class="container-carrito">

      <!-- ENCABEZADO -->
      <div class="row items-center justify-between q-mb-md q-mb-md-lg">
        <div>
          <div :class="$q.screen.xs ? 'text-h5 text-weight-bold text-grey-9 row items-center' : 'text-h4 text-weight-bold text-grey-9 row items-center'">
            <img
              src="../assets/logo5.png"
              class="q-mr-xs q-mr-sm-sm"
              :style="{ width: $q.screen.xs ? '36px' : '48px', height: $q.screen.xs ? '36px' : '48px' }"
            />
            Mi carrito
          </div>
          <div class="text-caption text-sm-subtitle1 text-grey-7 q-mt-xs">
            Revisa tus productos antes de continuar.
          </div>
        </div>

        <q-btn
          flat
          color="primary"
          icon="arrow_back"
          :label="$q.screen.xs ? 'Volver' : 'Seguir explorando'"
          no-caps
          class="q-mt-xs-xs q-mt-sm-none"
          :disable="procesandoCompra"
          @click="router.push('/')"
        />
      </div>

      <div class="row q-col-gutter-sm q-col-gutter-md-lg">

        <!-- LISTA DE PRODUCTOS -->
        <div class="col-12 col-md-8">
          <q-card flat bordered class="rounded-borders">

            <q-card-section class="row items-center justify-between q-pa-md">
              <div class="text-subtitle1 text-sm-h6 text-weight-bold">
                Productos seleccionados
              </div>

              <q-badge color="primary" rounded class="q-px-sm q-py-xs">
                {{ carrito.counter }}
                {{ carrito.counter === 1 ? 'unidad' : 'unidades' }}
              </q-badge>
            </q-card-section>

            <q-separator />

            <!-- CARRITO VACÍO -->
            <q-card-section
              v-if="carrito.items.length === 0"
              class="column items-center text-center q-pa-md q-pa-md-xl"
            >
              <q-icon
                name="shopping_cart"
                :size="$q.screen.xs ? '60px' : '90px'"
                color="grey-5"
              />

              <div class="text-subtitle1 text-sm-h6 text-grey-8 q-mt-md">
                Tu carrito está vacío
              </div>

              <div class="text-caption text-sm-body2 text-grey-6 q-mt-xs">
                Todavía no has agregado ningún teléfono.
              </div>

              <q-btn
                color="primary"
                icon="phone_iphone"
                label="Explorar teléfonos"
                no-caps
                unelevated
                class="q-mt-lg"
                @click="router.push('/')"
              />
            </q-card-section>

            <!-- PRODUCTOS -->
            <template v-else>
              <template v-for="(item, index) in carrito.items" :key="item.id">
                <q-card-section class="q-pa-xs-sm q-pa-sm-md">
                  <div class="row items-start q-col-gutter-xs-sm q-col-gutter-sm-md">

                    <!-- IMAGEN -->
                    <div class="col-4 col-sm-3 flex flex-center">
                      <q-img
                        v-if="item.imagen"
                        :src="item.imagen"
                        fit="contain"
                        class="imagen-producto"
                      />

                      <div
                        v-else
                        class="imagen-producto flex flex-center bg-grey-3"
                      >
                        <q-icon
                          name="phone_iphone"
                          :size="$q.screen.xs ? '32px' : '50px'"
                          color="grey-6"
                        />
                      </div>
                    </div>

                    <!-- INFORMACIÓN -->
                    <div class="col-8 col-sm-9">
                      <div class="row items-start no-wrap justify-between">
                        <div class="col q-pr-xs">
                          <div class="text-caption text-grey-6 text-uppercase text-weight-bold">
                            {{ item.marca }}
                          </div>

                          <div class="text-subtitle2 text-sm-subtitle1 text-weight-bold text-grey-9 ellipsis-2-lines">
                            {{ item.modelo || item.titulo }}
                          </div>

                          <div class="text-caption text-grey-7 q-mt-xs">
                            <span v-if="item.ram">
                              RAM: {{ item.ram }}
                            </span>

                            <span v-if="item.ram && item.rom">
                              ·
                            </span>

                            <span v-if="item.rom">
                              Storage: {{ item.rom }}
                            </span>
                          </div>

                          <q-badge
                            v-if="item.estado"
                            color="grey-3"
                            text-color="grey-8"
                            class="q-mt-xs text-caption"
                          >
                            {{ item.estado }}
                          </q-badge>
                        </div>

                        <!-- ELIMINAR DEL CARRITO -->
                        <q-btn
                          flat
                          round
                          dense
                          color="grey-7"
                          icon="delete_outline"
                          aria-label="Eliminar producto del carrito"
                          :disable="procesandoCompra"
                          @click="eliminarProducto(item.id)"
                        >
                          <q-tooltip>
                            Eliminar del carrito
                          </q-tooltip>
                        </q-btn>
                      </div>

                      <!-- PRECIO -->
                      <div class="row items-end justify-between q-mt-sm q-mt-sm-md">
                        <div>
                          <div class="text-caption text-grey-6">
                            Precio unitario
                          </div>

                          <div class="text-caption text-sm-body2 text-grey-8">
                            {{ formatoPrecio(item.precio) }}
                          </div>
                        </div>

                        <div class="text-right">
                          <div class="text-caption text-grey-6">
                            Subtotal (x{{ item.quantity || 1 }})
                          </div>
                          <div class="text-subtitle1 text-sm-h6 text-weight-bold text-primary">
                            {{
                              formatoPrecio(
                                Number(item.precio || 0) *
                                Number(item.quantity || 1)
                              )
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>

                <q-separator v-if="index < carrito.items.length - 1" />
              </template>

              <q-separator color="grey-4" />

              <!-- ACCIONES DEL CARRITO -->
              <q-card-section
                class="row justify-between items-center q-pa-sm q-pa-md-md"
                :class="{ 'column q-gutter-y-xs': $q.screen.xs }"
              >
                <q-btn
                  flat
                  color="primary"
                  icon="delete_sweep"
                  label="Vaciar carrito"
                  no-caps
                  :class="{ 'full-width': $q.screen.xs }"
                  :disable="procesandoCompra"
                  @click="confirmarVaciar"
                />

                <q-btn
                  flat
                  color="primary"
                  icon="add"
                  label="Agregar más productos"
                  no-caps
                  :class="{ 'full-width': $q.screen.xs }"
                  :disable="procesandoCompra"
                  @click="router.push('/')"
                />
              </q-card-section>
            </template>
          </q-card>
        </div>

        <!-- RESUMEN DE COMPRA -->
        <div class="col-12 col-md-4">
          <q-card flat bordered class="rounded-borders">
            <q-card-section class="q-pa-md">
              <div class="text-subtitle1 text-sm-h6 text-weight-bold">
                Resumen de compra
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
              <div class="row justify-between q-mb-sm text-body2">
                <span class="text-grey-7">Productos</span>
                <span class="text-weight-medium">
                  {{ carrito.counter }}
                </span>
              </div>

              <div class="row justify-between q-mb-sm text-body2">
                <span class="text-grey-7">Subtotal</span>
                <span class="text-weight-medium">
                  {{ formatoPrecio(carrito.totalPrice) }}
                </span>
              </div>

              <div class="row justify-between q-mb-sm text-body2">
                <span class="text-grey-7">Envío</span>
                <span class="text-caption text-grey-6">
                  Por confirmar
                </span>
              </div>

              <q-separator class="q-my-md" />

              <div class="row justify-between items-center">
                <span class="text-subtitle1 text-weight-bold">
                  Total parcial
                </span>

                <span class="text-h5 text-weight-bold text-primary">
                  {{ formatoPrecio(carrito.totalPrice) }}
                </span>
              </div>

              <div class="text-caption text-grey-6 q-mt-xs">
                El total no incluye posibles gastos de envío.
              </div>

              <!-- CONFIRMAR COMPRA -->
              <q-btn
                color="primary"
                icon="shopping_bag"
                :label="
                  procesandoCompra
                    ? 'Procesando compra...'
                    : 'Confirmar compra'
                "
                no-caps
                unelevated
                size="lg"
                class="full-width q-mt-md q-mt-md-lg boton-confirmar"
                :loading="procesandoCompra"
                :disable="
                  procesandoCompra ||
                  carrito.items.length === 0
                "
                @click="compraRealizada"
              />

              <div class="text-caption text-grey-6 q-mt-sm">
                Al confirmar, se eliminarán de la tienda los anuncios
                comprados y sus imágenes asociadas.
              </div>
            </q-card-section>
          </q-card>

          <!-- INFORMACIÓN ADICIONAL -->
          <q-card flat bordered class="rounded-borders q-mt-sm q-mt-md-md">
            <q-card-section class="row no-wrap items-center q-gutter-sm q-gutter-md-md q-pa-md">
              <q-icon
                name="verified_user"
                color="primary"
                :size="$q.screen.xs ? '24px' : '30px'"
              />

              <div>
                <div class="text-subtitle2 text-weight-bold">
                  Compra con tranquilidad
                </div>

                <div class="text-caption text-grey-7 q-mt-xs">
                  Revisa el estado y las características de cada teléfono
                  antes de confirmar tu compra.
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.container-carrito {
  max-width: 1200px;
  margin: 0 auto;
}

.rounded-borders {
  border-radius: 12px;
}

.imagen-producto {
  width: 100%;
  height: 110px;
  border-radius: 8px;
  background-color: #fafafa;
}

.boton-confirmar {
  min-height: 48px;
  font-weight: 600;
  border-radius: 8px;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 600px) {
  .imagen-producto {
    height: 140px;
  }
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconSet, useQuasar } from 'quasar'
import { useCounterStore } from '@/stores/counter'

// Firebase
import { db } from '@/boot/firebase'
import { doc, deleteDoc } from 'firebase/firestore'

// CouchDB
import { api } from '@/boot/axios'

const router = useRouter()
const $q = useQuasar()
const carrito = useCounterStore()

const procesandoCompra = ref(false)

// Formatear precios
const formatoPrecio = (precio) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(precio) || 0)
}

// Eliminar un artículo solo del carrito.
// Esto NO elimina el anuncio de la tienda.
const eliminarProducto = (id) => {
  if (procesandoCompra.value) return

  carrito.removeFromCart(id)

  $q.notify({
    type: 'positive',
    message: 'Producto eliminado del carrito',
    position: 'top',
    timeout: 1500
  })
}

// Vaciar el carrito sin borrar los anuncios
const confirmarVaciar = () => {
  if (procesandoCompra.value) return

  $q.dialog({
    title: 'Vaciar carrito',
    message:
      '¿Deseas quitar todos los teléfonos del carrito? ' +
      'Los anuncios seguirán publicados en la tienda.',
    cancel: {
      label: 'Cancelar',
      flat: true,
      noCaps: true
    },
    persistent: true,
    ok: {
      label: 'Sí, vaciar',
      color: 'primary',
      unelevated: true,
      noCaps: true
    }
  }).onOk(() => {
    carrito.clearCart()

    $q.notify({
      type: 'positive',
      message: 'Tu carrito está vacío',
      position: 'top'
    })
  })
}

// Eliminar el documento de imágenes de CouchDB.
// Las imágenes están adjuntas al documento cuyo ID coincide
// con el ID del anuncio de Firestore.
async function eliminarImagenesCouchDB(idDocumento) {
  const id = encodeURIComponent(String(idDocumento))
  let documento

  try {
    const response = await api.get(`/imagenesfpi/${id}`)
    documento = response.data
  } catch (error) {
    // Si no existe el documento de imágenes, continuamos con
    // Firestore. Esto también cubre anuncios sin imágenes.
    if (error.response?.status === 404) {
      return
    }

    throw new Error(
      `No se pudo consultar el documento de imágenes ${idDocumento}.`
    )
  }

  const revision = documento?._rev

  if (!revision) {
    throw new Error(
      `CouchDB no devolvió la revisión del documento ${idDocumento}.`
    )
  }

  try {
    await api.delete(
      `/imagenesfpi/${id}?rev=${encodeURIComponent(revision)}`
    )
  } catch (error) {
    // El documento ya no existe: no hay nada más que borrar allí.
    if (error.response?.status === 404) {
      return
    }

    throw new Error(
      `No se pudieron eliminar las imágenes del producto ${idDocumento}.`
    )
  }
}

// Eliminar el anuncio completo de CouchDB y Firestore
async function eliminarAnuncioCompleto(item) {
  if (!item?.id) {
    throw new Error('El producto no tiene un ID válido.')
  }

  // Primero se intenta eliminar el documento de CouchDB.
  await eliminarImagenesCouchDB(item.id)

  // Después se elimina el anuncio de Firestore.
  await deleteDoc(doc(db, 'product', String(item.id)))
}

// Mostrar el diálogo final antes de eliminar anuncios
const compraRealizada = () => {
  if (procesandoCompra.value || carrito.items.length === 0) {
    return
  }

  // Copia del pedido confirmado.
  const pedido = carrito.items.map(item => ({ ...item }))

  const detalleProductos = pedido.map((item, index) => {
    const nombre =
      item.modelo || item.titulo || item.marca || 'Teléfono'

    const cantidad = Number(item.quantity) || 1
    const precio = formatoPrecio(
      (Number(item.precio) || 0) * cantidad
    )

    return `${index + 1}. ${nombre} — ${precio}`
  }).join('\n')

  const total = pedido.reduce((suma, item) => {
    return suma +
      (Number(item.precio) || 0) *
      (Number(item.quantity) || 1)
  }, 0)

  $q.dialog({
    title: 'Confirmar compra',
    html: true, // Permite el uso de etiquetas y clases HTML
    message: `
      <p class="q-mb-sm">Vas a confirmar la compra de <strong>${pedido.length} ${pedido.length === 1 ? 'producto' : 'productos'}</strong>.</p>
      <list class="q-mb-sm">
        ${detalleProductos.split('\n').map(line => `<ol>${line}</ol>`).join('')}
      </list>
      <p class="text-subtitle1 text-weight-bold">Total parcial: ${formatoPrecio(total)}</p>
      <p class="text-caption text-grey-8 q-mt-md">
        Al confirmar, los anuncios seleccionados se eliminarán de la tienda y sus imágenes de CouchDB. Esta acción no se puede deshacer desde el carrito.
      </p>
    `,
    cancel: {
      label: 'Cancelar',
      flat: true,
      noCaps: true
    },
    persistent: true,
    ok: {
      label: 'Confirmar compra',
      color: 'primary',
      unelevated: true,
      noCaps: true
    }
  }).onOk(() => {
    procesarCompra(pedido)
})
}

//compra realizada pero sin eliminar los anuncios de la tienda
function compraRealizadaSinEliminar() {
  if (procesandoCompra.value || carrito.items.length === 0) {
    return
  }

  // Copia del pedido confirmado.
  const pedido = carrito.items.map(item => ({ ...item }))

  const detalleProductos = pedido.map((item, index) => {
    const nombre =
      item.modelo || item.titulo || item.marca || 'Teléfono'

    const cantidad = Number(item.quantity) || 1
    const precio = formatoPrecio(
      (Number(item.precio) || 0) * cantidad
    )

    return `${index + 1}. ${nombre} — ${precio}`
  }).join('\n')

  const total = pedido.reduce((suma, item) => {
    return suma +
      (Number(item.precio) || 0) *
      (Number(item.quantity) || 1)
  }, 0)

  $q.dialog({
    title: 'Confirmar compra',
    html: true,
    message: `
      <p class="q-mb-sm">Vas a confirmar la compra de <strong>${pedido.length} ${pedido.length === 1 ? 'producto' : 'productos'}</strong>.</p>
      <list class="q-mb-sm">
        ${detalleProductos.split('\n').map(line => `<ol>${line}</ol>`).join('')}
      </list>
      <p class="text-subtitle1 text-weight-bold">Total parcial: ${formatoPrecio(total)}</p>
      <p class="text-caption text-grey-8 q-mt-md">
        Al confirmar, los anuncios seleccionados permanecerán en la tienda y sus imágenes en CouchDB.
    `,
    cancel: {
      label: 'Cancelar',
      flat: true,
      noCaps: true
    },
    persistent: true,
    ok: {
      label: 'Confirmar compra',
      color: 'primary',
      unelevated: true,
      noCaps: true
    }
  }).onOk(() => {
    carrito.clearCart()

    $q.notify({
      type: 'positive',
      message: '¡Compra confirmada correctamente!',
      position: 'top',
      timeout: 3500
    })
})
}

// Procesar cada anuncio individualmente
async function procesarCompra(pedido) {
  if (procesandoCompra.value) return

  procesandoCompra.value = true

  const eliminados = []
  const fallidos = []

  try {
    for (const item of pedido) {
      try {
        await eliminarAnuncioCompleto(item)

        // Quitar del carrito solo después de completar el proceso.
        carrito.removeFromCart(item.id)
        eliminados.push(item)
      } catch (error) {
        console.error(
          `Error al procesar el producto ${item.id}:`,
          error
        )

        fallidos.push(item)
      }
    }

    if (fallidos.length === 0) {
      $q.notify({
        type: 'primary',
        icon: 'check_circle',
        message: '¡Compra confirmada correctamente!',
        caption:
          `${eliminados.length} ` +
          `${eliminados.length === 1
            ? 'anuncio eliminado'
            : 'anuncios eliminados'} de la tienda.`,
        position: 'top',
        timeout: 3500
      })

      // El carrito ya quedó vacío si todos se procesaron.
      return
    }

    if (eliminados.length > 0) {
      $q.notify({
        type: 'warning',
        icon: 'warning',
        message: 'Compra procesada parcialmente',
        caption:
          `${eliminados.length} producto(s) procesado(s). ` +
          `${fallidos.length} producto(s) permanece(n) en el carrito ` +
          'porque no se pudo completar su eliminación.',
        position: 'top',
        timeout: 6000
      })
    } else {
      $q.notify({
        type: 'negative',
        icon: 'error',
        message: 'No se pudo completar la compra',
        caption:
          'Los productos permanecen en el carrito. Revisa la conexión ' +
          'y los permisos de las bases de datos antes de reintentar.',
        position: 'top',
        timeout: 5000
      })
    }
  } finally {
    procesandoCompra.value = false
  }
}
</script>

