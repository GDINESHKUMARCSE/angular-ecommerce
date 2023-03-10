import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
//keyword!: string;
 currentCategoryId: number =1;
 searchMode: boolean = false;
pageNumber: number =1;
pageSize: number =5;
totalElements: number = 100;
  previousCategoryId: number=1;

  

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }
  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword')!;
    console.log('searchMode', this.searchMode);
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

 

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){

      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      this.currentCategoryId = 1;
    }
    //
    if(this.previousCategoryId!= this.currentCategoryId){
      this.pageNumber = 1;  
    }
   this.previousCategoryId = this.currentCategoryId;
   console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);


    this.productService.getProductListPagination(this.pageNumber-1, this.pageSize, this.currentCategoryId)
    .subscribe((data: any)=>{
      this.products = data._embedded.products;
      this.pageNumber = data.page.number +1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    })
  }
  handleSearchProducts(){
     let keyvalue = this.route.snapshot.paramMap.get('keyword')!;
     console.log(keyvalue);
    this.productService.searchProducts(keyvalue).subscribe(
      
       (data: any) => {
         
         this.products = data;

       }
      
    )
  }

  updatePageSize(modifiedPageSize: string){
 this.pageSize = +modifiedPageSize;
 this.pageNumber =1;
 this.listProducts();
  }

  addToCart(product: Product){
    console.log(`Adding to cart:${product.name},${product.unitPrice}`);
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

  
}
