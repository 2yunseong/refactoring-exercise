const { statement, amountFor, playFor } = require('../src/index');
const invoice = require('../src/data/invoice');
const plays = require('../src/data/plays');

describe('Chap01: Integrate Test', () => {
  test('statement test', () => {
    expect(statement(invoice, plays)).toEqual(
      `청구내역: (고객명: yunseong)\nhamlet: $650.00 (55석)\nAs you like it: $580.00 (35석)\nOthello: $550.00 (45석)\n총액: $1,780.00\n적립 포인트: 52점\n`
    );
  });
});

describe('Chap01: Unit Test', () => {
  test('amountFor: 공연비 계산 기능', () => {
    const { performances } = invoice;
    const errorPerf = {
      playID: 'error',
      audience: 40,
    };
    const errorPlay = {
      name: 'error',
      type: 'error',
    };
    expect(amountFor(performances[0], plays[performances[0].playID])).toEqual(
      65000
    );
    expect(amountFor(performances[1], plays[performances[1].playID])).toEqual(
      58000
    );
    expect(() => {
      amountFor(errorPerf, errorPlay);
    }).toThrow('알수 없는 장르');
  });
  test('playFor: 공연의 공연명을 가져오는 질의함수', () => {
    expect(
      playFor({
        playID: 'hamlet',
        audience: 55,
      })
    ).toEqual(plays['hamlet']);
  });
});
