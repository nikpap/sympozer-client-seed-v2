import {Component, OnInit} from '@angular/core';
import {LocalDAOService} from  './localdao.service';
import { Angulartics2Piwik } from 'angulartics2';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private DaoService:LocalDAOService,
    			angulartics2Piwik: Angulartics2Piwik) {
    }

    ngOnInit():void {
        this.DaoService.initialize();
        let persons = this.DaoService.query("getAllPersons", null);
    }

}
