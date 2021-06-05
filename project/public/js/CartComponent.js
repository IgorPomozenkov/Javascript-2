Vue.component('cart', {
    data() {
        return {
            imgCatalog: 'images/img-1.jpg',
            cartUrl: '/getBasket.json',
            cartItems: [],
            showCart: false,
        }
    },
    methods: {
        addProduct(item){
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if(data.result === 1){
                            find.quantity++
                        }
                    });
            } else {
                const prod = Object.assign({quantity: 1}, item);//создание нового объекта на основе двух, указанных в параметрах
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result === 1){
                            this.cartItems.push(prod)
                        }
                    });
            }
        },
        remove(item){
            if(item.quantity > 1){
                this.$parent.putJson(`/api/cart/${item.id_product }`, {quantity: -1})
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--;
                        }
                    });
            } else {
                this.$parent.delJson(`/api/cart/${item.id_product}`, item)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.splice( this.cartItems.indexOf(item), 1);
                        } else {
                            console.log('error');
                        }
                    });
            }
        }
    },
    mounted() {
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){
                    this.cartItems.push(item);
                }
            });
    },
    template:   `<div>
                    <button class="btn-cart" type="button" @click="showCart =! showCart">Корзина</button>
                    <div class="cart" v-show="showCart">
                        <button class="btnClose" type="button" @click="showCart =! showCart">Закрыть</button>
                        <h2 v-if="cartItems.length == 0">Список товаров пуст</h2>
                        <cart-item v-for="item of cartItems" :key="item.id_product" :img="imgCatalog" :cart-item="item"></cart-item>
                    </div>
                </div>`
});

Vue.component('cart-item', {
    props: ['img', 'cartItem'],
    template:   `<div class="cart__item">
                    <img :src="img" alt="Some img">
                    <div class="cart__contentCenter">
                        <h3>{{cartItem.product_name}}</h3>
                        <span class="cart__quantity">Quantity: {{cartItem.quantity}}</span>
                        <p>{{cartItem.price}}</p>
                    </div>
                    <div class="cart__contentRight">
                        <span class="cart__price">{{cartItem.quantity * cartItem.price}}</span>
                        <button class="btnAdd" @click="$parent.addProduct(cartItem)">+</button>
                        <button class="btnRemove" @click="$parent.remove(cartItem)">-</button>
                    </div>
                </div>`
});