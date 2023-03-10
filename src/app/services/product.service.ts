import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  //   let url = this.baseUrl + '/product-category/' +  categoryId + '/products';
  //   console.log(url)
  //   return this.httpClient.get<GetResponse>(url).pipe(map(response => response._embedded.products));
  // }


  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  //private baseUrl = "http://localhost:8080/api";


  constructor(private httpClient: HttpClient) { }
// getProductList(): Observable<Product[]> {
//   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(map(response => response._embedded.products));
// }
// getProductList(categoryId: number): Observable<Product[]> {
//   let url = this.baseUrl + '/product-category/' +  categoryId + '/products';
//   console.log(url)
//   return this.httpClient.get<GetResponse>(url).pipe(map(response => response._embedded.products));
// }
getProductListPagination(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
  
  let pageUrl = this.baseUrl + '/search/findByCategoryId?id=' +  categoryId +'&page=' +page+'&size='+pageSize ;
  console.log(pageUrl);


  return this.httpClient.get<GetResponseProducts>(pageUrl);

}
getProductList(categoryId: number): Observable<Product[]> {
  let url = this.baseUrl + '/search/findByCategoryId?id=' +  categoryId ;
  console.log(url)


  return this.httpClient.get<GetResponseProducts>(url).pipe(map((response: { _embedded: { products: any; }; }) => response._embedded.products));
}
getProductCategories(): Observable<ProductCategory[]> {
  return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map((response: { _embedded: { productCategory: any; }; }) => response._embedded.productCategory));

}
searchProducts(keyword: string): Observable<Product[]>{

  let searchUrl = `http://localhost:8080/api/products/search/findByNameContaining?name=${keyword}`;
  return this.getProducts(searchUrl);
}
getProduct(productId: number):Observable<Product[]> {
  let productIdUrl = `${this.baseUrl}/${productId}`;
  return this.httpClient.get<Product[]>(productIdUrl);
}

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map((response: { _embedded: { products: any; }; }) => response._embedded.products));
  }

 
}
 
interface GetResponseProducts{
  _embedded: {
    products: Product[];
  },
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}
interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}