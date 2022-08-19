import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["hello", { text: "Hi" }]);
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-purple-400"></div>
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-pink-400"></div>
      </div>
    </div>
  );
};

export default Home;
