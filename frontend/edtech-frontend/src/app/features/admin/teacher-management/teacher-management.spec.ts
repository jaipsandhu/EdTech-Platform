import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherManagement } from './teacher-management';

describe('TeacherManagement', () => {
  let component: TeacherManagement;
  let fixture: ComponentFixture<TeacherManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
