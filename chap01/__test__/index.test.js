const {
  statement,
  amountFor,
  playFor,
  volumeCreditsFor,
  usd,
  totalVolumeCredits,
} = require('../src/index');
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

    expect(amountFor(performances[0])).toEqual(65000);
    expect(amountFor(performances[1])).toEqual(58000);
  });
  test('playFor: 공연의 공연명을 가져오는 질의함수', () => {
    expect(
      playFor({
        playID: 'hamlet',
        audience: 55,
      })
    ).toEqual(plays['hamlet']);
  });

  test('volumesCreditsFor: 적립 포인트 계산 기능', () => {
    const answerSheet = [25, 12, 15];

    invoice.performances.forEach((perf, index) => {
      expect(volumeCreditsFor(perf)).toEqual(answerSheet[index]);
    });
  });

  test('usd: 달러 포맷 출력 기능', () => {
    const tests = [10000, 1000, 100, 102, 1034];
    const answers = ['$100.00', '$10.00', '$1.00', '$1.02', '$10.34'];

    tests.forEach((target, index) => {
      expect(usd(target)).toEqual(answers[index]);
    });
  });

  test('totalVolumeCredits: 보너스 총합 계산', () => {
    expect(totalVolumeCredits()).toEqual(52);
  });
});
