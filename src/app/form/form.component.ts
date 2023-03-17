import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import SignaturePad from 'signature_pad';

import { User } from '../interfaces/User';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  loading = false;

  @ViewChild('signaturePad', { static: false }) SignaturePad: any;
  private signaturePad: any;


  constructor(
    private fb: FormBuilder,
    private UsersService: UsersService
  ) { }

  ngOnInit(): void {
  }

  public form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    birthdate: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.maxLength(200), Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(10)]],
    phoneExtension: ['', [Validators.required, Validators.maxLength(10)]],
  })

  ngAfterViewInit() {
    const canvas = this.SignaturePad.nativeElement;
    this.signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)'
    });
  }


  /**
   * Method to save new user information
   */
  saveUser() {
    const nameControl = this.form.get('name');
    const birthdateControl = this.form.get('birthdate');
    const emailControl = this.form.get('email');
    const phoneControl = this.form.get('phone');
    const phoneExtension = this.form.get('phoneExtension');

    if (nameControl && birthdateControl && emailControl && phoneControl) {
      const user: User = {
        name: nameControl.value,
        birthdate: birthdateControl.value,
        email: emailControl.value,
        phone: `${phoneControl.value}, +${phoneExtension?.value}`,
        signature: this.signaturePad.toDataURL(),
      };

      this.form.markAllAsTouched();

      if (this.form.valid && !this.signaturePad.isEmpty()) {
        this.loading = true;

        this.clearForm()

        this.UsersService.postUser(user)
          .subscribe(response => {
            alert(response)
            this.loading = false;
          })
      } else {
        alert("Invalid form")
        this.loading = false;
      }
    }
  }

  isValid(control: string, tipoError: string) {
    return this.form.get(control)?.touched &&
      this.form.get(control)?.getError(tipoError);
  }

  clearForm() {
    this.form.reset();
    this.signaturePad.clear();
  }

}
