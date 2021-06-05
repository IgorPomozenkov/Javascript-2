Vue.component('cart', {
    props: ['cartItems', 'img', 'visibility'],
    template:   `<div class="cart" v-show="visibility">
                    <button class="btnClose" type="button" @click="$root.showCart =! $root.showCart">Закрыть</button>
                    <h2 v-if="cartItems.length == 0">Список товаров пуст</h2>
                    <cart-item v-for="item of cartItems" :key="item.id_product" :img="img" :cart-item="item"></cart-item>
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
                        <button class="btnAdd" @click="$parent.$emit('add-product', cartItem)">+</button>
                        <button class="btnRemove" @click="$parent.$emit('remove', cartItem)">-</button>
                    </div>
                </div>`
});