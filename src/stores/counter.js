
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    items: []
  }),

  getters: {
    // Cantidad total de unidades en el carrito
    counter: (state) =>
      state.items.reduce(
        (total, item) => total + item.quantity,
        0
      ),

    // Cantidad de productos diferentes
    productosDiferentes: (state) => state.items.length,

    // Precio total del carrito
    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.precio * item.quantity,
        0
      ),

    doubleCount() {
      return this.counter * 2
    }
  },

  actions: {
    addToCart(product) {
      // Comprobar si esta publicación ya está en el carrito
      const existe = this.items.some(
        item => String(item.id) === String(product.id)
      )

      // No permitir agregar la misma publicación dos veces
      if (existe) {
        return false
      }

      this.items.push({
        id: product.id,
        titulo: product.titulo,
        marca: product.marca,
        modelo: product.modelo,
        precio: Number(product.precio) || 0,
        ram: product.ram,
        rom: product.rom,
        pantalla: product.pantalla,
        estado: product.estado,
        imagen: product.imagenes?.[0] || null,
        quantity: 1
      })

      return true
    },

    removeFromCart(productId) {
      this.items = this.items.filter(
        item => item.id !== productId
      )
    },

    clearCart() {
      this.items = []
    }
  }
})
