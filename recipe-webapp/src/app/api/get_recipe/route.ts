import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { type } = await req.json();
  const apiKey = process.env.SPOONACULAR_API_KEY;

  // 1. Fetch data from Spoonacular
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?number=5&type=${type}&addRecipeInformation=true&apiKey=${apiKey}`
  );
  const data = await response.json();
  console.log('📦 Spoonacular API Response:', data);


  if (!data.results) {
    return NextResponse.json({ error: 'No recipes returned' }, { status: 400 });
  }

  // 2. Create or find the category
  const category = await prisma.category.upsert({
    where: { name: type },
    update: {},
    create: { name: type },
  });

  // 3. Create recipes (without upsert logic)
  for (const r of data.results) {
    try {
      await prisma.recipe.create({
        data: {
          title: r.title,
          imageUrl: r.image,
          instructions: r.instructions,
          ingredient: r.extendedIngredients?.map((i: any) => i.original) || [],
          categoryId: category.id,
        },
      });
    } catch (error) {
      console.error(`❌ Skipping recipe "${r.title}" due to error:`, error);
    }
  }

  return NextResponse.json({ message: 'Recipes fetched and stored successfully.' });
}
