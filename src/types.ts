export type NavScreen = 
  | 'command-center'
  | 'scenario-lab'
  | 'alerts-audit'
  | 'bottleneck-intel'
  | 'seasonal-forecast'
  | 'digital-twin';

export type StatusTier = 'critical' | 'warning' | 'watch' | 'ok';

export interface AuditRecord {
  id: string;
  time: string;
  alert: string;
  decision: 'Approved' | 'Dismissed' | 'Pending';
  decidedBy: string;
  role: string;
  note: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  tier: StatusTier;
  expectedBreach: string;
  timeTarget: string;
  impactOrQueue: string;
  confidence: number;
  drivers: {
    label: string;
    weight: number;
  }[];
  suggestedAction: string;
  actionImpact: string;
  status: 'pending' | 'approved' | 'dismissed';
}

export interface DepartmentBottleneck {
  id: string;
  name: string;
  shortName: string;
  tier: StatusTier;
  riskProbability: number;
  breachWindow: string;
  occupied: number;
  capacity: number;
  queueText: string;
  constrainingResource: string;
  modelConfidence: number;
  description: string;
  factors: {
    label: string;
    icon: string;
    weight: number;
    isBuffer?: boolean;
  }[];
}

export interface FacilityNode {
  id: string;
  floor: string;
  name: string;
  shortName: string;
  tier: StatusTier;
  utilizationPct: number;
  capacityText: string;
  queueText: string;
  icon: string;
  bedsOccupied: number;
  bedsTotal: number;
  bedsFree: number;
  bedBreakdown: {
    label: string;
    count: string | number;
    highlight?: boolean;
  }[];
  staff: {
    shift: string;
    rns: number;
    physicians: number;
    techs: number;
    ratio: string;
    targetRatio: string;
  };
  equipment: {
    ventilatorsOnline: number;
    ventilatorsTotal: number;
    ventilatorsStandby: number;
    ecmoOnline: number;
  };
}

export interface SimulationParams {
  edInflowHourly: number; // default 19
  nurseStaffing: number; // default 120
  dischargeRate: number; // default 4.2
  offlineEquipment: number; // default 2
}

export interface SimulationOutcome {
  unmitigated: {
    peakBedDeficit: number;
    capacityPct: number;
    divertTime: string;
    edBoardingHours: number;
    divertedAmbulances: number;
  };
  recommended: {
    peakBedDeficit: number;
    capacityPct: number;
    tactic: string;
    edBoardingHours: number;
    divertedAmbulances: number;
  };
  propagationRate: number;
  cascadeCrest: string;
  confidence: number;
}
