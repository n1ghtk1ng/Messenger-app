import {Component, OnInit} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AuthService} from "./auth.service";
import {User} from "./user.model";
/**
 * Created by Aman on 1/4/2018.
 */

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit{
    myForm: FormGroup;

    constructor(private authService: AuthService){
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
            password: new FormControl(null, Validators.required),
        })
    }
    onSubmit() {
        // console.log(this.myForm);
        const user = new User(this.myForm.value.email,this.myForm.value.password,this.myForm.value.firstName,this.myForm.value.lastName);
        this.authService.signup(user).subscribe(
            (data) => {
                console.log(data)},
            (err) => {console.error(err)}
        );
        this.myForm.reset();
    }
}