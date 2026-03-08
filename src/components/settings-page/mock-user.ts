export interface User {
  id: string;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export const mockUser: User = {
  id: '1',
  first_name: 'Иван',
  second_name: 'Иванов',
  display_name: 'Иван',
  login: 'ivanivanov',
  email: 'pochta@yandex.ru',
  phone: '+7 (000) 000 00 00',
  avatar: '',
};

export {};