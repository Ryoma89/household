import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY;

  console.log("Received date:", date);

  const cleanedDate = date.split('T')[0];
  const parsedDate = new Date(cleanedDate);
  const year = parsedDate.getUTCFullYear();
  const month = (parsedDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = parsedDate.getUTCDate().toString().padStart(2, '0');

  const BASE_URL = `https://openexchangerates.org/api/historical/${year}-${month}-${day}.json?app_id=${API_KEY}`;

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch historical exchange rates');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.log(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
