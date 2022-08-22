import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "type-fest";

type ResultsPageProps = {
  pokemon: AsyncReturnType<typeof getPokemon>;
};

const ResultsPage: NextPage<ResultsPageProps> = ({ pokemon }) => {
  return (
    <div className="flex flex-col items-center p-8">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl text-center mb-4">Results</h2>
        <div className="flex items-center space-x-4 w-full py-4">
          <div className="w-24">Pokemon</div>
          <div className="flex-[2]">Name</div>
          <div className="text-right flex-1">Votes For</div>
          <div className="text-right flex-1">Votes Against</div>
          <div className="text-right flex-1">Win %</div>
        </div>
        {pokemon.map((p) => (
          <PokemonListing pokemon={p} key={p.id} />
        ))}
      </div>
    </div>
  );
};

const PokemonListing: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemon>[number];
}> = ({ pokemon }) => {
  return (
    <div className="flex items-center space-x-4 border-t py-4">
      <div className="w-24">
        <Image
          src={pokemon.imageUrl}
          width={64}
          height={64}
          alt={pokemon.name}
          layout="fixed"
        />
      </div>
      <div className="capitalize flex-[2]">{pokemon.name}</div>
      <div className="text-right flex-1">{pokemon._count.votesFor}</div>
      <div className="text-right flex-1">{pokemon._count.votesAgainst}</div>
      <div className="text-right flex-1">
        {(winRate(pokemon) * 100).toFixed(2)}%
      </div>
    </div>
  );
};

const getPokemon = () =>
  prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      _count: {
        select: {
          votesAgainst: true,
          votesFor: true,
        },
      },
    },
  });

const winRate = (p: AsyncReturnType<typeof getPokemon>[number]) =>
  p._count.votesFor / (p._count.votesFor + p._count.votesAgainst || 1);

export const getStaticProps: GetStaticProps = async () => {
  const pokemon = await getPokemon();
  pokemon.sort((a, b) => {
    return winRate(b) - winRate(a);
  });
  return { props: { pokemon }, revalidate: 60 };
};

export default ResultsPage;
