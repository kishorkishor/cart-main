import { NextResponse } from 'next/server';
import fullData from '../../../../mocks/data/products.json';

export async function GET(
  _request: Request,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  
  // Try to find by slug first, then by ID
  const product = (fullData as any).data.find(
    (p: any) => p.slug === slug || p.id === slug
  );
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found', status: 404 },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ data: product, status: 200 }, { status: 200 });
}

