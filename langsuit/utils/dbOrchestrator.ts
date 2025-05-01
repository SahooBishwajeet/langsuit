import db from "@/db/drizzle";
import { users, admin, instructor, naive } from "@/db/schema";
import { eq } from "drizzle-orm";
class dbOrchestrator {
  static #instance: dbOrchestrator;

  private constructor() {}

  public static get instance(): dbOrchestrator {
    if (!dbOrchestrator.#instance) {
      dbOrchestrator.#instance = new dbOrchestrator();
    }
    return dbOrchestrator.#instance;
  }
}

export abstract class User {
  public abstract insert(
    role: string,
    username: string,
    email: string,
    password: string,
  ): Promise<void>;
  public async getSelfByUsername(username: string): Promise<any> {
    console.log("first");
    try {
      const foundUser = await db
        .select() // Start the select query
        .from(users) // Specify the table
        .where(eq(users.username, username)) // Use the 'eq' helper for WHERE clause
        .limit(1); // Limit to 1 result (optional)

      // console.log("foundUser", foundUser);
      // Check if the user is found and return the first result
      return foundUser.length > 0 ? foundUser[0] : null;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw new Error("Error fetching user by username");
    }
  }
}
export class UserOrchestrator {
  private m_RegisteredUser: Map<String, any> = new Map();
  static #instance: UserOrchestrator;

  public registerUser(userID: String, user: User) {
    this.m_RegisteredUser.set(userID, user);
  }

  public static get instance(): UserOrchestrator {
    if (!UserOrchestrator.#instance) {
      UserOrchestrator.#instance = new UserOrchestrator();
    }
    return UserOrchestrator.#instance;
  }

  public static get(userRole: String): User {
    return (UserOrchestrator.instance || this).m_RegisteredUser.get(userRole);
  }
}

class adminUser extends User {
  static #instance: adminUser;

  private constructor() {
    super();
  }

  public static get instance(): adminUser {
    if (!adminUser.#instance) {
      adminUser.#instance = new adminUser();
    }
    return adminUser.#instance;
  }

  static {
    UserOrchestrator.instance.registerUser("admin", adminUser.instance);
  }

  public async insert(
    role: string,
    username: string,
    email: string,
    password: string,
  ) {
    const userTable = await db
      .insert(users)
      .values({ username, email, password, role })
      .returning({ insertedId: users.id });
    const newUser = userTable[0];
    await db.insert(admin).values({ userId: newUser.insertedId });
  }
}

export class instructorUser extends User {
  static #instance: instructorUser;

  private constructor() {
    super();
  }

  public static get instance(): instructorUser {
    if (!instructorUser.#instance) {
      instructorUser.#instance = new instructorUser();
    }
    return instructorUser.#instance;
  }

  static {
    UserOrchestrator.instance.registerUser(
      "instructor",
      instructorUser.instance,
    );
  }

  public async insert(
    role: string,
    username: string,
    email: string,
    password: string,
  ) {
    const userTable = await db
      .insert(users)
      .values({ username, email, password, role })
      .returning({ insertedId: users.id });
    const newUser = userTable[0];
    await db.insert(instructor).values({ userId: newUser.insertedId });
  }
}
class naiveUser extends User {
  static #instance: naiveUser;

  private constructor() {
    super();
  }

  public static get instance(): naiveUser {
    if (!naiveUser.#instance) {
      naiveUser.#instance = new naiveUser();
    }
    return naiveUser.#instance;
  }

  static {
    UserOrchestrator.instance.registerUser("naive", naiveUser.instance);
  }

  public async insert(
    role: string,
    username: string,
    email: string,
    password: string,
  ) {
    const userTable = await db
      .insert(users)
      .values({ username, email, password, role })
      .returning({ insertedId: users.id });
    const newUser = userTable[0];
    await db.insert(naive).values({ userId: newUser.insertedId });
  }
}
