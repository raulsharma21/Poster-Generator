'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface AlbumData {
    album_name: string;
    artist_name: string;
    tracklist: string[];
    cover_url: string;
    copyright_text: string;
    font_size: number;
    color_scheme: number;
}

interface SessionData {
    id: string;
    album_data: AlbumData;
    customization: {
        font_size: number;
        color_scheme: number;
    };
}

export default function Customizer() {
    const params = useParams();
    const [posterData, setPosterData] = useState<AlbumData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPosterLoading, setIsPosterLoading] = useState(true);
    const [updateTimestamp, setUpdateTimestamp] = useState<number>(Date.now());

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                if (!params.sessionId) {
                    throw new Error('No session ID provided');
                }

                const response = await fetch(`/api/session?id=${params.sessionId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch session data');
                }

                const sessionData: SessionData = await response.json();
                setPosterData(sessionData.album_data);
            } catch (error) {
                console.error('Error fetching session data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessionData();
    }, [params.sessionId]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setPosterData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: value,
            };
        });

        setIsPosterLoading(true);

        try {
            await fetch('/api/session', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: params.sessionId,
                    updates: {
                        album_data: {
                            ...posterData,
                            [name]: value,
                        }
                    }
                })
            });
            setUpdateTimestamp(Date.now());
        } catch (error) {
            console.error('Error updating session:', error);
        }
    };

    const handleTracklistChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setPosterData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: name === 'tracklist' ? value.split('\n') : value,
            };
        });

        setIsPosterLoading(true);

        try {
            await fetch('/api/session', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: params.sessionId,
                    updates: {
                        album_data: {
                            ...posterData,
                            [name]: name === 'tracklist' ? value.split('\n') : value,
                        }
                    }
                })
            });
            setUpdateTimestamp(Date.now());
        } catch (error) {
            console.error('Error updating session:', error);
        }
    };

    const handleDownloadPoster = async () => {
        if (!posterData) return;

        const posterUrl = `/api/poster?id=${params.sessionId}&t=${updateTimestamp}`;
        try {
            const response = await fetch(posterUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch the poster image');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${posterData.album_name} - Poster.png`; // File name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading poster:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-smoky_black-100">
                <div className="text-[#e5e5dc]">Loading...</div>
            </div>
        );
    }

    if (!posterData) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-smoky_black-100 space-y-4">
                <div className="text-[#e5e5dc] text-center">
                    <p className="mt-2">Oops! It looks like your session has expired. Sessions expire an hour from creation, back to the lobby!</p>
                </div>
                <Button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 bg-[#f5853f] hover:bg-[#f79c64] text-[#050401] rounded-lg"
                >
                    Return to Homepage
                </Button>
            </div>
        );
    }

    return (
        <div className='bg-smoky_black-100 h-screen flex flex-col'>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 p-4 overflow-hidden">
                <div className="relative lg:w-1/2 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {isPosterLoading && (
                            <div className="absolute inset-0 flex justify-center items-center bg-smoky_black-100 bg-opacity-75 z-10">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full"></div>
                                    <p className="text-[#e5e5dc] mt-4">Generating your poster...</p>
                                </div>
                            </div>
                        )}
                        <div className="relative w-full h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden rounded-2xl">
                            <Image
                                src={`/api/poster?id=${params.sessionId}&t=${updateTimestamp}`}
                                alt={posterData.album_name}
                                fill
                                style={{ objectFit: 'contain', borderRadius: '1rem' }}
                                className="rounded-2xl"
                                onLoadingComplete={() => setIsPosterLoading(false)}
                                priority
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 flex flex-col justify-between p-6">
                    <div className="space-y-8">  {/* Container for form elements with consistent spacing */}
                        <h1 className="wosker-med text-center text-[#e5e5dc]">
                            Customize Your Poster
                        </h1>

                        <div className="flex items-start space-x-4">
                            <label className="text-[#e5e5dc] text-sm w-32 pt-2">Album Name</label>
                            <Input
                                type="text"
                                name="album_name"
                                value={posterData.album_name}
                                onChange={handleInputChange}
                                className="flex-1 bg-[#191308] text-[#e5e5dc] border-[#322a26]"
                            />
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="text-[#e5e5dc] text-sm w-32 pt-2">Artist Name</label>
                            <Input
                                type="text"
                                name="artist_name"
                                value={posterData.artist_name}
                                onChange={handleInputChange}
                                className="flex-1 bg-[#191308] text-[#e5e5dc] border-[#322a26]"
                            />
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="text-[#e5e5dc] text-sm w-32 pt-2">Tracklist</label>
                            <Textarea
                                name="tracklist"
                                value={Array.isArray(posterData.tracklist) ? posterData.tracklist.join("\n") : posterData.tracklist || ''}
                                onChange={handleTracklistChange}
                                placeholder="Tracklist (one per line)"
                                className="flex-1 bg-[#191308] text-[#e5e5dc] border-[#322a26] h-32"
                            />
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="text-[#e5e5dc] text-sm w-32 pt-2">Copyright Text</label>
                            <Input
                                type="text"
                                name="copyright_text"
                                value={posterData.copyright_text}
                                onChange={handleInputChange}
                                placeholder="Copyright Text"
                                className="flex-1 bg-[#191308] text-[#e5e5dc] border-[#322a26]"
                            />
                        </div>
                    </div>

                    <div className="mt-8">  {/* Container for button */}
                        <Button
                            onClick={handleDownloadPoster}
                            className="w-full px-8 py-5 text-white bg-[#f5853f] hover:bg-[#f79c64] text-[#050401]"
                        >
                            Download Poster
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}