import { relations } from "drizzle-orm";
import { pgTable,serial, text, varchar,timestamp, integer, date } from "drizzle-orm/pg-core"



// reusable chunks 
const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

const id = {
    id: serial("id").primaryKey()
}

export const courses = pgTable("courses",{
    ...id,
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
    instructorId: integer("instructor_id").notNull().references(()=>instructor.id)
});
export const coursesRelation = relations(courses,({one,many}) => ({
    instructor: one(instructor,{
        fields: [courses.instructorId],
        references: [instructor.id]
    }),
}))

const userColumns = {
    ...id,
    username: varchar("username").notNull(),
    email: varchar("email", {length: 256}).notNull(),
    password: text("password").notNull(),
}

export const user = pgTable("user",{
    ...userColumns,
    role: text("role").notNull()
})


export const admin = pgTable("admin",{
    ...userColumns,
    // not thought yet
}) 

export const instructor = pgTable("instructor",{
    ...userColumns,
    // not thought yet
})
export const instructorRelation = relations(instructor,({one,many}) => ({
    courses: many(courses), // ins have a many realation with courses
}))
export const naive = pgTable("naive",{
    ...userColumns,
    // not thought yet
})

export const liveStream = pgTable("live_stream",{
    ...id,
    ...timestamp,
    instructorId: integer("instructor_id").notNull().references(()=>instructor.id),
    title: text("title").notNull(),
    date: date("date").notNull(),
    price: integer("price")
    // Referencing instructor
});

export const liveStreamRelation = relations(liveStream,({one}) => ({
    instructor: one(instructor,{
        fields:[liveStream.instructorId],
        references: [instructor.id]
    })
}))

export const ticket = pgTable("ticket",{
    ...id,
    ...timestamp,
    streamId: integer("stream_id").notNull().references(()=>liveStream.id),
    userId: integer("user_id").notNull().references(()=>user.id)
    // Referencing liveStream and User
})

export const ticketRelation = relations(ticket,({one}) => ({
    liveStream: one(liveStream,{
        fields: [ticket.streamId],
        references: [liveStream.id]
    }),
    user: one(user,{
        fields: [ticket.userId],
        references: [user.id]
    })    
}))