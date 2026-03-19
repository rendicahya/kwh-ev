export function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 2,
  }).format(val);
}

export function calcTarget({ batteryCapacity, currentBattery, targetBattery, chargerPower, tariffPerKwh, PBJT_TL }) {
  const energyNeeded = Math.max(0, ((targetBattery - currentBattery) / 100) * batteryCapacity);
  const chargingTime = chargerPower > 0 ? energyNeeded / chargerPower : 0;
  const chargingHours = Math.floor(chargingTime);
  const chargingMinutes = Math.round((chargingTime - chargingHours) * 60);
  const energyCost = energyNeeded * tariffPerKwh;
  const totalCost = energyCost + PBJT_TL;
  return { energyNeeded, chargingHours, chargingMinutes, energyCost, totalCost };
}

export function calcTime({ batteryCapacity, currentBattery, chargerPower, availableHours, availableMinutes, tariffPerKwh, PBJT_TL }) {
  const availableTimeHours = availableHours + availableMinutes / 60;
  const energyFromTime = Math.min(chargerPower * availableTimeHours, batteryCapacity * (1 - currentBattery / 100));
  const batteryGained = batteryCapacity > 0 ? (energyFromTime / batteryCapacity) * 100 : 0;
  const finalBattery = Math.min(100, currentBattery + batteryGained);
  const energyCost = energyFromTime * tariffPerKwh;
  const totalCost = energyCost + PBJT_TL;
  return { energyFromTime, batteryGained, finalBattery, energyCost, totalCost };
}