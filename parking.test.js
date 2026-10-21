js
const { parkingFee } = require('./parking');

describe('parkingFee', () => {
  test('PT-01 0 minutes is free', () => {
    expect(parkingFee(0, 'A')).toBe(0);
  });

  // TODO: PT-02 … PT-12 from the handout, chapter 3 (same cases you ran by hand)
});
