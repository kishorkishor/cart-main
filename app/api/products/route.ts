import { NextResponse } from 'next/server';
import fullData from '../../../mocks/data/products.json';

type Product = (typeof fullData)["data"][number];

function filterProducts(products: Product[], params: URLSearchParams) {
  let result = [...products];

  const q = params.get('q') || params.get('search') || '';
  const minPrice = parseFloat(params.get('min_price') || '');
  const maxPrice = parseFloat(params.get('max_price') || '');
  const inStock = params.get('in_stock');
  const category = params.get('category');
  const tags = params.get('tags');

  if (q) {
    const qLower = q.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(qLower) ||
      p.description.toLowerCase().includes(qLower) ||
      p.tags?.some(t => t.toLowerCase().includes(qLower))
    );
  }

  if (!Number.isNaN(minPrice)) {
    result = result.filter(p => (p.sale_price ?? p.price) >= minPrice);
  }

  if (!Number.isNaN(maxPrice)) {
    result = result.filter(p => (p.sale_price ?? p.price) <= maxPrice);
  }

  if (inStock !== null) {
    const wantInStock = inStock === 'true' || inStock === '1';
    result = result.filter(p => wantInStock ? p.stock > 0 : p.stock === 0);
  }

  if (category) {
    result = result.filter(p => p.category?.id === category || p.category?.slug === category);
  }

  if (tags) {
    const set = new Set(tags.split(',').map(t => t.trim().toLowerCase()));
    result = result.filter(p => p.tags?.some(t => set.has(t.toLowerCase())));
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const limit = Math.max(parseInt(searchParams.get('limit') || '20', 10), 1);

  const filtered = filterProducts(fullData.data, searchParams);

  const start = (page - 1) * limit;
  const end = start + limit;
  const paged = filtered.slice(start, end);

  const response = {
    data: paged,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
    message: 'Products retrieved successfully',
    status: 200,
  };

  return NextResponse.json(response, { status: 200 });
}


