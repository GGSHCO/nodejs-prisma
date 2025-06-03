// src/services/email.service.ts

import nodemailer from 'nodemailer'
import { env } from '../config/env'
import logger from '../config/logger'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const verificationUrl = `${env.CLIENT_URL}/verify-email/${token}`

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 100%; margin: 0 auto;">
          <div style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border-bottom: 3px solid #4a90e2;">
            <h1 style="margin: 0; color: #2c3e50; font-size: 24px;">Welcome to Speed Your Fin! 🚀</h1>
          </div>

          <div style="padding: 30px 20px;">
            <p>Hi ${name},</p>
            <p style="margin: 0 0 20px 0;">Thanks for joining! Please verify your email address to get started:</p>
            
            <div style="margin: 25px 0; text-align: center;">
              <a href="${verificationUrl}" 
                style="background-color: #4a90e2; 
                        color: #ffffff; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: 500; 
                        display: inline-block; 
                        transition: background-color 0.3s ease;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Verify Email Address
              </a>
            </div>

            <p style="margin: 15px 0; font-size: 14px; color: #666;">
              This verification link will expire in 24 hours. If the button doesn't work, copy and paste this URL into your browser:<br>
              <span style="word-break: break-all; color: #4a90e2; font-size: 12px;">${verificationUrl}</span>
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                If you didn't create this account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    logger.info(`Verification email sent to ${email}`)
  } catch (error) {
    logger.error(`Error sending verification email: ${error}`)
    throw new Error('Failed to send verification email')
  }
}

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const resetUrl = `${env.CLIENT_URL}/reset-password/${token}`

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 100%; margin: 0 auto;">
          <div style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border-bottom: 3px solid #e74c3c;">
            <h1 style="margin: 0; color: #2c3e50; font-size: 24px;">Password Reset Request</h1>
          </div>

          <div style="padding: 30px 20px;">
            <p>Hi ${name},</p>
            <p style="margin: 0 0 20px 0;">We received a request to reset your password. Click the button below to proceed:</p>
            
            <div style="margin: 25px 0; text-align: center;">
              <a href="${resetUrl}" 
                style="background-color: #e74c3c; 
                       color: #ffffff; 
                       padding: 12px 30px; 
                       text-decoration: none; 
                       border-radius: 5px; 
                       font-weight: 500; 
                       display: inline-block; 
                       transition: background-color 0.3s ease;
                       box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Reset Password
              </a>
            </div>

            <p style="margin: 15px 0; font-size: 14px; color: #666;">
              This password reset link will expire in 1 hour. If you didn't request this change, please ignore this email.<br>
              <span style="word-break: break-all; color: #e74c3c; font-size: 12px;">${resetUrl}</span>
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                For security reasons, we don't store your password. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    logger.info(`Password reset email sent to ${email}`)
  } catch (error) {
    logger.error(`Error sending password reset email to ${email}:`, error)
    throw new Error('Failed to send password reset email')
  }
}
