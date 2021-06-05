Vue.component('products', {
    data(){
        return {
            catalogUrl: '/catalogData.json',
            products: [],
            filtered: [],
            imgCatalog: 'images/img-1.jpg',
        }
    },
    methods: {
        filter(userSearch){
            let regexp = new RegExp(userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted(){
        this.$parent.getJson(`/api/products`)
           .then(data => {
               for(let item of data){
                   this.products.push(item);
                   this.filtered.push(item);
               }
            });
        // this.$parent.getJson(`getProducts.json`)
        //     .then(data => {
        //         for(let item of data){
        //             this.products.push(item);
        //             this.filtered.push(item);
        //         }
        //     });
    },
    template:   `<div class="products container">
                    <product v-for="item of filtered" :key="item.id_product" :img="imgCatalog" :product="item"></product>
                </div>`
});

Vue.component('product', {
    props: ['product', 'img'],
    template:   `<div class="product-item">
                    <img :src="img" alt="Some img">
                    <h3>{{product.product_name}}</h3>
                    <p>{{product.price}}</p>
                    <button class="buy-btn" @click="$parent.$parent.$refs.cart.addProduct(product)">Купить</button>
                </div>`
});