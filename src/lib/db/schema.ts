import { pgTable, uuid, text, varchar, timestamp, decimal, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// Kunden-Tabelle
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().default('gen_random_uuid()'),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull(),
  company: varchar('company', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Buchungen-Tabelle
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().default('gen_random_uuid()'),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  
  // Stripe-Informationen
  stripeSessionId: varchar('stripe_session_id', { length: 255 }).unique(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  
  // Buchungsdetails
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  totalNights: integer('total_nights').notNull(),
  
  // Preisdetails
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  discountPercent: integer('discount_percent').default(0),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  
  // Status
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, confirmed, cancelled, completed
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'), // pending, paid, failed, refunded
  
  // Zusätzliche Informationen
  specialRequests: text('special_requests'),
  metadata: jsonb('metadata'), // Für zusätzliche Daten
  
  // Check-in Details
  checkInCode: varchar('checkin_code', { length: 10 }),
  checkInCodeSentAt: timestamp('checkin_code_sent_at'),
  actualCheckIn: timestamp('actual_checkin'),
  actualCheckOut: timestamp('actual_checkout'),
  
  // E-Mails
  confirmationEmailSent: boolean('confirmation_email_sent').default(false),
  checkInEmailSent: boolean('checkin_email_sent').default(false),
  
  // Zeitstempel
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blocked Dates - für Wartung, persönliche Nutzung etc.
export const blockedDates = pgTable('blocked_dates', {
  id: uuid('id').primaryKey().default('gen_random_uuid()'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  reason: varchar('reason', { length: 255 }).notNull(),
  description: text('description'),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// E-Mail Log - für Nachverfolgung gesendeter E-Mails
export const emailLog = pgTable('email_log', {
  id: uuid('id').primaryKey().default('gen_random_uuid()'),
  bookingId: uuid('booking_id').references(() => bookings.id),
  customerId: uuid('customer_id').references(() => customers.id),
  emailType: varchar('email_type', { length: 100 }).notNull(), // confirmation, checkin_instructions, reminder
  recipient: varchar('recipient', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // sent, failed, bounced
  sentAt: timestamp('sent_at'),
  failureReason: text('failure_reason'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript-Typen für die Tabellen
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type BlockedDate = typeof blockedDates.$inferSelect;
export type NewBlockedDate = typeof blockedDates.$inferInsert;

export type EmailLog = typeof emailLog.$inferSelect;
export type NewEmailLog = typeof emailLog.$inferInsert; 