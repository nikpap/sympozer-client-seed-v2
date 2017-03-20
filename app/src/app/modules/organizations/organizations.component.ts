import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDAOService } from  '../../localdao.service';
import {Encoder} from "../../lib/encoder";
import {routerTransition} from '../../app.router.animation';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
  animations: [routerTransition()],
  host: {'[@routerTransition]': ''}
})
export class OrganizationsComponent implements OnInit {
  organizations;
  constructor(
      private DaoService : LocalDAOService,
      private encoder: Encoder
  ) { }

  ngOnInit() {
    this.organizations = this.DaoService.query("getAllOrganizations", null);
    console.log(this.organizations);
  }

}
