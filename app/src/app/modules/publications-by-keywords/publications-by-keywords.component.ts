import {forEach} from "@angular/router/src/utils/collection";
import {Component, OnInit} from "@angular/core";
import {Conference} from "../../model/conference";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {DataLoaderService} from "../../data-loader.service";
import {DBLPDataLoaderService} from "../../dblpdata-loader.service";
import {LocalDAOService} from "../../localdao.service";
import {Encoder} from "../../lib/encoder";
import {routerTransition} from '../../app.router.animation';

@Component({
    selector: 'app-publication-by-keywords',
    templateUrl: 'publications-by-keywords.html',
    styleUrls: ['publications-by-keywords.scss'],
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class PublicationsByKeywords implements OnInit {
    title: string = "Keywords";
    private keywords;

    constructor(private router: Router, private route: ActivatedRoute,
                private DaoService: LocalDAOService, private encoder: Encoder) {
        this.keywords = new Set();
    }

    ngOnInit() {
        const that = this;
        that.DaoService.query("getAllKeywords", null, (results) => {
            if(results){
                const nodeKeyword = results['?keywords'];

                if(nodeKeyword){
                    const value = nodeKeyword.value;

                    if(value && value.length > 0){
                        if(!that.keywords.has(value)){
                            that.keywords.add(value);

                            const array = Array.from(that.keywords).sort();
                            that.keywords = new Set(array);
                        }
                    }
                }
            }
        });
    }
}
