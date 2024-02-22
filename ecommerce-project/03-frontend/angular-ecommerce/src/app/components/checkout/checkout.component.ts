import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
  checkoutFormGroup!: FormGroup;
  
  totalPrice:  Number  = 0;
  totalQuantity:  Number  = 0;

  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];

  countries : Country[] = [];
  statesOfShippingCountry : State[] = [];
  statesOfBillingCountry : State[] = [];

  constructor(private formBuilder : FormBuilder,
              private formService : FormService) {
    
  }
  
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName : [''],
        lastName : [''],
        email : ['']
      }),
      shippingAddress : this.formBuilder.group({
        street : [''],
        city:[''],
        state:[''],
        country:[''],
        zipCode: ['']
      }),
      billingAddress : this.formBuilder.group({
        street : [''],
        city:[''],
        state:[''],
        country:[''],
        zipCode: ['']
      }),
      creditCard : this.formBuilder.group({
        cardType : [''],
        nameOnCard : [''],
        cardNumber : [''],
        securityCode : [''],
        expirationMonth : [''],
        expirationYear : [''],
      })
    });

    // populate credit card months and years
    const startMonth : number = new Date().getMonth() + 1 ;
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        this.creditCardMonths = data;
      }
    )

    this.formService.getCreditCardYears().subscribe(
      data=>{
        this.creditCardYears = data;
      }
    )

    this.formService.getCountries().subscribe(
      data=>{
        this.countries = data;
      }
    )
  }
  
  copyShippingAddressToBillingAddress(event : any) {
    if(event.target.checked){
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value
      )

      this.statesOfBillingCountry = this.statesOfShippingCountry;
    }else{
      this.checkoutFormGroup.get('billingAddress')?.value.reset;

      this.statesOfBillingCountry = [];
    }
  }
  handleYearsAndMonths() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear : number  = new Date().getFullYear();
    const selectedYear : number  = Number(creditCardFormGroup?.value.expirationYear);

    // if current = selected , start with current month

    let startMonth : number ;
    if(currentYear===selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        this.creditCardMonths = data;
      }
    );
  }
  
  handleCountryAndStates(formGroupName : string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
  
    this.formService.getStates(countryCode).subscribe(
      data=> {
        if(formGroupName==='shippingAddress')
          this.statesOfShippingCountry = data;
        else
          this.statesOfBillingCountry = data;

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
    
    
  onSubmit(){
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }
    

}
