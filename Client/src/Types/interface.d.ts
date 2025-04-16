interface Iinventory {
  _id?: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

interface ISales {
  _id?: string;
  customer: string;
  product: string;
  price: number;
  quantity: number;
  total:number;
  date?:string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key?: string]: any;
}

interface IpageData{
  customers:ICustomer[],
  items:Iinventory[],
}
