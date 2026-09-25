// Authentication service for OmniCall Contact Manager

const USERS_STORAGE_KEY = 'omnicall_registered_users';
const ACTIVE_USER_STORAGE_KEY = 'omnicall_active_user';

// Default demo user
const DEFAULT_DEMO_USER = {
  id: 'usr-demo-1',
  username: 'alex_developer',
  mobile: '+1 (555) 019-2834',
  email: 'alex.developer@omnicall.io',
  password: 'Password123!',
  createdAt: new Date().toISOString()
};

/**
 * Load all registered users from local storage
 */
export function getRegisteredUsers() {
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (!saved) {
    const initial = [DEFAULT_DEMO_USER];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse users from local storage:', e);
    return [DEFAULT_DEMO_USER];
  }
}

/**
 * Register a new user
 * @param {Object} userData - { username, mobile, email, password }
 */
export function registerUser({ username, mobile, email, password }) {
  const users = getRegisteredUsers();

  const trimmedUsername = username.trim().toLowerCase();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedMobile = mobile.trim();

  // Check duplicates
  const existingUser = users.find(
    u => u.username.toLowerCase() === trimmedUsername || u.email.toLowerCase() === trimmedEmail
  );

  if (existingUser) {
    if (existingUser.username.toLowerCase() === trimmedUsername) {
      throw new Error('Username already exists. Please choose a different username.');
    }
    if (existingUser.email.toLowerCase() === trimmedEmail) {
      throw new Error('Email address already registered. Please sign in instead.');
    }
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    username: username.trim(),
    mobile: trimmedMobile,
    email: email.trim(),
    password: password,
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  
  // Automatically set as active user
  setActiveUser(newUser);
  return newUser;
}

/**
 * Authenticate user with credentials
 * Supports authentication with (Username, Mobile, Email, Password)
 */
export function loginUser({ username, mobile, email, password }) {
  const users = getRegisteredUsers();

  // Find user matching given credentials
  const user = users.find(u => {
    const passMatches = u.password === password;
    if (!passMatches) return false;

    // Flexible identifier match
    const uNameMatch = username ? u.username.toLowerCase() === username.trim().toLowerCase() : true;
    const emailMatch = email ? u.email.toLowerCase() === email.trim().toLowerCase() : true;
    const mobileMatch = mobile ? u.mobile.replace(/\D/g, '') === mobile.replace(/\D/g, '') : true;

    return uNameMatch && emailMatch && mobileMatch;
  });

  if (!user) {
    throw new Error('Invalid credentials. Please check your Username, Mobile Number, Email, and Password.');
  }

  setActiveUser(user);
  return user;
}

/**
 * Get currently logged-in active user
 */
export function getActiveUser() {
  const saved = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

/**
 * Set active logged-in user
 */
export function setActiveUser(user) {
  if (user) {
    const sessionUser = {
      id: user.id,
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      createdAt: user.createdAt
    };
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(sessionUser));
  } else {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
  }
}

/**
 * Log out active user
 */
export function logoutUser() {
  localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
}

/**
 * Get demo credentials helper
 */
export function getDemoCredentials() {
  return DEFAULT_DEMO_USER;
}
