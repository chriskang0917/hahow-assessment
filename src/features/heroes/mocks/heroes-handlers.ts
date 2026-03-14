import { http, HttpResponse } from "msw";

const baseURL = "https://hahow-recruit.herokuapp.com";

const mockHeroes = [
  { id: "1", name: "Ditto", image: "https://hahow-recruit.herokuapp.com/images/ditto.png" },
  { id: "2", name: "Pikachu", image: "https://hahow-recruit.herokuapp.com/images/pikachu.png" },
  { id: "3", name: "Charizard", image: "https://hahow-recruit.herokuapp.com/images/charizard.png" },
  { id: "4", name: "Mew", image: "https://hahow-recruit.herokuapp.com/images/mew.png" },
];

const mockProfiles: Record<string, { str: number; int: number; agi: number; luk: number }> = {
  "1": { str: 2, int: 7, agi: 5, luk: 6 },
  "2": { str: 5, int: 5, agi: 5, luk: 5 },
  "3": { str: 8, int: 4, agi: 6, luk: 2 },
  "4": { str: 3, int: 9, agi: 4, luk: 4 },
};

export const heroesHandlers = [
  http.get(`${baseURL}/heroes`, () => HttpResponse.json(mockHeroes)),

  http.get(`${baseURL}/heroes/:heroId/profile`, ({ params }) => {
    const profile = mockProfiles[params.heroId as string];
    if (!profile) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(profile);
  }),

  http.patch(`${baseURL}/heroes/:heroId/profile`, async ({ params, request }) => {
    const body = await request.json();
    mockProfiles[params.heroId as string] = body as (typeof mockProfiles)["1"];
    return HttpResponse.json(body);
  }),
];
