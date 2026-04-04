export function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 2,
  }).format(val);
}

export function calcTarget({ batteryCapacity, currentBattery, targetBattery, chargerPower, tariffPerKwh, pbjt_rate }) {
  const energyNeeded = Math.max(0, ((targetBattery - currentBattery) / 100) * batteryCapacity);
  const chargingTime = chargerPower > 0 ? energyNeeded / chargerPower : 0;
  const chargingHours = Math.floor(chargingTime);
  const chargingMinutes = Math.round((chargingTime - chargingHours) * 60);
  const energyCost = energyNeeded * tariffPerKwh;
  const pbjt = energyCost * pbjt_rate;
  const totalCost = energyCost + pbjt;
  return { energyNeeded, chargingHours, chargingMinutes, energyCost, pbjt, totalCost };
}

export function calcTime({ batteryCapacity, currentBattery, chargerPower, availableHours, availableMinutes, tariffPerKwh, pbjt_rate }) {
  const availableTimeHours = availableHours + availableMinutes / 60;
  const maxEnergy = batteryCapacity * (1 - currentBattery / 100);
  const energyFromTime = Math.min(chargerPower * availableTimeHours, maxEnergy);
  const batteryGained = batteryCapacity > 0 ? (energyFromTime / batteryCapacity) * 100 : 0;
  const finalBattery = Math.min(100, currentBattery + batteryGained);
  const actualTimeHours = chargerPower > 0 ? energyFromTime / chargerPower : 0;
  const actualHours = Math.floor(actualTimeHours);
  const actualMinutes = Math.round((actualTimeHours - actualHours) * 60);
  const energyCost = energyFromTime * tariffPerKwh;
  const pbjt = energyCost * pbjt_rate;
  const totalCost = energyCost + pbjt;
  return { energyFromTime, batteryGained, finalBattery, actualHours, actualMinutes, energyCost, pbjt, totalCost };
}

export function calcBudget({ budget, tariffPerKwh, chargerPower, batteryCapacity, currentBattery, pbjt_rate }) {
  // Total = energyCost + pbjt = energyCost * (1 + pbjt_rate)
  const maxEnergy = batteryCapacity * (1 - currentBattery / 100);
  const rawEnergy = budget / (tariffPerKwh * (1 + pbjt_rate));
  const energyFromBudget = Math.floor(Math.min(rawEnergy, maxEnergy));
  if (energyFromBudget <= 0) return null;
  const chargingTime = chargerPower > 0 ? energyFromBudget / chargerPower : 0;
  const chargingHours = Math.floor(chargingTime);
  const chargingMinutes = Math.round((chargingTime - chargingHours) * 60);
  const batteryGained = batteryCapacity > 0 ? (energyFromBudget / batteryCapacity) * 100 : 0;
  const finalBattery = Math.min(100, currentBattery + batteryGained);
  const energyCost = energyFromBudget * tariffPerKwh;
  const pbjt = energyCost * pbjt_rate;
  const actualCost = energyCost + pbjt;
  return { energyFromBudget, chargingHours, chargingMinutes, batteryGained, finalBattery, energyCost, pbjt, actualCost };
}

export function calcRange(fullRange, batteryPercent) {
  return Math.round(fullRange * batteryPercent / 100);
}