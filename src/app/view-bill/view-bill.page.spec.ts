import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBillPage } from './view-bill.page';

describe('ViewBillPage', () => {
  let component: ViewBillPage;
  let fixture: ComponentFixture<ViewBillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBillPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
