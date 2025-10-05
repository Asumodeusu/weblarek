export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

// Товары
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Покупатели
export type TPayment = "cash" | "card";
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type IOrder = Omit<IBuyer, "payment"> & {
  payment: TPayment; // явно указываем
  items: string[]; // массив ID товаров
  total: number; // общая сумма
}

export type IOrderResult = {
  id: string; // ID заказа
  total: number; // итоговая сумма
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}