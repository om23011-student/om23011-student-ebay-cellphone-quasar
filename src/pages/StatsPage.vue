<template>
  <q-page class="bg-grey-1 q-pa-xs-sm q-pa-sm-md q-py-md-lg">
    <div class="max-width-container">

      <!-- ENCABEZADO DE LA PÁGINA -->
      <div class="row items-center justify-between q-mb-sm q-mb-md-md">
        <div class="col-8 col-sm-auto">
          <div :class="$q.screen.xs ? 'text-subtitle1 text-bold text-dark flex items-center' : 'text-h5 text-bold text-dark flex items-center'">
            <q-icon name="bar_chart" class="q-mr-xs q-mr-sm-sm" color="primary" :size="$q.screen.xs ? '22px' : '28px'" />
            Estadísticas y Métricas
          </div>
          <div class="text-caption text-grey-7">
            Resumen de rendimiento y ventas de la plataforma.
          </div>
        </div>

        <q-btn
          outline
          color="primary"
          icon="refresh"
          :label="$q.screen.xs ? '' : 'Actualizar'"
          :round="$q.screen.xs"
          dense
          no-caps
          class="q-px-xs-xs q-px-sm-sm"
          @click="recargarMetricas"
        >
          <q-tooltip>Actualizar métricas</q-tooltip>
        </q-btn>
      </div>

      <!-- TARJETAS RESUMEN (KPIs) - Distribución 2x2 en móviles -->
      <div class="row q-col-gutter-xs-sm q-col-gutter-sm-md q-mb-sm q-mb-md-lg">
        <div class="col-6 col-sm-6 col-md-3">
          <q-card flat bordered class="bg-white q-pa-xs-sm q-pa-sm-sm text-center card-kpi">
            <div class="text-caption text-grey-7 ellipsis">Ventas Totales</div>
            <div :class="$q.screen.xs ? 'text-subtitle1 text-bold text-positive' : 'text-h5 text-bold text-positive'">
              $45,280.00
            </div>
            <div class="text-caption text-positive flex flex-center items-center">
              <q-icon name="arrow_upward" size="14px" /> +12% mes
            </div>
          </q-card>
        </div>

        <div class="col-6 col-sm-6 col-md-3">
          <q-card flat bordered class="bg-white q-pa-xs-sm q-pa-sm-sm text-center card-kpi">
            <div class="text-caption text-grey-7 ellipsis">Anuncios Activos</div>
            <div :class="$q.screen.xs ? 'text-subtitle1 text-bold text-primary' : 'text-h5 text-bold text-primary'">
              128
            </div>
            <div class="text-caption text-grey-6 ellipsis">8 marcas</div>
          </q-card>
        </div>

        <div class="col-6 col-sm-6 col-md-3">
          <q-card flat bordered class="bg-white q-pa-xs-sm q-pa-sm-sm text-center card-kpi">
            <div class="text-caption text-grey-7 ellipsis">Equipos Vendidos</div>
            <div :class="$q.screen.xs ? 'text-subtitle1 text-bold text-accent' : 'text-h5 text-bold text-accent'">
              342
            </div>
            <div class="text-caption text-positive flex flex-center items-center">
              <q-icon name="arrow_upward" size="14px" /> +5% vs mes ant.
            </div>
          </q-card>
        </div>

        <div class="col-6 col-sm-6 col-md-3">
          <q-card flat bordered class="bg-white q-pa-xs-sm q-pa-sm-sm text-center card-kpi">
            <div class="text-caption text-grey-7 ellipsis">Precio Promedio</div>
            <div :class="$q.screen.xs ? 'text-subtitle1 text-bold text-dark' : 'text-h5 text-bold text-dark'">
              $315.00
            </div>
            <div class="text-caption text-grey-6 ellipsis">Por equipo</div>
          </q-card>
        </div>
      </div>

      <!-- GRID DE GRÁFICOS -->
      <div class="row q-col-gutter-sm q-col-gutter-md-md">

        <!-- 1. BARRAS HORIZONTALES -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="bg-white q-pa-sm q-pa-md-md">
            <div class="text-subtitle2 text-sm-subtitle1 text-bold q-mb-sm text-dark flex items-center">
              <q-icon name="align_horizontal_left" class="q-mr-xs" color="primary" size="20px" />
              Top Marcas Más Buscadas
            </div>
            <div class="chart-container">
              <canvas ref="barrasHorizontalesCanvas"></canvas>
            </div>
          </q-card>
        </div>

        <!-- 2. BARRAS VERTICALES -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="bg-white q-pa-sm q-pa-md-md">
            <div class="text-subtitle2 text-sm-subtitle1 text-bold q-mb-sm text-dark flex items-center">
              <q-icon name="bar_chart" class="q-mr-xs" color="secondary" size="20px" />
              Ventas Mensuales (Unidades)
            </div>
            <div class="chart-container">
              <canvas ref="barrasVerticalesCanvas"></canvas>
            </div>
          </q-card>
        </div>

        <!-- 3. GRÁFICO DE LÍNEAS -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="bg-white q-pa-sm q-pa-md-md">
            <div class="text-subtitle2 text-sm-subtitle1 text-bold q-mb-sm text-dark flex items-center">
              <q-icon name="show_chart" class="q-mr-xs" color="accent" size="20px" />
              Comparativa: Visitas vs Contactos
            </div>
            <div class="chart-container">
              <canvas ref="lineasCanvas"></canvas>
            </div>
          </q-card>
        </div>

        <!-- 4. GRÁFICO CIRCULAR / PASTEL -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="bg-white q-pa-sm q-pa-md-md">
            <div class="text-subtitle2 text-sm-subtitle1 text-bold q-mb-sm text-dark flex items-center">
              <q-icon name="pie_chart" class="q-mr-xs" color="warning" size="20px" />
              Distribución por Estado del Equipo
            </div>
            <div class="chart-container flex flex-center">
              <canvas ref="pastelCanvas" class="pastel-canvas"></canvas>
            </div>
          </q-card>
        </div>

      </div>

    </div>
  </q-page>
</template>

<style scoped>
.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}

.card-kpi {
  border-radius: 10px;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chart-container {
  position: relative;
  height: 210px;
  width: 100%;
}

.pastel-canvas {
  max-height: 200px;
}

@media (min-width: 600px) {
  .chart-container {
    height: 260px;
  }

  .pastel-canvas {
    max-height: 250px;
  }

  .card-kpi {
    min-height: 100px;
  }
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'

// Importación directa de Chart.js
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const $q = useQuasar()

// Mapeo de la paleta CSS para usar dinámicamente en Chart.js
const PALETA = {
  primary: '#a83338',
  secondary: '#556b4f',
  accent: '#3b5b82',
  dark: '#2f3a44',
  positive: '#2e7d32',
  negative: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b'
}

// Referencias a los canvas HTML
const barrasHorizontalesCanvas = ref(null)
const barrasVerticalesCanvas = ref(null)
const lineasCanvas = ref(null)
const pastelCanvas = ref(null)

// Instancias de los gráficos
let chartHoriz = null
let chartVert = null
let chartLineas = null
let chartPastel = null

function crearGraficos() {
  if (chartHoriz) chartHoriz.destroy()
  if (chartVert) chartVert.destroy()
  if (chartLineas) chartLineas.destroy()
  if (chartPastel) chartPastel.destroy()

  // 1. Barras Horizontales ($primary)
  chartHoriz = new Chart(barrasHorizontalesCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'Huawei'],
      datasets: [{
        label: 'Consultas',
        data: [1420, 1280, 850, 620, 390],
        backgroundColor: PALETA.primary
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })

  // 2. Barras Verticales ($secondary vs $accent)
  chartVert = new Chart(barrasVerticalesCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Nuevos',
          data: [28, 35, 42, 30, 55, 60],
          backgroundColor: PALETA.secondary
        },
        {
          label: 'Usados',
          data: [45, 50, 62, 48, 70, 82],
          backgroundColor: PALETA.accent
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  // 3. Gráfico de Líneas ($accent y $warning)
  chartLineas = new Chart(lineasCanvas.value, {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Visitas a Anuncios',
          data: [1200, 1900, 3100, 2800, 4200, 4800],
          borderColor: PALETA.accent,
          backgroundColor: 'rgba(59, 91, 130, 0.15)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Mensajes / Compras',
          data: [300, 480, 750, 620, 950, 1100],
          borderColor: PALETA.warning,
          backgroundColor: 'transparent',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  // 4. Gráfico Pastel ($positive, $warning, $accent, $secondary)
  chartPastel = new Chart(pastelCanvas.value, {
    type: 'pie',
    data: {
      labels: ['Usado (Como nuevo)', 'Usado (Buen estado)', 'Nuevo (Caja cerrada)', 'Reacondicionado'],
      datasets: [{
        data: [48, 27, 18, 7],
        backgroundColor: [
          PALETA.positive,
          PALETA.warning,
          PALETA.accent,
          PALETA.secondary
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

function recargarMetricas() {
  crearGraficos()
  $q.notify({
    type: 'info',
    message: 'Métricas e indicadores actualizados',
    position: 'top-right',
    timeout: 1000
  })
}

onMounted(() => {
  crearGraficos()
})

onBeforeUnmount(() => {
  if (chartHoriz) chartHoriz.destroy()
  if (chartVert) chartVert.destroy()
  if (chartLineas) chartLineas.destroy()
  if (chartPastel) chartPastel.destroy()
})
</script>


