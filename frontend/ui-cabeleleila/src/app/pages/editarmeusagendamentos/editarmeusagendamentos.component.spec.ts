import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarmeusagendamentosComponent } from './editarmeusagendamentos.component';

describe('EditarmeusagendamentosComponent', () => {
  let component: EditarmeusagendamentosComponent;
  let fixture: ComponentFixture<EditarmeusagendamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarmeusagendamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarmeusagendamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
