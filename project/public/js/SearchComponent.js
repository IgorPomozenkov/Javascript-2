Vue.component('search', {
    data() {
        return {
            userSearch: '',
        }
    },
    template:   `<form action="#" class="searchForm" @submit.prevent="$parent.$refs.products.filter(userSearch)">
                    <input type="text" placeholder="поиск..." class="searchForm__field" v-model="userSearch">
                    <button class="btnSearch" type="submit">Найти</button>
                </form>`
});