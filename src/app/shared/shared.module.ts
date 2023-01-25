import { SearchComponent } from './components/search/search.component';
import { components } from './components/index';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import {Button, ButtonModule} from 'primeng/button';
import {ImageModule} from 'primeng/image';
import {AccordionModule} from 'primeng/accordion';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, CardModule, ButtonModule, ImageModule, AccordionModule, RouterModule ],
  exports: [MaterialModule, components],
  declarations: [SharedComponent, components],
})
export class SharedModule {}
