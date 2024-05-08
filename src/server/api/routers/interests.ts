import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const interestsRouter = createTRPCRouter({
  addUserInterest: privateProcedure
    .input(
      z.object({
        interestId: z.string({ required_error: "required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;
        const { interestId } = input;
        const response = await ctx.db.userInterest.create({
          data: {
            userId: String(userId),
            interestId,
          },
        });
        if (!response) {
          return { success: false, message: "unable to add user's interest" };
        }
        return {
          success: true,
          message: "Successfully added user's interest",
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  deleteUserInterest: privateProcedure
    .input(
      z.object({
        userInterestId: z.number({ required_error: "required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.userId;
        const { userInterestId } = input;
        const response = await ctx.db.userInterest.delete({
          where: {
            userId: String(userId),
            id: userInterestId,
          },
        });
        if (!response) {
          return { success: false, message: "unable to add user's interest" };
        }
        return {
          success: true,
          message: "Successfully added user's interest",
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  fetchAllInterests: privateProcedure
    .input(z.object({ pageSize: z.number(), pageNumber: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const { pageSize, pageNumber } = input;
        const skip = pageSize * (pageNumber - 1);
        const take = pageSize;
        const response = await ctx.db.category.findMany({ skip, take });
        // Fetch total count of categories
        const totalCount: number = await ctx.db.category.count();
        if (!response || !totalCount)
          return { success: false, message: "unable tp fetch data" };

        return {
          success: true,
          message: "Successfully fetched categories",
          interests: response,
          totalCount,
        };
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  fetchUserInterests: privateProcedure.query(async ({ ctx }) => {
    try {
      const { userId } = ctx;
      const response = await ctx.db.userInterest.findMany({
        where: { userId: String(userId) },
      });
      if (!response) return { success: false, message: "unable tp fetch data" };
      return {
        success: true,
        message: "Successfully fetched user interests",
        interests: response,
      };
    } catch (error) {
      console.log(error);
    }
  }),
});
