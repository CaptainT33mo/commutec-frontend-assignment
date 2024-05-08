import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { comparePasswordHash, hashPassword } from "@/utils/passwordHash";
import { TRPCError } from "@trpc/server";
import mailSender from "@/utils/mailer";
import { sessionCreator } from "@/utils/sessionCreator";
import type { UserDetails } from "@/types";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string({ required_error: "name is required" }).min(1),
        email: z.string({ required_error: "email is required" }).email(),
        password: z.string({ required_error: "password is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, email, password } = input;
        const passwordHash = await hashPassword(password);
        let saveUserDataResponse: UserDetails | Record<string, never> = {};
        const user = await ctx.db.user.findUnique({
          where: {
            email,
          },
        });
        if (!user?.id) {
          saveUserDataResponse = await ctx.db.user.create({
            data: {
              email,
              name,
              password: passwordHash,
              isEmailVerified: false,
            },
          });
          if (!saveUserDataResponse) {
            throw new TRPCError({
              message: "Error creating the user",
              code: "BAD_REQUEST",
            });
          }
        }
        const otp = Math.floor(Math.random() * 90000000) + 10000000;
        const mailResponseForOtpVerification = await sendEmailNotification({
          email,
          otp,
        });
        if (!mailResponseForOtpVerification) {
          throw new TRPCError({
            message: "Unable to send otp for email verification",
            code: "BAD_REQUEST",
          });
        }
        const currentDateTime = new Date();
        const expiryDateTime = new Date(currentDateTime.getTime() + 10 * 60000);
        const saveUserOtp = await ctx.db.otpVerification.create({
          data: {
            userId: saveUserDataResponse.id || user?.id,
            otp,
            expiresAt: expiryDateTime,
          },
        });
        if (!saveUserOtp) {
          throw new TRPCError({
            message: "Error saving OTP",
            code: "BAD_REQUEST",
          });
        }

        return {
          success: true,
          message: "User created successfully",
          data: saveUserDataResponse || user,
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  verifyOTP: publicProcedure
    .input(
      z.object({
        userId: z.string({ required_error: "userId is required" }),
        otp: z.number({ required_error: "otp is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { userId, otp } = input;
        const userOtpData = await ctx.db.otpVerification.findUnique({
          where: {
            userId: userId,
            otp,
          },
        });
        if (!userOtpData) {
          return { success: false, code: 401, message: "invalid otp" };
        }
        if (new Date() >= userOtpData.expiresAt) {
          return { success: false, message: "expired otp" };
        }
        const updateUserInfo = await ctx.db.user.update({
          where: {
            id: userId,
          },
          data: {
            isEmailVerified: true,
          },
        });
        if (!updateUserInfo) {
          return {
            success: false,
            message: "unable to update email verification status",
          };
        }
        const accessToken = await sessionCreator({ userData: updateUserInfo });
        return {
          success: true,
          message: "Email verified successfully",
          data: {
            accessToken,
          },
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string({ required_error: "email is required" }).email(),
        password: z.string({ required_error: "password is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { email, password } = input;
        const userData = await ctx.db.user.findUnique({
          where: {
            email,
          },
        });
        if (!userData) {
          return { success: false, message: "User not found" };
        }
        const isPasswordMatch = await comparePasswordHash(
          password,
          userData.password,
        );
        if (!isPasswordMatch) {
          return { success: false, message: "Incorrect email or password" };
        }
        const accessToken = await sessionCreator({ userData });
        return {
          success: true,
          message: "Successfully logged in",
          data: {
            accessToken,
          },
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

const sendEmailNotification = async ({
  email,
  otp,
}: {
  email: string;
  otp: number;
}) => {
  try {
    const mailResponse = await mailSender({
      email,
      title: "Very your email",
      body: `<h1>Please use the OTP shown below to verify your email ${email}</h1>
       <p>Code: ${otp}</p>`,
    });
    return mailResponse;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
