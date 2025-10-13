import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function IdCard() {
    const [name, setName] = useState<string>('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [type, setType] = useState<string>('nurse');

    const [photoPosition, setPhotoPosition] = useState({ x: 0, y: 0 });
    const [photoScale, setPhotoScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState<{ x: number; y: number } | null>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };



    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !startDrag) return;
        const dx = e.clientX - startDrag.x;
        const dy = e.clientY - startDrag.y;

        setPhotoPosition((prev) => ({
            x: Math.max(Math.min(prev.x + dx, 50), -50), // batasi pergeseran
            y: Math.max(Math.min(prev.y + dy, 50), -50),
        }));
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setStartDrag(null);
    };


    const getTypeDisplayText = (typeValue: string) => {
        return typeValue === 'nurse' ? 'Perawat' : 'Caregiver';
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDownloadPdf = async () => {
        if (!photoDataUrl) {
            alert('Silakan pilih foto terlebih dahulu!');
            return;
        }

        try {
            // Dynamic import - only loads when user clicks download
            const { pdf, Document, Page, View, Image, Text, StyleSheet } = await import('@react-pdf/renderer');

            // Create styles dynamically since StyleSheet is also imported
            const styles = StyleSheet.create({
                page: {
                    position: 'relative',
                    width: 353,
                    height: 600,
                },
                background: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                },
                contentContainer: {
                    position: 'absolute',
                    top: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 353,
                    gap: 10,
                },
                photoWrapper: {
                    width: 260,
                    height: 260,
                    overflow: 'hidden',
                },
                photo: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 10,
                },
                name: {
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#111827',
                    width: '90%',
                    lineHeight: 1.2,
                    paddingHorizontal: 24,
                    flexWrap: 'wrap',
                },
                typeBox: {
                    minWidth: 120,
                    minHeight: 34,
                    backgroundColor: '#008EDF',
                    borderRadius: 17,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                typeText: {
                    color: '#FFFFFF',
                    fontSize: 20,
                    fontWeight: 'light',
                },
                websiteText: {
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'light',
                    color: '#212121',
                    width: '100%',
                },
            });

            const blob = await pdf(
                <Document>
                    <Page size={[353, 600]} style={styles.page}>
                        {/* Background template */}
                        <Image src='/idcard_template.png' style={styles.background} />

                        {/* Content Container - Column Layout */}
                        <View style={styles.contentContainer}>
                            {/* Foto */}
                            {photoDataUrl && (
                                <View
                                    style={{
                                        ...styles.photoWrapper,
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    <Image
                                        src={photoDataUrl}
                                        style={{
                                            ...styles.photo,
                                            objectFit: 'contain',
                                            transform: `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${photoScale})`,
                                            transformOrigin: 'center center',
                                        }}
                                    />
                                </View>
                            )}

                            {/* Nama */}
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <Text style={styles.name}>{name || 'Nama Lengkap'}</Text>
                            </View>

                            {/* Type Box */}
                            <View style={styles.typeBox}>
                                <Text style={styles.typeText}>{getTypeDisplayText(type)}</Text>
                            </View>

                            {/* Website Text */}
                            <Text style={styles.websiteText}>www.insanmedika.co.id</Text>
                        </View>
                    </Page>
                </Document>
            ).toBlob();

            saveAs(blob, `${name || 'idcard'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-100 to-white font-['Inter',sans-serif] p-5">
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full max-w-[900px] ${isMobile ? 'min-h-auto' : 'min-h-[600px]'} rounded-2xl overflow-hidden shadow-lg`}>
                {/* LEFT SIDE - FORM INPUT */}
                <div className={`flex-1 bg-white ${isMobile ? 'p-5' : 'p-10'} flex flex-col justify-center ${isMobile ? 'min-h-auto' : 'min-h-[300px]'}`}>
                    <h2 className="text-gray-800 font-bold text-xl mb-6">
                        Buat ID Card
                    </h2>

                    <label className="text-sm text-black mb-2">Foto:</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handlePhotoChange}
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    />

                    <label className="text-sm text-black mb-2">Zoom Foto:</label>
                    <input
                        type="range"
                        min="0.8"
                        max="2"
                        step="0.05"
                        value={photoScale}
                        onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
                        className="w-full mb-4 accent-[#008EDF]"
                    />


                    <label className="text-sm text-black mb-2">Nama Singkat: (Hanya 1 Baris)</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Masukkan 1 baris nama singkat'
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    />

                    <label className="text-sm text-black mb-2">Tipe:</label>
                    <div className="relative mb-4">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className={`w-full appearance-none rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#008EDF] ${isMobile
                                ? 'text-base min-h-11 px-4 py-3.5 pr-10'
                                : 'text-sm px-3 py-2.5 pr-8'
                                }`}
                        >
                            <option value="nurse">Perawat</option>
                            <option value="caregiver">Caregiver</option>
                        </select>

                        {/* custom arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadPdf}
                        className={`bg-[#008EDF] text-white border-none ${isMobile ? 'py-4 px-6' : 'py-3 px-5'} rounded-lg cursor-pointer font-semibold tracking-wide ${isMobile ? 'text-base' : 'text-sm'} ${isMobile ? 'min-h-12' : ''} w-full`}
                    >
                        Unduh ID Card (PDF)
                    </button>
                </div>

                {/* RIGHT SIDE - LIVE PREVIEW */}
                <div className={`flex-1 bg-[#008EDF] text-white flex flex-col justify-center items-center ${isMobile ? 'p-5' : 'p-7.5'} ${isMobile ? 'min-h-[600px]' : 'min-h-[300px]'}`}>
                    <h2 className="text-white font-bold text-xl mb-6">
                        ID Card Preview
                    </h2>

                    <div
                        className={`relative bg-cover bg-center shadow-lg rounded-xl w-full max-w-[271px] h-[460px] ${isMobile ? 'aspect-[3/4]' : ''} transition-all duration-200 ${isDraggingFile ? 'ring-4 ring-blue-400 ring-offset-2' : ''
                            }`}
                        style={{ backgroundImage: "url('/idcard_template.png')" }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                    >
                        {photoDataUrl ? (
                            <div
                                className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[190px] h-[190px] rounded-[12px] overflow-hidden border border-gray-200 bg-gray-100 cursor-grab active:cursor-grabbing"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <img
                                    src={photoDataUrl}
                                    alt="preview"
                                    className="absolute select-none pointer-events-none"
                                    style={{
                                        width: 'auto',
                                        height: '100%',
                                        objectFit: 'contain',
                                        transform: `translate(${photoPosition.x}px, ${photoPosition.y}px) scale(${photoScale})`,
                                        transformOrigin: 'center center',
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[190px] h-[190px] rounded-[12px] border-3 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-xs font-medium text-center">
                                <div>
                                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                                    <div>{isDraggingFile ? 'Lepaskan foto di sini' : 'Tarik & Jatuhkan foto'}</div>
                                    <div>atau klik upload</div>
                                </div>
                            </div>
                        )}

                        {/* Text Column Container */}
                        <div className="absolute bottom-[11%] left-0 w-full flex flex-col items-center justify-start px-7 space-y-2">
                            {/* Name */}
                            <div className="w-full text-center text-lg font-bold text-gray-900 leading-tight break-words max-w-full">
                                {name || 'Nama Lengkap'}
                            </div>

                            {/* Type Box */}
                            <div className="w-[110px] h-[30px] bg-[#008EDF] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-normal">
                                    {getTypeDisplayText(type)}
                                </span>
                            </div>

                            {/* Insanmedika Text */}
                            <div className="w-full text-center text-sm font-light text-gray-900">
                                www.insanmedika.co.id
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


