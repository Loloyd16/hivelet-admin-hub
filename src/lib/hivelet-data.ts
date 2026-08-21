/**
 * HIVELET — canonical mock dataset for
 * Fe Galang Da Silva Boarding House, Brgy. Sambat, Tanauan City, Batangas.
 * All amounts in Philippine Peso (PHP).
 */

export type Cluster = "BH" | "Back Apartment" | "Penthouse" | "Front Apartment" | "Linda Units";
export type UnitStatus = "settled" | "pending" | "overdue" | "vacant" | "maintenance";

export interface Unit {
  code: string;
  cluster: Cluster;
  floor: 1 | 2 | 3;
  type: string;
  capacity: number;
  rate: number;
  status: UnitStatus;
  tenant: string | null;
  occupants: number;
  billingRule: string;
  amenities: string[];
  photo: string;
}

export const PHOTOS = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1521477716071-6d9a6a3ff1b5?auto=format&fit=crop&w=1200&q=70",
];

export const HERO_PHOTO =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=75";

const FILIPINO_NAMES = [
  "Samantha Cruz",
  "Maria Santos",
  "Gabriel Fernandez",
  "Jerome Mercado",
  "Michelle Bautista",
  "Andrea Villanueva",
  "Paolo Reyes",
  "Katrina Delos Reyes",
  "Rafael Aguilar",
  "Joyce Mangubat",
  "Dennis Panganiban",
  "Liza Marasigan",
  "Ronnie Castillo",
  "Cherry Ann Dimaculangan",
  "Nico Bayani",
  "Trisha Gonzales",
  "Arvin Malabanan",
  "Grace Hernandez",
  "Kevin Alcantara",
  "Rowena Silva",
  "Mark Anthony Lopez",
  "Bea Corpuz",
  "Julius Ramirez",
  "Diana Rosales",
  "Emman Tolentino",
  "Precious Landicho",
  "Allan Ilagan",
  "Sofia Manalo",
];

export function peso(value: number, decimals = 0) {
  return `₱${value.toLocaleString("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function phone(seed: number) {
  const prefix = seed % 2 === 0 ? "0917" : "0928";
  const a = String(200 + ((seed * 37) % 780)).padStart(3, "0");
  const b = String(1000 + ((seed * 613) % 8999)).padStart(4, "0");
  return `${prefix}-${a}-${b}`;
}

const bhCodes: Array<[string, 1 | 2 | 3]> = [
  ...["1a", "1b", "1c", "1d", "1e", "1f", "1g", "1h"].map((c) => [c, 1] as [string, 1]),
  ...["2a", "2b", "2c", "2d", "2e", "2f", "2g"].map((c) => [c, 2] as [string, 2]),
  ...["3a", "3b", "3c", "3d", "3e", "3f", "3g"].map((c) => [c, 3] as [string, 3]),
];

const statusCycle: UnitStatus[] = [
  "settled",
  "settled",
  "settled",
  "pending",
  "settled",
  "settled",
  "overdue",
  "settled",
  "vacant",
  "settled",
  "settled",
  "settled",
];

let nameCursor = 0;
const nextName = () => FILIPINO_NAMES[nameCursor++ % FILIPINO_NAMES.length];

const BH_AMENITIES = ["Private bathroom", "Submetered electricity", "Ceiling fan", "Study desk", "Wi-Fi ready"];
const APT_AMENITIES = [
  "Private bathroom",
  "Kitchenette",
  "Submetered electricity",
  "Balcony access",
  "Wi-Fi ready",
  "Parking slot",
];

function build(): Unit[] {
  nameCursor = 0;
  const units: Unit[] = [];

  bhCodes.forEach(([code, floor], i) => {
    const status = statusCycle[i % statusCycle.length];
    const rate = [4500, 5000, 5500, 6000, 6500][i % 5];
    units.push({
      code,
      cluster: "BH",
      floor,
      type: i % 4 === 0 ? "1-Bedroom Standard" : "1-Bedroom Deluxe",
      capacity: i % 4 === 0 ? 2 : 3,
      rate,
      status,
      tenant: status === "vacant" ? null : nextName(),
      occupants: status === "vacant" ? 0 : 1 + (i % 3),
      billingRule: "Rent + ₱200 / occupant water",
      amenities: BH_AMENITIES,
      photo: PHOTOS[i % PHOTOS.length],
    });
  });

  const back: Array<[string, 1 | 2 | 3, number]> = [
    ["B1F", 1, 7000],
    ["B2F", 2, 8000],
    ["B2B", 2, 7500],
    ["B3F", 3, 9000],
    ["B3B", 3, 8500],
  ];
  back.forEach(([code, floor, rate], i) => {
    const status: UnitStatus = i === 2 ? "pending" : i === 4 ? "vacant" : "settled";
    units.push({
      code,
      cluster: "Back Apartment",
      floor,
      type: "2-Bedroom Apartment",
      capacity: 4,
      rate,
      status,
      tenant: status === "vacant" ? null : nextName(),
      occupants: status === "vacant" ? 0 : 2 + (i % 3),
      billingRule: "Rent + ₱200 / occupant water",
      amenities: APT_AMENITIES,
      photo: PHOTOS[(i + 2) % PHOTOS.length],
    });
  });

  units.push({
    code: "PH",
    cluster: "Penthouse",
    floor: 3,
    type: "3-Bedroom Penthouse Suite",
    capacity: 5,
    rate: 12000,
    status: "settled",
    tenant: nextName(),
    occupants: 4,
    billingRule: "Rent + ₱200 / occupant water",
    amenities: [...APT_AMENITIES, "Roof deck", "Panoramic Tanauan view"],
    photo: PHOTOS[3],
  });

  const front: Array<[string, 1 | 2 | 3, number]> = [
    ["F1", 1, 8000],
    ["F2F", 2, 10000],
    ["F2B", 2, 9000],
  ];
  front.forEach(([code, floor, rate], i) => {
    const status: UnitStatus = i === 1 ? "overdue" : i === 2 ? "maintenance" : "settled";
    units.push({
      code,
      cluster: "Front Apartment",
      floor,
      type: "2-Bedroom Apartment",
      capacity: 4,
      rate,
      status,
      tenant: nextName(),
      occupants: 2 + i,
      billingRule: "Rent + ₱200 / occupant water",
      amenities: APT_AMENITIES,
      photo: PHOTOS[(i + 5) % PHOTOS.length],
    });
  });

  units.push(
    {
      code: "LF",
      cluster: "Linda Units",
      floor: 1,
      type: "Linda Front Unit",
      capacity: 3,
      rate: 6500,
      status: "settled",
      tenant: nextName(),
      occupants: 2,
      billingRule: "Fixed: ₱325 electricity + ₱400 water (remitted to Linda)",
      amenities: BH_AMENITIES,
      photo: PHOTOS[6],
    },
    {
      code: "LB",
      cluster: "Linda Units",
      floor: 1,
      type: "Linda Back Unit",
      capacity: 2,
      rate: 5500,
      status: "pending",
      tenant: nextName(),
      occupants: 1,
      billingRule: "Fixed: ₱325 electricity + ₱200 water (remitted to Linda)",
      amenities: BH_AMENITIES,
      photo: PHOTOS[7],
    },
  );

  return units;
}

export const UNITS: Unit[] = build();

export const CLUSTERS: Cluster[] = [
  "BH",
  "Back Apartment",
  "Penthouse",
  "Front Apartment",
  "Linda Units",
];

export const LINDA_FIXED: Record<string, { electricity: number; water: number }> = {
  LF: { electricity: 325, water: 400 },
  LB: { electricity: 325, water: 200 },
};

export const WATER_PER_OCCUPANT = 200;
export const GARBAGE_FEE = 600;

/* ------------------------------------------------------------------ tenants */

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  moveIn: string;
  anniversary: string;
  deposit: number;
  occupants: number;
  emergencyName: string;
  emergencyPhone: string;
  occupation: string;
  facebook: string;
  status: "active" | "notice" | "vacated";
}

const OCCUPATIONS = [
  "BPO Team Lead",
  "Public School Teacher",
  "Nurse — Tanauan Medical",
  "Freelance Designer",
  "Bank Teller",
  "Engineering Student",
  "Barista",
  "Government Employee",
];

export const TENANTS: Tenant[] = UNITS.filter((u) => u.tenant).map((u, i) => ({
  id: `TEN-${String(i + 1).padStart(3, "0")}`,
  name: u.tenant as string,
  unit: u.code,
  phone: phone(i + 3),
  email: `${(u.tenant as string).split(" ")[0].toLowerCase()}.${u.code.toLowerCase()}@gmail.com`,
  moveIn: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} ${5 + (i % 20)}, 202${3 + (i % 3)}`,
  anniversary: `${5 + (i % 20)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]}`,
  deposit: u.rate * 2,
  occupants: u.occupants,
  emergencyName: FILIPINO_NAMES[(i + 9) % FILIPINO_NAMES.length],
  emergencyPhone: phone(i + 17),
  occupation: OCCUPATIONS[i % OCCUPATIONS.length],
  facebook: `facebook.com/${(u.tenant as string).replace(/\s+/g, "").toLowerCase()}`,
  status: i % 13 === 5 ? "notice" : "active",
}));

/* ------------------------------------------------------------------- income */

export interface IncomeRow {
  unit: string;
  cluster: Cluster;
  datePaid: string;
  contact: string;
  invoice: string;
  rentFor: string;
  rent: number;
  occupants: number;
  water: number;
  garbage: number;
  anniversary: string;
  deposit: number;
  linda?: { electricity: number; water: number };
}

export const INCOME_ROWS: IncomeRow[] = UNITS.map((u, i) => {
  const isLinda = u.cluster === "Linda Units";
  const water = isLinda ? LINDA_FIXED[u.code].water : u.occupants * WATER_PER_OCCUPANT;
  return {
    unit: u.code,
    cluster: u.cluster,
    datePaid: u.status === "vacant" ? "—" : `Jul ${((i * 3) % 25) + 1}, 2026`,
    contact: u.tenant ? phone(i + 3) : "—",
    invoice: `OR-2026-${String(1040 + i)}`,
    rentFor: "Jun.26 – Jul.25",
    rent: u.status === "vacant" ? 0 : u.rate,
    occupants: u.occupants,
    water: u.status === "vacant" ? 0 : water,
    garbage: u.status === "vacant" ? 0 : GARBAGE_FEE,
    anniversary: `${((i * 3) % 25) + 1} ${["Jan", "Mar", "May", "Jul", "Sep", "Nov"][i % 6]}`,
    deposit: u.status === "vacant" ? 0 : u.rate * 2,
    linda: isLinda ? LINDA_FIXED[u.code] : undefined,
  };
});

export const halfShare = (rent: number) => rent / 2;
export const remitted = (row: IncomeRow) => row.rent + row.water;
export const expectedWater = (occupants: number) => occupants * WATER_PER_OCCUPANT;

/* ----------------------------------------------------------------- expenses */

export const EXPENSE_CATEGORIES = [
  "1 — Supplies",
  "2 — Taxes & Licenses",
  "3 — Janitorial",
  "4 — Depreciation",
  "5 — Professional Fees",
  "6 — Salaries: Michelle (PhilHealth, SSS, Allowances)",
  "7 — Utilities",
  "8 — Repairs & Maintenance",
  "9 — Fuel & Oil",
  "10 — Others",
];

export const PROPERTY_AREAS = [
  "Boarding House",
  "Main House",
  "Front Apt",
  "Back Apt",
  "Other",
] as const;
export type PropertyArea = (typeof PROPERTY_AREAS)[number];

export interface ExpenseSplit {
  area: PropertyArea;
  amount: number;
}
export interface ExpenseEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  splits: ExpenseSplit[];
}

export const EXPENSES: ExpenseEntry[] = [
  {
    id: "EXP-001",
    date: "Jul 02, 2026",
    description: "OR #88213 — Sambat Hardware (pipes, sealant)",
    category: "8 — Repairs & Maintenance",
    splits: [
      { area: "Boarding House", amount: 2450 },
      { area: "Back Apt", amount: 1200 },
    ],
  },
  {
    id: "EXP-002",
    date: "Jul 02, 2026",
    description: "OR #88220 — Tanauan Water District",
    category: "7 — Utilities",
    splits: [
      { area: "Boarding House", amount: 4800 },
      { area: "Front Apt", amount: 1600 },
      { area: "Main House", amount: 900 },
    ],
  },
  {
    id: "EXP-003",
    date: "Jul 08, 2026",
    description: "Payroll — Michelle (salary + SSS + PhilHealth)",
    category: "6 — Salaries: Michelle (PhilHealth, SSS, Allowances)",
    splits: [
      { area: "Boarding House", amount: 9500 },
      { area: "Main House", amount: 2500 },
    ],
  },
  {
    id: "EXP-004",
    date: "Jul 08, 2026",
    description: "OR #4471 — Janitorial supplies, Batangas Mercantile",
    category: "3 — Janitorial",
    splits: [
      { area: "Boarding House", amount: 1850 },
      { area: "Front Apt", amount: 450 },
      { area: "Back Apt", amount: 450 },
    ],
  },
  {
    id: "EXP-005",
    date: "Jul 15, 2026",
    description: "Business permit renewal — Tanauan City Hall",
    category: "2 — Taxes & Licenses",
    splits: [{ area: "Other", amount: 6200 }],
  },
  {
    id: "EXP-006",
    date: "Jul 19, 2026",
    description: "Diesel — generator standby",
    category: "9 — Fuel & Oil",
    splits: [
      { area: "Boarding House", amount: 1400 },
      { area: "Main House", amount: 600 },
    ],
  },
  {
    id: "EXP-007",
    date: "Jul 24, 2026",
    description: "Bookkeeping retainer — J. Mercado CPA",
    category: "5 — Professional Fees",
    splits: [{ area: "Other", amount: 3500 }],
  },
  {
    id: "EXP-008",
    date: "Jul 28, 2026",
    description: "OR #9912 — Cleaning & office supplies",
    category: "1 — Supplies",
    splits: [
      { area: "Boarding House", amount: 1250 },
      { area: "Main House", amount: 700 },
    ],
  },
];

export const expenseTotal = (e: ExpenseEntry) => e.splits.reduce((s, x) => s + x.amount, 0);

/* ------------------------------------------------------------------ tickets */

export type Priority = "Emergency" | "High" | "Medium" | "Low";
export type TicketStatus = "Open" | "In Progress" | "Resolved";

export interface Ticket {
  id: string;
  unit: string;
  title: string;
  category: string;
  priority: Priority;
  reported: string;
  description: string;
  technician: string;
  status: TicketStatus;
  photo: string;
}

export const TECHNICIANS = [
  "Unassigned",
  "Mang Ruel (Plumbing)",
  "Kuya Dante (Electrical)",
  "Jerome Mercado (Carpentry)",
  "Aircon Pro Tanauan",
];

export const TICKETS: Ticket[] = [
  {
    id: "TCK-1042",
    unit: "2f",
    title: "Burst water line under lavatory",
    category: "Plumbing",
    priority: "Emergency",
    reported: "Aug 18, 2026",
    description:
      "Water is spraying from the joint under the lavatory and flooding the hallway of the 2nd floor. Main valve temporarily closed by Michelle.",
    technician: "Mang Ruel (Plumbing)",
    status: "In Progress",
    photo: PHOTOS[2],
  },
  {
    id: "TCK-1041",
    unit: "F2B",
    title: "Bedroom outlet sparks when plugged",
    category: "Electrical",
    priority: "High",
    reported: "Aug 17, 2026",
    description: "Outlet beside the bed sparks and smells burnt. Tenant stopped using it.",
    technician: "Kuya Dante (Electrical)",
    status: "Open",
    photo: PHOTOS[5],
  },
  {
    id: "TCK-1038",
    unit: "3c",
    title: "Door hinge loose, does not lock",
    category: "Carpentry",
    priority: "Medium",
    reported: "Aug 12, 2026",
    description: "Upper hinge screws stripped; door sags and the deadbolt no longer aligns.",
    technician: "Jerome Mercado (Carpentry)",
    status: "Resolved",
    photo: PHOTOS[7],
  },
  {
    id: "TCK-1035",
    unit: "B2F",
    title: "Aircon not cooling, drips water",
    category: "Appliances",
    priority: "Low",
    reported: "Aug 09, 2026",
    description: "Split-type unit drips into the living area and barely cools after 30 minutes.",
    technician: "Aircon Pro Tanauan",
    status: "Resolved",
    photo: PHOTOS[1],
  },
];

/* ---------------------------------------------------------------- inquiries */

export interface Inquiry {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  date: string;
  message: string;
}

export const INQUIRIES: Inquiry[] = [
  {
    id: "INQ-301",
    name: "Gabriel Fernandez",
    unit: "3e",
    phone: "0917-482-1190",
    email: "gab.fernandez@gmail.com",
    date: "Aug 20, 2026",
    message:
      "Good day po! Available pa po ba ang Room 3e this September? Two kami mag-share, both working sa Tanauan. Pwede po bang mag-viewing this Saturday?",
  },
  {
    id: "INQ-300",
    name: "Maria Santos",
    unit: "PH",
    phone: "0928-771-3345",
    email: "maria.santos@yahoo.com",
    date: "Aug 19, 2026",
    message:
      "Hello, interested po ako sa Penthouse for our family of 4. May parking po ba at magkano ang deposit requirement?",
  },
  {
    id: "INQ-298",
    name: "Jerome Mercado",
    unit: "B1F",
    phone: "0917-220-6612",
    email: "jerome.mercado@outlook.com",
    date: "Aug 17, 2026",
    message:
      "Magandang umaga. Ask ko lang po kung kasama na ang tubig sa Back Apartment rate, at kung allowed po ang motorcycle parking.",
  },
];

/* ----------------------------------------------------------- tenant profile */

export const DEMO_TENANT = {
  name: "Samantha Cruz",
  unit: "204",
  unitLabel: "Room 204 — 2nd Floor, Back Apartment Wing",
  phone: "0917-845-2210",
  email: "samantha.cruz@gmail.com",
  occupation: "BPO Team Lead",
  facebook: "facebook.com/samanthacruz",
  emergencyName: "Maria Santos",
  emergencyPhone: "0928-441-7788",
  moveIn: "March 5, 2024",
  deposit: 9000,
  occupants: 2,
  capacity: 3,
  rent: 4500,
  water: 400,
  dueDate: "August 5, 2026",
  amountDue: 4900,
  photo: PHOTOS[0],
  fixtures: [
    "Private tiled bathroom with heater outlet",
    "Built-in wardrobe and study desk",
    "Ceiling fan + provision for window-type aircon",
    "Submetered electricity (₱12.50 / kWh, read every 25th)",
    "Shared laundry area access, 6:00 AM – 9:00 PM",
    "Fiber Wi-Fi ready (own subscription allowed)",
  ],
};

export const PAYMENT_HISTORY = [
  { or: "OR-2026-1032", date: "Jul 03, 2026", period: "Jun.26 – Jul.25", amount: 4900, method: "GCash", status: "Verified" },
  { or: "OR-2026-0981", date: "Jun 04, 2026", period: "May.26 – Jun.25", amount: 4900, method: "GCash", status: "Verified" },
  { or: "OR-2026-0930", date: "May 02, 2026", period: "Apr.26 – May.25", amount: 4700, method: "Cash", status: "Verified" },
  { or: "OR-2026-0888", date: "Apr 05, 2026", period: "Mar.26 – Apr.25", amount: 4700, method: "GCash", status: "Verified" },
];

export const TENANT_TICKETS: Ticket[] = [
  {
    id: "TCK-1039",
    unit: "204",
    title: "Faucet drips continuously",
    category: "Plumbing",
    priority: "Medium",
    reported: "Aug 14, 2026",
    description: "Bathroom faucet keeps dripping even when fully closed.",
    technician: "Mang Ruel (Plumbing)",
    status: "In Progress",
    photo: PHOTOS[4],
  },
  {
    id: "TCK-1021",
    unit: "204",
    title: "Ceiling fan wobbles",
    category: "Electrical",
    priority: "Low",
    reported: "Jul 22, 2026",
    description: "Fan wobbles on speed 3 and makes a knocking sound.",
    technician: "Kuya Dante (Electrical)",
    status: "Resolved",
    photo: PHOTOS[6],
  },
];

export const LANDLADY = {
  name: "Fe Galang Da Silva",
  gcash: "0917-123-4567",
  property: "Fe Galang Da Silva Boarding House",
  address: "Brgy. Sambat, Tanauan City, Batangas",
};
