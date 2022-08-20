import * as trpc from "@trpc/server";
import { z } from "zod";
import axios from "axios";
import { prisma } from "@/backend/utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({
      input,
    }): Promise<{ id: number; name: string; image: string }> {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${input.id}`
        );
        return {
          id: response.data.id,
          name: response.data.name,
          image: response.data.sprites.other["official-artwork"].front_default,
        };
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
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({ data: { ...input } });
    },
  });

export type AppRouter = typeof appRouter;
