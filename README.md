# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные

Товары:
interface IProduct {
id: string; // Уникальный идентификатор товара
description: string; // Подробное описание товара
image: string; // URL изображения товара
title: string; // Название товара
category: string; // Категория товара
price: number | null; // Цена товара (может быть null)
}

Покупатель:
interface IBuyer {
payment: TPayment; // Способ оплаты: 'cash' или 'card'
email: string; // Email покупателя для уведомлений
phone: string; // Телефон для связи
address: string; // Адрес доставки
}

Тип Оплаты:
type TPayment = 'cash' | 'card'; // Доступные способы оплаты

Заказ:
type IOrder = Omit<IBuyer, 'payment'> & {
payment: TPayment; // Способ оплаты
items: string[]; // Массив ID товаров в заказе
total: number; // Общая сумма заказа
};

Результат заказа:
type IOrderResult = {
id: string; // ID созданного заказа
total: number; // Итоговая сумма заказа
};

#### Модели данных

#### Класс CatalogProducts

Назначение: Хранение товаров, которые можно купить в приложении

Поля:
`private AllProducts: IProduct[]` - хранит массив всех товаров;
`private SelectedProduct: IProduct | null` - хранит товар, выбранный для подробного отображения;

Методы:
`setProducts(products: IProduct[])` - сохранение массива товаров
`getProducts(): IProduct[]` - получение всего каталога товаров
`getProductById(id: string): IProduct | undefined` - получение одного товара по его id;
`setSelectedProduct(product: IProduct)` - сохранения товара для подробного отображения;
`getSelectedProduct(): IProduct | null` - получение товара для подробного отображения.

#### Класс Basket

Назначение: Хранение товаров, которые покупатель выбрал для покупки

Поля:
`private ProductBuyer: IProduct[]` - товары, добавленные в корзину

Методы:
`getProducts(): IProduct[]` - получение всех товаров в корзине
`addProduct(product: IProduct)` - добавление товара в корзину
`removeProduct(productId: string): void` - удаление товара из корзины по ID
`clearBasket()` - очистка корзины
`getTotalPrice(): number` - расчет общей стоимости товаров в корзине
`getTotalProduct(): number` - получение количества товаров в корзине
`hasProductBasket(id: string): boolean` - проверка наличия товара в корзине по ID

#### Класс Buyer

Назначение: Хранение и валидация данных покупателя при оформлении заказа

Поля:
`private buyerData: IBuyer `- данные покупателя

Методы:
`setBuyerData(data: IBuyer)` - сохранение всех данных покупателя
`setPayment(payment: TPayment)` - установка способа оплаты
`setEmail(email: string)` - установка email адреса
`setPhone(phone: string)` - установка номера телефона
`setAddress(address: string)` - установка адреса доставки
`getBuyerData(): IBuyer` - получение всех данных покупателя
`clearBuyerData()` - сброс всех данных покупателя
`validateBuyerData(data: IBuyer): { isValid: boolean; errors: string[] }` - валидация данных
пол
Валидация включает:
Проверку `email` на наличие `@` и `.`
Проверку `телефона` на формат `+79991234567`
Проверку `адреса` (минимум 4 символа)
Проверку `способа оплаты` (только 'cash' или 'card')

#### Слой коммуникации

#### Класс ApiService

Назначение: Организация взаимодействия с API сервера "Веб-ларёк"

Принцип работы: Использует композицию с базовым классом Api для выполнения HTTP-запросов

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})`
`baseUrl` - базовый URL API сервера
`options` - дополнительные настройки HTTP-запросов

Методы:
`getProducts(): Promise<IProduct[]>`- GET запрос на эндпоинт /product/ для получения каталога товаров
`createOrder(order: IOrder): Promise<IOrderResult>` - POST запрос на эндпоинт /order/ для оформления заказа

### Основной скрипт (main.ts)

Назначение: Инициализация приложения, тестирование компонентов

Импорт:
`import "./scss/styles.scss";`
`import { CatalogProducts } from "./components/Models/Products/CatalogProducts";`
`import { Basket } from "./components/Models/Products/Basket";`
`import { Buyer } from "./components/Models/Buyers/Buyer";`
`import { apiProducts } from "./utils/data";`
`import { API_URL } from "./utils/constants";`
`import { ApiService } from "./components/base/ApiService";`

Инициализация моделей:
`const productsModel = new CatalogProducts();` - товары
`const basket = new Basket();` - корзина
`const buyer = new Buyer();` - покупатель

Тестирование CatalogProducts:
`productsModel.setProducts(apiProducts.items);`
`console.log('Каталог товаров:', productsModel.getProducts());`

Тестирование Basket:
`console.log("Содержимое корзины:", basket.getProducts());`

Тестирование покупателя:
`buyer.setPayment('card');`
`buyer.setEmail('test@mail.ru');`
`buyer.setPhone('+79991234567');`
`buyer.setAddress('ул. Примерная, 1');`
`console.log('Данные покупателя:', buyer.getBuyerData());`

Работа с ApiService:
`const apiService = new ApiService(API_URL);`
`apiService.getProducts()`
`.then(products => {`
`productsModel.setProducts(products);`
`console.log("Товары с сервера сохранены в каталог:");`
`console.log(productsModel.getProducts());});`

### Класс Header

interface HeaderData {
counterElement: number;
}

Принцип работы:

Конструктор:

Поля:
private basketButton: HTMLButtonElement;
private counterElement: HTMLElement;

Методы:
set counter(value: number)

### Класс Gallery -------

interface GalleryData {
catalog: HTMLElement [];
}

Принцип работы:

Конструктор:

Поля:
private catalogElement: HTMLElement;

Методы:
set catalog(items: HTMLElement[])


### Класс Madal

interface ModalData {
contentElement: HTMLElement;
}

Принцип работы:

Конструктор:
super.continer // Component - constructor

Поля:
private modalCloseButton: HTMLButtonElement;
private contentElement: HTMLElement

Методы:

### Класс Success

interface HeaderData {

}

Принцип работы:

Конструктор:

Поля:
private 
private 

Методы:

### Класс

interface HeaderData {

}

Принцип работы:

Конструктор:

Поля:
private 
private 

Методы:

### Класс

interface HeaderData {

}

Принцип работы:

Конструктор:

Поля:
private 
private 

Методы:

### Класс

### Класс

### Класс

### Класс

### Класс

### Класс

### Класс

### Класс

### Класс

### Класс

### Структура репозитория

├── .env
├── README.md
├── src
│   ├── components
│   │   ├── Models
│   │   │   ├── Buyers
│   │   │   │   └── Buyer.ts
│   │   │   └── Products
│   │   │       ├── Basket.ts
│   │   │       └── CatalogProducts.ts
│   │   └── base
│   │       ├── Api.ts
│   │       ├── ApiService.ts
│   │       ├── Component.ts
│   │       └── Events.ts
│   ├── main.ts
│   ├── types
│   │   └── index.ts
