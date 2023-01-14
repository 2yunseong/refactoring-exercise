const invoice = require('./data/invoice');
const plays = require('./data/plays');

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
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
      throw new Error(`알수 없는 장르 : ${playFor(aPerformance).type}`);
  }

  return result;
}

function playFor(perf) {
  return plays[perf.playID];
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function volumeCreditsFor(perf) {
  let result = 0; // 포인트
  result += Math.max(perf.audience - 30, 0);
  if ('comedy' === playFor(perf).type) result += Math.floor(perf.audience / 5);
  return result;
}

function totalVolumeCredits() {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }
  return volumeCredits;
}

function totalAmount() {
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf, playFor(perf));
  }
  return result;
}

function statement(invoice) {
  const statementData = {};
  statementData.customer = invoice.customer;

  let result = renderPlainText(statementData, invoice);
  return result;
}

function renderPlainText(data, invoice) {
  let result = `청구내역: (고객명: ${data.customer})\n`;

  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf, playFor(perf)))} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
}

exports.statement = statement;
exports.amountFor = amountFor;
exports.playFor = playFor;
exports.usd = usd;
exports.volumeCreditsFor = volumeCreditsFor;
exports.totalVolumeCredits = totalVolumeCredits;
exports.totalAmount = totalAmount;
