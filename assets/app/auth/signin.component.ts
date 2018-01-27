/**
 * Created by Aman on 1/4/2018.
 */
import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {User} from "./user.model";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit{
    myForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {

    }
    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
            password: new FormControl(null, Validators.required),
        })
    }
    onSubmit() {
        //console.log(this.myForm);
        const user = new User(this.myForm.value.email,this.myForm.value.password);
        this.authService.signin(user).subscribe(
            (data) => {
                console.log(data);
                // store the token in the localstorage
                localStorage.setItem('token', data['token']);
                localStorage.setItem('userId', data['userId']);
                this.router.navigateByUrl('/');
            },
            (err) => {console.error(err)}
        );
        this.myForm.reset();
    }
}