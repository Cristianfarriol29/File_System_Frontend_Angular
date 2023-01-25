import { FilesService } from './../../../core/services/files.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
// import { TranslateService } from '@ngx-translate/core';
// import { slideAnimation } from '@shared/animations';
// import { BussinessDevServices } from '@shared/models/bussinessDevServices';
// import { Library } from '@shared/models/libraries';
// import { procedure } from '@shared/models/qhse';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { userCreatorDB } from 'userCreator';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';
// import {
//   links,
//   linksSection,
// } from './../../../modules/home/models/links.const';

/**
 * Interface for receiving information about what to search for
 *
 * @interface searchOptions
 */
interface searchOptions {
  toggleSearch: boolean;
  items: Array<any>;
  colorSearch: string;
}
/**
 * Reutilizable component for searchbars
 *
 * @export
 * @class SearchComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // animations: [
  //   trigger('slide', [
  //     transition(':enter', [useAnimation(slideAnimation, {})]),
  //   ]),
  // ],
})
export class SearchComponent implements OnInit {
  @Input() options: searchOptions = {
    toggleSearch: false,
    items: [],
    colorSearch: 'var(--typsa-primary-color)',
  };
  @Output() itemsEmit = new EventEmitter<any>();
  @Output() searchEmit = new EventEmitter<any>();
  @Output() toggleEmit = new EventEmitter<boolean>();
  @Input() userCreator:string = ""
  filteredOptions = new Observable<any>();
  myControl = new FormControl();
  data: any;
  dataService: any;
  nameInput = new FormControl('', Validators.required);
  busqueda: any;
  constructor(private fileService: FilesService, private registerService: RegisterServiceService) { }

  ngOnInit() {
    let x = this.options.items;

    this.fileService.getFiles({userSession: this.registerService.user.email})
    this.fileService.filesEmitter.subscribe(v => {
this.dataService = v
    })

  }

  getBySearch(event: any) {

    this.data = this.dataService

   if (event.target.value.length)
this.data = this.data.filter((v: any) => v.file.toLowerCase().includes(event.target.value.toLowerCase()))
else
this.data = []


  }

  goToPath(path:string){
let location = "https://dlab.typsa.net/plataforma-montenegro/?path="

const reference = document.createElement("a")
reference.href = location + path;

reference.click()

  }

  /**
   * displayFn will be used to decide how we display
   * the mat-options for the autocomplete dialog.
   *
   * @param {*} element
   * @return {*}  {string}
   * @memberof SearchComponent
   */
  displayFn(element: any): string {
    return element && element.id ? element.id : '';
  }

  /**
   * This is the filter function. We have an EventEmitter<> for
   * external components and a return for internal autocomplete options dialog
   *
   * @private
   * @param {string} id
   * @return {*}  {(BussinessDevServices[] | Library[])}
   * @memberof SearchComponent
   */
  private _filter(id: string) {
    const filterValue = id.toLowerCase();
    let result = this.isIncluded(filterValue);
    this.searchEmit.emit(result);
    this.itemsEmit.emit(result);

    let idFilter = this.options.items.filter((option) => {
      return option.id.toLowerCase().includes(filterValue);
    });

    this.options.items.filter((option) => {
      let isIncluded: boolean;
      return option.links?.filter((optionFiltered: any) => {
        // this.translator.get(optionFiltered.title).subscribe((value: string) => {
        //   isIncluded = this.normalizeWord(value)
        //     .toLowerCase()
        //     .includes(filterValue);
        if (!idFilter.includes(option) && isIncluded) {
          idFilter.push({
            title: optionFiltered.title,
            url: optionFiltered.url,
            id: option.id,
          });
        }
      });
    });
  }

  // this.searchEmit.emit(idFilter);

  // return idFilter;

  normalizeWord(word: string) {
    let normalize = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalize;
  }

  private isIncluded(filterValue: string) {
    let isIncluded: boolean;
    // return this.options.items.filter((option: { id: string }) => {
    //   this.translator.get(option.id).subscribe((value: string) => {
    //     isIncluded = value.toLowerCase().includes(filterValue);
    //   });
    //   return isIncluded;
  }

  closeSearch(): void {
    this.toggleEmit.emit(false);
    this.myControl.reset();
  }
}
