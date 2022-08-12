import { faker } from '@faker-js/faker/locale/pt_BR';

export function generateName() {
  return `${faker.word.adjective()}-${faker.animal.type()}`;
}
