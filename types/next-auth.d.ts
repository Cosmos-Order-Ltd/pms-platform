import { DefaultSession, DefaultUser } from "next-auth"
import { UserRole, Organization, Guest, Staff } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      organizationId?: string
      organization?: Organization
      guestProfile?: Guest
      staffProfile?: Staff & {
        property?: Property
      }
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    organizationId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
  }
}