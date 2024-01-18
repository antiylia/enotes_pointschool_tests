export interface IProduct {
  id: number;
  name: string;
  price: number;
  discount: number;
}

export type ITestProduct = IProduct & { count: number };
