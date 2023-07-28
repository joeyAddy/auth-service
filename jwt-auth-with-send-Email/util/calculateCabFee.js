function calculateCabFee(distanceInKm, gasPricePerLiter) {
  const baseFare = 150; // Replace with the actual base fare value
  const perKmRate = 100; // Replace with the actual per-kilometer rate value
  const additionalCharges = 50; // Replace with the actual additional charges value

  const totalFee = baseFare + perKmRate * distanceInKm + additionalCharges;

  // Optionally, you can also calculate the operating cost for the cab company based on gas price
  const averageFuelConsumption = 10; // Replace with the actual average fuel consumption per km value (in liters)
  const operatingCost =
    (gasPricePerLiter / 100) * averageFuelConsumption * distanceInKm;

  return {
    totalFee: Math.ceil(totalFee.toFixed(2)),
    operatingCost: Math.ceil(operatingCost.toFixed(2)),
  };
}
