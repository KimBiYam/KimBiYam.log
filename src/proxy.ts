import { NextRequest, NextResponse } from 'next/server';

export const proxy = (request: NextRequest) => {
  const tag = request.nextUrl.searchParams.get('tag');

  if (!tag) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.pathname = tag === 'all' ? '/' : `/tags/${tag}`;
  destination.search = '';

  return NextResponse.redirect(destination, 308);
};

export const config = {
  matcher: '/',
};
