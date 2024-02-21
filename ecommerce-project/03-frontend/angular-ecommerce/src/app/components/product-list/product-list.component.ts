import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  products : Product[] = [] ;
  currentCategoryId : number = 1 ;
  previousCategoryId : number = 1 ;
  currentCategoryName : string = "";
  searchMode : boolean = false;
  
  // new properties for pagination 
  pageNumber : number =  1;
  pageSize : number = 5;
  totalElements:  number = 0; 
  constructor(private productService : ProductService,
              private cartService : CartService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      console.log(`search mode`);
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleListProducts(){
    // check if "id" is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      //get the "id" param string , convert to number using +
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }else{
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // Check if we have a different category than previous
    // Note: angular will reuse a component if it is currently being viewed

    // if we have a different category id than previous , then set pagenumber back to 1
    
    if(this.previousCategoryId != this.currentCategoryId){
      this.pageNumber = 1;
    } 

    this.previousCategoryId = this.currentCategoryId;

    console.log('currentCategoryId='+this.currentCategoryId + " pageNumber : " + this.pageNumber);

    
    // get the products for the given category id
    this.productService.getProductListPageinate(this.pageNumber-1,  // paging is 0 based in spring boot
                                                this.pageSize,
                                                this.currentCategoryId).subscribe(
                                                  this.processResult()
                                                );
    

  }

  handleSearchProducts(){
    const theKeyword : string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProductsPaginate(this.pageNumber-1,
                                               this.pageSize,
                                               theKeyword).subscribe(this.processResult())
  }
  private processResult() {
    return (data:any)=>{
      this.products = data._embedded.products
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;                                 
    };
  }

  updatePageSize(pageSize : string){
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product){
    const cartItem  = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
