const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductsList {
    constructor(container = '.products') {
        this.container = container;
        this.allProducts = [];
        this.goods = [];
        this._getProducts()
            .then(data => { //data - объект js
                this.goods = [...data];
                this.render();
                //console.log(this.calcSum());
            });
    }

    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        const block = document.querySelector(this.container);
        for(let product of this.goods) {
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
    calcSum() {
        let sumOfProducts = 0;
        for(let product of this.allProducts) {
            sumOfProducts += product.price;
        }
        return sumOfProducts;
    }
}

class ProductItem {
	constructor(product, img = 'images/img-1.jpg') {
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
		this.img = img;
	}

	render() {
        return `<div class="product-item" data-id="${this.id}">
                    <img src="${this.img}" alt="Some img">
                    <h3>${this.title}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn">Купить</button>
                </div>`
	}
}

let list = new ProductsList();

class CartProducts {
    constructor(container = '.cart') {
        this.container = container;
        this.goods = [];
        this._getGoods()
            .then(data => {
                this.goods = [...data.contents];
                this.render();
                this.add();
            });
    }

    _getGoods() {
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        const block = document.querySelector(this.container);
        for(let product of this.goods) {
            const productObj = new CartProductsElem(product);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    add() {
        document.querySelectorAll('.buy-btn').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                let productId = event.currentTarget.parentNode.dataset.id;
                for(let product of this.goods) {
                    if(productId == product.id_product) {
                        document.querySelector('.cart__quantity').innerText = ++product.quantity;
                    }
                }
            });
        });
    }
    remove() {

    }
    change() {

    }
    clear() {

    }
}

class CartProductsElem {
    constructor(product, img = 'images/img-1.jpg') {
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
        this.quantity = product.quantity;
		this.img = img;
	}
    
    render() {
        return `<div class="cart__item" data-id="${this.id}">
                    <img src="${this.img}" alt="Some img">
                    <div class="cart__contentCenter">
                        <h3>${this.title}</h3>
                        <div>Quantity: <span class="cart__quantity">${this.quantity}</span></div>
                        <p>$${this.price}</p>
                    </div>
                    <div class="cart__contentRight">
                        <span class="cart__total">$${this.price}</span>
                        <button class="btnRemove">X</button>
                    </div>
                </div>`
    }
}

let cartProducts = new CartProducts();