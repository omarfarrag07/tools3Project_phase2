import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedOrdersCourierComponent } from './assigned-orders-courier.component';

describe('AssignedOrdersCourierComponent', () => {
  let component: AssignedOrdersCourierComponent;
  let fixture: ComponentFixture<AssignedOrdersCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedOrdersCourierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedOrdersCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
