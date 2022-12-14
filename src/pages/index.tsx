import { getOptionsForVote } from "@/utils/pokemon";
import { inferQueryResponse, trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";

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
      voteMutation.mutate({ votedForId: first, votedAgainstId: second });
    } else {
      voteMutation.mutate({ votedForId: second, votedAgainstId: first });
    }

    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <PokemonListing pokemon={firstPokemon.data} vote={voteForRoundest} />
        <div className="p-8">Vs</div>
        <PokemonListing pokemon={secondPokemon.data} vote={voteForRoundest} />
      </div>
      <div className="mt-4 text-xl underline text-pink-400">
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon?: PokemonFromServer;
  vote: (id: number) => void;
}> = ({ pokemon, vote }) => {
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    setLoaded(false);
  }, [pokemon]);

  return (
    <div className="flex flex-col">
      {pokemon && (
        <div className={loaded ? "" : "opacity-0 absolute"}>
          <Image
            src={pokemon.imageUrl}
            width={256}
            height={256}
            alt={pokemon.name}
            onLoadingComplete={() => setLoaded(true)}
          />
        </div>
      )}
      {!loaded && (
        <div className="opacity-30">
          <Image src="/loading.svg" width={256} height={256} alt="loading" />
        </div>
      )}
      <div className="p-4" />
      <button
        disabled={!pokemon}
        onClick={() => pokemon && vote(pokemon.id)}
        className="bg-green-600 hover:bg-green-500 rounded p-2 text-xl capitalize"
      >
        {pokemon ? pokemon.name : "Loading..."}
      </button>
    </div>
  );
};

export default Home;
