// src /interfaces/User.ts
export interface User {
  // === Core Identification ===
  LID: number
  EMAIL: string | null
  NAME: string | null
  PASSWORD?: string | null // Deprecated, use encPassword

  // === Authentication ===
  encPassword: string | null
  salt: string | null

  resetToken?: string | null
  tokenExpiration?: string | null
  failedLoginAttempts?: number | null
  lastFailedLogin?: Date | null
  lastLogin?: Date | null

  // === Email Verification ===
  emailVerificationToken?: string | null
  verificationExpires?: Date | null

  // === Personal Information ===
  FIRSTNAME?: string | null
  LASTNAME?: string | null
  DOB?: Date | null
  GENDER?: string | null
  MARITALSTATUS?: string | null
  PHONENUMBER?: string | null
  COUNTRY?: string | null
  PROFILEIMAGE?: string | null

  // === Account Status ===
  STATUS?: string | null
  SUBSCRIPTION?: string | null

  // === Timestamps ===
  ADDEDTIME?: Date | null
  MODIFIEDTIME?: Date | null

  // === Security ===
  SECRETQUESTIONS?: string | null
  SECRETANSWERS?: string | null

  // === Service Subscriptions ===
  ISTALLYSUBSCRIBED?: boolean | null
  ISZOHOSUBSCRIBED?: boolean | null
  ISWEBAPPSUBSCRIBED?: boolean | null
  ZBStatus?: string | null
  TYPE?: string | null
}

export type UserCheck = User | null
export type UserUpdate = Partial<Omit<User, 'LID' | 'ADDEDTIME'>>
export type SanitizedUser = Omit<User, 'PASSWORD' | 'SALT' | 'SECRETANSWERS'>
