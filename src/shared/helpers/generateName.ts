import { faker } from '@faker-js/faker';

export function generateName() {
  faker.setLocale('pt_BR');

  return `${faker.commerce.product()}-${faker.commerce.productAdjective()}`;
}
