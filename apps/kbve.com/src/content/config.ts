import { z, defineCollection } from 'astro:content';

//*         [Applications]
const application = defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()), 
      category: z.string(),
      footnote: z.string().optional(),
      author: z.string().default('KBVE Team'),
      unsplash: z.string().default(''),
      img: z.string().default(''),
      date: z.string().optional(),
      url: z.string().optional(),
      information: z.string().optional(),
      media: z.any().optional(),
      lottie: z.string().optional(),
    }),
  });
  

//*         [Assets]

//?         {Crypto}
const crypto = defineCollection({
    schema: z.object({
      ticker: z.string(),
      title: z.string(),
      description: z.string(),
      isin: z.string().optional(),
      cusip: z.string().optional(),
      exchange: z.string(),
      tags: z.array(z.string()), 
      footnote: z.string().optional(),
      author: z.string().default('KBVE Team'),
      unsplash: z.string().default(''),
      img: z.string().default(''),
      date: z.string().optional(),
      url: z.string().optional(),
    }),
  });


//*         [Blog]

//?         {Journal}
const journal = defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()), 
      footnote: z.string().optional(),
      author: z.string().default('KBVE Team'),
      unsplash: z.string().default(''),
      img: z.string().default(''),
      date: z.date().optional(),
      url: z.string().optional(),
    }),
  });

//*         [Tools]
const tools = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    js_integrity: z.string().optional(),
    js_file: z.string().optional(),
    wasm_integrity: z.string().optional(),
    wasm_file:  z.string().optional()
  }),
});

//*         [Comic]
const comic = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()), 
    category: z.string(),
    series: z.string(),
    npc: z.string(),
    footnote: z.string().optional(),
    author: z.string().default('KBVE Team'),
    unsplash: z.string().default(''),
    img: z.string().default(''),
    date: z.string().optional(),
    url: z.string().optional(),
    information: z.string().optional(),
    media: z.any().optional(),
    lottie: z.string().optional(),
  }),
});

export const collections = {

    //*     [Applications]
    application: application,

    //*     [Assets]
    crypto: crypto,

    //*     [Blog]
    journal: journal,

    //*     [Tools]
    tools: tools,

    //*     [Comic]
    comic: comic,

}