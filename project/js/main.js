const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];

let productsEl = document.querySelector('.products');

//Функция для формирования верстки каждого товара
const renderProduct = (item) => {
    return `<div class="product-item">
                <img src="images/img-1.jpg" alt="photo">
                <h3>${item.title}</h3>
                <p>${item.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
};
const renderPage = list => {
    //мой сокращённый вариант кода
    list.forEach(item => productsEl.insertAdjacentHTML('beforeend', renderProduct(item)));
    
    // const productsList = list.map(item => renderProduct(item));
    // console.log(productsList);
    // с помощью метода join объединяем все элементы в строку и удаляем лишние символы
    // document.querySelector('.products').innerHTML = productsList.join('\n');
};

renderPage(products);