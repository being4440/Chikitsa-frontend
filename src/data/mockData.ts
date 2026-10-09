import { AuditRecord, RiskAlert, DepartmentBottleneck, FacilityNode } from '../types';

export const INITIAL_AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'rec-1',
    time: '13:45 Today',
    alert: 'ED Surge Warning Tier 2',
    decision: 'Approved',
    decidedBy: 'Dr. Sarah Lin',
    role: 'Operations Director',
    note: 'Fast-track triage clinic activated in Annex B; 8 patients reassigned.'
  },
  {
    id: 'rec-2',
    time: '11:15 Today',
    alert: 'CT Scanner 2 Cooling Warning',
    decision: 'Approved',
    decidedBy: 'Marcus Vance, RN',
    role: 'Charge Nurse',
    note: 'Biomedical engineering dispatched; preventative calibration completed.'
  },
  {
    id: 'rec-3',
    time: '08:30 Today',
    alert: 'Pediatric Bed Surge Pre-Alert',
    decision: 'Dismissed',
    decidedBy: 'Dr. Robert Chen',
    role: 'Chief Medical Officer',
    note: 'False alarm caused by batch EHR discharge delay; census re-verified.'
  },
  {
    id: 'rec-4',
    time: 'Yesterday 21:04',
    alert: 'Telemetry Bed Shortage',
    decision: 'Approved',
    decidedBy: 'Dr. Sarah Lin',
    role: 'Operations Director',
    note: 'Discharge lounge utilized for 4 morning discharge candidates.'
  }
];

export const INITIAL_RISK_ALERTS: RiskAlert[] = [
  {
    id: 'alert-icu-deficit',
    title: 'ICU Bed Deficit Projected',
    tier: 'critical',
    expectedBreach: 'in ~3 h 40 min',
    timeTarget: '18:12 today',
    impactOrQueue: 'Confidence: 94% · Impact: Acute Trauma & Post-Op',
    confidence: 94,
    drivers: [
      { label: 'Incoming emergency trauma transfers (+4 patients)', weight: 48 },
      { label: 'Delayed step-down transfers to General Ward (3 patients cleared)', weight: 34 },
      { label: 'Late post-op discharge orders pending physician sign-off', weight: 18 }
    ],
    suggestedAction: 'Initiate Surge Protocol 4A: Authorize transfer of 3 stable ICU patients to Step-Down telemetry ward and summon 2 standby float nurses for 16:00 shift.',
    actionImpact: 'Prevents capacity breach; restores bed safety margin to +4 beds through 23:00.',
    status: 'pending'
  },
  {
    id: 'alert-ed-congestion',
    title: 'Emergency Dept Boarding Congestion',
    tier: 'warning',
    expectedBreach: 'in ~5 h 15 min',
    timeTarget: '19:45 today',
    impactOrQueue: '12 patients waiting for acute bed allocation',
    confidence: 88,
    drivers: [
      { label: 'Inbound ambulance influx (high respiratory complaints)', weight: 52 },
      { label: 'Lab turnaround delays for cardiac troponin testing', weight: 29 },
      { label: 'Shortage of dedicated fast-track triage chairs', weight: 19 }
    ],
    suggestedAction: 'Open rapid observation unit beds (Wing 3) and re-route ESI level 4/5 cases to urgent walk-in annex.',
    actionImpact: 'Reduces ED boarding lag by 2.4 hours and protects critical resuscitation bays.',
    status: 'pending'
  },
  {
    id: 'alert-pacu-lag',
    title: 'Post-Op PACU Holding Queue Lag',
    tier: 'watch',
    expectedBreach: 'in ~8 h 30 min',
    timeTarget: '23:00 today',
    impactOrQueue: 'Surgical recovery occupancy at 72%',
    confidence: 82,
    drivers: [
      { label: 'Scheduled afternoon orthopedics batch release overlap', weight: 45 },
      { label: 'Pending transport porter dispatch for floor transitions', weight: 35 },
      { label: 'Bed cleaning sanitation turnaround backlog', weight: 20 }
    ],
    suggestedAction: 'Deploy mobile transit liaison and prioritize terminal cleaning for 4 orthopedics beds.',
    actionImpact: 'Prevents PACU gridlock and avoids downstream OR schedule holds.',
    status: 'pending'
  }
];

export const DEPARTMENT_BOTTLENECKS: DepartmentBottleneck[] = [
  {
    id: 'icu',
    name: 'Intensive Care Unit (ICU)',
    shortName: 'Intensive Care',
    tier: 'critical',
    riskProbability: 82,
    breachWindow: '~3 h 40 min (18:12 Today)',
    occupied: 19,
    capacity: 20,
    queueText: 'ICU net bed deficit predicted to reach -3 beds if current admission tempo and discharge delays persist.',
    constrainingResource: 'Level 3 Critical Care Beds',
    modelConfidence: 94.2,
    description: 'High Probability · Urgent Intervention Required',
    factors: [
      { label: 'ED Inflow Acceleration (+2.8 acute patients/hr above mean)', icon: 'trending_up', weight: 34 },
      { label: 'Delayed Step-Down Bed Acceptance in Medical Wards', icon: 'hourglass_bottom', weight: 26 },
      { label: 'Scheduled Post-Surgical Recovery Transfers', icon: 'medical_services', weight: 18 },
      { label: 'Discharge Lounge Buffer (Patients awaiting afternoon pickup)', icon: 'meeting_room', weight: 12, isBuffer: true },
      { label: 'Float Staff Redeployment Available in Wing B', icon: 'group_add', weight: 8, isBuffer: true }
    ]
  },
  {
    id: 'ed',
    name: 'Emergency Department (ED)',
    shortName: 'Emergency Dept',
    tier: 'warning',
    riskProbability: 74,
    breachWindow: '~5 h 15 min (19:45 Today)',
    occupied: 42,
    capacity: 50,
    queueText: '38 patients in triage queue; arrival rate +35% above regional historical baseline.',
    constrainingResource: 'Specialized Triage Nursing',
    modelConfidence: 91.8,
    description: 'Elevated Risk · Boarding Delays Accumulating',
    factors: [
      { label: 'EMS Inbound Surge (Respiratory & Acute Trauma)', icon: 'local_shipping', weight: 38 },
      { label: 'Lab Diagnostics Wait Time (Troponin & Blood Gas)', icon: 'biotech', weight: 28 },
      { label: 'Inpatient Bed Allocation Hand-off Lag', icon: 'sync_problem', weight: 20 },
      { label: 'Annex Fast-Track Secondary Screening Pods', icon: 'check_circle', weight: 14, isBuffer: true },
      { label: 'On-Call Float Attending Physician Standby', icon: 'person', weight: 9, isBuffer: true }
    ]
  },
  {
    id: 'radiology',
    name: 'Radiology / Imaging',
    shortName: 'Radiology / Imaging',
    tier: 'warning',
    riskProbability: 69,
    breachWindow: '~6 h 00 min (20:30 Today)',
    occupied: 7,
    capacity: 9,
    queueText: '11 emergency CT scans queued with Scanner 2 operating in scheduled maintenance cooling mode.',
    constrainingResource: 'CT Diagnostic Turnaround',
    modelConfidence: 88.5,
    description: 'Moderate Risk · Diagnostic Latency Bottleneck',
    factors: [
      { label: 'CT Scanner 2 Scheduled Calibration Maintenance', icon: 'build', weight: 36 },
      { label: 'Trauma Angiography Priority Pre-Emptions', icon: 'emergency', weight: 31 },
      { label: 'Teleradiology Remote Over-Read Queue Delay', icon: 'schedule', weight: 19 },
      { label: 'MRI Contrast Prep Station Dedicated Buffer', icon: 'shield', weight: 15, isBuffer: true },
      { label: 'Night Shift Diagnostic Resident Check-In', icon: 'group', weight: 8, isBuffer: true }
    ]
  },
  {
    id: 'surgical',
    name: 'Acute Surgical Wing',
    shortName: 'Acute Surgical Wing',
    tier: 'watch',
    riskProbability: 58,
    breachWindow: '~8 h 20 min (22:50 Today)',
    occupied: 8,
    capacity: 12,
    queueText: 'Inflow currently tracking scheduled discharges; potential evening PACU dwell delay.',
    constrainingResource: 'PACU Phase 1 Recovery Bays',
    modelConfidence: 86.0,
    description: 'Stable with Monitoring · PACU Flow Watch',
    factors: [
      { label: 'Late Scheduled Orthopedic Joint Reconstructions', icon: 'healing', weight: 32 },
      { label: 'Post-Anesthesia Extubation Hold Time', icon: 'timer', weight: 24 },
      { label: 'Step-Down Transfer Ward Acceptance Queue', icon: 'transfer_within_a_station', weight: 20 },
      { label: 'Dedicated Surgical Step-Down Bed Hold Protocol', icon: 'verified', weight: 16, isBuffer: true },
      { label: 'Extended PACU Evening Nurse Float Coverage', icon: 'support_agent', weight: 11, isBuffer: true }
    ]
  },
  {
    id: 'general',
    name: 'General Medical Ward',
    shortName: 'General Medical Ward',
    tier: 'ok',
    riskProbability: 32,
    breachWindow: 'No breach projected (>24h buffer)',
    occupied: 104,
    capacity: 200,
    queueText: 'Optimal buffer status with 22 immediately ready beds and 14 scheduled discharges.',
    constrainingResource: 'Bed Sanitization Turnaround',
    modelConfidence: 95.0,
    description: 'Nominal Operations · Healthy Buffer Margin',
    factors: [
      { label: 'Elective Admissions Scheduled for Tomorrow 08:00', icon: 'event', weight: 22 },
      { label: 'Pharmacy Discharge Medication Verification Pace', icon: 'medication', weight: 18 },
      { label: 'Transport Porter Dispatch Cadence', icon: 'commute', weight: 12 },
      { label: 'Central Discharge Lounge High Turnover Buffer', icon: 'chair', weight: 24, isBuffer: true },
      { label: 'Rapid Bed Turnover Cleaning Team On Site', icon: 'cleaning_services', weight: 21, isBuffer: true }
    ]
  }
];

export const FACILITY_NODES: FacilityNode[] = [
  {
    id: 'icu',
    floor: 'CRITICAL LEVEL 02',
    name: 'Intensive Care Unit (ICU)',
    shortName: 'ICU',
    tier: 'critical',
    utilizationPct: 96.8,
    capacityText: '96.8% Utilization (31/32 beds)',
    queueText: 'Queue: 4 inbound transfers pending',
    icon: 'coronavirus',
    bedsOccupied: 31,
    bedsTotal: 32,
    bedsFree: 1,
    bedBreakdown: [
      { label: 'Adult Acute Medical', count: '24 beds' },
      { label: 'Post-Op Cardiothoracic', count: '7 beds' },
      { label: 'Solitary Isolation', count: '1 remaining', highlight: true }
    ],
    staff: {
      shift: 'Shift: Alpha',
      rns: 16,
      physicians: 3,
      techs: 2,
      ratio: '1.9 : 1',
      targetRatio: 'Target ≤ 2:1'
    },
    equipment: {
      ventilatorsOnline: 28,
      ventilatorsTotal: 30,
      ventilatorsStandby: 2,
      ecmoOnline: 1
    }
  },
  {
    id: 'ed',
    floor: 'GROUND LEVEL 01',
    name: 'Emergency Department (ED)',
    shortName: 'ED',
    tier: 'warning',
    utilizationPct: 84.0,
    capacityText: '84% Utilization (42/50 bays)',
    queueText: 'Queue: 38 patients waiting',
    icon: 'call_missed_outgoing',
    bedsOccupied: 42,
    bedsTotal: 50,
    bedsFree: 8,
    bedBreakdown: [
      { label: 'Resuscitation Bays', count: '4 beds' },
      { label: 'Acute Treatment Pods', count: '28 beds' },
      { label: 'Rapid Assessment Zone', count: '10 beds' }
    ],
    staff: {
      shift: 'Shift: Alpha',
      rns: 24,
      physicians: 6,
      techs: 5,
      ratio: '2.4 : 1',
      targetRatio: 'Target ≤ 2:1'
    },
    equipment: {
      ventilatorsOnline: 8,
      ventilatorsTotal: 10,
      ventilatorsStandby: 2,
      ecmoOnline: 0
    }
  },
  {
    id: 'radiology',
    floor: 'DIAGNOSTIC CORE',
    name: 'Radiology / CT & MRI',
    shortName: 'Radiology',
    tier: 'warning',
    utilizationPct: 77.8,
    capacityText: '78% Utilization (7/9 scanners)',
    queueText: 'Queue: 11 scans scheduled',
    icon: 'document_scanner',
    bedsOccupied: 7,
    bedsTotal: 9,
    bedsFree: 2,
    bedBreakdown: [
      { label: 'Multislice CT Scanners', count: '3 active (1 cooling)' },
      { label: '3T MRI Chambers', count: '2 active' },
      { label: 'Mobile Digital X-Ray', count: '2 active' }
    ],
    staff: {
      shift: 'Shift: Alpha',
      rns: 4,
      physicians: 3,
      techs: 8,
      ratio: 'N/A',
      targetRatio: 'Diagnostics'
    },
    equipment: {
      ventilatorsOnline: 2,
      ventilatorsTotal: 2,
      ventilatorsStandby: 0,
      ecmoOnline: 0
    }
  },
  {
    id: 'surgical',
    floor: 'LEVEL 02 SURGICAL WING',
    name: 'Acute Surgical Pavilion (OR / PACU)',
    shortName: 'OR / PACU',
    tier: 'watch',
    utilizationPct: 68.0,
    capacityText: '68% Utilization (8/12 theatres)',
    queueText: 'Queue: 2 post-op holding',
    icon: 'medical_information',
    bedsOccupied: 8,
    bedsTotal: 12,
    bedsFree: 4,
    bedBreakdown: [
      { label: 'Laminar Flow ORs', count: '6 active' },
      { label: 'PACU Phase 1 Recovery', count: '8 beds' },
      { label: 'Pre-Op Holding Pods', count: '6 bays' }
    ],
    staff: {
      shift: 'Shift: Alpha',
      rns: 18,
      physicians: 8,
      techs: 6,
      ratio: '1.2 : 1',
      targetRatio: 'Target ≤ 1.5:1'
    },
    equipment: {
      ventilatorsOnline: 12,
      ventilatorsTotal: 14,
      ventilatorsStandby: 2,
      ecmoOnline: 1
    }
  },
  {
    id: 'general',
    floor: 'LEVEL 03 & 04 INPATIENT',
    name: 'General Medical Inpatient Ward',
    shortName: 'General Medical',
    tier: 'ok',
    utilizationPct: 52.0,
    capacityText: '52% Utilization (104/200 beds)',
    queueText: 'Queue: 0 backlog (22 beds ready)',
    icon: 'hotel',
    bedsOccupied: 104,
    bedsTotal: 200,
    bedsFree: 96,
    bedBreakdown: [
      { label: 'East Telemetry Wing', count: '48 beds' },
      { label: 'West Acute Medicine', count: '40 beds' },
      { label: 'North Respiratory Pod', count: '16 beds' }
    ],
    staff: {
      shift: 'Shift: Alpha',
      rns: 32,
      physicians: 5,
      techs: 8,
      ratio: '3.8 : 1',
      targetRatio: 'Target ≤ 4:1'
    },
    equipment: {
      ventilatorsOnline: 4,
      ventilatorsTotal: 6,
      ventilatorsStandby: 2,
      ecmoOnline: 0
    }
  },
  {
    id: 'lounge',
    floor: 'EXIT CONCOURSE BUFFER',
    name: 'Central Discharge Lounge',
    shortName: 'Discharge Lounge',
    tier: 'ok',
    utilizationPct: 35.0,
    capacityText: '35% Utilization (7/20 chairs)',
    queueText: 'Active Buffer Protocol Online',
    icon: 'chair',
    bedsOccupied: 7,
    bedsTotal: 20,
    bedsFree: 13,
    bedBreakdown: [
      { label: 'Recliner Observation', count: '14 chairs' },
      { label: 'Pharmacy Pick-Up Bays', count: '4 stalls' },
      { label: 'Stretcher Transit Pad', count: '2 spots' }
    ],
    staff: {
      shift: 'Shift: Alpha',
      rns: 2,
      physicians: 0,
      techs: 2,
      ratio: '3.5 : 1',
      targetRatio: 'Target ≤ 5:1'
    },
    equipment: {
      ventilatorsOnline: 0,
      ventilatorsTotal: 0,
      ventilatorsStandby: 0,
      ecmoOnline: 0
    }
  }
];

export const CENSUS_FORECAST_POINTS = [
  { time: '08:00', actual: 355, forecast: null, lower: null, upper: null },
  { time: '10:00', actual: 378, forecast: null, lower: null, upper: null },
  { time: '12:00', actual: 395, forecast: null, lower: null, upper: null },
  { time: '14:00', actual: 412, forecast: 412, lower: 405, upper: 419, isNow: true },
  { time: '16:00', actual: null, forecast: 426, lower: 414, upper: 438 },
  { time: '18:00', actual: null, forecast: 437, lower: 421, upper: 452, surgeBreach: true },
  { time: '20:00', actual: null, forecast: 444, lower: 425, upper: 462 },
  { time: '22:00+', actual: null, forecast: 448, lower: 427, upper: 468 }
];

export const SEASONAL_WEEKS_DATA = [
  { week: 'Week 1', demand: 295, forecast: null, lower: null, upper: null, isHistorical: true },
  { week: 'Week 2', demand: 312, forecast: null, lower: null, upper: null, isHistorical: true },
  { week: 'Week 3', demand: 328, forecast: null, lower: null, upper: null, isHistorical: true },
  { week: 'Week 4', demand: 320, forecast: null, lower: null, upper: null, isHistorical: true },
  { week: 'Week 5', demand: 350, forecast: null, lower: null, upper: null, isHistorical: true },
  { week: 'Week 6', demand: 372, forecast: 372, lower: 360, upper: 385, isToday: true, isHistorical: true },
  { week: 'Week 7', demand: null, forecast: 420, lower: 395, upper: 445, inMonsoon: true },
  { week: 'Week 8', demand: null, forecast: 472, lower: 440, upper: 502, inMonsoon: true },
  { week: 'Week 9', demand: null, forecast: 498, lower: 462, upper: 535, isPeak: true, inMonsoon: true },
  { week: 'Week 10', demand: null, forecast: 460, lower: 420, upper: 498, inMonsoon: true },
  { week: 'Week 11', demand: null, forecast: 395, lower: 360, upper: 430 },
  { week: 'Week 12', demand: null, forecast: 365, lower: 330, upper: 400 }
];

export const ALL_12_UNITS = [
  { id: 'u1', name: 'Intensive Care Unit (ICU)', tier: 'critical', occupied: 31, capacity: 32, breachProbability: 96, breachETA: '~3 h 40 min' },
  { id: 'u2', name: 'Emergency Department (ED)', tier: 'warning', occupied: 42, capacity: 50, breachProbability: 84, breachETA: '~5 h 15 min' },
  { id: 'u3', name: 'Radiology & Imaging Core', tier: 'warning', occupied: 7, capacity: 9, breachProbability: 78, breachETA: '~6 h 00 min' },
  { id: 'u4', name: 'Acute Surgical Pavilion (PACU)', tier: 'watch', occupied: 8, capacity: 12, breachProbability: 68, breachETA: '~8 h 20 min' },
  { id: 'u5', name: 'Cardiac Intensive Care (CICU)', tier: 'watch', occupied: 15, capacity: 18, breachProbability: 62, breachETA: '~11 h 30 min' },
  { id: 'u6', name: 'Pediatric Intensive Care (PICU)', tier: 'ok', occupied: 9, capacity: 16, breachProbability: 41, breachETA: 'Nominal (>24h)' },
  { id: 'u7', name: 'General Medical Inpatient Ward', tier: 'ok', occupied: 104, capacity: 200, breachProbability: 32, breachETA: 'Nominal (>24h)' },
  { id: 'u8', name: 'Orthopedic & Joint Recovery', tier: 'ok', occupied: 26, capacity: 36, breachProbability: 28, breachETA: 'Nominal (>24h)' },
  { id: 'u9', name: 'Oncology & Infusion Suites', tier: 'ok', occupied: 22, capacity: 30, breachProbability: 25, breachETA: 'Nominal (>24h)' },
  { id: 'u10', name: 'Neurology Step-Down Unit', tier: 'ok', occupied: 14, capacity: 20, breachProbability: 24, breachETA: 'Nominal (>24h)' },
  { id: 'u11', name: 'Maternity & Neonatal Wing', tier: 'ok', occupied: 18, capacity: 28, breachProbability: 20, breachETA: 'Nominal (>24h)' },
  { id: 'u12', name: 'Central Discharge Lounge', tier: 'ok', occupied: 7, capacity: 20, breachProbability: 12, breachETA: 'Nominal (>24h)' }
];
