'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import debounce from 'lodash/debounce'

interface PosterData {
    album_name: string
    artist_name: string
    tracklist: string
    copyright_text: string
    font_size: number
    color_scheme: number
}

export default function Customizer() {
    const [posterData, setPosterData] = useState<PosterData>({
        album_name: '',
        artist_name: '',
        tracklist: '',
        copyright_text: '',
        font_size: 16,
        color_scheme: 50,
    })
    const [posterUrl, setPosterUrl] = useState('/placeholder.svg?height=600&width=400')

    const generatePoster = useCallback(async (data: PosterData) => {
        try {
            const response = await fetch('/api/generate-poster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const result = await response.json()
                setPosterUrl(result.posterUrl)
            } else {
                console.error('Failed to generate poster')
            }
        } catch (error) {
            console.error('Error generating poster:', error)
        }
    }, [])

    const debouncedGeneratePoster = useCallback(
        debounce((data: PosterData) => generatePoster(data), 500),
        [generatePoster]
    )

    useEffect(() => {
        debouncedGeneratePoster(posterData)
    }, [posterData, debouncedGeneratePoster])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPosterData(prev => ({ ...prev, [name]: value }))
    }

    const handleSliderChange = (name: string) => (value: number[]) => {
        setPosterData(prev => ({ ...prev, [name]: value[0] }))
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(posterUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = 'custom_poster.png'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading poster:', error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#e5e5dc]">Customize Your Poster</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                    <Image
                        src={posterUrl}
                        alt="Custom Poster"
                        width={600}
                        height={800}
                        className="rounded-lg shadow-lg"
                    />
                </div>
                <div className="lg:w-1/2 space-y-6">
                    <Input
                        type="text"
                        name="album_name"
                        value={posterData.album_name}
                        onChange={handleInputChange}
                        placeholder="Album Name"
                        className="bg-[#191308] text-[#e5e5dc] border-[#322a26]"
                    />
                    <Input
                        type="text"
                        name="artist_name"
                        value={posterData.artist_name}
                        onChange={handleInputChange}
                        placeholder="Artist Name"
                        className="bg-[#191308] text-[#e5e5dc] border-[#322a26]"
                    />
                    <Textarea
                        name="tracklist"
                        value={posterData.tracklist}
                        onChange={handleInputChange}
                        placeholder="Tracklist (one per line)"
                        className="bg-[#191308] text-[#e5e5dc] border-[#322a26] h-32"
                    />
                    <Input
                        type="text"
                        name="copyright_text"
                        value={posterData.copyright_text}
                        onChange={handleInputChange}
                        placeholder="Copyright Text"
                        className="bg-[#191308] text-[#e5e5dc] border-[#322a26]"
                    />
                    <div>
                        <label className="block text-sm font-medium text-[#e5e5dc] mb-2">Font Size</label>
                        <Slider
                            min={12}
                            max={24}
                            step={1}
                            value={[posterData.font_size]}
                            onValueChange={handleSliderChange('font_size')}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#e5e5dc] mb-2">Color Scheme</label>
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[posterData.color_scheme]}
                            onValueChange={handleSliderChange('color_scheme')}
                            className="w-full"
                        />
                    </div>
                    <Button
                        onClick={handleDownload}
                        className="w-full bg-[#f5853f] hover:bg-[#f79c64] text-[#050401]"
                    >
                        Download Poster
                    </Button>
                </div>
            </div>
        </div>
    )
}

