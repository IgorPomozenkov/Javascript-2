Vue.component('search', {
   
   template:    `<form action="#" class="searchForm" @submit.prevent="$root.filter">
                    <input type="text" class="searchForm__field" v-model="$root.userSearch">
                    <button class="btnSearch" type="submit">Найти</button>
                </form>`
});