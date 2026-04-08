const PARAM_KEYS = {
  tab: 'tab',
  location: 'loc',
  batteryCapacity: 'cap',
  currentBattery: 'cur',
  chargerPower: 'pwr',
  targetBattery: 'tgt',
  availableHours: 'hr',
  availableMinutes: 'min',
  budget: 'bdg',
  efficiency: 'eff',
  selectedEV: 'ev',
  selectedCharger: 'charger',
  homeDaya: 'daya',
  tariffPerKwh: 'tariff',
};

export function stateToUrl(state) {
  const params = new URLSearchParams();
  for (const [key, param] of Object.entries(PARAM_KEYS)) {
    if (state[key] !== undefined && state[key] !== null) {
      params.set(param, state[key]);
    }
  }
  const base = window.location.pathname;
  window.history.replaceState({}, '', `${base}?${params.toString()}`);
}

export function urlToState(defaults) {
  const params = new URLSearchParams(window.location.search);
  const state = { ...defaults };
  const reverseKeys = Object.fromEntries(
    Object.entries(PARAM_KEYS).map(([k, v]) => [v, k])
  );
  for (const [param, value] of params.entries()) {
    const key = reverseKeys[param];
    if (!key) continue;
    // Parse angka
    if (['batteryCapacity', 'currentBattery', 'chargerPower', 'targetBattery',
         'availableHours', 'availableMinutes', 'budget', 'efficiency'].includes(key)) {
      state[key] = parseFloat(value);
    } else {
      state[key] = value;
    }
  }
  return state;
}