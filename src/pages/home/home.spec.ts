import { HomePage } from './home';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, NavController } from 'ionic-angular';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { TransactionProviderMock } from '../../../test-config/mocks-ionic';

describe('HomePage', () => {
  let comp: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(HomePage)
      ],
      providers: [
        NavController,
        { provide: TransactionProvider, useClass: TransactionProviderMock },
        // TransactionProvider,
        AlertController
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    comp = fixture.componentInstance;
  });

  it('should create component', () => expect(comp).toBeDefined());
});
