import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export interface iconRegistryItem {
  iconPath: string;
  iconName: string;
}

const iconsToRegist: iconRegistryItem[] = [
  { iconPath: 'assets/icons/pdf.svg', iconName: 'pdf_icon' },
  { iconPath: 'assets//icons/excel.svg', iconName: 'excel_icon' },
  { iconPath: 'assets/icons/word.svg', iconName: 'word_icon' },

];

/**
 *
 *
 * @export
 * @param {MatIconRegistry} IconRegistry
 * @param {DomSanitizer} sanitizer
 */
export function iconRegistry(
  IconRegistry: MatIconRegistry,
  sanitizer: DomSanitizer
) {
  iconsToRegist.forEach((iconToRegist) => {
    IconRegistry.addSvgIcon(
      iconToRegist.iconName,
      sanitizer.bypassSecurityTrustResourceUrl(iconToRegist.iconPath)
    );
  });
}
