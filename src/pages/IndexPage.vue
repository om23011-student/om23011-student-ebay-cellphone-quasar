<template>
  <q-page class="feed-page q-px-sm q-py-md relative-position">
    <!-- Carga -->
    <q-inner-loading :showing="cargando" class="loading-catalogo">
      <q-spinner-dots size="50px" color="primary" />
      <span class="q-mt-sm text-subtitle2 texto-secundario">
        Cargando catálogo e imágenes...
      </span>
    </q-inner-loading>

    <div v-if="!cargando" class="feed-container">
      <div class="row q-col-gutter-md feed-layout-row">

        <!-- FILTROS LATERALES -->
        <div class="col-12 col-md-3 feed-filters-column">
          <q-card flat bordered class="panel-filtros">
            <q-expansion-item
              :default-opened="$q.screen.gt.sm"
              icon="tune"
              label="Filtros"
              expand-separator
              header-class="texto-principal text-weight-bold"
              class="filtros-expansion"
            >

            <!-- ESTADO -->
            <q-card-section class="q-py-md">
              <div class="titulo-filtro">Estado del equipo</div>

              <div class="opcion-filtro">
                <q-toggle
                  v-model="filtroNuevoOnly"
                  label="Mostrar solo nuevos"
                  color="primary"
                  keep-color
                />
              </div>
            </q-card-section>

            <q-separator class="separador-suave" />

            <!-- MARCA -->
            <q-card-section class="q-py-md">
              <div class="titulo-filtro">
                Marca
              </div>

              <div
                v-for="marca in opcionesMarcas"
                :key="marca.nombre"
                class="fila-filtro"
              >
                <q-checkbox
                  v-model="marcasSeleccionadas"
                  :val="marca.nombre"
                  :label="marca.nombre"
                  dense
                  color="primary"
                  class="texto-filtro"
                />

                <q-badge class="contador-filtro">
                  {{ marca.count }}
                </q-badge>
              </div>
            </q-card-section>

            <q-separator class="separador-suave" />

            <!-- SISTEMA -->
            <q-card-section class="q-py-md">
              <div class="titulo-filtro">
                Sistema operativo
              </div>

              <div
                v-for="sis in opcionesSistemas"
                :key="sis.nombre"
                class="fila-filtro"
              >
                <q-checkbox
                  v-model="sistemasSeleccionados"
                  :val="sis.nombre"
                  :label="sis.nombre"
                  dense
                  color="primary"
                  class="texto-filtro"
                />

                <q-badge class="contador-filtro">
                  {{ sis.count }}
                </q-badge>
              </div>
            </q-card-section>

            <q-separator class="separador-suave" />

            <!-- PANTALLA -->
            <q-card-section class="q-py-md">
              <div class="titulo-filtro">
                Tamaño de pantalla
              </div>

              <div
                v-for="pan in opcionesPantallas"
                :key="pan.val"
                class="fila-filtro"
              >
                <q-checkbox
                  v-model="pantallasSeleccionadas"
                  :val="pan.val"
                  :label="pan.label"
                  dense
                  color="primary"
                  class="texto-filtro"
                />

                <q-badge class="contador-filtro">
                  {{ pan.count }}
                </q-badge>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-btn
                outline
                color="primary"
                label="Limpiar filtros"
                icon="filter_alt_off"
                class="full-width boton-limpiar"
                no-caps
                @click="limpiarFiltros"
              />
            </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>

        <!-- CATÁLOGO PRINCIPAL -->
        <div class="col-12 col-md-9 feed-catalog-column">

          <!-- PRECIO Y ORDENAMIENTO -->
          <q-card flat bordered class="barra-catalogo q-mb-lg">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-col-gutter-md feed-controls-row">

                <!-- PRECIO -->
                <div class="col-12 col-lg">
                  <div class="etiqueta-control q-mb-sm">
                    <q-icon name="payments" size="18px" />
                    Rango de precio
                  </div>

                  <div class="row items-center q-gutter-sm">
                    <q-input
                      v-model.number="precioMin"
                      type="number"
                      prefix="$"
                      placeholder="Mínimo"
                      outlined
                      dense
                      class="input-precio"
                    />

                    <span class="texto-secundario text-caption">hasta</span>

                    <q-input
                      v-model.number="precioMax"
                      type="number"
                      prefix="$"
                      placeholder="Máximo"
                      outlined
                      dense
                      class="input-precio"
                    />
                  </div>
                </div>

                <div class="col-12 col-lg-auto">

                  <div class="etiqueta-control q-mb-sm">
                    <q-icon name="sort" size="18px" />
                    Ordenar por
                  </div>

                  <div class="row items-center q-gutter-sm feed-price-inputs">
                    <q-btn
                      :outline="ordenActual !== 'precio-asc' && ordenActual !== 'precio-desc'"
                      :unelevated="ordenActual === 'precio-asc' || ordenActual === 'precio-desc'"
                      color="primary"
                      no-caps
                      class="boton-orden"
                      @click="toggleOrdenPrecio"
                    >
                      <q-icon
                        :name="ordenActual === 'precio-desc' ? 'south' : 'north'"
                        size="18px"
                        class="q-mr-xs"
                      />
                      Precio
                    </q-btn>

                    <q-btn
                      :outline="ordenActual !== 'fecha'"
                      :unelevated="ordenActual === 'fecha'"
                      color="primary"
                      icon="schedule"
                      label="Fecha"
                      no-caps
                      class="boton-orden"
                      @click="ordenActual = 'fecha'"
                    />
                  </div>
                </div>

              </div>
            </q-card-section>
          </q-card>

          <!-- ENCABEZADO DE RESULTADOS -->
          <div class="row items-center justify-between q-mb-md feed-results-header">
            <div class="text-subtitle1 text-weight-bold texto-principal">
              Dispositivos disponibles
            </div>

            <div class="texto-secundario text-caption">
              Explora el catálogo
            </div>
          </div>

          <!-- PRODUCTOS -->
          <div
            v-if="productosPaginados.length > 0"
            class="row q-col-gutter-md feed-products-grid"
          >
            <div
              v-for="prod in productosPaginados"
              :key="prod.id"
              class="col-6 col-sm-6 col-lg-4 feed-product-column"
            >
              <q-card
                flat
                bordered
                class="product-card column full-height cursor-pointer"
                @click="verAnuncio(prod)"
                @mouseenter="iniciarAnimacionImagen(prod)"
                @mouseleave="detenerAnimacionImagen(prod)"
              >
                <!-- IMAGEN -->
                <div
                  class="image-container relative-position flex flex-center"
                  @click.stop="verAnuncio(prod)"
                >
                  <q-img
                    v-if="prod.imagenes && prod.imagenes.length > 0"
                    :src="prod.imagenes[prod.indiceImagen]"
                    fit="contain"
                    class="imagen-producto"
                  >
                    <div
                      v-if="prod.imagenes.length > 1"
                      class="absolute-bottom-right contador-imagenes"
                    >
                      <q-icon name="photo_library" size="14px" class="q-mr-xs" />
                      {{ prod.indiceImagen + 1 }} / {{ prod.imagenes.length }}
                    </div>

                    <template #error>
                      <div class="placeholder-box flex flex-center full-width full-height">
                        <q-icon name="phone_iphone" size="58px" />
                      </div>
                    </template>
                  </q-img>

                  <div
                    v-else
                    class="placeholder-box flex flex-center full-width"
                  >
                    <q-icon name="phone_iphone" size="58px" />
                  </div>

                  <q-badge
                    v-if="prod.estado"
                    class="estado-producto"
                    :class="prod.estado === 'nuevo' ? 'estado-nuevo' : 'estado-usado'"
                  >
                    {{ prod.estado === 'nuevo' ? 'Nuevo' : 'Usado' }}
                  </q-badge>
                </div>

                <q-separator class="separador-suave" />

                <!-- INFORMACIÓN -->
                <q-card-section class="contenido-producto column col q-pa-md">
                  <div class="precio-producto">
                    ${{ Number(prod.precio || 0).toFixed(2) }}
                  </div>

                  <div
                    class="nombre-producto q-mt-sm cursor-pointer"
                    @click.stop="verAnuncio(prod)"
                  >
                    {{ prod.marca }} {{ prod.modelo }}
                  </div>

                  <div class="especificaciones-producto q-mt-xs">
                    <span v-if="prod.pantalla">
                      <q-icon name="aspect_ratio" size="14px" />
                      {{ prod.pantalla }}"
                    </span>

                    <span v-if="prod.rom">
                      <q-icon name="storage" size="14px" />
                      {{ prod.rom }}
                    </span>

                    <span v-if="prod.ram">
                      <q-icon name="memory" size="14px" />
                      {{ prod.ram }} RAM
                    </span>
                  </div>

                  <div
                    v-if="prod.vendedor"
                    class="vendedor-producto q-mt-md"
                  >
                    <q-avatar
                      size="26px"
                      class="avatar-vendedor"
                    >
                      <q-icon name="person" size="16px" />
                    </q-avatar>

                    <span class="ellipsis">
                      {{ prod.vendedor }}
                    </span>
                  </div>

                  <q-space />

                  <q-btn
                    color="primary"
                    icon="add_shopping_cart"
                    label="Agregar al carrito"
                    no-caps
                    unelevated
                    class="full-width boton-carrito q-mt-md"
                    @click.stop="agregarAlCarrito(prod)"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- SIN RESULTADOS -->
          <q-card
            v-else
            flat
            bordered
            class="sin-resultados text-center q-pa-xl"
          >
            <q-avatar
              size="76px"
              class="icono-sin-resultados q-mb-md"
            >
              <q-icon name="search_off" size="38px" />
            </q-avatar>

            <div class="text-h6 text-weight-bold texto-principal">
              No encontramos dispositivos
            </div>

            <div class="text-body2 texto-secundario q-mt-sm">
              Prueba con otros filtros o amplía el rango de precios.
            </div>

            <q-btn
              label="Restablecer filtros"
              color="primary"
              icon="restart_alt"
              no-caps
              unelevated
              class="q-mt-lg boton-orden"
              @click="limpiarFiltros"
            />
          </q-card>

          <!-- PAGINACIÓN -->
          <q-card
            flat
            bordered
            class="paginacion-catalogo q-mt-lg"
          >
            <q-card-section class="row items-center justify-between q-col-gutter-md feed-pagination-content">
              <div class="col-12 col-sm-auto feed-pagination-pages">
                <q-pagination
                  v-model="paginaActual"
                  :max="totalPaginas"
                  :max-pages="5"
                  direction-links
                  boundary-links
                  color="dark"
                  active-color="primary"
                  size="md"
                />
              </div>

              <div class="col-12 col-sm-auto row items-center q-gutter-sm feed-pagination-options">
                <span class="text-caption texto-secundario">
                  Artículos por página
                </span>

                <q-select
                  v-model="articulosPorPagina"
                  :options="[8, 12, 25, 50]"
                  dense
                  outlined
                  options-dense
                  class="selector-paginacion"
                />
              </div>
            </q-card-section>
          </q-card>

        </div>
      </div>
    </div>

    <!-- PIE DE PÁGINA -->
    <footer class="footer-tienda q-pa-sm text-center">
  <div class="text-caption text-grey-6 footer-text">
    &copy; {{ currentYear }} Adalid Orantes
    <span class="footer-separador q-mx-xs">•</span>
    <span class="text-weight-medium">Carnet:</span> OM23011
    <span class="footer-separador q-mx-xs">•</span>
    Todos los derechos reservados.
  </div>
</footer>
  </q-page>
</template>


<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'

import { useRoute, useRouter } from 'vue-router'

// Firebase y Axios
import { db } from '@/boot/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { api } from '@/boot/axios'

// Stores
import { useCounterStore } from '@/stores/counter'
import { useDeviceDataStore } from '@/stores/dataDevice'

// Quasar
import { useQuasar } from 'quasar'

// Instancias
const route = useRoute()
const router = useRouter()
const carrito = useCounterStore()
const deviceData = useDeviceDataStore()
const $q = useQuasar()

// Estado base
const productos = ref([])
const cargando = ref(true)

// Rangos de pantalla
const rangosPantalla = [
  { label: 'Menos de 6.0"', val: 'pequena', min: 0, max: 5.99 },
  { label: '6.0" a 6.5"', val: 'mediana', min: 6.0, max: 6.5 },
  { label: 'Más de 6.5"', val: 'grande', min: 6.51, max: 100 }
]

// Filtros
const filtroNuevoOnly = ref(false)
const marcasSeleccionadas = ref([])
const sistemasSeleccionados = ref([])
const pantallasSeleccionadas = ref([])

const precioMin = ref(null)
const precioMax = ref(null)
const ordenActual = ref('precio-desc') // 'precio-asc', 'precio-desc', 'fecha'

// Paginación
const paginaActual = ref(1)
const articulosPorPagina = ref(8)

// Normalizar texto
function normalizarTexto(texto) {
  if (!texto) return ''

  const t = String(texto).trim().toLowerCase()
  return t.charAt(0).toUpperCase() + t.slice(1)
}


//extraer año actual
const currentYear = computed(() => new Date().getFullYear())
// ==================================================
// IMÁGENES DE COUCHDB
// ==================================================

async function obtenerImagenesCouchDB(idDocumento) {
  try {
    const response = await api.get(
      `/imagenesfpi/${encodeURIComponent(idDocumento)}`
    )

    const anexos = response.data?._attachments

    if (!anexos || typeof anexos !== 'object') {
      return []
    }

    const listaArchivos = Object.keys(anexos)
    const listaBlobUrls = []

    for (const nombreArchivo of listaArchivos) {
      try {
        const urlArchivo =
          `/imagenesfpi/${encodeURIComponent(idDocumento)}/${encodeURIComponent(nombreArchivo)}`

        const responseBlob = await api.get(urlArchivo, {
          responseType: 'blob'
        })

        if (responseBlob.status === 200) {
          listaBlobUrls.push(
            URL.createObjectURL(responseBlob.data)
          )
        }
      } catch (errorArchivo) {
        console.warn(
          `No se pudo cargar el archivo "${nombreArchivo}" del producto ${idDocumento}.`,
          errorArchivo.response?.status || errorArchivo.message
        )
      }
    }

    return listaBlobUrls
  } catch (error) {
    // Un producto sin documento de imágenes no debe detener el catálogo.
    // El 404 indica que CouchDB no encontró el ID solicitado.
    if (error.response?.status === 404) {
      console.warn(
        `CouchDB no tiene un documento de imágenes para el producto ${idDocumento}.`
      )
    } else {
      console.warn(
        `No se pudieron obtener las imágenes del producto ${idDocumento}.`,
        error.message
      )
    }

    return []
  }
}

// ==================================================
// CARGAR PRODUCTOS DESDE FIREBASE
// ==================================================

async function cargarProductos() {
  cargando.value = true

  try {
    const querySnapshot = await getDocs(collection(db, 'product'))
    const listaProductos = []

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data()
      const idDoc = docSnap.id

      // La ausencia de imágenes no impide cargar el producto.
      const imagenes = await obtenerImagenesCouchDB(idDoc)

      const productoItem = {
        id: idDoc,
        titulo: data.titulo || '',
        marca: normalizarTexto(data.marca),
        modelo: data.modelo || '',
        sistema: normalizarTexto(data.Sistema || data.sistema),
        pantalla: data.pantalla ? Number(data.pantalla) : null,
        precio: data.precio ? Number(data.precio) : 0,
        ram: data.ram || '',
        rom: data.rom || '',
        estado: data.estado || 'usado',
        vendedor: data.vendedor || '',
        telefono: data.telefono || '',
        descripcion: data.descripcion || '',

        // Se conserva el mismo campo que utiliza el template.
        imagenes,
        indiceImagen: 0,
        intervaloAnimacion: null
      }

      listaProductos.push(productoItem)
    }

    productos.value = listaProductos
  } catch (error) {
    console.error('Error al cargar productos desde Firebase:', error)

    $q.notify({
      type: 'negative',
      message: 'No se pudo cargar el catálogo',
      caption: 'Comprueba tu conexión e inténtalo nuevamente.',
      icon: 'error',
      position: 'top',
      timeout: 3000
    })
  } finally {
    cargando.value = false
  }
}

// ==================================================
// ANIMACIÓN DE IMÁGENES
// ==================================================

function iniciarAnimacionImagen(prod) {
  if (
    prod.imagenes?.length > 1 &&
    !prod.intervaloAnimacion
  ) {
    prod.intervaloAnimacion = setInterval(() => {
      prod.indiceImagen =
        (prod.indiceImagen + 1) % prod.imagenes.length
    }, 2000)
  }
}

function detenerAnimacionImagen(prod) {
  if (prod.intervaloAnimacion) {
    clearInterval(prod.intervaloAnimacion)
    prod.intervaloAnimacion = null
  }

  prod.indiceImagen = 0
}

// Solo se limpian los temporizadores.
// No revocamos aquí las URL blob porque el anuncio seleccionado
// puede seguir utilizándolas en DeviceDataPage o en el carrito.
onBeforeUnmount(() => {
  productos.value.forEach(prod => {
    if (prod.intervaloAnimacion) {
      clearInterval(prod.intervaloAnimacion)
      prod.intervaloAnimacion = null
    }
  })
})

// Cargar catálogo al montar
onMounted(() => {
  cargarProductos()
})

// ==================================================
// RESETEAR PÁGINA CUANDO CAMBIAN LOS FILTROS
// ==================================================

watch(
  [
    filtroNuevoOnly,
    marcasSeleccionadas,
    sistemasSeleccionados,
    pantallasSeleccionadas,
    precioMin,
    precioMax,
    ordenActual,
    () => route.query.search
  ],
  () => {
    paginaActual.value = 1
  },
  { deep: true }
)

// ==================================================
// FILTRADO Y ORDENAMIENTO
// ==================================================

function toggleOrdenPrecio() {
  ordenActual.value =
    ordenActual.value === 'precio-asc'
      ? 'precio-desc'
      : 'precio-asc'
}

const productosFiltrados = computed(() => {
  const query = String(route.query.search || '')
    .toLowerCase()
    .trim()

  return productos.value
    .filter(item => {
      // Buscador
      if (query.length >= 3) {
        const coincideTitulo =
          item.titulo?.toLowerCase().includes(query)

        const coincideMarca =
          item.marca?.toLowerCase().includes(query)

        const coincideModelo =
          item.modelo?.toLowerCase().includes(query)

        if (
          !coincideTitulo &&
          !coincideMarca &&
          !coincideModelo
        ) {
          return false
        }
      }

      // Solo productos nuevos
      if (
        filtroNuevoOnly.value &&
        item.estado?.toLowerCase() !== 'nuevo'
      ) {
        return false
      }

      // Marca
      if (
        marcasSeleccionadas.value.length > 0 &&
        !marcasSeleccionadas.value.includes(item.marca)
      ) {
        return false
      }

      // Sistema
      if (
        sistemasSeleccionados.value.length > 0 &&
        !sistemasSeleccionados.value.includes(item.sistema)
      ) {
        return false
      }

      // Pantalla
      if (pantallasSeleccionadas.value.length > 0) {
        const coincideConAlgunRango =
          pantallasSeleccionadas.value.some(valRango => {
            const rangoDef = rangosPantalla.find(
              rango => rango.val === valRango
            )

            return (
              rangoDef &&
              item.pantalla !== null &&
              item.pantalla >= rangoDef.min &&
              item.pantalla <= rangoDef.max
            )
          })

        if (!coincideConAlgunRango) return false
      }

      // Precio mínimo
      if (
        precioMin.value !== null &&
        precioMin.value !== '' &&
        item.precio < Number(precioMin.value)
      ) {
        return false
      }

      // Precio máximo
      if (
        precioMax.value !== null &&
        precioMax.value !== '' &&
        item.precio > Number(precioMax.value)
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (ordenActual.value === 'precio-asc') {
        return a.precio - b.precio
      }

      if (ordenActual.value === 'precio-desc') {
        return b.precio - a.precio
      }

      // Se conserva el comportamiento anterior para "Fecha".
      return 0
    })
})

const totalPaginas = computed(() => {
  return (
    Math.ceil(
      productosFiltrados.value.length /
      Number(articulosPorPagina.value)
    ) || 1
  )
})

const productosPaginados = computed(() => {
  const cantidad = Number(articulosPorPagina.value) || 8
  const start = (paginaActual.value - 1) * cantidad

  return productosFiltrados.value.slice(start, start + cantidad)
})

// ==================================================
// OPCIONES DINÁMICAS DE FILTROS
// ==================================================

const opcionesMarcas = computed(() => {
  const conteo = {}

  productos.value.forEach(producto => {
    if (producto.marca) {
      conteo[producto.marca] =
        (conteo[producto.marca] || 0) + 1
    }
  })

  return Object.keys(conteo).map(nombre => ({
    nombre,
    count: conteo[nombre]
  }))
})

const opcionesSistemas = computed(() => {
  const conteo = {}

  productos.value.forEach(producto => {
    if (producto.sistema) {
      conteo[producto.sistema] =
        (conteo[producto.sistema] || 0) + 1
    }
  })

  return Object.keys(conteo).map(nombre => ({
    nombre,
    count: conteo[nombre]
  }))
})

const opcionesPantallas = computed(() => {
  return rangosPantalla.map(rango => {
    const count = productos.value.filter(producto => {
      return (
        producto.pantalla !== null &&
        producto.pantalla >= rango.min &&
        producto.pantalla <= rango.max
      )
    }).length

    return { ...rango, count }
  })
})

// Limpiar filtros
function limpiarFiltros() {
  filtroNuevoOnly.value = false
  marcasSeleccionadas.value = []
  sistemasSeleccionados.value = []
  pantallasSeleccionadas.value = []
  precioMin.value = null
  precioMax.value = null
  ordenActual.value = 'precio-asc'
  paginaActual.value = 1
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

// ==================================================
// ABRIR DETALLES DEL ANUNCIO
// ==================================================

function verAnuncio(producto) {
  if (!producto) return

  try {
    // Guarda el anuncio seleccionado en Pinia.
    // El store debe conservar las imágenes en el campo "fotos".
    deviceData.seleccionarDispositivo(producto)

    // Se conserva la ruta actual de detalles.
    router.push('/device').catch(error => {
      console.error('Error al abrir el anuncio:', error)
    })
  } catch (error) {
    console.error('No se pudo seleccionar el anuncio:', error)

    $q.notify({
      type: 'negative',
      message: 'No se pudo abrir este anuncio',
      position: 'top',
      timeout: 2500
    })
  }
}
</script>

<style scoped>

.feed-page {
  width: 100%;
  min-width: 0;
  min-height: 100%;
  box-sizing: border-box;
  background: var(--background, #f7f6f2);
  color: var(--text-primary, #1a1a1a);
  padding: 24px clamp(12px, 2.5vw, 40px) 90px;
  overflow-x: clip;
}

.feed-container {
  width: 100%;
  max-width: 1800px;
  min-width: 0;
  margin-inline: auto;
  box-sizing: border-box;
}

.feed-header {
  padding: 8px 2px 14px;
}

.texto-principal {
  color: var(--text-primary, #1a1a1a);
}

.texto-secundario {
  color: var(--text-secondary, #4a4a4a);
}

.texto-acento {
  color: var(--secondary, #556b4f);
  font-weight: 700;
  letter-spacing: 0.14em;
}

.icono-catalogo {
  background: var(--surface, #d9d9d9);
  color: var(--primary, #a83338);
}

.panel-filtros,
.barra-catalogo,
.product-card,
.paginacion-catalogo,
.sin-resultados {
  background: #fff;
  border: 1px solid var(--border-color, #d9d9d9);
  border-radius: 14px;
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}

.feed-layout-row,
.feed-controls-row,
.feed-products-grid,
.feed-pagination-content,
.feed-filters-column,
.feed-catalog-column,
.feed-product-column,
.feed-pagination-pages,
.feed-pagination-options {
  min-width: 0;
  box-sizing: border-box;
}

.feed-filters-column,
.feed-catalog-column {
  max-width: 100%;
}

.panel-filtros {
  overflow: hidden;
  position: sticky;
  top: 16px;
}

.titulo-filtro {
  color: var(--text-primary, #1a1a1a);
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.fila-filtro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 34px;
  min-width: 0;
}

.texto-filtro {
  color: var(--text-secondary, #4a4a4a);
  min-width: 0;
  overflow-wrap: anywhere;
}

.contador-filtro {
  flex-shrink: 0;
  background: rgba(85, 107, 79, 0.12);
  color: var(--secondary, #556b4f);
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.separador-suave {
  background: var(--border-color, #d9d9d9);
}

.boton-limpiar,
.boton-orden,
.boton-carrito {
  border-radius: 9px;
  font-weight: 600;
  box-sizing: border-box;
}

.barra-catalogo {
  box-shadow: 0 3px 12px rgba(47, 58, 68, 0.035);
}

.etiqueta-control {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--text-secondary, #4a4a4a);
  font-size: 0.82rem;
  font-weight: 700;
}

.feed-price-inputs {
  flex-wrap: wrap;
  min-width: 0;
}

.input-precio {
  width: 112px;
  max-width: 100%;
  min-width: 0;
}

.input-precio :deep(.q-field__control),
.selector-paginacion :deep(.q-field__control) {
  border-radius: 9px;
}

.separador-orden {
  height: 48px;
  margin-right: 18px;
  background: var(--border-color, #d9d9d9);
}

/* Tarjetas de productos */

.feed-product-column {
  display: flex;
  align-items: stretch;
  min-width: 0;
  max-width: 100%;
}

.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 14px;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary, #a83338);
  box-shadow: 0 10px 26px rgba(47, 58, 68, 0.1);
}

/* Contenedor de imagen: limita el tamaño sin deformar la foto */

.image-container {
  position: relative;
  flex: 0 0 205px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 205px;
  padding: 12px;
  overflow: hidden;
  background: var(--background, #fafafa);
  box-sizing: border-box;
}

.imagen-producto {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 180px;
  overflow: hidden;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

/* Evita que el contenido interno de QImg exceda su contenedor */

.imagen-producto :deep(.q-img__container),
.imagen-producto :deep(.q-img__content) {
  max-width: 100%;
  overflow: hidden;
}

.imagen-producto :deep(.q-img__image) {
  max-width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain !important;
}

.product-card:hover .imagen-producto {
  transform: scale(1.035);
}

.placeholder-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: 180px;
  overflow: hidden;
  box-sizing: border-box;
  color: #f7f6f2;
  background: var(--background, #f7f6f2);
}

.contador-imagenes {
  display: flex;
  align-items: center;
  max-width: calc(100% - 16px);
  border-radius: 7px;
  margin: 0 8px 8px 0;
  padding: 5px 8px;
  background: rgba(47, 58, 68, 0.85);
  color: #fff;
  font-size: 0.7rem;
}

.estado-producto {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  max-width: calc(100% - 24px);
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: capitalize;
}

.estado-nuevo {
  background: var(--secondary, #556b4f);
  color: #fff;
}

.estado-usado {
  background: var(--dark, #2f3a44);
  color: #fff;
}

/* Contenido flexible: alinea los botones entre tarjetas */

.contenido-producto {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 220px;
  max-width: 100%;
  box-sizing: border-box;
}

.precio-producto {
  color: var(--primary, #a83338);
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.nombre-producto {
  display: -webkit-box;
  min-width: 0;
  max-width: 100%;
  min-height: 2.8em;
  overflow: hidden;
  overflow-wrap: anywhere;
  color: var(--text-primary, #1a1a1a);
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.45;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.especificaciones-producto {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px 10px;
  min-width: 0;
  max-width: 100%;
  color: var(--text-secondary, #4a4a4a);
  font-size: 0.75rem;
}

.especificaciones-producto span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.vendedor-producto {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
  color: var(--text-secondary, #4a4a4a);
  font-size: 0.78rem;
}

.vendedor-producto .ellipsis {
  flex: 1 1 auto;
  min-width: 0;
}

.avatar-vendedor {
  flex-shrink: 0;
  color: var(--secondary, #556b4f);
  background: rgba(85, 107, 79, 0.13);
}

/* Botón consistente en todas las tarjetas */

.boton-carrito {
  display: flex;
  flex: 0 0 auto;
  align-self: stretch;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 42px;
  margin-top: auto;
  padding-inline: 8px;
  overflow: hidden;
  background: var(--primary, #a83338) !important;
  box-shadow: none;
  box-sizing: border-box;
  transition: filter 0.2s ease;
}

.boton-carrito:hover {
  filter: brightness(0.92);
}

.boton-carrito :deep(.q-btn__content) {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 5px;
  min-width: 0;
  max-width: 100%;
  white-space: nowrap;
}

.boton-carrito :deep(.q-icon) {
  flex-shrink: 0;
}

.boton-carrito :deep(.block) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estados vacíos y paginación */

.sin-resultados {
  background: var(--surface, #f7f6f2);
  border-style: dashed;
  border-radius: 16px;
}

.icono-sin-resultados {
  color: var(--secondary, #556b4f);
  background: rgba(85, 107, 79, 0.12);
}

.paginacion-catalogo {
  background: var(--surface, #f7f6f2);
}

.selector-paginacion {
  width: 100px;
  max-width: 100%;
}

.footer-tienda {
  /* Fondo transparente o muy suave para no cortar visualmente */
  background: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: auto; /* Ayuda a empujarlo al final si usas flexbox */
}

.footer-text {
  font-size: 0.75rem; /* Tamaño compacto para móvil */
  line-height: 1.4;
  opacity: 0.8;
}

.footer-separador {
  opacity: 0.4;
}

.loading-catalogo {
  z-index: 10;
}

/* Cabecera del filtro desplegable */

.filtros-expansion :deep(.q-item) {
  min-height: 54px;
  padding: 10px 16px;
}

.filtros-expansion :deep(.q-item__label) {
  font-size: 0.98rem;
  font-weight: 700;
}

.filtros-expansion :deep(.q-expansion-item__content) {
  min-width: 0;
  max-width: 100%;
}

/* Tablets y pantallas medianas */

@media (max-width: 1023px) {
  .panel-filtros {
    position: static;
  }

  .separador-orden {
    display: none;
  }

  .contenido-producto {
    min-height: 210px;
  }

  .feed-filters-column,
  .feed-catalog-column {
    width: 100%;
    max-width: 100%;
  }
}

/* Móviles */

@media (max-width: 599px) {
  .feed-page {
    padding: 12px 10px 80px;
  }

  .feed-header {
    padding: 6px 0 12px;
  }

  .feed-header .text-h4 {
    font-size: 1.55rem;
    line-height: 1.25;
  }

  .icono-catalogo {
    width: 46px;
    height: 46px;
  }

  .panel-filtros,
  .barra-catalogo,
  .product-card,
  .paginacion-catalogo {
    border-radius: 11px;
  }

  .panel-filtros .q-card__section {
    padding-left: 12px;
    padding-right: 12px;
  }

  .barra-catalogo .q-card__section {
    padding: 12px;
  }

  .feed-controls-row {
    row-gap: 16px;
  }

  .feed-price-inputs {
    gap: 8px;
  }

  .input-precio {
    width: min(112px, calc(50vw - 44px));
    min-width: 0;
  }

  .filtros-expansion :deep(.q-item) {
    padding: 10px 12px;
  }

  .feed-products-grid {
    row-gap: 12px;
  }

  .feed-product-column .product-card {
    border-radius: 11px;
  }

  .feed-product-column .image-container {
    flex-basis: 160px;
    height: 160px;
    padding: 8px;
  }

  .feed-product-column .imagen-producto,
  .feed-product-column .placeholder-box {
    height: 144px;
  }

  .feed-product-column .contenido-producto {
    min-height: 0;
    padding: 10px;
  }

  .feed-product-column .precio-producto {
    font-size: 1.15rem;
    line-height: 1.3;
  }

  .feed-product-column .nombre-producto {
    min-height: 2.7em;
    font-size: 0.88rem;
    line-height: 1.35;
  }

  .feed-product-column .especificaciones-producto {
    gap: 6px 8px;
    font-size: 0.7rem;
  }

  .feed-product-column .boton-carrito {
    min-height: 42px;
    padding-inline: 4px;
  }

  .feed-product-column .boton-carrito :deep(.q-btn__content) {
    gap: 3px;
    font-size: clamp(0.62rem, 2.2vw, 0.75rem);
  }

  .feed-product-column .boton-carrito :deep(.q-icon) {
    font-size: 17px;
  }

  .sin-resultados {
    padding: 24px 14px;
  }

  .feed-pagination-content {
    row-gap: 14px;
  }

  .feed-pagination-pages {
    display: flex;
    justify-content: center;
    overflow-x: auto;
    max-width: 100%;
  }

  .feed-pagination-options {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .selector-paginacion {
    width: 90px;
  }

  .footer-tienda {
    padding: 12px 10px;
  }

  .footer-text {
    font-size: 0.65rem;
  }

  .footer-separador {
    padding: 0 2px;
  }
}

/* Móviles muy estrechos */

@media (max-width: 360px) {
  .feed-page {
    padding-left: 6px;
    padding-right: 6px;
  }

  .feed-layout-row,
  .feed-products-grid {
    row-gap: 10px;
  }

  .input-precio {
    width: 88px;
  }

  .feed-product-column .image-container {
    flex-basis: 145px;
    height: 145px;
    padding: 8px;
  }

  .feed-product-column .imagen-producto,
  .feed-product-column .placeholder-box {
    height: 129px;
  }

  .feed-product-column .contenido-producto {
    padding: 8px;
  }

  .feed-product-column .precio-producto {
    font-size: 1.05rem;
  }

  .feed-product-column .nombre-producto {
    font-size: 0.82rem;
  }

  .feed-product-column .boton-carrito {
    padding-inline: 2px;
  }

  .feed-product-column .boton-carrito :deep(.q-btn__content) {
    gap: 2px;
    font-size: 0.61rem;
  }

  .feed-product-column .boton-carrito :deep(.q-icon) {
    font-size: 15px;
  }

  .feed-pagination-options {
    align-items: flex-start;
  }
}


/* Más espacio entre el vendedor y el botón */
.vendedor-producto {
  margin-bottom: 12px;
}

/* Botón más compacto en móviles */
@media (max-width: 599px) {
  .feed-product-column .boton-carrito {
    align-self: center;
    width: 88%;
    max-width: 220px;
    min-height: 38px;
    margin-top: auto;
    padding: 0 8px;
  }

  .feed-product-column .boton-carrito :deep(.q-btn__content) {
    justify-content: center;
    gap: 4px;
    font-size: 0.72rem;
  }

  .feed-product-column .boton-carrito :deep(.q-icon) {
    font-size: 16px;
  }

  .feed-product-column .vendedor-producto {
    margin-bottom: 16px;
  }
}

@media (max-width: 360px) {
  .feed-product-column .boton-carrito {
    width: 94%;
    max-width: 200px;
    min-height: 36px;
    padding-inline: 3px;
  }

  .feed-product-column .boton-carrito :deep(.q-btn__content) {
    font-size: 0.62rem;
    gap: 2px;
  }
}


/* Respeta las preferencias de movimiento del usuario */

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .imagen-producto,
  .boton-carrito {
    transition: none;
  }

  .product-card:hover,
  .product-card:hover .imagen-producto {
    transform: none;
  }
}

</style>

