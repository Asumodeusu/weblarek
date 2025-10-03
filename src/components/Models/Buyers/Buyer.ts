// Данные покупателя, которые тот должен указать при оформлении заказа

import { TPayment, IBuyer } from "../../../types/index";
import { EventEmitter } from "../../base/Events";

export class Buyer {
  private buyerData: IBuyer = {
    payment: "" as TPayment,
    email: "",
    phone: "",
    address: "",
  };

  constructor(private events: EventEmitter) {}

  setBuyerData(allDataBuyer: IBuyer) {
    this.buyerData = allDataBuyer;
    this.events.emit('buyer:changed');
  } // сохранение данных в модели, общий метод

  setPayment(payment: TPayment) {
    this.buyerData.payment = payment;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string) {
    this.buyerData.email = email;
    this.events.emit('buyer:changed');
  }

  setPhone(phone: string) {
    this.buyerData.phone = phone;
    this.events.emit('buyer:changed');
  }

  setAddress(address: string) {
    this.buyerData.address = address;
    this.events.emit('buyer:changed');
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
    this.events.emit('buyer:changed');
  } // очистка данных покупателя;

  validateBuyer(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.buyerData.payment) {
      errors.push('Выберите способ оплаты');
    } // способ оплаты
    if (!this.buyerData.address?.trim()) {
      errors.push('Введите адрес доставки');
    } // Проверка адреса
    return { 
      isValid: errors.length === 0, 
      errors: errors 
        };
    }
  
  validateBuyerContacts(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.buyerData.email?.trim()) {
      errors.push('Введите email');
    } // Проверка email
    if (!this.buyerData.phone?.trim()) {
      errors.push('Введите телефон');
    } // Проверка телефона
    return { 
      isValid: errors.length === 0, 
      errors: errors 
    };
  }
}
