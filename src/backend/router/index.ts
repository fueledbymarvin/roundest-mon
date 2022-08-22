import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({
      input,
    }): Promise<{ id: number; name: string; imageUrl: string }> {
      try {
        const pokemon = await prisma.pokemon.findFirst({
          where: { id: input.id },
        });
        if (!pokemon) throw "Doesn't exist";
        return pokemon;
      } catch (error) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "oops",
          cause: error,
        });
      }
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedForId: z.number(),
      votedAgainstId: z.number(),
    }),
    async resolve({ input }) {
      await prisma.vote.create({ data: { ...input } });
    },
  });

export type AppRouter = typeof appRouter;
