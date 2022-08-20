import { getOptionsForVote } from "@/utils/pokemon";
import { inferQueryResponse, trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

type HomeProps = {
  initialIds: number[];
};

const Home: NextPage<HomeProps> = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: first,
    },
  ]);
  const secondPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: second,
    },
  ]);

  const voteMutation = trpc.useMutation(["cast-vote"]);

  if (firstPokemon.isError || secondPokemon.isError) return <>Error</>;

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading &&
          !secondPokemon.isLoading &&
          firstPokemon.data &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={voteForRoundest}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={voteForRoundest}
              />
            </>
          )}
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: (id: number) => void;
}> = ({ pokemon, vote }) => {
  return (
    <div className="flex flex-col">
      <Image
        className="w-64 h-64"
        src={pokemon.image}
        width={500}
        height={500}
        alt={pokemon.name}
      />
      <div className="p-4" />
      <button
        onClick={() => vote(pokemon.id)}
        className="bg-green-600 hover:bg-green-500 rounded p-2 text-xl capitalize"
      >
        {pokemon.name}
      </button>
    </div>
  );
};

export default Home;
