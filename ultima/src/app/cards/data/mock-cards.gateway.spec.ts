import { MockCardsGateway } from './mock-cards.gateway';
import { MOCK_CARDS } from './mock-cards.data';

describe('MockCardsGateway', () => {
  const gateway = new MockCardsGateway();

  it('given the mock data, when listing, then emits all cards', (done) => {
    gateway.list().subscribe((cards) => {
      expect(cards.length).toBe(MOCK_CARDS.length);
      done();
    });
  });

  it('given a mutation of the emitted list, when listing again, then source data is unchanged', (done) => {
    gateway.list().subscribe((cards) => {
      cards[0].alias = 'mutado';
      gateway.list().subscribe((again) => {
        expect(again[0].alias).toBe(MOCK_CARDS[0].alias);
        done();
      });
    });
  });

  it('given an existing id, when getById, then emits that card', (done) => {
    gateway.getById('c-001').subscribe((card) => {
      expect(card?.id).toBe('c-001');
      done();
    });
  });

  it('given an unknown id, when getById, then emits null', (done) => {
    gateway.getById('no-existe').subscribe((card) => {
      expect(card).toBeNull();
      done();
    });
  });
});
