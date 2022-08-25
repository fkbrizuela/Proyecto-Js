//Elementos
const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartModal = document.querySelector('.cart-modal')
const cartItems = document.querySelector('.cart-items')
const cartContainer= document.querySelector('.cart-container')
const cartTotal = document.querySelector('.cart-total')
const productsDOM = document.querySelector('.products-center')

// carrito 
let cart = []

// get products
class Products{
    async getProducts(){
        try {
            let result = await fetch('products.json')
            let data = await result.json()
            let products = data.items
            products = products.map(item => {
                const {title,price} = item.fields //desestructuración titulo y precio de la propiedad campos de cada item
                const {id} = item.sys
                const image = item.fields.image.fields.file.url
                return {title,price,id,image}
            })
            return products
        }
        catch (error){
            console.log(error)
        }
    }
}
//display products
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
}
//localStorage
class Storage{

}

document.addEventListener('DOMContentLoaded',()=>{
    const ui = new UI()
    const products = new Products()
    
    // traer todos los productos metodo getProducts
    products.getProducts().then(products=> ui.displayProducts(products))
})