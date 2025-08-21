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

function sortProducts(products: Product[], sortBy: string, sortOrder: string) {
  const sorted = [...products];
  
  sorted.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'price':
        aValue = a.sale_price ?? a.price;
        bValue = b.sale_price ?? b.price;
        break;
      case 'rating':
        aValue = a.average_rating || 0;
        bValue = b.average_rating || 0;
        break;
      case 'created':
        aValue = new Date(a.created_at || 0);
        bValue = new Date(b.created_at || 0);
        break;
      case 'name':
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const limit = Math.max(parseInt(searchParams.get('limit') || '20', 10), 1);
  const sortBy = searchParams.get('sort_by') || 'name';
  const sortOrder = searchParams.get('sort_order') || 'asc';

  let filtered = filterProducts(fullData.data, searchParams);
  
  // Apply sorting
  filtered = sortProducts(filtered, sortBy, sortOrder);

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


