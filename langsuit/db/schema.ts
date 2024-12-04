import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Reusable chunks
const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

const id = {
  id: serial("id").primaryKey(),
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  hasPurchased: boolean("has_purchased").default(false).notNull(),
});

export const instructor = pgTable("instructor", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const instructorRelation = relations(instructor, ({ one, many }) => ({
  user: one(users, {
    fields: [instructor.userId],
    references: [users.id],
  }),
  courses: many(courses),
}));

export const courses = pgTable("courses", {
  ...id,
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
  instructorId: integer("instructor_id")
    .notNull()
    .references(() => instructor.id),
  category: text("category").notNull(),
  price: integer("price").default(0),
  visits: integer("visits").default(0),
});

export const coursesRelation = relations(courses, ({ one }) => ({
  instructor: one(instructor, {
    fields: [courses.instructorId],
    references: [instructor.id],
  }),
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ many, one }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengesRelations = relations(challenges, ({ many, one }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

export const admin = pgTable("admin", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const naive = pgTable("naive", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const followList = pgTable(
  "follow_list",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => instructor.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.instructorId] }),
  })
);

export const followListRelations = relations(followList, ({ one }) => ({
  users: one(users, {
    fields: [followList.userId],
    references: [users.id],
  }),
  instructor: one(instructor, {
    fields: [followList.instructorId],
    references: [instructor.id],
  }),
}));

export const liveStream = pgTable("live_stream", {
  ...id,
  ...timestamps,
  instructorId: integer("instructor_id")
    .notNull()
    .references(() => instructor.id),
  title: text("title").notNull(),
  date: date("date").notNull(),
  category: text("category").notNull(),
  price: integer("price"),
  ingressId: text("ingress_id").notNull(),
  serverUrl: text("server_url"),
  streamKey: text("stream_key"),
  isLive: boolean("is_live"),
  isChatEnabled: boolean("is_chat_enabled"),
  isChatDelayed: boolean("is_chat_delayed"),
  isChatFollowersOnly: boolean("is_chat_followers_only"),
});

export const liveStreamRelation = relations(liveStream, ({ one }) => ({
  instructor: one(instructor, {
    fields: [liveStream.instructorId],
    references: [instructor.id],
  }),
}));

export const ticket = pgTable("ticket", {
  ...id,
  ...timestamps,
  streamId: integer("stream_id")
    .notNull()
    .references(() => liveStream.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const ticketRelation = relations(ticket, ({ one }) => ({
  liveStream: one(liveStream, {
    fields: [ticket.streamId],
    references: [liveStream.id],
  }),
  users: one(users, {
    fields: [ticket.userId],
    references: [users.id],
  }),
}));

export const sales = pgTable("sales", {
  ...id,
  ...timestamps,
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  streamId: integer("stream_id").references(() => liveStream.id),
  amount: integer("amount").notNull(),
});

export const salesRelations = relations(sales, ({ one }) => ({
  users: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [sales.courseId],
    references: [courses.id],
  }),
  stream: one(liveStream, {
    fields: [sales.streamId],
    references: [liveStream.id],
  }),
}));
