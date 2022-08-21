import axios from "axios";
import { prisma } from "../src/backend/utils/prisma";

const doBackfill = async () => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/?limit=493`
  );

  const pokemon = response.data.results.map((p: any, i: number) => ({
    id: i + 1,
    name: p.name,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      i + 1
    }.png`,
  }));

  await prisma.pokemon.createMany({
    data: pokemon,
  });
};

doBackfill();
