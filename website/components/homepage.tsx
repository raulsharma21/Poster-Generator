'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react'


// Mock data for pre-generated posters
const preGeneratedPosters = [
  { id: 1, src: '/images/RHCP.png?height=500&width=350' },
  { id: 2, src: '/images/SZA.png?height=300&width=200' },
  { id: 3, src: '/images/drake2.jpg?height=300&width=200' },
];

interface SearchResult {
  id: number; // Adjust to string if IDs are strings
  cover_url: string;
  album_name: string;
  artist_name: string;
}

export function HomepageComponent() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false)


  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchQuery = (form.elements.namedItem('search') as HTMLInputElement).value;
    setQuery(searchQuery); // Save query for pagination
    setPage(1); // Reset to the first page for a new search
    setSearchResults([]); // Clear previous results
    setIsLoading(true) // Start loading
    try {

      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}&quantity=8`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();  // This already gives you a parsed object
        if (data.error) {
          console.error("Error parsing JSON search results:", data.error.message);
        } else {
          // Access the albums through the result key
          setSearchResults(data.result.albums);  // Changed from data.albums to data.result.albums
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleShowMore = async () => {
    const nextPage = page + 1;
    // setIsLoading(true); // Start loading
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&quantity=${nextPage * 8}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const rawData = await response.json();
        const data = JSON.parse(rawData.result);
        if (data.error) {
          console.error("Error parsing JSON search results:", data.error.message);
        } else {
          setSearchResults([]); // Clear previous results
          setSearchResults((prevResults) => [...prevResults, ...data.albums]);
          setPage(nextPage); // Update to the next page
        }
      } else {
        console.error("Error fetching additional results, response not OK.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const generatePoster = async () => {
    try {
      const selectedAlbum = searchResults.find((result) => result.id === selectedResult);
      if (!selectedAlbum) {
        console.error("Cannot generate poster, no album is selected.");
        return;
      }

      // Create session
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumId: selectedAlbum.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const { sessionId } = await response.json();

      // Navigate to customize page with session ID
      window.location.href = `/customize/${sessionId}`;

    } catch (error) {
      console.error("Error generating poster:", error);
      // Show an error message to the user here
    }
  };


  return (
    <div className="min-h-screen bg-smoky_black-100 text-alabaster-600">
      <header className="pt-8">
        <h1 className="wosker-xxl font-semi text-center text-[#e5e5dc]">PosterOven</h1>
      </header>

      <main className="container mx-auto px-4 py-2">
        <section className="mb-12">
          <div className="flex justify-center items-center mb-8 space-x-4">
            <form onSubmit={handleSearch} className="flex-grow max-w-[50%]">
              <Input
                type="search"
                name="search"
                placeholder="Search for albums or artists"
                autoComplete='off'
                className="w-full text-med py-6 bg-[#191308] text-[#e5e5dc] border-[#322a26] placeholder-[#988d93]"
              />
            </form>

            <Button
              size="lg"
              onClick={generatePoster}
              disabled={!selectedResult}
              className={`px-8 py-4 text-m ${selectedResult ? 'bg-[#f5853f] hover:bg-[#f79c64] text-[#050401]' : 'bg-[#322a26] text-[#988d93]'}`}
            >
              Generate Poster
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center mt-8">
              <Loader2 className="animate-spin text-[#e5e5dc] w-10 h-10" />
            </div>
          ) : (
            searchResults.length > 0 && (
              <div className="mb-12">
                <h2 className="wosker-med mb-4 text-[#e5e5dc]">Search Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((result) => (
                    <Card
                      key={result.id}
                      className={`cursor-pointer transition-all duration-300 hover:bg-[#322a26] ${selectedResult === result.id ? 'bg-[#322a26]' : 'bg-[#191308]'}`}
                      onClick={() => setSelectedResult(result.id)}
                      onDoubleClick={() => {
                        setSelectedResult(result.id); // Ensure it's selected
                        generatePoster(); // Call the poster generation handler
                      }}
                    >
                      <CardContent className="p-4 rounded-lg">
                        <Image
                          src={result.cover_url}
                          alt={result.album_name}
                          width={200}
                          height={200}
                          className="rounded-md mb-2 w-full h-48 object-cover"
                        />
                        <h3 className="font-semibold text-[#e5e5dc] truncate">{result.album_name}</h3>
                        <p className="text-sm text-[#988d93] truncate">{result.artist_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleShowMore}
                    className="text-[#f5853f] hover:text-[#f79c64] hover:bg-transparent"
                    aria-label="Show more results"
                  >
                    <ChevronDown className="h-6 w-6" />
                  </Button>
                </div>

              </div>
            )
          )}
        </section>

        <section className="mb-12">
        <p className="wosker-med text-base mb-4 text-[#e5e5dc] py-4">Featured Posters</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preGeneratedPosters.map((poster) => (
              <Card key={poster.id} className="bg-[#191308] border-[#322a26] flex justify-center items-center">
                <CardContent className="p-4 flex justify-center items-center">
                  <Image src={poster.src} alt={`Poster ${poster.id}`} width={280} height={400} className="rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
