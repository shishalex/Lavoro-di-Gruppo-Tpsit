const { createApp, ref, reactive, computed, defineComponent } = Vue

// rappresenta un prodotto del menù
class Product {
  constructor(id, name, price, image) {
    this.id = id
    this.name = name
    this.price = price
    this.image = image
  }
}

// gestisce logica del carrello
const CartController = {
  addToCart(store, product) {
    store.items.push(product)
  },
  clearCart(store) {
    // svuotamento 
    store.items.splice(0, store.items.length)
  },
  getTotal(store) {
    return store.items.reduce((sum, p) => sum + p.price, 0)
  }
}

// singolo piatto del menu
const MenuItem = defineComponent({
  name: 'MenuItem',
  props: ['product'],
  emits: ['add'],
  template: `
    <div class="menu-item">
      <img :src="encodeURI(product.image.replace(/^\\//, ''))" :alt="product.name" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }} €</p>
      <button @click="$emit('add', product)">Aggiungi</button>
    </div>
  `
})

// vista del carrello
const CartView = defineComponent({
  name: 'CartView',
  props: ['cart', 'total'],
  emits: ['clear', 'purchase'],
  template: `
    <div class="cart">
      <h2>🛒 Carrello</h2>

      <div v-if="cart.length > 0">
        <ul>
          <li v-for="(item, index) in cart" :key="index" class="cart-item">
            <img :src="encodeURI(item.image.replace(/^\\//, ''))" :alt="item.name" />
            <span>{{ item.name }} - {{ item.price }} €</span>
          </li>
        </ul>
        <h3>Totale: {{ total }} €</h3>
        <button @click="$emit('clear')">Svuota carrello</button>
        <button @click="$emit('purchase')" style="margin-left:8px;background:#27ae60">Acquista</button>
      </div>

      <p v-else>Nessun prodotto nel carrello.</p>
    </div>
  `
})

// APP PRINCIPALE
createApp({
  components: { MenuItem, CartView },

  setup() {
    // LOGIN DATI
    const username = ref('')
    const age = ref(null)
    const isLoggedIn = ref(false)
    const accessGranted = ref(false)
    const error = ref('')

    // STORE
    const cartStore = reactive({
      items: []
    })

    // LISTA PRODOTTI
    const products = [
      new Product(1, 'Bucket Tenders + HotWings', 18, '/immagini/buchet_tender.png'),
      new Product(2, 'Bucket Vegano', 13, '/immagini/buchet vegano.png'),
      new Product(3, '9 Nuggets + Salsa', 6, '/immagini/9 nuggets_salsa.png'),
      new Product(4, 'Box HotDog Spicy', 9, '/immagini/box hot dog spicy.png'),
      new Product(5, 'Box HotDog Cheesy', 9, '/immagini/box meal hot dog cheesy.png'),
      new Product(7, 'Box Cheese and Becon Burger', 12.95, '/immagini/box meal cheese e bacon.png'),
      new Product(8, 'Classic Chicken Burger', 4.90, '/immagini/classic.png'),
      new Product(9, 'Vegan Burger', 4.90, '/immagini/classico vegetariano.png'),
      new Product(10, 'Cheesy Doritos Fries', 3.87, '/immagini/doritos fries cheesy.png'),
      new Product(11, 'Spicy Doritos Fries', 3.87, '/immagini/doritos fries spicy.png'),
      new Product(12, 'Double Chicken BBQ and Becon', 5.98, '/immagini/double BBQ.png'),
      new Product(13, 'HotDog Spicy', 13, '/immagini/hot hod dog spicy.png'),
      new Product(14, 'Menù Famiglia Normale', 25, '/immagini/menu famiglia 2 menu large e 1 junior.png'),
      new Product(15, 'Menù Famiglia Grande', 28.45, '/immagini/menu famiglia 2 menu large e 2 junior.png'),
      new Product(16, 'Wrap di Pollo', 8.12, '/immagini/wrap colonel.png'),
      new Product(17, 'Wrap Vegano', 8.12, '/immagini/wrap vegano.png'),
      new Product(18, 'Acqua', 1.20, '/immagini/acqua.png'),
      new Product(19, 'Birra Peroni', 3.40, '/immagini/birra Peroni.png'),
      new Product(20, 'Actimel', 0.80, '/immagini/actimel.png'),
      new Product(21, 'Caffè Espresso', 1.20, '/immagini/caffè espresso.png'),
      new Product(22, 'Mus di frutta', 2.30, '/immagini/mus di frutta.png'),
      new Product(23, 'Pepsi', 2.20, '/immagini/pepsi.png'),
      new Product(24, 'Redbull', 2, '/immagini/redbull.png'),
      new Product(25, 'Sundae classico', 4.80, '/immagini/sundea classico.png'),
      new Product(26, 'Sundae Nutella', 4.80, '/immagini/sundae nutella.png'),
      new Product(27, 'Sundae Galak Pistacchio', 5.80, '/immagini/sundae galak pistacchio.png'),
      new Product(28, 'Sundae Caramello ', 4.80, '/immagini/sndae caramello.png'),
      new Product(29, 'Pane e Nutella', 3.50, '/immagini/pane e nutella.png')

    ]

    // totale aggiornato
    const total = computed(() => CartController.getTotal(cartStore))

    // LOGIN
    function login() {
      if (username.value.trim() === '') {
        error.value = 'Inserisci il nome utente.'
        return
      }
      if (!age.value || age.value < 18) {
        error.value = 'Accesso negato: devi essere maggiorenne.'
        return
      }

      isLoggedIn.value = true
      accessGranted.value = true
      error.value = ''
    }

    // Aggiunge al carrello
    function addToCart(product) {
      CartController.addToCart(cartStore, product)
    }

    // Svuota carrello
    function clearCart() {
      CartController.clearCart(cartStore)
    }

    // Acquisto: mostra alert con totale, poi svuota carrello e torna alla pagina iniziale
    function purchase() {
      const paid = total.value.toFixed(2)
      alert(`Acquisto effettuato✅ . Totale pagato: ${paid} €`)
      clearCart()
      // reset login / ritorna alla schermata iniziale
      username.value = ''
      age.value = null
      isLoggedIn.value = false
      accessGranted.value = false
      error.value = ''
    }

    return {
      username, age, isLoggedIn, accessGranted, error,
      products,
      cart: cartStore.items,
      total,
      login,
      addToCart,
      clearCart,
      purchase
    }
  }
}).mount('#app')



