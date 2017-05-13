import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {routerTransition} from '../../app.router.animation';
import {ApiExternalServer} from '../../services/ApiExternalServer';
import {MdSnackBar} from "@angular/material";
import {VoteService} from '../../services/vote.service'

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class LoginComponent implements OnInit {

    title: string = "Login";


    constructor(private router: Router,
                private apiExternalServer: ApiExternalServer,
                public snackBar: MdSnackBar,
                private voteService: VoteService) {
    }

    ngOnInit() {
        if (document.getElementById("page-title-p"))
            document.getElementById("page-title-p").innerHTML = this.title;
    }

    /**
     * Invoke the login external server service
     * @param email
     * @param password
     */
    login = (email, password) => {
        this.apiExternalServer.login(email, password).then(() => {
            this.voteService.votedTracks()
                .then(()=>{
                    console.log("User voted tracks retrieved")
                })
                .catch((err)=>{
                    console.log(err)
                })
            this.snackBar.open("Login successful", "", {
                duration: 2000,
            });
        }).catch((err) => {
            this.snackBar.open(err, "", {
                duration: 2000,
            });
        });
    }
}