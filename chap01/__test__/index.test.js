const statement = require('../src/index');
const invoice = require('../src/data/invoice');
const plays = require('../src/data/plays');

describe('statement test', () => {
  test('statement test', () => {
    expect(statement(invoice, plays)).toEqual(
      `청구내역: (고객명: yunseong)\nhamlet: $650.00 (55석)\nAs you like it: $580.00 (35석)\nOthello: $550.00 (45석)\n총액: $1,780.00\n적립 포인트: 52점\n`
    );
  });
});
