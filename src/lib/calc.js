export function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 2,
  }).format(val);
}

export function calcTarget({ batteryCapacity, currentBattery, targetBattery, chargerPower, tariffPerKwh, pbjt_rate, efficiency = 0.90 }) {
  const energyNeeded = Math.max(0, ((targetBattery - currentBattery) / 100) * batteryCapacity);
  const energyFromGrid = energyNeeded / efficiency; // energi dari PLN lebih besar karena losses
  const chargingTime = chargerPower > 0 ? energyFromGrid / chargerPower : 0;
  const chargingHours = Math.floor(chargingTime);
  const chargingMinutes = Math.round((chargingTime - chargingHours) * 60);
  const energyCost = energyFromGrid * tariffPerKwh;
  const pbjt = energyCost * pbjt_rate;
  const totalCost = energyCost + pbjt;
  return { energyNeeded, energyFromGrid, chargingHours, chargingMinutes, energyCost, pbjt, totalCost };
}

export function calcTime({ batteryCapacity, currentBattery, chargerPower, availableHours, availableMinutes, tariffPerKwh, pbjt_rate, efficiency = 0.90 }) {
  const availableTimeHours = availableHours + availableMinutes / 60;
  const maxEnergy = batteryCapacity * (1 - currentBattery / 100);

  // Energi yang masuk ke baterai = daya charger × waktu × efisiensi
  const energyFromGrid = chargerPower * availableTimeHours;
  const energyToBattery = Math.min(energyFromGrid * efficiency, maxEnergy);

  const batteryGained = batteryCapacity > 0 ? (energyToBattery / batteryCapacity) * 100 : 0;
  const finalBattery = Math.min(100, currentBattery + batteryGained);

  // Waktu aktual berdasarkan energi ke baterai yang dibutuhkan
  const actualEnergyFromGrid = Math.min(energyFromGrid, maxEnergy / efficiency);
  const actualTimeHours = chargerPower > 0 ? actualEnergyFromGrid / chargerPower : 0;
  const actualHours = Math.floor(actualTimeHours);
  const actualMinutes = Math.round((actualTimeHours - actualHours) * 60);

  const energyCost = actualEnergyFromGrid * tariffPerKwh;
  const pbjt = energyCost * pbjt_rate;
  const totalCost = energyCost + pbjt;

  return { energyToBattery, energyFromGrid: actualEnergyFromGrid, batteryGained, finalBattery, actualHours, actualMinutes, energyCost, pbjt, totalCost };
}

export function calcBudget({ budget, tariffPerKwh, chargerPower, batteryCapacity, currentBattery, pbjt_rate, efficiency = 0.90 }) {
  const maxEnergyToBattery = batteryCapacity * (1 - currentBattery / 100);
  // Energi ke baterai dari anggaran, setelah PBJT-TL dan efisiensi
  const rawEnergyFromGrid = budget / (tariffPerKwh * (1 + pbjt_rate));
  const rawEnergyToBattery = rawEnergyFromGrid * efficiency;
  const energyToBattery = Math.floor(Math.min(rawEnergyToBattery, maxEnergyToBattery));
  if (energyToBattery <= 0) return null;
  const energyFromGrid = energyToBattery / efficiency;
  const chargingTime = chargerPower > 0 ? energyFromGrid / chargerPower : 0;
  const chargingHours = Math.floor(chargingTime);
  const chargingMinutes = Math.round((chargingTime - chargingHours) * 60);
  const batteryGained = batteryCapacity > 0 ? (energyToBattery / batteryCapacity) * 100 : 0;
  const finalBattery = Math.min(100, currentBattery + batteryGained);
  const energyCost = energyFromGrid * tariffPerKwh;
  const pbjt = energyCost * pbjt_rate;
  const actualCost = energyCost + pbjt;
  return { energyToBattery, energyFromGrid, chargingHours, chargingMinutes, batteryGained, finalBattery, energyCost, pbjt, actualCost };
}

export function calcRange(fullRange, batteryPercent) {
  return Math.round(fullRange * batteryPercent / 100);
}