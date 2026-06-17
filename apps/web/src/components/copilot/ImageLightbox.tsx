import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

interface ImageLightboxProps {
    file: any;
    onClose: () => void;
}

export default function ImageLightbox({ file, onClose }: ImageLightboxProps) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) return;

        const isClientFile = file instanceof File;
        const type = isClientFile ? file.type : file.type;

        if (isClientFile) {
            const url = URL.createObjectURL(file);
            setImgUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (file.base64) {
            setImgUrl(`data:${type};base64,${file.base64}`);
        } else if (file.url) {
            setImgUrl(file.url);
        }
    }, [file]);

    const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 4));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.25));
    const handleRotate = () => setRotation(r => (r + 90) % 360);

    if (!imgUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">
            {/* Cinematic Backdrop */}
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Top Toolbar */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
                <a 
                    href={imgUrl}
                    download={file.name}
                    className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all cursor-pointer"
                    title="Download Image"
                >
                    <Download className="w-4.5 h-4.5" />
                </a>
                <button 
                    onClick={onClose}
                    className="p-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-all cursor-pointer"
                >
                    <X className="w-4.5 h-4.5" />
                </button>
            </div>

            {/* Bottom Floating Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl z-50 shadow-2xl">
                <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 text-white/80 hover:text-white rounded-xl transition-colors cursor-pointer">
                    <ZoomOut className="w-4 h-4" />
                </button>
                <div className="px-3 text-xs font-mono font-bold text-white/90 select-none">
                    {(scale * 100).toFixed(0)}%
                </div>
                <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 text-white/80 hover:text-white rounded-xl transition-colors cursor-pointer">
                    <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/20 mx-1" />
                <button onClick={handleRotate} className="p-2 hover:bg-white/20 text-white/80 hover:text-white rounded-xl transition-colors cursor-pointer" title="Rotate">
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>

            {/* Image Canvas */}
            <div className="relative w-full h-full flex items-center justify-center p-12 pointer-events-none">
                <img 
                    src={imgUrl} 
                    alt={file.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out pointer-events-auto shadow-2xl"
                    style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
                />
            </div>
        </div>
    );
}