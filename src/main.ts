import "./scss/styles.scss";

// model
import { CatalogProducts } from "./components/Models/Products/CatalogProducts";
import { Basket } from "./components/Models/Products/Basket";
import { Buyer } from "./components/Models/Buyers/Buyer";

// api
import { API_URL } from "./utils/constants";
import { ApiService } from "./components/base/ApiService";

// events & utils & type
import { EventEmitter } from "./components/base/Events";
import { ensureElement } from "./utils/utils";
import {
  IOrder,
  IProduct,
  IProductsResponse,
  TPayment,
  IOrderResult,
} from "./types";

// view
import { Success } from "./components/View/Success";
import { Modal } from "./components/View/Modal";
import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { BasketView } from "./components/View/BasketView";
import { FormContacts } from "./components/View/Form/FormContacts";
import { FormAddress } from "./components/View/Form/FormAddress";
import { CardPreview } from "./components/View/Card/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { CardCatalog } from "./components/View/Card/CardCatalog";

const events = new EventEmitter();

// Модели данных
const apiService = new ApiService(API_URL);
const productsModel = new CatalogProducts(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

// Представления
const catalogContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(events, catalogContainer);
const modal = new Modal(events);
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const formAddress = new FormAddress(events);
const formContacts = new FormContacts(events);
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const success = new Success(
  events,
  successTemplate.content.cloneNode(true) as HTMLElement
);

let currentBasketView: BasketView;
let currentPreview: CardPreview | null = null;

// исправил для галереии
events.on("catalog:changed", () => {
  const products = productsModel.getProducts();
  const cardElements = products.map((product) => {
    return new CardCatalog(events).render(product);
  });
  gallery.render({ items: cardElements });
});

// Изменение выбранного товара
events.on("product:selected", (product: IProduct) => {
  currentPreview = new CardPreview(events);
  const cardElement = currentPreview.render(product);
  const inBasket = basket.getProducts().some((p) => p.id === product.id);
  currentPreview.setInBasket(inBasket);
  modal.open(cardElement);
});

// сохраняем в модель
events.on("card:select", (product: IProduct) => {
  productsModel.setSelectedProduct(product);
});

// Добавление в корзину
events.on("card:toggle", (product: IProduct) => {
  const inBasket = basket.getProducts().some((p) => p.id === product.id);
  if (inBasket) {
    basket.removeProduct(product.id);
  } else {
    basket.addProduct(product);
  }
  if (currentPreview) {
    currentPreview.setInBasket(!inBasket);
  }
});

// обновление корзины - логика (basket:changed, basket:open, card:remove);
events.on("basket:changed", () => {
  header.counter = basket.getTotalProduct();
  if (currentBasketView) {
    const basketItems = basket.getProducts().map((product, index) => {
      return new CardBasket(events).render({ ...product, index });
    });
    currentBasketView.items = basketItems;
    currentBasketView.total = basket.getTotalPrice();
  }
});

events.on("basket:open", () => {
  const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement;
  currentBasketView = new BasketView(events, basketContainer);
  events.emit("basket:changed");
  modal.open(basketContainer);
});

// Удаление из корзины
events.on("card:remove", (product: IProduct) => {
  basket.removeProduct(product.id);
});

// Работа с формами
// 1 часть
events.on("basket:order", () => {
  modal.open(formAddress.render()); // использую render для получения container
});

events.on("payment:select", (data: { method: string }) => {
  buyer.setPayment(data.method as TPayment);
  formAddress.setPaymentSelected(data.method);
  validateFirstForm();
});

events.on("address:change", (data: { value: string }) => {
  buyer.setAddress(data.value);
  validateFirstForm();
});

// Валидация формы адреса
const validateFirstForm = () => {
  const validation = buyer.validateBuyer();
  const isValid = validation.isValid;
  formAddress.setSubmitEnabled(isValid); // метод формы
  if (!isValid) {
    formAddress.setErrors(validation.errors.join(", "));
  } else {
    formAddress.clearErrors();
  }
};

// переход
events.on("order:submit", () => {
  const validation = buyer.validateBuyer();
  if (validation.isValid) {
    modal.open(formContacts.render());
  } else {
    formAddress.setErrors(validation.errors.join(", "));
  }
});

// 2 часть форм

events.on("contacts:email", (data: { value: string }) => {
  buyer.setEmail(data.value);
  validateSecondForm();
});

events.on("contacts:phone", (data: { value: string }) => {
  buyer.setPhone(data.value);
  validateSecondForm();
});

// Валидация формы контактов
const validateSecondForm = () => {
  const validation = buyer.validateBuyerContacts();
  const isValid = validation.isValid;
  formContacts.setSubmitEnabled(isValid);
  if (!isValid) {
    formContacts.setErrors(validation.errors.join(", "));
  } else {
    formContacts.clearErrors();
  }
};

// кнопки оплаты/завершения оформления заказа
events.on("contacts:submit", () => {
  const validation = buyer.validateBuyerContacts();
  if (validation.isValid) {
    const order: IOrder = {
      ...buyer.getBuyerData(),
      items: basket.getProducts().map((product) => product.id),
      total: basket.getTotalPrice(),
    };
    apiService.createOrder(order).then((result: IOrderResult) => {
      success.total = result.total;
      modal.open(success.render());
      basket.clearBasket();
      buyer.clearBuyerData();
    });
  } else {
    formContacts.setErrors(validation.errors.join(", "));
  }
});

// Закрытие заказа
events.on("success:close", () => {
  modal.close();
});

// Загрузка товаров
apiService
  .getProducts()
  .then((response: IProductsResponse) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Ошибка при получении товаров:", error);
  });
