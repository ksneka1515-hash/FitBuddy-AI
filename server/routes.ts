import { Router, Request, Response, NextFunction } from 'express';
import { db, User } from './db';
import { generateAIPlan, RecommendationRequest } from './gemini';

export const apiRouter = Router();

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']);
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const session = db.getSession(token);
  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }

  const user = db.findUserById(session.user_id);
  if (!user) {
    res.status(401).json({ error: 'User not found.' });
    return;
  }

  req.user = user;
  next();
}

// ----------------- Auth Routes -----------------

// POST /api/auth/register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, confirm_password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirm_password !== undefined && password !== confirm_password) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    const { user, error } = db.createUser(name, email, password);
    if (error || !user) {
      res.status(400).json({ error: error || 'Failed to create account.' });
      return;
    }

    const session = db.createSession(user.id);

    res.status(201).json({
      message: 'Account created successfully.',
      token: session.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'An unexpected server error occurred during registration.' });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = db.verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const session = db.createSession(user.id);

    res.json({
      message: 'Logged in successfully.',
      token: session.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An unexpected error occurred during login.' });
  }
});

// POST /api/auth/demo (1-click Demo Login)
apiRouter.post('/auth/demo', (_req: Request, res: Response) => {
  try {
    const demoUser = db.findUserByEmail('demo@example.com');
    if (!demoUser) {
      res.status(404).json({ error: 'Demo user not initialized.' });
      return;
    }
    const session = db.createSession(demoUser.id);
    res.json({
      message: 'Welcome to PocketSmart AI Demo!',
      token: session.token,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        created_at: demoUser.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to log in as demo user.' });
  }
});

// GET /api/auth/me
apiRouter.get('/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
  });
});

// PUT /api/auth/profile
apiRouter.put('/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Name must be at least 2 characters long.' });
      return;
    }
    const updated = db.updateUserName(req.user!.id, name);
    if (!updated) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        created_at: updated.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// PUT /api/auth/change-password
apiRouter.put('/auth/change-password', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      res.status(400).json({ error: 'Current password and new password are required.' });
      return;
    }

    const isValid = db.verifyPassword(current_password, req.user!.password_hash, req.user!.salt);
    if (!isValid) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }

    if (new_password.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const ok = db.updateUserPassword(req.user!.id, new_password);
    if (!ok) {
      res.status(500).json({ error: 'Failed to update password.' });
      return;
    }

    res.json({ message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : String(req.headers['x-auth-token'] || '');
  if (token) {
    db.deleteSession(token);
  }
  res.json({ message: 'Logged out successfully.' });
});

// ----------------- AI Recommendation Engine -----------------

// POST /api/ai/generate-plan
apiRouter.post('/ai/generate-plan', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_type, budget } = req.body;

    if (!plan_type || !['home', 'party', 'jewelry'].includes(plan_type)) {
      res.status(400).json({ error: 'Invalid plan type. Must be home, party, or jewelry.' });
      return;
    }

    const numBudget = Number(budget);
    if (!numBudget || isNaN(numBudget) || numBudget < 1000) {
      res.status(400).json({ error: 'Please enter a valid budget of at least ₹1,000.' });
      return;
    }

    if (numBudget > 50000000) {
      res.status(400).json({ error: 'Budget exceeds maximum supported threshold of ₹5,00,00,000.' });
      return;
    }

    const recommendationRequest: RecommendationRequest = {
      ...req.body,
      plan_type,
      budget: numBudget,
    };

    const result = await generateAIPlan(recommendationRequest);

    res.json({
      success: true,
      plan: result,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/generate-plan:', err);
    res.status(500).json({
      error: 'Something went wrong while generating your plan. Please try again.',
    });
  }
});

// ----------------- Plans Persistence -----------------

// GET /api/plans
apiRouter.get('/plans', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const plans = db.getPlansByUserId(req.user!.id);
    
    // Calculate dashboard statistics
    const totalPlans = plans.length;
    const totalBudgetPlanned = plans.reduce((sum, p) => sum + p.budget, 0);
    const totalBudgetUsed = plans.reduce((sum, p) => sum + p.budget_used, 0);
    const totalBudgetRemaining = plans.reduce((sum, p) => sum + p.budget_remaining, 0);
    const recentPlan = plans[0] || null;

    res.json({
      plans,
      stats: {
        total_plans: totalPlans,
        total_budget_planned: totalBudgetPlanned,
        total_budget_used: totalBudgetUsed,
        total_budget_remaining: totalBudgetRemaining,
        recent_plan: recentPlan,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve plans.' });
  }
});

// POST /api/plans (Save Plan)
apiRouter.post('/plans', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_type, title, budget, budget_used, budget_remaining, request_data, result_data } = req.body;

    if (!plan_type || !title || budget === undefined || !result_data) {
      res.status(400).json({ error: 'Missing required plan data.' });
      return;
    }

    const newPlan = db.createPlan({
      user_id: req.user!.id,
      plan_type,
      title,
      budget: Number(budget),
      budget_used: Number(budget_used || 0),
      budget_remaining: Number(budget_remaining || 0),
      request_data: request_data || {},
      result_data,
    });

    res.status(201).json({
      message: 'Plan saved successfully.',
      plan: newPlan,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save plan.' });
  }
});

// GET /api/plans/:id
apiRouter.get('/plans/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const plan = db.getPlanById(req.params.id, req.user!.id);
    if (!plan) {
      res.status(404).json({ error: 'Plan not found or unauthorized access.' });
      return;
    }
    res.json({ plan });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve plan.' });
  }
});

// DELETE /api/plans/:id
apiRouter.delete('/plans/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deletePlan(req.params.id, req.user!.id);
    if (!success) {
      res.status(404).json({ error: 'Plan not found or unauthorized to delete.' });
      return;
    }
    res.json({ message: 'Plan deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete plan.' });
  }
});

// ----------------- Contact Form -----------------

// POST /api/contact
apiRouter.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'All fields (Name, Email, Message) are required.' });
      return;
    }
    const saved = db.saveContactMessage(name, email, message);
    res.status(201).json({
      message: 'Thank you for reaching out! Your message has been received.',
      entry: saved,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PocketSmart AI Backend',
  });
});
