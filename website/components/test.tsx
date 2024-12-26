'use client'

import { useSearchParams } from 'next/navigation';

export default function Page2() {
    const searchParams = useSearchParams();
    const name = searchParams.get('name');
    const age = searchParams.get('age');
  

  return (
    <div>
      <h1>Name: {name}</h1>
      <h1>Age: {age}</h1>
    </div>
  );
}