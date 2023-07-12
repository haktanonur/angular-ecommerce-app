import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCartYears: number[] = [];
  creditCartMonths: number[] = [];

  countries: Country[]  = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']

      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        address: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        address: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("Start Month : " + startMonth);

    // populate credit card months
    this.luv2ShopFormService.getCreditCartMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCartMonths = data;
      }
    );

    // populate credit card years
    this.luv2ShopFormService.getCreditCartYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCartYears = data;
      }
    );

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.countries = data;
      }
    );


  }

  copyShippingAddressToBillingAddress(event: Event) {
    const billingAddressControl = this.checkoutFormGroup.get('billingAddress');
    const shippingAddressControl = this.checkoutFormGroup.get('shippingAddress');

    if (billingAddressControl && shippingAddressControl) {
      if ((event.target as HTMLInputElement).checked) {
        billingAddressControl.setValue(shippingAddressControl.value);
        
        this.billingAddressStates = this.shippingAddressStates;

      } else {
        billingAddressControl.reset();

        this.billingAddressStates = [];
      }
    }
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCartMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit cart months: " + JSON.stringify(data));
        this.creditCartMonths = data;
      }
    );
  }

  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // select first item default
        if(formGroup){
          formGroup.get('state')?.setValue(data[0]);
        }
      
      }
    );

  }

}
