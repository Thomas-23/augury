import {
  Component,
  NgZone,
  EventEmitter,
  Output,
  ElementRef,
  Input
} from '@angular/core';

import {UserActions} from '../../actions/user-actions/user-actions';
import {ComponentDataStore}
  from '../../stores/component-data/component-data-store';

@Component({
  selector: 'augury-header',
  templateUrl: 'src/frontend/components/header/header.html',
  host: {
    '(document:click)': 'resetIfSettingOpened($event)'
  }
})
export class Header {

  @Input() searchDisabled: boolean;
  @Input() theme: string;
  private searchIndex: number = 0;
  private totalSearchCount: number = 0;
  private query: string = '';
  private settingOpened: boolean = false;
  private elementRef;

  @Output() newTheme: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private userActions: UserActions,
    private componentDataStore: ComponentDataStore,
    private _ngZone: NgZone,
    elementRef: ElementRef
  ) {

    this.elementRef = elementRef;

    this.componentDataStore.dataStream
      .subscribe((data: any) => {
        this.totalSearchCount = data.totalSearchCount;
      });

  }

  ngOnChanges() {
    if (this.searchDisabled) {
      this.query = '';
    }
  }

  resetTheme() {
    this.settingOpened = false;
  }

  resetIfSettingOpened(event) {
    let clickedComponent = event.target;
    if (!clickedComponent) {
      return;
    }
    let menuElement = this.elementRef.nativeElement
      .querySelector('#augury-theme-menu');
    let menuButtonElement = this.elementRef.nativeElement
      .querySelector('#augury-theme-menu-button');

    // If click was not inside menu button or menu, close the menu.
    let inside = (menuElement && menuElement.contains(clickedComponent)) ||
      (menuButtonElement && menuButtonElement.contains(clickedComponent));

    if (!inside) {
      this.resetTheme();
    }
  }

  openSettings() {
    this.settingOpened = !this.settingOpened;
  }

  themeChange(theme, selected) {
    if (selected) {
      this.theme = theme;
      this.newTheme.emit(this.theme);
    }
    this.resetTheme();
  }

  /**
   * Query for a node
   * @param  {String} query
   */
  onKey(event, isNext) {

    if (this.query.length === 0) {
      return;
    }

    if (isNext === undefined && event.keyCode === 13) {
      this.searchIndex++;
    } else if (isNext === undefined) {
      this.searchIndex = 0;
    } else if (isNext) {
      this.searchIndex++;
    } else if (!isNext) {
      this.searchIndex--;
    }

    // cycle over the search results if reached at the end
    if (this.searchIndex === this.totalSearchCount) {
      this.searchIndex = 0;
    } else if (this.searchIndex < 0) {
      this.searchIndex = this.totalSearchCount - 1;
    }

    this.query = this.query.toLocaleLowerCase();

    this.userActions.searchNode({ query: this.query, index: this.searchIndex });
    this._ngZone.run(() => undefined);
  }

}
