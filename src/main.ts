import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";

// Модели
import { CatalogProducts } from "./components/Models/Products/CatalogProducts";
import { Basket } from "./components/Models/Products/Basket";
import { Buyer } from "./components/Models/Buyers/Buyer";

// View компоненты
import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { Modal } from "./components/View/Modal";
import { BasketView } from "./components/View/BasketView";
import { Success } from "./components/View/Success";
import { FormAddress } from "./components/View/Form/FormAddress";
import { FormContacts } from "./components/View/Form/FormContacts";
import { CardPreview } from "./components/View/Card/CardPreview";
import { CardBasket } from "./components/View/Card/CardBasket";

// API и утилиты
import { API_URL } from "./utils/constants";
import { ApiService } from "./components/base/ApiService";
import { IProduct, IOrder, IOrderResult } from "./types";

console.log('🚀 Инициализация приложения...');
console.log('API_URL:', API_URL);

// Инициализация EventEmitter
const events = new EventEmitter();

// Инициализация моделей
const catalog = new CatalogProducts(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

// Инициализация View компонентов
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(events, ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events);

// ИСПРАВЛЯЕМ: Создаем BasketView из template, а не из готового элемента
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketView = new BasketView(events, cloneTemplate(basketTemplate));

const success = new Success(events, ensureElement<HTMLElement>('#success'));
const formAddress = new FormAddress(events);
const formContacts = new FormContacts(events);

// Инициализация API
const apiService = new ApiService(API_URL);
console.log('✅ API инициализирован');

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ====================

// 📦 ИЗМЕНЕНИЕ КАТАЛОГА ТОВАРОВ
events.on('catalog:changed', () => {
    const products = catalog.getProducts();
    console.log('📦 Каталог обновлен, товаров:', products.length);
    gallery.render({ items: products });
});

// 🛒 ИЗМЕНЕНИЕ СОДЕРЖИМОГО КОРЗИНЫ
events.on('basket:changed', () => {
    const count = basket.getTotalProduct();
    console.log('🛒 Корзина обновлена, товаров:', count);
    header.counter = count;
});

// 👤 ИЗМЕНЕНИЕ ДАННЫХ ПОКУПАТЕЛЯ
events.on('buyer:changed', () => {
    console.log('👤 Данные покупателя обновлены:', buyer.getBuyerData());
});

// 🎯 ИЗМЕНЕНИЕ ВЫБРАННОГО ДЛЯ ПРОСМОТРА ТОВАРА
events.on('product:selected', (product: IProduct) => {
    console.log('🎯 Открыт товар:', product.title);
    const preview = new CardPreview(events).render(product);
    modal.open(preview);
});

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ ====================

// 🎯 ВЫБОР КАРТОЧКИ ДЛЯ ПРОСМОТРА
events.on('card:select', (product: IProduct) => {
    console.log('🎯 Выбран товар для просмотра:', product.title);
    catalog.setSelectedProduct(product);
});

// 🔄 НАЖАТИЕ КНОПКИ ПОКУПКИ/УДАЛЕНИЯ ТОВАРА
events.on('card:toggle', (product: IProduct) => {
    if (basket.hasProductBasket(product.id)) {
        console.log('🗑️ Удаление товара из корзины:', product.title);
        basket.removeProduct(product.id);
    } else {
        console.log('🛒 Добавление товара в корзину:', product.title);
        basket.addProduct(product);
    }
});

// 🗑️ НАЖАТИЕ КНОПКИ УДАЛЕНИЯ ТОВАРА ИЗ КОРЗИНЫ
events.on('card:remove', (product: IProduct) => {
    console.log('🗑️ Удаление товара из корзины:', product.title);
    basket.removeProduct(product.id);
});

// 🛍️ НАЖАТИЕ КНОПКИ ОТКРЫТИЯ КОРЗИНЫ
events.on('basket:open', () => {
    console.log('🛍️ Открытие корзины');
    const basketCards = basket.getProducts().map((product, index) => {
        return new CardBasket(events).render({ ...product, index });
    });
    basketView.items = basketCards;
    basketView.total = basket.getTotalPrice();
    modal.open(basketView.render());
});

// 📋 НАЖАТИЕ КНОПКИ ОФОРМЛЕНИЯ ЗАКАЗА
events.on('basket:order', () => {
    console.log('📋 Оформление заказа');
    modal.open(formAddress.render());
});

// 💳 ИЗМЕНЕНИЕ ДАННЫХ В ФОРМАХ - ВЫБОР СПОСОБА ОПЛАТЫ
events.on('payment:select', (data: { method: string }) => {
    console.log('💳 Выбран способ оплаты:', data.method);
    buyer.setPayment(data.method as "card" | "cash");
});

// 🏠 ИЗМЕНЕНИЕ ДАННЫХ В ФОРМАХ - АДРЕС ДОСТАВКИ
events.on('address:change', (data: { value: string }) => {
    console.log('🏠 Введен адрес:', data.value);
    buyer.setAddress(data.value);
});

// 📧 ИЗМЕНЕНИЕ ДАННЫХ В ФОРМАХ - EMAIL
events.on('contacts:email', (data: { value: string }) => {
    console.log('📧 Введен email:', data.value);
    buyer.setEmail(data.value);
});

// 📞 ИЗМЕНЕНИЕ ДАННЫХ В ФОРМАХ - ТЕЛЕФОН
events.on('contacts:phone', (data: { value: string }) => {
    console.log('📞 Введен телефон:', data.value);
    buyer.setPhone(data.value);
});

// ➡️ НАЖАТИЕ КНОПКИ ПЕРЕХОДА КО ВТОРОЙ ФОРМЕ ОФОРМЛЕНИЯ ЗАКАЗА
events.on('order:submit', () => {
    console.log('➡️ Переход к форме контактов');
    const validation = buyer.validateBuyer();
    if (validation.isValid) {
        modal.open(formContacts.render());
    } else {
        console.error('❌ Ошибки в форме заказа:', validation.errors);
    }
});

// 💰 НАЖАТИЕ КНОПКИ ОПЛАТЫ/ЗАВЕРШЕНИЯ ОФОРМЛЕНИЯ ЗАКАЗА
events.on('contacts:submit', async () => {
    console.log('💰 Отправка заказа');
    const contactsValidation = buyer.validateBuyerContacts();
    const orderValidation = buyer.validateBuyer();
    
    if (contactsValidation.isValid && orderValidation.isValid) {
        try {
            const order: IOrder = {
                ...buyer.getBuyerData(),
                items: basket.getProducts().map(product => product.id),
                total: basket.getTotalPrice()
            };

            console.log('📦 Отправка заказа на сервер:', order);
            const result: IOrderResult = await apiService.createOrder(order);
            
            console.log('✅ Заказ успешно оформлен:', result);
            success.total = result.total;
            modal.open(success.render());
            
            basket.clearBasket();
            buyer.clearBuyerData();

        } catch (error) {
            console.error('❌ Ошибка оформления заказа:', error);
        }
    } else {
        console.error('❌ Ошибки в форме контактов:', contactsValidation.errors);
    }
});

// ✅ ЗАКРЫТИЕ УСПЕШНОГО ЗАКАЗА
events.on('success:close', () => {
    console.log('✅ Закрытие успешного заказа');
    modal.close();
});

// ==================== ЗАГРУЗКА ДАННЫХ ====================

console.log('🔄 Загрузка товаров с сервера...');

// Загрузка товаров с сервера при старте приложения
apiService.getProducts()
    .then(products => {
        console.log('✅ Товары загружены:', products.length, 'шт');
        catalog.setProducts(products);
    })
    .catch(error => {
        console.error('❌ Ошибка загрузки товаров:', error);
    });

console.log('🎉 Приложение инициализировано!');