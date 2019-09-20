import { Component, OnInit } from '@angular/core';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { ConsoleReporter } from 'jasmine';
declare var $: any
@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss'],
    providers: [NgbAccordionConfig]
})
export class BlankPageComponent implements OnInit {
    constructor(config: NgbAccordionConfig) {
        // customize default values of accordions used by this component tree
        config.closeOthers = true;
        config.type = 'success';
      }

    ngOnInit() {
        
    }
    button_mapa(){
        console.log("funcion");
    }
    status: boolean = false;
    clickEvent(){
        this.status = !this.status;       
    }
}
