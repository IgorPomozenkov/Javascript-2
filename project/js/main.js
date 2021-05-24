const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {
    constructor(url, container, list = list2) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }

    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }
    handleData(data) {
        this.goods = [...data];
        this.render();
    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new this.list[this.constructor.name](product);//мы сделали объект товара либо CartItem, либо ProductItem
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
    filter(value) {
        const regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
        this.allProducts.forEach(el => {
            const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
            if(!this.filtered.includes(el)){
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        });
    }
    _init() {
        return false;
    }
    calcSum() {
        let sumOfProducts = 0;
        for(let product of this.allProducts) {
            sumOfProducts += product.price;
        }
        return sumOfProducts;
    }
}

class Item {
	constructor(el, img = 'images/img-1.jpg') {
		this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
	}

	render() { //генерация товара для каталога товаров
        return `<div class="product-item" data-id="${this.id_product}">
                    <img src="${this.img}" alt="Some img">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>`
	}
}

class ProductsList extends List {
    constructor(cart, container = '.products', url = "/catalogData.json") {
        super(url, container);
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data)); //handleData запускает отрисовку либо каталога товаров, либо списка товаров корзины
    }
    _init() {
        document.querySelector(this.container).addEventListener('click', event => {
            if(event.target.classList.contains('buy-btn')) {
                this.cart.addProduct(event.target);
            }
        });
        document.querySelector('.searchForm').addEventListener('submit', event => {
            event.preventDefault();
            this.filter(document.querySelector('.searchForm__field').value)
        });
    }
}

class ProductItem extends Item {}

class Cart extends List {
    constructor(container = ".cart", url = "/getBasket.json") {
        super(url, container);
        this.getJson()
            .then(data => this.handleData(data.contents)); //вывели все товары в корзине
    }
    
    addProduct(element) {
        this.getJson(`${API}/addToBasket.json`)
            .then(data => {
                if(data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if(find) {
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            });
    }
    removeProduct(element) {
        this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if(data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if(find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart__item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            });
    }
    _updateCart(product) {
        let block = document.querySelector(`.cart__item[data-id="${product.id_product}"]`);
        block.querySelector('.cart__quantity').textContent = `Quantity: ${product.quantity}`;
        block.querySelector('.cart__price').textContent = `$${product.quantity*product.price}`;
    }
    _init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector('.btnClose').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', event => {
            if(event.target.classList.contains('btnAdd')) {
                this.addProduct(event.target);
            }
        });
        document.querySelector(this.container).addEventListener('click', event => {
           if(event.target.classList.contains('btnRemove')) {
               this.removeProduct(event.target);
           }
        });
    }
    clearCart() {

    }
}

class CartItem extends Item {
    constructor(el, img = 'images/img-1.jpg') {
		super(el, img);
        this.quantity = el.quantity;
	}
    
    render() {
        return `<div class="cart__item" data-id="${this.id_product}">
                    <img src="${this.img}" alt="Some img">
                    <div class="cart__contentCenter">
                        <h3>${this.product_name}</h3>
                        <span class="cart__quantity">Quantity: ${this.quantity}</span>
                        <p>$${this.price}</p>
                    </div>
                    <div class="cart__contentRight">
                        <span class="cart__price">$${this.price}</span>
                        <button class="btnAdd" data-id="${this.id_product}">+</button>
                        <button class="btnRemove" data-id="${this.id_product}">-</button>
                    </div>
                </div>`
    }
}

const list2 = {
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);