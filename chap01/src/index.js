const invoice = require('./data/invoice');
const plays = require('./data/plays');

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function totalVolumeCredits(data) {
  let volumeCredits = 0;
  for (let perf of data.performances) {
    volumeCredits += perf.volumeCredits;
  }
  return volumeCredits;
}

function totalAmount(data) {
  let result = 0;
  for (let perf of data.performances) {
    result += perf.amount;
  }
  return result;
}

function statement(invoice) {
  return renderPlainText(createStatementData(invoice, plays));
}

function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
}

function enrichPerformance(aPerformance) {
  const result = { ...aPerformance };
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);
  return result;
}

function amountFor(aPerformance) {
  let result = 0;
  switch (aPerformance.play.type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알수 없는 장르 : ${aPerformance.play.type}`);
  }

  return result;
}

function playFor(perf) {
  return plays[perf.playID];
}

function volumeCreditsFor(perf) {
  let result = 0; // 포인트
  result += Math.max(perf.audience - 30, 0);
  if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 5);
  return result;
}

function renderPlainText(data) {
  let result = `청구내역: (고객명: ${data.customer})\n`;

  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}

exports.statement = statement;
exports.amountFor = amountFor;
exports.playFor = playFor;
exports.usd = usd;
exports.volumeCreditsFor = volumeCreditsFor;
exports.totalVolumeCredits = totalVolumeCredits;
exports.totalAmount = totalAmount;
exports.createStatementData = createStatementData;
