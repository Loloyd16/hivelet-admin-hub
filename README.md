# Hivelet Admin Hub

You are a Principal UI/UX Architect and Lead Frontend Engineer. 

Design and build a complete, world-class modern web application for "Hivelet" — the official Apartment Management System and Resident Portal for "Fe Galang Da Silva Boarding House", located in Barangay Sambat, Tanauan City, Batangas, Philippines.

You have full creative freedom to choose the optimal tech stack (React / Vite / Tailwind CSS with Lucide Icons or Vue) and visual design language. Craft a sleek, high-end modern SaaS interface (inspired by modern Stripe, Linear, and Airbnb Host dashboards) that feels exceptionally intuitive, responsive, and easy to use for a non-technical landlady.

================================================================================

1. CORE DESIGN PRINCIPLES & AESTHETIC DIRECTION

================================================================================

- Visual Style: Clean, sophisticated, modern corporate SaaS with refined typography, subtle card elevations, elegant borders, and purposeful spacing.

- Iconography: Use Lucide SVG icons exclusively. Strictly NO emojis anywhere in the interface.

- Mobile-First & PWA Architecture: 44px+ touch targets on all interactive elements, fluid cards, slide-over navigation drawers on mobile, sticky table headers with horizontal scrolling, and responsive layouts across mobile, tablet, and desktop.

- Image Policy: Use clean Lucide SVG icons and fast online Unsplash architecture/room photos (e.g. https://images.unsplash.com/photo-...). Do NOT generate AI images.

- Color & Status Badge System:

  • Settled / Active / Resolved: Subtle soft green tones

  • Pending / Warning: Subtle soft amber tones

  • Overdue / Emergency: Subtle soft red tones

  • In Progress / Available: Subtle soft blue/slate tones

  • Vacated / Maintenance: Subtle neutral slate tones

================================================================================

2. AUTHENTIC PHILIPPINE DATASET (THE 32 CANONICAL UNITS)

================================================================================

All mock data must use Philippine Peso (₱ / PHP), Philippine phone numbers (0917-xxx-xxxx / 0928-xxx-xxxx), and authentic Filipino names (Fe Galang Da Silva, Samantha Cruz, Maria Santos, Gabriel Fernandez, Jerome Mercado, Michelle):

- Property Details: 3 Floors, 32 Rentable Units across 5 Property Clusters:

  1. BH (Main Rooms) — 22 Units: 1a, 1b, 1c, 1d, 1e, 1f, 1g, 1h (Floor 1); 2a, 2b, 2c, 2d, 2e, 2f, 2g (Floor 2); 3a, 3b, 3c, 3d, 3e, 3f, 3g (Floor 3). Rent: ₱4,500–₱6,500/mo.

  2. Back Apartment — 5 Units: B1F, B2F, B2B, B3F, B3B. Rent: ₱7,000–₱9,000/mo.

  3. Penthouse — 1 Unit: PH. Rent: ₱12,000/mo.

  4. Front Apartment — 3 Units: F1, F2F, F2B. Rent: ₱8,000–₱10,000/mo.

  5. Linda Units — 2 Units: LF (Linda Front), LB (Linda Back).

     • Special Rule: Fixed Electricity = ₱325/mo per unit; Fixed Water: LF = ₱400/mo, LB = ₱200/mo. Remitted directly to Linda, separate from the main subtotal.

- Calculation Rules:

  • Standard Water Fee: ₱200 per registered occupant monthly.

  • 50% Share: Exactly Rent ÷ 2 (auto-calculated).

  • Total Remittance: Rent Amount + Water Payment.

================================================================================

3. APPLICATION SHELL & MULTI-ROLE SWITCHER

================================================================================

Sticky top navigation header with:

- Brand identity: "HIVELET" with subtitle "Fe Galang Da Silva Boarding House".

- Prominent Role Switcher:

  [ 🛡️ Landlady Admin ] | [ 👤 Tenant Portal ] | [ 🏠 Public Guest Showcase ]

- Floating Live Chat / Inquiry Inbox trigger button with unread count badge.

- Mobile drawer navigation for small screens.

================================================================================

4. MODULE 1: LANDLADY ADMIN OPERATIONS WORKSPACE

================================================================================

Sidebar navigation with 7 core management views:

A. Executive Overview (/admin/overview):

- 4 Top KPI Cards:

  1. Monthly Revenue: ₱178,500 (+₱12,000 vs last month)

  2. Occupancy Rate: 28 / 32 Units (87.5%) • 4 Vacant

  3. Pending GCash Verifications: ₱12,400 (2 Remittances)

  4. Maintenance Alerts: 2 Open (1 Emergency)

- Top Right Button: "+ Record On-Site Cash Payment" (opens Cash Payment Modal).

- 32-Unit Visual Matrix: Interactive cards grouped into the 5 clusters with status colors (Green = Settled, Amber = Pending, Red = Overdue, Gray = Vacant). Each card shows Unit Code, Type, Occupant Name, and quick buttons to View Specs and Edit Unit.

B. Room & Rate Directory (/admin/directory):

- Search & Cluster filter dropdown.

- Data table of all 32 canonical units with Unit Code, Cluster, Type, Billing Rule, Rate (₱/mo), Status Badge, Primary Tenant, and "Edit Rate" button.

- Rate & Specs Editor Drawer with 2% annual price cap guidance helper.

C. Active Tenant Directory (/admin/tenants):

- "+ Onboard Tenant" button opening onboarding modal (Full Name, Email, Phone, Unit Dropdown, Move-in Date, Anniversary Anchor Date, Deposit [₱], Occupants count, Emergency Contact Name & Phone, Occupation, Facebook link).

- Table of active residents with unit code, contact phone, emergency contact, move-in date, and account status.

- Row actions: "View Profile", "Edit Contact Info", "Settle Vacancy / Deactivate".

D. Monthly Income & Collections Ledger (/admin/income):

- Excel-matched 12-column table:

  1. Rm # (32 units), 2. Date Paid, 3. Contact + Invoice # (in red), 4. Rent For (derived period, e.g. Jun.26–Jul.25), 5. Rent Amount, 6. 50% Share (Rent/2), 7. Occupants, 8. Water Payment (Occupants × ₱200 with warning if mismatch), 9. GBG (annual garbage fee), 10. Remitted Amount (Rent + Water), 11. Anniv Date, 12. Deposit.

- Subtotal rows after BH, Back Apartment, Front Apartment, Grand Subtotal (excluding Linda), and Linda Separate Section.

- "Export Income to Excel" action button.

E. Guided Monthly Expenses Ledger (/admin/expenses):

- Guided Split Expense Entry Form: Date picker, OR/Supplier description, Category dropdown (1 Supplies, 2 Taxes & Licenses, 3 Janitorial, 4 Depreciation, 5 Professional Fees, 6 Salaries: Michelle [PhilHealth, SSS, Allowances], 7 Utilities, 8 Repairs & Maintenance, 9 Fuel & Oil, 10 Others).

- Multi-Area Split Sub-list: Allocate amounts across 5 Fixed Property Areas (Boarding House, Main House, Front Apt, Back Apt, Other) on a single receipt without duplicate typing.

- Date-grouped ledger table with merged date rowspans.

- Bottom Property Area totals & Right-side 2-Column Category Summary (This Month vs Cumulative Year-to-Date).

- "Export Expenses to Excel" action button.

F. Maintenance Dispatch & Resolution (/admin/tickets):

- Table of issue tickets with Unit Code, Issue Title, Priority Badge (Emergency, High, Medium, Low), Date Reported, Thumbnail, Assigned Technician, and Status.

- Inspection Drawer with full description, photo preview, technician assignment dropdown, and "Resolve & Close Ticket" action.

G. Public Prospect Inquiry Inbox (/admin/inquiries):

- Cards of prospective tenant inquiries with Prospect Name, Target Unit, Phone, Email, Date, Message body, and actions to "Reply in Live Chat" and "Convert to Tenant Onboarding".

================================================================================

5. MODULE 2: TENANT SELF-SERVICE WORKSPACE (/tenant)

================================================================================

Resident Portal (Demo User: Samantha Cruz — Room 204):

1. Unit Overview & Specs: Room specs, capacity, private bathroom, included fixtures, submetered electricity guidelines.

2. Statement of Account: Current billing summary card (Amount Due: ₱4,900, Due Date: August 5, 2026, Status: Paid / Due / Overdue), itemized breakdown (Rent ₱4,500 + Water ₱400), and past payment history list with viewable receipts.

3. Submit GCash Remittance: Landlady GCash QR and Number (0917-123-4567 — Fe Galang Da Silva), payment date, amount, reference/OR number input, proof of payment screenshot uploader, and "Submit Remittance" button.

4. Maintenance Ticketing: "+ Report New Issue" form (Title, Category [Plumbing, Electrical, Carpentry, Appliances], Priority, Description, Photo file attachment) and list of submitted tickets with live status tracking.

5. My Resident Profile: View account details and edit phone number, emergency contacts, occupation, and Facebook link.

================================================================================

6. MODULE 3: PUBLIC GUEST PORTAL (/public)

================================================================================

Visitor portal for prospective tenants:

- Hero Banner: "Fe Galang Da Silva Boarding House" — Sambat, Tanauan City, Batangas.

- 3 Category Explorer Cards: 1-Bedroom Unit (Up to 3 Pax), 2-Bedroom Unit (Up to 4 Pax), 3-Bedroom / Penthouse Suite (Up to 5 Pax).

- Full-Screen Unit Showcase: Interactive carousel/selector of units with floor, capacity, base rate, amenities checklist, and status tag (Available / Reserved).

- In-Place "Inquire Now" Modal Form: Name, Phone, Email, Target Unit dropdown, Message textarea, and "Send Inquiry to Landlady" / "Chat Live" buttons.

================================================================================

7. INTERACTIVE MODALS, DRAWERS & TOAST NOTIFICATIONS

================================================================================

Include working interactive popups across the app:

1. On-Site Cash Payment Modal (Unit select, amount, OR #, record button).

2. Live Chathead Messenger Drawer (bottom-right floating chat popover between Landlady and Inquirers).

3. Rate & Unit Specs Editor Drawer.

4. Tenant Onboarding Modal with pre-filled fields.

5. Confirmation Modal for destructive actions (e.g. closing tickets, settling vacancies).

6. Floating Toast Notifications (Success, Warning, Error) triggering dynamically on form submissions.

================================================================================

8. DELIVERABLE EXPECTATION

================================================================================

Deliver a complete, highly polished, fully functional single-page or multi-page application with rich Philippine mock data pre-populated across all 32 units, views, and tables. Ensure fluid transitions between roles and modules, responsive layouts, and zero console/build errors.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d56dd6a1-ec62-4bf9-93a0-b89f0e9026e2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
