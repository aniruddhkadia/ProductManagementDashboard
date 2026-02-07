export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  company: {
    name: string;
    title: string;
  };
  address: {
    address: string;
    city: string;
  };
}

export interface UserListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
