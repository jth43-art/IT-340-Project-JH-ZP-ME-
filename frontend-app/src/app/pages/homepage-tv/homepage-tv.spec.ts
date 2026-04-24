import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageTv } from './homepage-tv';

describe('HomepageTv', () => {
  let component: HomepageTv;
  let fixture: ComponentFixture<HomepageTv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageTv],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageTv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
