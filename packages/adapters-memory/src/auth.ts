import { createHash, randomBytes, randomInt } from "node:crypto";
import type { AuthService, CodeSender, Identifier, Session, User } from "@bloom/core";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface PendingCode {
  hash: string;
  expiresAt: number;
  sentAt: number;
  attempts: number;
}

const hash = (code: string) => createHash("sha256").update(code).digest("hex");
const key = (id: Identifier) => `${id.kind}:${id.value}`;

// Dev sender: prints the code to the server log instead of sending it.
export const consoleCodeSender: CodeSender = {
  async send(to, code) {
    console.log(`[auth] sign-in code for ${to.value}: ${code}`);
  },
};

export interface MemoryAuthOptions {
  sender: CodeSender;
  // Emails / E.164 phone numbers that become admins on first sign-in.
  adminIdentifiers?: string[];
}

export function createMemoryAuth({ sender, adminIdentifiers = [] }: MemoryAuthOptions): AuthService {
  const codes = new Map<string, PendingCode>();
  const users: User[] = [];
  const sessions = new Map<string, Session>();

  function findOrCreateUser(id: Identifier): User {
    const existing = users.find((u) => u[id.kind] === id.value);
    if (existing) return existing;
    const user: User = {
      id: `u${users.length + 1}`,
      [id.kind]: id.value,
      role: adminIdentifiers.includes(id.value) ? "admin" : "provider",
    };
    users.push(user);
    return user;
  }

  return {
    async requestCode(to) {
      const now = Date.now();
      const pending = codes.get(key(to));
      if (pending && now - pending.sentAt < RESEND_COOLDOWN_MS) return { ok: false, reason: "rate_limited" };
      const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
      codes.set(key(to), { hash: hash(code), expiresAt: now + CODE_TTL_MS, sentAt: now, attempts: 0 });
      await sender.send(to, code);
      return { ok: true };
    },

    async verifyCode(to, code) {
      const pending = codes.get(key(to));
      if (!pending || Date.now() > pending.expiresAt || pending.attempts >= MAX_ATTEMPTS) return null;
      pending.attempts++;
      if (pending.hash !== hash(code.trim())) return null;
      codes.delete(key(to));

      const user = findOrCreateUser(to);
      const session: Session = {
        token: randomBytes(32).toString("hex"),
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
      };
      sessions.set(session.token, session);
      return session;
    },

    async getUser(token) {
      const session = sessions.get(token);
      if (!session) return null;
      if (Date.parse(session.expiresAt) < Date.now()) {
        sessions.delete(token);
        return null;
      }
      return users.find((u) => u.id === session.userId) ?? null;
    },

    async signOut(token) {
      sessions.delete(token);
    },

    async linkProvider(userId, providerId) {
      const user = users.find((u) => u.id === userId);
      if (user) user.providerId = providerId;
    },
  };
}
