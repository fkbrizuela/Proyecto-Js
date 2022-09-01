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
        cartTotal.innerText = tempTotal
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
                                <i class="fas fa-chevron-down" data-id=${item.id}></i>
                            </div>`
        cartContainer.appendChild(div)
        console.log(div);
    }//diferenciar cada item por id
    showCart(){
        cartModal.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }//metodo mostrar carrito
    setupAPP(){
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populateCart(cart)
        cartBtn.addEventListener('click',this.showCart)
        closeCartBtn.addEventListener('click',this.hideCart)
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        cartModal.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }
    cartLogic(){
        //limpiar carrito
        clearCartBtn.addEventListener('click', () => this.clearCart());
        //funcionalidad del Carrito
        cartContainer.addEventListener('click', event =>{
            console.log(event.target);
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target
                let id = removeItem.dataset.id
                cartContainer.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id)
            }
            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target
                let id = addAmount.dataset.id
                let tempItem = cart.find(item => item.id === id)
                tempItem.amount = tempItem.amount + 1
                Storage.saveCart(cart)
                this.setCartValues(cart)
                addAmount.nextElementSibling.innerText = tempItem.amount
            }
            else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target
                console.log(lowerAmount);
                let id = lowerAmount.dataset.id
                console.log(id);
                let tempItem = cart.find(item => item.id === id)
                console.log(tempItem);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount
                }else{
                    cartContainer.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeItem(id)
                }
            }
        })
    }
    clearCart(){
        let cartItems = cart.map(item => item.id)
        console.log(cartItems)//mapeo los id de los productos cargados en el carrito
        cartItems.forEach(id => this.removeItem(id))
        console.log(cartContainer.children);
        while(cartContainer.children.length>0){
            cartContainer.removeChild(cartContainer.children[0])
        }
        this.hideCart()
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
        let button = this.getSingleButton(id)
        button.disabled = false
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>añadir al carrito`
    }
    getSingleButton(id){
        return buttonsDOM.find(button=> button.dataset.id === id)
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
    static getCart(){
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
    }
}
//Evento carga del DOM
document.addEventListener('DOMContentLoaded',()=>{
    const ui = new UI()
    const products = new Products()
    ui.setupAPP()
    // traer todos los productos metodo getProducts
    products.getProducts().then(products=> {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(()=> {
        ui.getCartButtons()
        ui.cartLogic()
    })//Mostrar productos y automaticamente cargarlos el localStorage
})//del objeto productos, aplico metodo conseguir productos, capturo la respuesta y con el objeto UI aplico su metodo mostrar productos para renderizar el DOM