import React, { useState, useEffect } from 'react';
import { Page, Text, Image, Document, StyleSheet, pdf, View } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export default function App() {
    const [name, setName] = useState<string>('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [type, setType] = useState<string>('nurse');

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

        const blob = await pdf(
            <Document>
                <Page size={[353, 600]} style={styles.page}>
                    {/* Background template */}
                    <Image src='/idcard_template.png' style={styles.background} />

                    {/* Content Container - Column Layout */}
                    <View style={styles.contentContainer}>
                        {/* Foto */}
                        {photoDataUrl && (
                            <View style={styles.photoWrapper}>
                                <Image src={photoDataUrl} style={styles.photo} />
                            </View>
                        )}

                        {/* Nama */}
                        <Text style={styles.name}>{name || 'Nama Lengkap'}</Text>

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
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 font-['Inter',sans-serif] p-5">
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

                    <label className="text-sm text-black mb-2">Nama:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Masukkan nama lengkap'
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    />

                    <label className="text-sm text-black mb-2">Tipe:</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    >
                        <option value="nurse">Perawat</option>
                        <option value="caregiver">Caregiver</option>
                    </select>

                    <button
                        onClick={handleDownloadPdf}
                        className={`bg-[#008EDF] text-white border-none ${isMobile ? 'py-4 px-6' : 'py-3 px-5'} rounded-lg cursor-pointer font-semibold tracking-wide ${isMobile ? 'text-base' : 'text-sm'} ${isMobile ? 'min-h-12' : ''} w-full`}
                    >
                        Unduh ID Card (PDF)
                    </button>
                </div>

                {/* RIGHT SIDE - LIVE PREVIEW */}
                <div className={`flex-1 bg-[#008EDF] text-white flex flex-col justify-center items-center ${isMobile ? 'p-5' : 'p-7.5'} ${isMobile ? 'min-h-[400px]' : 'min-h-[300px]'}`}>
                    <h2 className="text-white font-bold text-xl mb-6">
                        ID Card Preview
                    </h2>

                    <div
                        className={`relative bg-cover bg-center shadow-lg rounded-xl w-full max-w-[271px] ${isMobile ? 'h-auto' : 'h-[460px]'} ${isMobile ? 'aspect-[3/4]' : ''}`}
                        style={{ backgroundImage: "url('/idcard_template.png')" }}
                    >
                        {photoDataUrl ? (
                            <img
                                src={photoDataUrl}
                                alt='preview'
                                className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[150px] h-[150px] rounded-[12px] object-cover border-3 border-[#008EDF]"
                            />
                        ) : (
                            <div className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[150px] h-[150px] rounded-[12px] border-3 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-xs font-medium text-center">
                                <div>
                                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                                    <div>Photo</div>
                                    <div>Placeholder</div>
                                </div>
                            </div>
                        )}

                        {/* Text Column Container */}
                        <div className="absolute top-[61%] left-0 w-full flex flex-col items-center justify-start px-7 space-y-2">
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
        width: 210,
        height: 210,
        borderRadius: 12,
        overflow: 'hidden',
        border: '3px solid #008EDF',
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
        width: '100%',
        lineHeight: 1.2,
        paddingHorizontal: "8px",
        paddingVertical: "4px",
        flexWrap: 'wrap',
        wordWrap: 'break-word',
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

