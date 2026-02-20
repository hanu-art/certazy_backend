// src/config/passport.js
// Google + GitHub OAuth strategy
// Login hone ke baad user DB mein dhundho ya banao

'use strict';

const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const env            = require('./env');
const db             = require('./db');

// ─── GOOGLE STRATEGY ────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID    : env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL : env.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(null, false, { message: 'Google account mein email nahi mila' });
        }

        const user = await findOrCreateOAuthUser({
          provider  : 'google',
          providerId: profile.id,
          name      : profile.displayName,
          email,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// ─── GITHUB STRATEGY ────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID    : env.github.clientId,
      clientSecret: env.github.clientSecret,
      callbackURL : env.github.callbackUrl,
      scope       : ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub pe email public nahi bhi ho sakta
        const email  = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(null, false, { message: 'GitHub account mein email nahi mila — email public karo' });
        }

        const user = await findOrCreateOAuthUser({
          provider  : 'github',
          providerId: String(profile.id),
          name      : profile.displayName || profile.username,
          email,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// ─── HELPER: User dhundho ya banao ──────────────────────────
const findOrCreateOAuthUser = async ({ provider, providerId, name, email, avatar }) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. oauth_accounts mein check karo
    const [oauthRows] = await conn.query(
      `SELECT u.* FROM oauth_accounts oa
       JOIN users u ON u.id = oa.user_id
       WHERE oa.provider = ? AND oa.provider_id = ?
       LIMIT 1`,
      [provider, providerId]
    );

    if (oauthRows.length > 0) {
      // User pehle se hai — return karo
      await conn.commit();
      return oauthRows[0];
    }

    // 2. Email se existing user check karo
    const [emailRows] = await conn.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    let userId;

    if (emailRows.length > 0) {
      // Email se user mila — OAuth account link karo
      userId = emailRows[0].id;
    } else {
      // 3. Naya user banao
      const [result] = await conn.query(
        `INSERT INTO users (name, email, avatar, oauth_provider, oauth_id, is_verified, is_first_login)
         VALUES (?, ?, ?, ?, ?, 1, 0)`,
        [name, email, avatar, provider, providerId]
      );
      userId = result.insertId;
    }

    // 4. oauth_accounts mein save karo
    await conn.query(
      'INSERT INTO oauth_accounts (user_id, provider, provider_id) VALUES (?, ?, ?)',
      [userId, provider, providerId]
    );

    // 5. Updated user return karo
    const [userRows] = await conn.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    await conn.commit();
    return userRows[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

module.exports = passport;
