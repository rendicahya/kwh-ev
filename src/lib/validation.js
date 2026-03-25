export function validateShared({ batteryCapacity, chargerPower, currentBattery }) {
  return {
    batteryCapacityError: batteryCapacity <= 0 ? 'Kapasitas harus lebih dari 0 kWh.' : '',
    chargerPowerError: chargerPower <= 0 ? 'Daya charger harus lebih dari 0 kW.' : '',
    currentBatteryError: currentBattery < 0 || currentBattery > 100 ? 'Baterai saat ini harus antara 0–100%.' : '',
  };
}

export function validateTarget({ targetBattery, currentBattery }) {
  if (targetBattery < 0 || targetBattery > 100) return 'Target baterai harus antara 0–100%.';
  if (targetBattery <= currentBattery) return 'Target harus lebih besar dari baterai saat ini.';
  return '';
}

export function validateTime({ availableHours, availableMinutes }) {
  return {
    availableHoursError: availableHours < 0 ? 'Jam tidak boleh negatif.' : '',
    availableMinutesError: availableMinutes < 0 || availableMinutes > 59 ? 'Menit harus antara 0–59.' : '',
    timeError: availableHours <= 0 && availableMinutes <= 0 ? 'Masukkan waktu yang tersedia.' : '',
  };
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function validateBudget({ budget }) {
  if (budget <= 0) return 'Biaya harus lebih dari Rp0.';
  return '';
}