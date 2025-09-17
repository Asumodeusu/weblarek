import "./scss/styles.scss";
import { CatalogProducts } from "./components/Models/Products/CatalogProducts";
import { Basket } from "./components/Models/Products/Basket";
import { Buyer } from "./components/Models/Buyers/Buyer";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
import { ApiService } from "./components/base/ApiService";

// Тесты
const productsModel = new CatalogProducts();
productsModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", productsModel.getProducts());

const basket = new Basket();
console.log("Содержимое корзины: ", basket.getProducts());

const buyer = new Buyer();
buyer.setPayment("cash");
buyer.setEmail("test@mail.ru");
buyer.setPhone("+79221234567");
buyer.setAddress("ул. Пушкинская, 1");
console.log("Данные покупателя: ", buyer.getBuyerData());

// ApiService
const apiService = new ApiService(API_URL);

apiService
  .getProducts()
  .then((products) => {
    productsModel.setProducts(products);
    console.log("Товары получены с сервера и сохранены в каталог:");
    console.log(productsModel.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка при получении товаров:", error);
  });
