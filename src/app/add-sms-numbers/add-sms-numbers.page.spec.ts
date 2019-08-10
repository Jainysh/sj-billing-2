import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmsNumbersPage } from './add-sms-numbers.page';

describe('AddSmsNumbersPage', () => {
  let component: AddSmsNumbersPage;
  let fixture: ComponentFixture<AddSmsNumbersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSmsNumbersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmsNumbersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
