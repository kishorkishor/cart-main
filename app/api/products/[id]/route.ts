import { NextResponse } from 'next/server';
import fullData from '../../../../mocks/data/products.json';

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const product = (fullData as any).data.find(
    (p: any) => p.id === id || p.slug === id
  );

  if (!product) {
    return NextResponse.json(
      { message: 'Product not found', status: 404 },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { data: product, status: 200 },
    { status: 200 }
  );
}


