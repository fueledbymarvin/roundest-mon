import { getOptionsForVote } from "@/utils/pokemon";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";

type HomeProps = {
  first: number;
  second: number;
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const [first, second] = getOptionsForVote();
  return { props: { first, second } };
};

const Home: NextPage<HomeProps> = ({ first, second }) => {
  const {
    data: firstPokemon,
    isLoading: isFirstLoading,
    isError: isFirstError,
  } = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: first,
    },
  ]);
  const {
    data: secondPokemon,
    isLoading: isSecondLoading,
    isError: isSecondError,
  } = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: second,
    },
  ]);

  if (isFirstLoading || isSecondLoading) return <>Loading...</>;

  if (isFirstError || isSecondError || !firstPokemon || !secondPokemon)
    return <>Error</>;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="flex flex-col">
          <div className="w-64 h-64">
            <Image
              src={firstPokemon.image}
              width={500}
              height={500}
              alt={firstPokemon.name}
            />
          </div>
          <div className="p-4" />
          <div className="text-xl text-center capitalize">
            {firstPokemon.name}
          </div>
        </div>
        <div className="p-8">Vs</div>
        <div className="flex flex-col">
          <div className="w-64 h-64">
            <Image
              src={secondPokemon.image}
              width={500}
              height={500}
              alt={secondPokemon.name}
            />
          </div>
          <div className="p-4" />
          <div className="text-xl text-center capitalize">
            {secondPokemon.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
