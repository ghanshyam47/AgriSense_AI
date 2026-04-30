import { ClerkExpressRequireAuth, ClerkExpressWithAuth, createClerkClient } from '@clerk/clerk-sdk-node';
import { config } from '../config/env.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

const clerkClient = createClerkClient({ secretKey: config.CLERK_SECRET_KEY, publishableKey: config.CLERK_PUBLISHABLE_KEY });

const syncUser = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return next();
  }

  try {
    let user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      // Fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const phone = clerkUser.phoneNumbers[0]?.phoneNumber;
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'New User';

      user = await User.create({
        clerkId: clerkUser.id,
        name,
        email,
        phone,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Error syncing Clerk user to local DB:', error);
    next(error);
  }
};

export const authenticate = [
  ClerkExpressRequireAuth(),
  syncUser,
];

export const optionalAuth = [
  ClerkExpressWithAuth(),
  syncUser,
];
