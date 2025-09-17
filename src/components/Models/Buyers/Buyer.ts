// Данные покупателя, которые тот должен указать при оформлении заказа

import { TPayment, IBuyer } from "../../../types/index";

export class Buyer {
  private buyerData: IBuyer = {
    payment: "" as TPayment,
    email: "",
    phone: "",
    address: "",
  };

  setBuyerData(allDataBuyer: IBuyer) {
    this.buyerData = allDataBuyer;
  } // сохранение данных в модели, общий метод

  setPayment(payment: TPayment) {
    this.buyerData.payment = payment;
  }

  setEmail(email: string) {
    this.buyerData.email = email;
  }

  setPhone(phone: string) {
    this.buyerData.phone = phone;
  }

  setAddress(address: string) {
    this.buyerData.address = address;
  } // отдельные методы для каждого поля

  getBuyerData(): IBuyer {
    return this.buyerData;
  } // получение всех данных покупателя;

  clearBuyerData() {
    this.buyerData = {
      payment: "" as TPayment,
      email: "",
      phone: "",
      address: "",
    };
  } // очистка данных покупателя;

  validateBuyerData(data: IBuyer): { isValid: boolean; errors: string[] } {
    const errors: string[] = []; // валидация данных

    if (!data.email || !data.email.includes("@") || !data.email.includes(".")) {
      errors.push("Введите корректный email");
    } // Проверка email

    const phoneReg = /^\+7\d{10}$/;
    if (!data.phone || !phoneReg.test(data.phone)) {
      errors.push("Телефон должен быть в формате: +79991234567");
    } // Проверка телефона

    if (!data.address || data.address.trim().length < 4) {
      errors.push("Адрес должен содержать не менее 4 символов");
    } // Проверка адреса

    const validPayment: TPayment[] = ["card", "cash"];
    if (!data.payment || !validPayment.includes(data.payment)) {
      errors.push("Выберите корректный способ оплаты");
    } // Проверка способа оплаты

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  } // Обработка ошибок
}
