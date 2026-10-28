
import { defineStore } from 'pinia'

export const useDeviceDataStore = defineStore('deviceData', {
  state: () => ({
    selectedDevice: null
  }),

  getters: {
    hayDispositivoSeleccionado: (state) =>
      state.selectedDevice !== null
  },

  actions: {
    seleccionarDispositivo(producto) {
      if (!producto) return

      const fotos = Array.isArray(producto.imagenes)
        ? producto.imagenes
        : Array.isArray(producto.fotos)
          ? producto.fotos
          : producto.imagen
            ? [producto.imagen]
            : producto.foto
              ? [producto.foto]
              : []

      this.selectedDevice = {
        ...producto,
        id: producto.id,
        titulo: producto.titulo || producto.nombre || producto.modelo || 'Anuncio sin título',
        precio: Number(producto.precio) || 0,
        vendedor: producto.vendedor || 'Vendedor no especificado',
        telefono: producto.telefono || producto.numero || '',
        estado: producto.estado || 'No especificado',
        marca: producto.marca || 'No especificada',
        modelo: producto.modelo || 'No especificado',
        pantalla: producto.pantalla || 'No especificada',
        sistema: producto.sistema || 'No especificado',
        ram: producto.ram || 'No especificada',
        rom: producto.rom || 'No especificada',
        descripcion: producto.descripcion || 'Sin descripción disponible',
        fotos
      }
    },

    limpiarDispositivo() {
      this.selectedDevice = null
    }
  }
})
