//Elementos
const cartBtn = document.querySelector('.cart-btn-nav')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartModal = document.querySelector('.cart-modal')
const cartItems = document.querySelector('.cart-items')
const cartContainer= document.querySelector('.cart-container')
const cartTotal = document.querySelector('.cart-total')
const productsDOM = document.querySelector('.products-center')
/* const btns = document.querySelector('.cart-btn') *///al mostrar los botones despues de renderizar el DOM y con hover la captura de los mismos lo hacemos despues de renderizar el DOM 
/* console.log(btns); */

// carrito 
let cart = []
// Botones de productos
let buttonsDOM = []

// get products
class Products{
    async getProducts(){
        try {
            let result = await fetch('db.json')
            let data = await result.json()
            let products = data.items
            products = products.map(item => {
                const {title,price,id,image} = item
                return {title,price,id,image}
            })
            return products
        }
        catch (error){
            console.log(error)
        }
    }
}
//Mostrar productos
class UI {
    displayProducts(products) {
        let result = ''
        products.forEach(product =>{
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" srcset="" class="product-img">
                    <button class="cart-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        añadir al carrito
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>Precio: $${product.price}</h4>
            </article>
            <!-- end of single product -->
            `
        })
        productsDOM.innerHTML = result
    }
    getCartButtons(){
        const buttons = [...document.querySelectorAll('.cart-btn')]
        console.log(buttons);
        buttonsDOM = buttons
        buttons.forEach(button =>{
            let id = button.dataset.id
            console.log(id);
            let inCart = cart.find(item => item.id === id)
            if(inCart){
                button.innerText = "Añadido"
                button.disabled = true
            }
            button.addEventListener("click",()=>{
                console.log(event);
                event.target.innerHTML = "Añadido"
                event.target.disabled = true
                /* traer un producto de array productos */
                let cartItem = {...Storage.getProducts(id), amount: 1}//le agrego la propiedad cantidad
                console.log(cartItem);
                /* agregar el producto al carrito */
                cart = [...cart,cartItem]
                console.log(cart);
                /* guardar producto seleccionado en localStorage */
                Storage.saveCart(cart)
                /* valores del carrito */
                this.setCartValues(cart)
                /* display productos del carrito  */
                this.addCartItem(cartItem)
                /* display carrito */
                this.showCart()
            })
        })
    }
    setCartValues(cart){
        let tempTotal = 0
        let itemsTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal
        console.log(cartTotal, cartItems);
    }
    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `<img src=${item.image} srcset="">
                            <div>
                                <h4>${item.title}</h4>
                                <h5>$${item.price}</h5>
                                <span class="remove-item" data-id=${item.id}>quitar</span>
                            </div>
                            <div>
                                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                                <p class="item-amount">${item.amount}</p>
                                <i class="fas fa-chevron-down data-id=${item.id}"></i>
                            </div>`
        cartContainer.appendChild(div)
        console.log(div);
    }//diferenciar cada item por id
    showCart(){
        cartModal.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }
}
//localStorage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProducts(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id)
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart))
    }
}
//Evento carga del DOM
document.addEventListener('DOMContentLoaded',()=>{
    const ui = new UI()
    const products = new Products()
    
    // traer todos los productos metodo getProducts
    products.getProducts().then(products=> {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(()=> {
        ui.getCartButtons()
    })//Mostrar productos y automaticamente cargarlos el localStorage
})//del objeto productos, aplico metodo conseguir productos, capturo la respuesta y con el objeto UI aplico su metodo mostrar productos para renderizar el DOM