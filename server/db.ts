import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  created_at: string;
}

export interface Session {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

export interface PlanItem {
  name: string;
  category: string;
  estimated_price: number;
  quantity: number;
  reason: string;
  shopping_query?: string;
}

export interface BudgetBreakdownCategory {
  category: string;
  allocated_budget: number;
  percentage_of_budget: number;
  items: PlanItem[];
}

export interface PlanResultData {
  title: string;
  summary: string;
  budget_used: number;
  budget_remaining: number;
  budget_breakdown: BudgetBreakdownCategory[];
  tips: string[];
  disclaimer: string;
}

export interface Plan {
  id: string;
  user_id: string;
  plan_type: 'home' | 'party' | 'jewelry';
  title: string;
  budget: number;
  budget_used: number;
  budget_remaining: number;
  request_data: Record<string, any>;
  result_data: PlanResultData;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  plans: Plan[];
  contacts: ContactMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'pocketsmart_db.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  return hashPassword(password, salt) === hash;
}

class PocketSmartDB {
  private data: DatabaseSchema = {
    users: [],
    sessions: [],
    plans: [],
    contacts: [],
  };
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.persist();
      }
      this.isLoaded = true;
      this.seedDemoData();
    } catch (err) {
      console.error('Error initializing database:', err);
      this.data = { users: [], sessions: [], plans: [], contacts: [] };
      this.seedDemoData();
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  private seedDemoData() {
    const demoEmail = 'demo@example.com';
    let demoUser = this.data.users.find(u => u.email.toLowerCase() === demoEmail);

    if (!demoUser) {
      const salt = generateSalt();
      demoUser = {
        id: 'usr_demo_001',
        name: 'Demo User',
        email: demoEmail,
        salt,
        password_hash: hashPassword('password123', salt),
        created_at: new Date('2026-01-15T10:00:00.000Z').toISOString(),
      };
      this.data.users.push(demoUser);
    }

    const demoPlansCount = this.data.plans.filter(p => p.user_id === demoUser!.id).length;
    if (demoPlansCount === 0) {
      // 1. Home Plan (₹50,000)
      this.data.plans.push({
        id: 'plan_demo_home_01',
        user_id: demoUser.id,
        plan_type: 'home',
        title: 'Smart Home Plan for ₹50,000',
        budget: 50000,
        budget_used: 45500,
        budget_remaining: 4500,
        request_data: {
          budget: 50000,
          room: 'Living Room',
          home_type: 'Apartment',
          style: 'Modern',
          priority: 'Balanced',
          required_items: 'Modular Sofa, LED Accent Lights, BLDC Ceiling Fan, Coffee Table',
          additional_requirements: 'Warm ambient vibe, compact space friendly',
        },
        result_data: {
          title: 'Smart Home Plan for ₹50,000',
          summary: 'A curated living room upgrade balancing durable comfort furniture, energy-efficient BLDC fan, and smart ambient lighting within budget.',
          budget_used: 45500,
          budget_remaining: 4500,
          budget_breakdown: [
            {
              category: 'Furniture',
              allocated_budget: 17500,
              percentage_of_budget: 35,
              items: [
                {
                  name: '3-Seater Fabric Living Room Sofa',
                  category: 'Furniture',
                  estimated_price: 13500,
                  quantity: 1,
                  reason: 'High density foam, space-saving track arms, fits modern apartment aesthetic.',
                  shopping_query: '3 seater fabric modern sofa living room',
                },
                {
                  name: 'Engineered Wood Coffee Table with Storage',
                  category: 'Furniture',
                  estimated_price: 4000,
                  quantity: 1,
                  reason: 'Dual open shelves for magazines and remote storage, warm walnut finish.',
                  shopping_query: 'engineered wood coffee table storage walnut',
                },
              ],
            },
            {
              category: 'Lighting',
              allocated_budget: 7500,
              percentage_of_budget: 15,
              items: [
                {
                  name: 'Smart Dimmable LED Ceiling Light Panel',
                  category: 'Lighting',
                  estimated_price: 3200,
                  quantity: 1,
                  reason: 'App and remote controlled warmth adjustment from cool white to warm amber.',
                  shopping_query: 'smart dimmable led ceiling light panel',
                },
                {
                  name: 'Minimalist Nordic Arc Floor Lamp',
                  category: 'Lighting',
                  estimated_price: 4300,
                  quantity: 1,
                  reason: 'Adds cozy architectural reading corner lighting without ceiling wiring.',
                  shopping_query: 'nordic arc floor lamp living room',
                },
              ],
            },
            {
              category: 'Fans & Climate',
              allocated_budget: 6000,
              percentage_of_budget: 12,
              items: [
                {
                  name: '5-Star BLDC Energy Saving Ceiling Fan with Remote',
                  category: 'Fans',
                  estimated_price: 3800,
                  quantity: 1,
                  reason: 'Saves 65% power consumption with whisper-quiet airflow and timer controls.',
                  shopping_query: 'BLDC energy saving ceiling fan with remote',
                },
              ],
            },
            {
              category: 'Decor & Essentials',
              allocated_budget: 14500,
              percentage_of_budget: 29,
              items: [
                {
                  name: 'Anti-Slip Geometric Area Rug (5x7 ft)',
                  category: 'Decor',
                  estimated_price: 3800,
                  quantity: 1,
                  reason: 'Binds seating elements together and dampens echo in living area.',
                  shopping_query: 'geometric area rug 5x7 feet living room',
                },
                {
                  name: 'Set of 3 Minimalist Canvas Wall Art Panels',
                  category: 'Decor',
                  estimated_price: 2200,
                  quantity: 1,
                  reason: 'Contemporary neutral palette frames that elevate blank wall spaces.',
                  shopping_query: 'minimalist canvas wall art living room set 3',
                },
                {
                  name: 'Indoor Plant with Ceramic Planter Pot (Monstera)',
                  category: 'Decor',
                  estimated_price: 1500,
                  quantity: 1,
                  reason: 'Natural greenery bringing vitality and air purification indoors.',
                  shopping_query: 'indoor monstera plant ceramic pot',
                },
              ],
            },
          ],
          tips: [
            'Compare deals during festival sales or clearance weekends for furniture to save an extra 10-15%.',
            'Keep your ₹4,500 surplus as an emergency buffer for delivery and assembly fees.',
            'Opt for BLDC fans to recover initial costs through monthly power bill reductions within 12 months.',
            'Check fabric warranty and rub-count on sofa upholstery before checkout.',
          ],
          disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
        },
        created_at: new Date('2026-02-10T14:30:00.000Z').toISOString(),
      });

      // 2. Party Plan (₹30,000)
      this.data.plans.push({
        id: 'plan_demo_party_02',
        user_id: demoUser.id,
        plan_type: 'party',
        title: 'Party Budget Plan for ₹30,000',
        budget: 30000,
        budget_used: 27800,
        budget_remaining: 2200,
        request_data: {
          budget: 30000,
          party_type: 'Birthday',
          guests: 25,
          location: 'Rooftop / Cafe Space',
          food_preference: 'Snacks & Beverages + Starter Platter',
          decoration_preference: 'Theme Based & Fairy Lights',
          entertainment_preference: 'DJ / High-Output Bluetooth Sound System',
          date: '2026-10-15',
          additional_requirements: 'Photography corner with themed backdrop',
        },
        result_data: {
          title: 'Party Budget Plan for ₹30,000',
          summary: 'A lively 25-guest celebration plan providing appetizers, beverages, custom photo booth setup, and ambient audio within ₹30,000.',
          budget_used: 27800,
          budget_remaining: 2200,
          budget_breakdown: [
            {
              category: 'Food & Drinks',
              allocated_budget: 10500,
              percentage_of_budget: 35,
              items: [
                {
                  name: 'Gourmet Snack Platters & Finger Foods (25 guests)',
                  category: 'Food & Drinks',
                  estimated_price: 7500,
                  quantity: 1,
                  reason: 'Includes sliders, bruschetta, paneer/chicken skewers and dips.',
                  shopping_query: 'party catering snack platters finger food',
                },
                {
                  name: 'Custom 2-Tier Designer Birthday Cake (1.5 kg)',
                  category: 'Food & Drinks',
                  estimated_price: 1800,
                  quantity: 1,
                  reason: 'Fresh cream fondant design tailored to party theme.',
                  shopping_query: 'custom designer birthday cake 1.5kg',
                },
                {
                  name: 'Mocktail Juices & Soda Mixers Pack',
                  category: 'Food & Drinks',
                  estimated_price: 1200,
                  quantity: 1,
                  reason: 'Refreshing cranberry, mint mojito and soda dispensers.',
                  shopping_query: 'mocktail syrup soda mixer party pack',
                },
              ],
            },
            {
              category: 'Venue & Seating',
              allocated_budget: 7500,
              percentage_of_budget: 25,
              items: [
                {
                  name: 'Community Rooftop / Clubhouse Rental Fee',
                  category: 'Venue',
                  estimated_price: 6000,
                  quantity: 1,
                  reason: '4-hour evening booking with cleaning service included.',
                  shopping_query: 'party hall clubhouse rental booking',
                },
              ],
            },
            {
              category: 'Decorations',
              allocated_budget: 4500,
              percentage_of_budget: 15,
              items: [
                {
                  name: 'Metallic Balloon Arch & Shimmer Backdrop Kit',
                  category: 'Decorations',
                  estimated_price: 2100,
                  quantity: 1,
                  reason: 'Includes balloon pump, tape, navy/gold palette and selfie backdrop.',
                  shopping_query: 'metallic balloon arch shimmer backdrop kit',
                },
                {
                  name: 'Warm White LED Curtain String Lights (30m)',
                  category: 'Decorations',
                  estimated_price: 1400,
                  quantity: 2,
                  reason: 'Creates cozy festival atmosphere across rooftop railings.',
                  shopping_query: 'warm white led curtain string lights outdoor',
                },
              ],
            },
            {
              category: 'Entertainment & Music',
              allocated_budget: 4500,
              percentage_of_budget: 15,
              items: [
                {
                  name: 'High-Bass Party Bluetooth Speaker with Wireless Mic',
                  category: 'Entertainment',
                  estimated_price: 3200,
                  quantity: 1,
                  reason: '100W output suitable for 25 people with mic for speeches and karaoke.',
                  shopping_query: 'party bluetooth speaker wireless mic high bass',
                },
                {
                  name: 'Fun Group Trivia & Icebreaker Card Games Pack',
                  category: 'Entertainment',
                  estimated_price: 600,
                  quantity: 1,
                  reason: 'Engages all 25 guests in interactive laugh-filled rounds.',
                  shopping_query: 'party trivia board games adults groups',
                },
              ],
            },
            {
              category: 'Contingency & Supplies',
              allocated_budget: 3000,
              percentage_of_budget: 10,
              items: [
                {
                  name: 'Biodegradable Eco-Friendly Cutlery & Tableware Set',
                  category: 'Supplies',
                  estimated_price: 800,
                  quantity: 1,
                  reason: 'Disposable palm leaf plates, cups, and napkins for 30 servings.',
                  shopping_query: 'biodegradable palm leaf party plates cutlery set',
                },
              ],
            },
          ],
          tips: [
            'Assemble the balloon garland 3 hours before the party to save on event decorator service charges.',
            'Create a shared Spotify collaborative playlist in advance so guests can add their favorite tracks.',
            'Keep your ₹2,200 remaining amount handy for last-minute ice bags and extra beverages.',
          ],
          disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
        },
        created_at: new Date('2026-03-01T18:00:00.000Z').toISOString(),
      });

      // 3. Jewelry Plan (₹1,00,000)
      this.data.plans.push({
        id: 'plan_demo_jewelry_03',
        user_id: demoUser.id,
        plan_type: 'jewelry',
        title: 'Jewelry Budget Plan for ₹1,00,000',
        budget: 100000,
        budget_used: 94000,
        budget_remaining: 6000,
        request_data: {
          budget: 100000,
          jewelry_type: 'Set',
          occasion: 'Festive / Diwali & Weddings',
          preferred_metal: 'Gold',
          style: 'Elegant',
          main_piece: 'Lightweight 22K Gold Choker / Pendant Necklace',
          matching_requirements: 'Matching Jhumkas or Studs + Delicate Ring',
          additional_requirements: 'Hallmarked BIS certification, versatile for modern and ethnic outfits',
        },
        result_data: {
          title: 'Jewelry Budget Plan for ₹1,00,000',
          summary: 'A certified 22K BIS hallmarked gold collection combining a delicate filigree choker necklace, matching drop jhumkas, and a solitaire band.',
          budget_used: 94000,
          budget_remaining: 6000,
          budget_breakdown: [
            {
              category: 'Main Piece (Necklace)',
              allocated_budget: 55000,
              percentage_of_budget: 55,
              items: [
                {
                  name: '22K (916) BIS Hallmarked Floral Filigree Gold Necklace (~7.5g)',
                  category: 'Main Piece',
                  estimated_price: 52000,
                  quantity: 1,
                  reason: 'Precision laser-cut filigree work providing magnificent visual volume with lightweight wearing comfort.',
                  shopping_query: '22k 916 gold lightweight filigree necklace 8g',
                },
              ],
            },
            {
              category: 'Matching Piece (Earrings)',
              allocated_budget: 25000,
              percentage_of_budget: 25,
              items: [
                {
                  name: '22K Gold Matching Drop Jhumkas with Ruby Accent (~3.2g)',
                  category: 'Matching Piece',
                  estimated_price: 23500,
                  quantity: 1,
                  reason: 'Classic dome jhumki with secure screw-back finding, seamlessly pairs with necklace or standalone sarees.',
                  shopping_query: '22k gold drop jhumka earrings lightweight',
                },
              ],
            },
            {
              category: 'Complementary Accessory (Ring)',
              allocated_budget: 10000,
              percentage_of_budget: 10,
              items: [
                {
                  name: '18K Yellow Gold Solitaire Zirconia Minimalist Band (~1.8g)',
                  category: 'Accessory',
                  estimated_price: 9500,
                  quantity: 1,
                  reason: 'Understated sparkle suitable for daily office wear and festive fusion dresses.',
                  shopping_query: '18k gold minimalist solitaire band ring',
                },
              ],
            },
            {
              category: 'Care & Insurance Buffer',
              allocated_budget: 10000,
              percentage_of_budget: 10,
              items: [
                {
                  name: 'Anti-Tarnish Velvet Lined Wooden Jewelry Organizer Box',
                  category: 'Care & Storage',
                  estimated_price: 1800,
                  quantity: 1,
                  reason: 'Protects delicate gold polish from oxidation, moisture, and scratching.',
                  shopping_query: 'anti tarnish velvet wooden jewelry box lock',
                },
              ],
            },
          ],
          tips: [
            'Always insist on a computerized tax invoice with the unique 6-digit HUID (Hallmark Unique Identification) code.',
            'Ask the jeweler for current making charge breakdown; negotiate making charges during festive promo campaigns.',
            'Store gold pieces in separate micro-fiber ziplock pouches inside the velvet box to prevent entanglement.',
            'Your ₹6,000 remaining buffer covers current gold price daily market fluctuations or GST differential.',
          ],
          disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
        },
        created_at: new Date('2026-03-12T11:15:00.000Z').toISOString(),
      });
    }

    this.persist();
  }

  // --- User Operations ---
  createUser(name: string, email: string, passwordPlain: string): { user?: User; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.data.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { error: 'An account with this email address already exists.' };
    }
    const salt = generateSalt();
    const newUser: User = {
      id: `usr_${crypto.randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      salt,
      password_hash: hashPassword(passwordPlain, salt),
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    return { user: newUser };
  }

  findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  verifyPassword(password: string, hash: string, salt: string): boolean {
    return verifyPassword(password, hash, salt);
  }

  updateUserName(id: string, newName: string): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    user.name = newName.trim();
    this.persist();
    return user;
  }

  updateUserPassword(id: string, newPasswordPlain: string): boolean {
    const user = this.findUserById(id);
    if (!user) return false;
    user.salt = generateSalt();
    user.password_hash = hashPassword(newPasswordPlain, user.salt);
    this.persist();
    return true;
  }

  // --- Session Operations ---
  createSession(userId: string): Session {
    // Delete old sessions for this user if more than 5
    const userSessions = this.data.sessions.filter(s => s.user_id === userId);
    if (userSessions.length > 5) {
      this.data.sessions = this.data.sessions.filter(s => s.user_id !== userId || s.token === userSessions[userSessions.length - 1].token);
    }

    const session: Session = {
      token: generateToken(),
      user_id: userId,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };
    this.data.sessions.push(session);
    this.persist();
    return session;
  }

  getSession(token: string): Session | undefined {
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return undefined;
    if (new Date(session.expires_at) < new Date()) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.persist();
  }

  // --- Plan Operations ---
  createPlan(plan: Omit<Plan, 'id' | 'created_at'>): Plan {
    const newPlan: Plan = {
      ...plan,
      id: `plan_${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
    };
    this.data.plans.unshift(newPlan);
    this.persist();
    return newPlan;
  }

  getPlansByUserId(userId: string): Plan[] {
    return this.data.plans.filter(p => p.user_id === userId);
  }

  getPlanById(planId: string, userId: string): Plan | undefined {
    return this.data.plans.find(p => p.id === planId && p.user_id === userId);
  }

  deletePlan(planId: string, userId: string): boolean {
    const initialLen = this.data.plans.length;
    this.data.plans = this.data.plans.filter(p => !(p.id === planId && p.user_id === userId));
    if (this.data.plans.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Contact Operations ---
  saveContactMessage(name: string, email: string, message: string): ContactMessage {
    const entry: ContactMessage = {
      id: `msg_${crypto.randomUUID()}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
    };
    this.data.contacts.unshift(entry);
    this.persist();
    return entry;
  }
}

export const db = new PocketSmartDB();
