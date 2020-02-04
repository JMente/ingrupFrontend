import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MarcasService } from "./../../../shared/services/marcas.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TiposService } from "./../../../shared/services/tipos.service";
import { ProductosService } from "./../../../shared/services/productos.service";
import { CategoriasService } from "./../../../shared/services/categorias.service";
import { TranslateService } from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
declare var $: any
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    session:boolean = localStorage.getItem('currentUser')?true:false;
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    buscado: boolean;
    pushRightClass: string;
    Table:any = []
    TableProds:any = []
    TableProdsFind:any = []
    hover_num = 0
    private _success = new Subject<string>();
    mercados_active = false;
    productos_active = false;
    staticAlertClosed = false;
    Sostenibilidad_active = false;
    successMessage: string;
    @BlockUI() blockUI: NgBlockUI;
    @Output() collapsedEvent = new EventEmitter<boolean>();
    constructor(
        private translate: TranslateService,
        private TiposService:TiposService,
        public router: Router,
        private CategoriasService:CategoriasService,
        private ProductosService:ProductosService,
        private MarcasService:MarcasService
    ) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }
    ngOnInit() {

        this._success.subscribe((message) => this.successMessage = message);
        this.buscado=false
        this.isActive = true;
        this.collapsed = true;
        this.showMenu = '0';
        this.pushRightClass = 'push-right';
        this.cargarAll();
        $(window).scroll(function() {
            var windscroll = $(window).scrollTop();
            if (windscroll >= 100) {
                $('.menu_fixed').addClass('add_css');
            } else {
                $('.menu_fixed').removeClass('add_css');
            }
        
        }).scroll();​   
        
        $('.conteiner_show_more').click(function(){
            alert(true);
            $( ".content_size").stop().animate( { scrollTop: 1 * 200 }, 500 );
        });
    }
    
    public changeSuccessMessage() {
        this._success.next(`<strong>No se ha encontrado nada en esta busqueda...</strong>`);
    }
    findByName(formData){

    this.blockUI.start();
      const data = {
        id:formData,
        state:'0',
        filter:'nombre'
      };
    //   console.log('antes:'+this.selectedData.id+' Ahora'+id);

    this.CategoriasService.getAllFilter(data)
                          .then(response => {

                            this.TableProdsFind=response;
                            this.expand_menu();
                            if(response.length<=0){
                                this.buscado=true;
                            }
                            console.log(response);
                            this.blockUI.stop();
                        }).catch(error => {
                            console.clear;
                            this.blockUI.stop();
                          });
    }
    recharge(){
        setTimeout(() => {
            this.TableProdsFind.length=0;
            location.reload();

        }, 500);
    }
    cargarAll(){

          this.MarcasService.getAll()
                              .then(response => {
                                this.Table=response
                                // console.log(response);
                                this.CategoriasService.getAll()
                                                        .then(response => {
                                                            this.TableProds=response
                                                            // console.log(response);
                                                        }).catch(error => {
                                                            console.clear
                                                        })
                            }).catch(error => {
                                console.clear
                              })

    }
    openMenu(){
        var width_device = window.screen.width;
        if(width_device < 1000){
            // this.toggleCollapsed();
            this.toggleSidebar();
        }else{
            this.toggleSidebar();
            this.toggleCollapsed();
        }

    }
    openMenu2(){
        var width_device = window.screen.width;
        if(width_device < 1000){
            this.toggleCollapsed();
            this.toggleSidebar();
        }else{
            this.toggleCollapsed();
            this.toggleSidebar();
        }

    }

    logout(){
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentEmail');
        localStorage.removeItem('currentFirstName');
        localStorage.removeItem('currentLastName');
        localStorage.removeItem('currentId');
        localStorage.removeItem('currentPicture');
        localStorage.removeItem('currentState');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentBisCardId');
        localStorage.removeItem('currentEmail');
        localStorage.removeItem('currentApellidos');
        localStorage.removeItem('currentNombres');
        localStorage.removeItem('currentEstado');
        localStorage.removeItem('currentSalt');
        localStorage.removeItem('currentTelefono');
        localStorage.removeItem('currentAvatar');
        localStorage.removeItem('token');
        localStorage.removeItem('currentNuevaSesion');
        localStorage.removeItem('currentTipoUsuarioId');
        localStorage.clear();
        this.session=false;
          this.router.navigate([`../../../../`])

      }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        console.log(element);
        if(element === "markets"){
            this.productos_active = false;
            this.Sostenibilidad_active = false;
            this.mercados_active = true;
            this.expand_menu();
        }
        
        if(element === "products"){
            this.mercados_active = false;
            this.Sostenibilidad_active = false;
            this.productos_active = true;
            this.expand_menu();
        }
        if(element === "pages"){
            this.mercados_active = false;
            this.productos_active = false;
            this.Sostenibilidad_active = true;
            this.expand_menu();
        }

        if (element === this.showMenu) {
            this.showMenu = '0';
            this.closem();
        } else {
            
            this.showMenu = element;
        }

    }
    toggleCollapsed() {
        $(".sidebar").removeClass("menu-w70");
        $(".toggle-button").removeClass("menu-w70");
        $(".cerrarSide").removeClass("menu-w100");
        $("new_option").removeClass("show");
        this.mercados_active = false;
        this.productos_active = false;
        this.Sostenibilidad_active = false;
        this.showMenu = '0';
        this.closem();
        // last code
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
        var width_device = window.screen.width;
        if(width_device <= 1000){
            this.collapsed = false;
        }
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
    expand_menu(){
        $(".sidebar").addClass("menu-w70");
        $(".toggle-button").addClass("menu-w70");
        $(".cerrarSide").addClass("menu-w100");
        $(".new_option").addClass("show");
    }
    closem(){
        this.mercados_active = false;
        this.productos_active = false;
        this.Sostenibilidad_active = false;
        $(".sidebar").removeClass("menu-w70");
        $(".toggle-button").removeClass("menu-w70");
        $(".cerrarSide").removeClass("menu-w100");
        this.buscado=true;
    }
    showMore(){
       
        
        if(this.hover_num >= 15){
            this.hover_num = 0;
            $( ".content_size").stop().animate( { scrollTop: this.hover_num * 44 }, 500 );
        }else{
            this.hover_num += 10;
            $( ".content_size").stop().animate( { scrollTop: this.hover_num * 44 }, 500 );
        }
    }
    
    showMore2(onHover){
        if(onHover){
            this.hover_num += 1;
            $( ".content_size").stop().animate( { scrollTop: this.hover_num * 44 }, 500 );
        }
        
    }
}
