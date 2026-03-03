import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Image as ImageIcon } from 'lucide-react';

interface ImageData {
    url: string;
    alt: string;
    caption?: string;
}

interface ImageContentProps {
    imageData: ImageData;
}

export default function ImageContent({ imageData }: ImageContentProps) {
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 25, 50));
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <>
            <div className="h-full flex flex-col p-6 bg-[#111317]/80 backdrop-blur-xl border border-gray-800 rounded-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#A855F7]" />
                        <span className="text-sm font-semibold text-[#D0D0E0]">Visual Reference</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 50}
                            className="p-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-[#D0D0E0] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-[#A0A0B0] w-12 text-center">{zoom}%</span>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 200}
                            className="p-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-[#D0D0E0] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleFullscreen}
                            className="p-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-[#D0D0E0] rounded-lg transition-colors ml-2"
                            title="Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div className="flex-1 bg-gray-950 border border-gray-800 rounded-lg overflow-auto">
                    <div className="min-h-full flex items-center justify-center p-4">
                        <img
                            src={imageData.url}
                            alt={imageData.alt}
                            style={{ transform: `scale(${zoom / 100})` }}
                            className="max-w-full h-auto transition-transform duration-200 origin-center"
                        />
                    </div>
                </div>

                {/* Caption */}
                {imageData.caption && (
                    <div className="mt-4 p-3 bg-[#111317] border border-gray-800 rounded-lg">
                        <p className="text-sm text-[#A0A0B0]">{imageData.caption}</p>
                    </div>
                )}

                {/* Info */}
                <div className="mt-4 flex items-center gap-2 text-xs text-[#808090]">
                    <div className="w-2 h-2 bg-[#4F0F93] rounded-full"></div>
                    <span>Study the diagram to understand the concept visually</span>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={handleFullscreen}
                >
                    <button
                        onClick={handleFullscreen}
                        className="absolute top-4 right-4 p-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-white rounded-lg transition-colors"
                    >
                        ✕
                    </button>
                    <img
                        src={imageData.url}
                        alt={imageData.alt}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {imageData.caption && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl bg-[#111317]/90 backdrop-blur-xl border border-gray-800 rounded-lg p-4">
                            <p className="text-sm text-[#D0D0E0] text-center">{imageData.caption}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
