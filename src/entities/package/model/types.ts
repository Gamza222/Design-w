export type MainPackageId = 'planning' | 'drawings' | 'collages' | 'planViz' | 'full';
export type PackageId = MainPackageId | 'electric';
export type AddonId = 'viz3d' | 'supervision' | 'procurement' | 'consultation';
export type TariffId = PackageId | AddonId;

export interface Package {
  id: MainPackageId;
  popular?: boolean;
}

export interface TariffDefinition {
  id: TariffId;
  kind: 'perM2' | 'monthly' | 'quoted';
  rates: { RUB: number; BYN: number } | null;
  from: boolean;
  featureKeys: readonly string[];
  summaryKeys: readonly string[];
  exclusionKeys: readonly string[];
  includedAddonIds: readonly AddonId[];
}
