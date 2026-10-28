
<template>
  <q-page class="pagina-publicacion q-pa-xs-sm q-pa-sm-md q-pa-md-lg">
    <div class="contenedor-publicacion">

      <!-- ENCABEZADO -->
      <div class="encabezado-publicacion q-mb-sm q-mb-md-lg">
        <div class="row items-center no-wrap q-gutter-sm q-gutter-sm-md">
          <q-avatar
            :size="$q.screen.xs ? '46px' : '58px'"
            color="primary"
            text-color="white"
            rounded
            class="sombra-icono"
          >
            <q-icon name="add_business" :size="$q.screen.xs ? '24px' : '30px'" />
          </q-avatar>

          <div class="col">
            <div :class="$q.screen.xs ? 'text-h6 text-weight-bold text-grey-9' : 'text-h5 text-weight-bold text-grey-9'">
              Publicar dispositivo
            </div>
            <div class="text-caption text-sm-body2 text-grey-7">
              Completa los detalles y publica tu teléfono en la tienda.
            </div>
          </div>
        </div>
      </div>

      <q-form
        @submit.prevent="guardarProducto"
        @reset="limpiarFormulario"
      >
        <q-card flat bordered class="tarjeta-formulario">

          <!-- SECCIÓN 1: ESTADO -->
          <q-card-section class="q-pa-md q-pa-md-lg">
            <div class="row items-center q-gutter-sm q-mb-md">
              <q-icon name="verified" color="primary" size="24px" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-grey-9">
                  Estado del dispositivo
                </div>
                <div class="text-caption text-grey-6">
                  Indica si el equipo es nuevo o usado.
                </div>
              </div>
            </div>

            <!-- Propiedad `spread` para ajustar al 100% en pantallas móviles -->
            <q-btn-toggle
              v-model="producto.estado"
              no-caps
              rounded
              unelevated
              spread
              toggle-color="primary"
              color="grey-2"
              text-color="grey-8"
              :options="[
                { label: 'Nuevo', value: 'nuevo', icon: 'new_releases' },
                { label: 'Usado', value: 'usado', icon: 'smartphone' }
              ]"
              class="selector-estado full-width"
            />
          </q-card-section>

          <q-separator color="grey-3" />

          <!-- SECCIÓN 2: INFORMACIÓN TÉCNICA -->
          <q-card-section class="q-pa-md q-pa-md-lg">
            <div class="titulo-seccion q-mb-md q-mb-md-lg">
              <q-avatar
                color="primary"
                text-color="white"
                :size="$q.screen.xs ? '36px' : '42px'"
                rounded
              >
                <q-icon name="phone_iphone" :size="$q.screen.xs ? '20px' : '23px'" />
              </q-avatar>

              <div>
                <div class="text-subtitle1 text-weight-bold text-grey-9">
                  Información del dispositivo
                </div>
                <div class="text-caption text-grey-6">
                  Marca, modelo y especificaciones técnicas.
                </div>
              </div>
            </div>

            <!-- Grid adaptable a tablet (sm) y desktop (md) -->
            <div class="row q-col-gutter-sm q-col-gutter-md-md">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="producto.marca"
                  label="Marca"
                  placeholder="Ej. Samsung"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'La marca es requerida']"
                >
                  <template v-slot:prepend>
                    <q-icon name="branding_watermark" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="producto.modelo"
                  label="Modelo"
                  placeholder="Ej. Galaxy S24"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'El modelo es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model.number="producto.pantalla"
                  type="number"
                  step="0.1"
                  label="Tamaño de pantalla"
                  placeholder="6.5"
                  outlined
                  bg-color="white"
                  suffix='"'
                  class="campo-formulario"
                  :rules="[val => val > 0 || 'Ingrese un tamaño válido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="aspect_ratio" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <q-select
                  v-model="producto.sistema"
                  :options="opcionesSistema"
                  label="Sistema operativo"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'Seleccione el sistema']"
                >
                  <template v-slot:prepend>
                    <q-icon name="settings_suggest" color="grey-6" />
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="producto.ram"
                  label="Memoria RAM"
                  placeholder="Ej. 8GB"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'Ingrese la memoria RAM']"
                >
                  <template v-slot:prepend>
                    <q-icon name="memory" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="producto.rom"
                  label="Almacenamiento"
                  placeholder="Ej. 128GB"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'Ingrese el almacenamiento']"
                >
                  <template v-slot:prepend>
                    <q-icon name="storage" color="grey-6" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-3" />

          <!-- SECCIÓN 3: PUBLICACIÓN -->
          <q-card-section class="q-pa-md q-pa-md-lg">
            <div class="titulo-seccion q-mb-md q-mb-md-lg">
              <q-avatar
                color="primary"
                text-color="white"
                :size="$q.screen.xs ? '36px' : '42px'"
                rounded
              >
                <q-icon name="sell" :size="$q.screen.xs ? '20px' : '23px'" />
              </q-avatar>

              <div>
                <div class="text-subtitle1 text-weight-bold text-grey-9">
                  Detalles de la publicación
                </div>
                <div class="text-caption text-grey-6">
                  Presenta tu producto y establece su precio.
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-sm q-col-gutter-md-md">
              <div class="col-12 col-md-8">
                <q-input
                  v-model="producto.titulo"
                  label="Título del anuncio"
                  placeholder="Ej. Samsung Galaxy en excelente estado"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'El título es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="producto.precio"
                  type="number"
                  step="1"
                  label="Precio de venta"
                  placeholder="0.00"
                  outlined
                  bg-color="white"
                  prefix="$"
                  class="campo-formulario"
                  :rules="[val => val > 0 || 'Ingrese un precio válido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="payments" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="producto.vendedor"
                  label="Nombre del vendedor"
                  placeholder="Tu nombre"
                  outlined
                  bg-color="white"
                  class="campo-formulario"
                  :rules="[val => !!val || 'El nombre es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person_outline" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="producto.telefono"
                  label="Número telefónico"
                  placeholder="1234-5678"
                  outlined
                  bg-color="white"
                  mask="####-####"
                  unmasked-value
                  class="campo-formulario"
                  :rules="[val => !!val || 'El teléfono es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="producto.descripcion"
                  type="textarea"
                  label="Descripción del producto"
                  placeholder="Describe el estado, características y detalles importantes..."
                  outlined
                  bg-color="white"
                  :rows="$q.screen.xs ? 3 : 4"
                  class="campo-formulario"
                  :rules="[val => !!val || 'Agregue una descripción']"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="grey-6" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-3" />

          <!-- SECCIÓN 4: IMÁGENES -->
          <q-card-section class="q-pa-md q-pa-md-lg">
            <div class="titulo-seccion q-mb-md">
              <q-avatar
                color="primary"
                text-color="white"
                :size="$q.screen.xs ? '36px' : '42px'"
                rounded
              >
                <q-icon name="photo_library" :size="$q.screen.xs ? '20px' : '23px'" />
              </q-avatar>

              <div>
                <div class="text-subtitle1 text-weight-bold text-grey-9">
                  Fotografías del producto
                </div>
                <div class="text-caption text-grey-6">
                  Añade hasta 5 imágenes para mostrar tu dispositivo.
                </div>
              </div>
            </div>

            <div class="zona-imagenes q-pa-sm q-pa-md-md">
              <q-file
                v-model="archivosImagenes"
                label="Seleccionar imágenes"
                outlined
                multiple
                append
                use-chips
                accept="image/*"
                :max-files="5"
                @rejected="alExcederLimiteArchivos"
                :rules="[
                  val => !val || val.length <= 5 || 'No puede subir más de 5 imágenes'
                ]"
                class="campo-formulario"
              >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" color="primary" size="24px" />
                </template>
              </q-file>

              <div class="row items-center q-gutter-xs q-mt-xs text-caption text-grey-6">
                <q-icon name="info_outline" size="16px" />
                <span>Usa imágenes claras del equipo.</span>
              </div>
            </div>
          </q-card-section>

          <!-- ACCIONES RESPONSIVAS -->
          <q-separator color="grey-3" />

          <q-card-actions
            :align="$q.screen.xs ? 'center' : 'right'"
            class="q-pa-md q-pa-md-lg acciones-formulario"
            :class="{ 'column q-gutter-y-sm': $q.screen.xs }"
          >
            <!-- En móvil el botón principal aparece arriba en ancho completo -->
            <q-btn
              label="Guardar producto"
              type="submit"
              color="primary"
              icon="check_circle"
              unelevated
              no-caps
              :loading="cargando"
              :disable="cargando"
              class="boton-accion boton-guardar"
              :class="{ 'full-width order-first': $q.screen.xs }"
            />

            <q-btn
              label="Cancelar"
              type="reset"
              color="grey-7"
              flat
              no-caps
              icon="close"
              to="/"
              :disable="cargando"
              class="boton-accion"
              :class="{ 'full-width q-ml-none': $q.screen.xs }"
            />
          </q-card-actions>
        </q-card>
      </q-form>

      <div class="text-center text-caption text-grey-6 q-mt-md q-mb-lg">
        <q-icon name="shield_outlined" size="14px" class="q-mr-xs" />
        Verifica los datos antes de publicar tu dispositivo.
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.pagina-publicacion {
  min-height: 100%;
  background: #f4f5f7;
}

.contenedor-publicacion {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.encabezado-publicacion {
  padding: 4px 2px 8px;
}

.sombra-icono {
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.12);
}

.tarjeta-formulario {
  overflow: hidden;
  border-radius: 16px;
  border-color: #e5e7eb;
  background: #fff;
  box-shadow: 0 8px 28px rgba(30, 41, 59, 0.045);
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 12px;
}

.campo-formulario :deep(.q-field__control) {
  border-radius: 10px;
}

.campo-formulario :deep(.q-field__label) {
  font-weight: 500;
}

.campo-formulario :deep(.q-field--outlined .q-field__control:before) {
  border-color: #dfe3e8;
}

.campo-formulario :deep(.q-field--outlined:hover .q-field__control:before) {
  border-color: #aeb7c2;
}

.selector-estado {
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  overflow: hidden;
}

.zona-imagenes {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
}

.acciones-formulario {
  background: #fcfcfd;
}

.boton-accion {
  min-height: 44px;
  border-radius: 9px;
  padding-left: 18px;
  padding-right: 18px;
  font-weight: 600;
}

.boton-guardar {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.18);
}

@media (max-width: 599px) {
  .tarjeta-formulario {
    border-radius: 12px;
  }

  .titulo-seccion {
    align-items: flex-start;
  }
}
</style>


<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Importación de Firebase y Axios
import { db } from '@/boot/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { api } from '@/boot/axios' // Instancia de axios configurada

const $q = useQuasar()
const router = useRouter()

const cargando = ref(false)
const archivosImagenes = ref([]) // Guarda los archivos de imágenes seleccionados

// Opciones de Sistemas Operativos
const opcionesSistema = ['Android', 'iOS', 'HarmonyOS', 'Otro']

// Formulario reactivo
const producto = reactive({
  estado: 'usado',
  marca: '',
  modelo: '',
  pantalla: null,
  sistema: '',
  ram: '',
  rom: '',
  titulo: '',
  precio: null,
  vendedor: '',
  telefono: '',
  descripcion: ''
})

// Notificación al intentar subir más de 5 imágenes
function alExcederLimiteArchivos() {
  $q.notify({
    type: 'warning',
    message: 'Solo puede seleccionar un máximo de 5 imágenes.',
    position: 'top-right'
  })
}

// Limpiar el formulario
function limpiarFormulario() {
  producto.estado = 'usado'
  producto.marca = ''
  producto.modelo = ''
  producto.pantalla = null
  producto.sistema = ''
  producto.ram = ''
  producto.rom = ''
  producto.titulo = ''
  producto.precio = null
  producto.vendedor = ''
  producto.telefono = ''
  producto.descripcion = ''
  archivosImagenes.value = []
}

// Subir imágenes a CouchDB basándose en el id del documento recién creado
async function subirImagenesCouchDB(idDocumento) {
  if (!archivosImagenes.value || archivosImagenes.value.length === 0) return

  const coleccionCouchdb = '/imagenesfpi/'
  let rev = null

  for (let i = 0; i < archivosImagenes.value.length; i++) {
    const file = archivosImagenes.value[i]

    // Obtener la extensión original del archivo o fallback a jpg
    const extension = file.name.split('.').pop() || 'jpg'
    const attname = `archivo${i}.${extension}`

    // Si rev tiene valor (de la 2da imagen en adelante), agregamos ?rev=${rev} a la URL[cite: 2]
    const endpoint = rev
      ? `${coleccionCouchdb}${idDocumento}/${attname}?rev=${rev}`
      : `${coleccionCouchdb}${idDocumento}/${attname}`

    console.log(`Subiendo imagen ${i + 1}: ${endpoint}`)

    const response = await api.put(endpoint, file, {
      headers: {
        'Content-Type': file.type || 'image/jpeg'
      }
    })

    // Actualizamos el rev con la respuesta para la siguiente iteración[cite: 2]
    if (response.data && response.data.rev) {
      rev = response.data.rev
    }
  }
}

// Guardar producto en Firestore y posteriormente sus imágenes en CouchDB
async function guardarProducto() {
  cargando.value = true

  try {
    const nuevoProducto = {
      Sistema: String(producto.sistema),
      descripcion: String(producto.descripcion),
      estado: String(producto.estado),
      marca: String(producto.marca),
      modelo: String(producto.modelo),
      pantalla: Number(producto.pantalla),
      precio: parseInt(producto.precio, 10),
      ram: String(producto.ram),
      rom: String(producto.rom),
      telefono: String(producto.telefono),
      titulo: String(producto.titulo),
      vendedor: String(producto.vendedor)
    }

    // 1. Guardar documento en Firestore y obtener su ID de referencia
    const docRef = await addDoc(collection(db, 'product'), nuevoProducto)
    const idDocumento = docRef.id

    // 2. Subir imágenes asociadas a CouchDB usando el ID generado
    if (archivosImagenes.value && archivosImagenes.value.length > 0) {
      await subirImagenesCouchDB(idDocumento)
    }

    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: `Producto "${nuevoProducto.titulo}" e imágenes guardadas exitosamente.`,
      position: 'top-right',
      timeout: 2500
    })

    limpiarFormulario()
    router.push('/')

  } catch (error) {
    console.error('Error al procesar el guardado:', error)
    $q.notify({
      type: 'negative',
      message: 'Ocurrió un error al guardar el producto o las imágenes.',
      position: 'top-right'
    })
  } finally {
    cargando.value = false
  }
}
</script>
