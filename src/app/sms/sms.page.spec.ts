import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsPage } from './sms.page';

describe('SmsPage', () => {
  let component: SmsPage;
  let fixture: ComponentFixture<SmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
