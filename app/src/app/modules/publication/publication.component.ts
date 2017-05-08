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
    selector: 'app-publication',
    templateUrl: 'publication.component.html',
    styleUrls: ['publication.component.scss'],
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class PublicationComponent implements OnInit {
    public publication;
    public authors;
    public events = [];
    public track = {};
    public keywords = [];
    public trackId;
    public eventType;

    constructor(private router: Router, private route: ActivatedRoute,
                private DaoService: LocalDAOService, private encoder: Encoder) {
        this.authors = [];
        this.publication = {
            label: undefined,
            abstract: undefined
        };
    }

    ngOnInit() {
        const that = this;
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.trackId = id;
            let name = params['name'];
            let query = {'key': this.encoder.decode(id)};

            /**
             * Retrieve the publication
             */
            this.DaoService.query("getPublication", query, (results) => {
                if (results) {
                    const nodeLabel = results['?label'];
                    const nodeAbstract = results['?abstract'];

                    if (!nodeLabel || !nodeAbstract) {
                        return false;
                    }

                    const label = nodeLabel.value;
                    const abstract = nodeAbstract.value;

                    if (!label || !abstract) {
                        return false;
                    }

                    that.publication.label = label;
                    that.publication.abstract = abstract;
                    if (document.getElementById("page-title-p"))
                        document.getElementById("page-title-p").innerHTML = label;
                }
            });

            /**
             * Retrieve the author by the publication
             */
            this.DaoService.query("getAuthorLinkPublication", query, (results) => {
                console.log('getAuthorLinkPublication : ', results);
                if (results) {
                    const nodeIdPerson = results['?idPerson'];
                    const nodeLabel = results['?label'];

                    if (!nodeIdPerson || !nodeLabel) {
                        return false;
                    }

                    let idPerson = nodeIdPerson.value;
                    const label = nodeLabel.value;

                    if (!idPerson || !label) {
                        return false;
                    }

                    idPerson = that.encoder.encode(idPerson);
                    if (!idPerson) {
                        return false;
                    }

                    that.authors.push({
                        id: idPerson,
                        label: label,
                    });
                }
            });

            /**
             * Retrieve the event from the publication
             */
            that.DaoService.query("getEventFromPublication", query, (results) => {
                if(results){
                    const nodeId = results['?id'];
                    const nodeLabel = results['?label'];
                    const nodeType = results['?type'];

                    if(nodeId && nodeLabel && nodeType){
                        let id = nodeId.value;
                        const label = nodeLabel.value;
                        let type = nodeType.value;

                        if(id && label){
                            id = that.encoder.encode(id);
                            if(id){
                                /*//On récup le type dans l'URI
                                const tab = type.split('#');
                                if(tab.length !== 2){
                                    return false;
                                }

                                type = tab[1];
                                type.replace('>', '');

                                if(!type || type.length === 0){
                                    return false;
                                }*/

                                that.events = that.events.concat({
                                    id: id,
                                    label: label,
                                    //type: type,
                                });

                                that.events.sort((a, b) => {
                                    return a.label > b.label ? 1 : -1;
                                });
                            }
                        }
                    }
                }
            });

            /**
             * Retrive track from the publication
             */
            that.DaoService.query("getPublicationTrack", query, (results) => {
                console.log(results);
               if(results){
                   const nodeLabel = results['?label'];
                   const nodeId = results['?isSubEventOf'];

                   if(nodeLabel && nodeId){
                       const label = nodeLabel.value;
                       let id = nodeId.value;

                       if(label && id){
                           id = that.encoder.encode(id);

                           if(id){
                               that.eventType = id
                               console.log(label, id);
                               that.track = {
                                   id: id,
                                   label: label,
                               };
                           }
                       }
                   }
               }
            });

            /**
             * Retrieve keywords from publication
             */
            that.DaoService.query("getKeywordsFromPublication", query, (results) => {
                if(results){
                    const nodeKeywords = results['?keywords'];

                    if(nodeKeywords){
                        const keyword = nodeKeywords.value;

                        if(keyword && keyword.length > 0){
                            that.keywords.push(keyword);
                        }
                    }
                }
            });

            /*for(let i in this.publication.authors){
             let query = { 'key' : this.publication.authors[i] };
             this.authors[i] = this.DaoService.query("getPersonLink",query);
             }*/
        });
    }
}
