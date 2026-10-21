// Parking fee calculator for a city car park.
//
// Rules (what the function SHOULD do):
//   parkingFee(minutes, zone, options)
//   - minutes: whole minutes parked, must be a number >= 0, otherwise a TypeError is thrown
//   - first 15 minutes are free (0–15 min → 0 €)
//   - after that every started hour of the WHOLE stay is charged: zone 'A' 2.00 €/h, zone 'B' 1.00 €/h
//     (16–60 min = 1 hour, 61–120 min = 2 hours, …)
//   - unknown zone → TypeError
//   - daily maximum: 12.00 € in zone A, 6.00 € in zone B – a day never costs more than that
//   - options.resident === true → 50 % off the final price (after the daily maximum)
//   - result is rounded to 2 decimals
//
// NOTE: this file contains TWO intentional bugs. Your tests should find them.

const RATE = { A: 2.0, B: 1.0 };
const DAILY_MAX = { A: 12.0, B: 6.0 };
const FREE_MINUTES = 15;

function parkingFee(minutes, zone, options = {}) {
  if (typeof minutes !== 'number' || Number.isNaN(minutes) || minutes < 0) {
    throw new TypeError('minutes must be a number >= 0');
  }
  if (!RATE[zone]) {
    throw new TypeError('unknown zone');
  }
  if (minutes <= FREE_MINUTES) {
    return 0;
  }
  const hours = Math.ceil((minutes - FREE_MINUTES) / 60);   
  let fee = hours * RATE[zone];
  if (options.resident) {                                   
    fee = fee * 0.5;
  }
  if (fee > DAILY_MAX[zone]) {
    fee = DAILY_MAX[zone];
  }
  return Math.round(fee * 100) / 100;
}

module.exports = { parkingFee };
