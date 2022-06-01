import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form2pdfComponent } from './form2pdf.component';

describe('Form2pdfComponent', () => {
  let component: Form2pdfComponent;
  let fixture: ComponentFixture<Form2pdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form2pdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Form2pdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
