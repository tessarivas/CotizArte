// src/utils/calculateQuote.js
export function calculateDigitalIllustrationQuote(project, pricingProfile) {
  const workCost = project.hoursWorked * pricingProfile.hourlyRate;
  const softwareCost = pricingProfile.softwareCost || 0;
  const extras = (project.additionalModifications || 0) * (pricingProfile.modificationExtra || 0);
  const detailFactor = project.detailLevel * (pricingProfile.detailMultiplier || 0);
  return workCost + softwareCost + extras + detailFactor;
}

export function calculateVideoEditingQuote(project, pricingProfile) {
  const minuteCost = project.duration * pricingProfile.baseRatePerMinute * pricingProfile.complexityFactor;
  const workCost = project.hoursWorked * pricingProfile.hourlyRate;
  const extras = pricingProfile.assetCost || 0;
  return minuteCost + workCost + extras;
}

export function calculatePaintingQuote(project, pricingProfile, materialsCost, toolsCost) {
  const sizeCost = parseFloat(project.size) * pricingProfile.techniqueFactor;
  const workCost = project.hoursWorked * pricingProfile.hourlyRate;
  const toolFactor = toolsCost / pricingProfile.worksPerMonth;
  const extras = (project.shipping ? pricingProfile.shippingFee : 0) +
                 (project.certified ? pricingProfile.certificateFee : 0);
  return sizeCost + workCost + materialsCost + toolFactor + extras;
}

export function calculateDrawingQuote(project, pricingProfile, materialsCost, toolsCost) {
  const sizeCost = parseFloat(project.size) * pricingProfile.techniqueFactor;
  const workCost = project.hoursWorked * pricingProfile.hourlyRate;
  const toolFactor = toolsCost / pricingProfile.worksPerMonth;
  const extras = (project.shipping ? pricingProfile.shippingFee : 0) +
                 (project.certified ? pricingProfile.certificateFee : 0);
  return sizeCost + workCost + materialsCost + toolFactor + extras;
}
