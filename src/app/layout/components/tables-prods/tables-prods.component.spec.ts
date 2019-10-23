import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesProdsComponent } from './tables-prods.component';

describe('TablesProdsComponent', () => {
  let component: TablesProdsComponent;
  let fixture: ComponentFixture<TablesProdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesProdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesProdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
