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

### View

#### Класс Header

Назначение: 
Отображение состояния корзины и предоставление доступа к ней

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами
`container: HTMLElement` - корневой DOM-элемент для компонента header

Поля:
`basketButton: HTMLButtonElement` - кнопка для открытия корзины
`counterElement: HTMLElement` - элемент, отображающий количество товаров в корзине

Методы:
`set counter(value: number)` - обновляет отображение счетчика корзины с переданным значением

#### Класс Gallery

Назначение:
Отображение галереи товаров

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами
`container: HTMLElement` - корневой DOM-элемент для контейнера галереи

Методы:
`render(data?: { items: IProduct[] }): HTMLElement` - отрисовывает переданный массив товаров в виде карточек каталога

#### Класс Modal

Назначение:
Управление модальными окнами приложения

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами

Поля:
`ModalCloseButtonElement: HTMLButtonElement` - кнопка закрытия модального окна
`ModalContentElement: HTMLElement` - контейнер для содержимого модального окна

Методы:
`open(content: HTMLElement): void` - открывает модальное окно
`close(): void` - закрывает модальное окно и очищает его

#### Класс Success

Назначение:
Отображение оформления заказа

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами
`container: HTMLElement` - корневой DOM-элемент

Поля:
`orderTitleElement: HTMLElement` - элемент заголовка заказа
`description: HTMLElement` - информация о списании средств
`orderButtonCloseElement: HTMLButtonElement` - кнопка закрытия страницы успеха

Методы:
`set total(value: number): void` - устанавливает сумму списания

#### Класс BasketView

Назначение:
Отображение и управление корзины товаров

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами
`container: HTMLElement` - корневой DOM-элемент

Поля:
`basketTitleElement: HTMLElement` - элемент заголовка корзины
`basketListElement: HTMLElement` - контейнер для списка товаров в корзине
`basketButtonOrderElement: HTMLButtonElement` - кнопка оформления заказа
`basketPriceElement: HTMLElement` - элемент отображения общей суммы заказа

Методы:
`set items(value: HTMLElement[]): void` - обновляет список товаров в корзине
`set total(value: number): void` - устанавливает общую сумму заказа

#### Класс CardBasket

Назначение:
Отображение карточки товара в корзине с возможностью удаления

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами

Поля:
`title: HTMLElement` - элемент названия товара
`price: HTMLElement` - элемент цены товара
`CardIndexElement: HTMLElement` - элемент отображения порядкового номера товара
`CardButtonRemoveElement: HTMLButtonElement` - кнопка удаления товара из корзины

Методы:
`render(product: IProduct & { index?: number }): HTMLElement` - отрисовывает карточку товара с данными и обработчиком удаления

примечание:
Независимая реализация обусловлена - из-за отсутствия `category` и `image`, что в свою очередь затрудняет наследование от родителя `AbstractCard`

#### Абстрактный класс AbstractCard

Назначение:
Абстрактный класс для карточек товаров, определяющий общую структуру и логику

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами
`template: string` - селектор шаблона для создания карточки

Поля:
`category: HTMLElement` - элемент категории товара
`title: HTMLElement` - элемент названия товара
`image: HTMLImageElement` - элемент изображения товара
`price: HTMLElement` - элемент цены товара

Методы:
`protected renderBase(product: IProduct): void` - заполняет базовые данные карточки товара
`abstract render(product: IProduct): HTMLElement` - абстрактный метод для отрисовки карточки (реализуется в наследниках)

#### Класс CardCatalog

Назначение:
Отображение карточки товара в каталоге с возможностью выбора

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами

Поля:
Наследует от `AbstractCard`: `category`, `title`, `image`, `price`

Методы:
`render(product: IProduct): HTMLElement` - отрисовывает карточку товара с обработчиком выбора

#### Класс CardPreview

Назначение:
Отображение превью с возможностью добавления/удаления из корзины

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами

Поля:
Наследует от `AbstractCard`: `category`, `title`, `image`, `price`
`description: HTMLElement` - элемент описания товара
`CardButtonElement: HTMLButtonElement` - кнопка управления состоянием товара в корзине

Методы:
`render(product: IProduct): HTMLElement` - отрисовывает детальную карточку товара с обработчиком взаимодействия
`setInBasket(inBasket: boolean): void` - обновляет состояние кнопки в зависимости от наличия товара в корзине

#### Абстрактный класс AbstractFormOrder

Назначение:
Абстрактный класс для форм оформления заказа, определяющий общую структуру и поведение

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами
`template: string` - селектор шаблона для создания формы
`submitEvent: string` - название события, отправляемого при сабмите формы

Поля:
`formSubmitButtonElement: HTMLButtonElement` - кнопка отправки формы
`formErrorsElement: HTMLElement` - контейнер для отображения ошибок
`formTitleElements: HTMLElement[]` - элементы заголовков формы

Методы:
`protected setErrors(message: string): void` - устанавливает сообщение об ошибке
`protected setSubmitEnabled(enabled: boolean): void` - управляет состоянием кнопки отправки формы

#### Класс FormAddress

Назначение:
Управление формой ввода адреса и выбора способа оплаты

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами

Поля:
Наследует от AbstractFormOrder: `formSubmitButtonElement`, `formErrorsElement`, `formTitleElements`
`FormPaymentButtonElement: HTMLButtonElement[]` - кнопки выбора способа оплаты
`FormAddressInputElement: HTMLInputElement` - поле ввода адреса доставки

Методы:
`setPaymentSelected(method: string): void` - устанавливает выбранный способ оплаты с визуальным выделением

#### Класс FormContacts

Назначение:
Управление формой ввода контактных данных покупателя

Конструктор:
`events: IEvents` - шина событий для коммуникации между компонентами

Поля:
Наследует от AbstractFormOrder: `formSubmitButtonElement`, `formErrorsElement`, `formTitleElements`
`FormEmailInputElement: HTMLInputElement` - поле ввода электронной почты
`FormTelephoneInputElement: HTMLInputElement` - поле ввода телефона

Методы:
Отсутствуют (использует унаследованные методы базового класса)

### Основной скрипт (main.ts)

Назначение: Инициализация приложения

## Модели
**CatalogProducts** - каталог товаров  
**Basket** - корзина покупок  
**Buyer** - данные покупателя

## Сервисы
**ApiService** - работа с API

## Представления
**Gallery** - галерея карточек 
**Header** - верхняя панель с корзиной  
**Modal** - модальные окна  
**BasketView** - интерфейс корзины  
**FormAddress/FormContacts** - формы заказа  
**CardPreview/CardBasket** - карточки товаров  
**Success** - страница успеха

## Поток данных
1. Загрузка товаров
2. Добавление в корзину
3. Оформление заказа
4. Отправка → API → Success

## События
`catalog:changed`, `basket:changed`, `card:toggle`, `order:submit`, `success:close`

## Особенности
Event-driven архитектура через EventEmitter
Разделение на Model-View слои
Двухэтапное оформление заказа с валидацией
Динамическое обновление интерфейса

### Структура репозитория

├── .env
├── README.md
├── src/
│ ├── components/
│ │ ├── Models/
│ │ │ ├── Buyers/
│ │ │ │ └── Buyer.ts
│ │ │ └── Products/
│ │ │ ├── Basket.ts
│ │ │ └── CatalogProducts.ts
│ │ ├── View/
│ │ │ ├── Card/
│ │ │ │ ├── AbstractCard.ts
│ │ │ │ ├── CardCatalog.ts
│ │ │ │ └── CardPreview.ts
│ │ │ ├── Form/
│ │ │ │ ├── AbstractFormOrder.ts
│ │ │ │ ├── FormAddress.ts
│ │ │ │ └── FormContacts.ts
│ │ │ ├── BasketView.ts
│ │ │ ├── CardBasket.ts
│ │ │ ├── Gallery.ts
│ │ │ ├── Header.ts
│ │ │ ├── Modal.ts
│ │ │ └── Success.ts
│ │ └── base/
│ │ ├── Api.ts
│ │ ├── ApiService.ts
│ │ ├── Component.ts
│ │ └── Events.ts
│ ├── types/
│ │ └── index.ts
│ └── main.ts
