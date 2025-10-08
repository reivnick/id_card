import React, { useState, useEffect } from 'react';
import { Page, Text, Image, Document, StyleSheet, pdf, View } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export default function App() {
    const [name, setName] = useState<string>('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

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
                <Page size={[524, 810]} style={styles.page}>
                    {/* Background template */}
                    <Image src='/idcard_template.png' style={styles.background} />

                    {/* Foto */}
                    {photoDataUrl && (
                        <View style={styles.photoWrapper}>
                            <Image src={photoDataUrl} style={styles.photo} />
                        </View>
                    )}

                    {/* Nama */}
                    <Text style={styles.name}>{name || 'Nama Lengkap'}</Text>
                </Page>
            </Document>
        ).toBlob();

        saveAs(blob, `${name || 'idcard'}.pdf`);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f4f6fa',
                fontFamily: 'Inter, sans-serif',
                padding: '20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    width: '100%',
                    maxWidth: '900px',
                    minHeight: isMobile ? 'auto' : '600px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                }}
            >
                {/* LEFT SIDE - FORM INPUT */}
                <div
                    style={{
                        flex: 1,
                        background: '#ffffff',
                        padding: isMobile ? '20px' : '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: isMobile ? 'auto' : '300px',
                    }}
                >
                    <h2
                        style={{
                            color: '#333',
                            fontWeight: 700,
                            fontSize: '22px',
                            marginBottom: '24px',
                        }}
                    >
                        Buat ID Card
                    </h2>

                    <label style={{ fontSize: 14, color: '#444', marginBottom: 8 }}>Foto:</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handlePhotoChange}
                        style={{
                            marginBottom: 16,
                            padding: isMobile ? 12 : 8,
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            fontSize: isMobile ? '16px' : '14px',
                            minHeight: isMobile ? '44px' : 'auto',
                        }}
                    />

                    <label style={{ fontSize: 14, color: '#444', marginBottom: 8 }}>Nama:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Masukkan nama lengkap'
                        style={{
                            padding: isMobile ? '14px 16px' : '10px 12px',
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            marginBottom: 20,
                            fontSize: isMobile ? '16px' : '14px',
                            minHeight: isMobile ? '44px' : 'auto',
                        }}
                    />

                    <button
                        onClick={handleDownloadPdf}
                        style={{
                            background: 'linear-gradient(135deg, #003A69, #0469BA)',
                            color: '#fff',
                            border: 'none',
                            padding: isMobile ? '16px 24px' : '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            fontSize: isMobile ? '16px' : '14px',
                            minHeight: isMobile ? '48px' : 'auto',
                            width: '100%',
                        }}
                    >
                        Unduh ID Card (PDF)
                    </button>
                </div>

                {/* RIGHT SIDE - LIVE PREVIEW */}
                <div
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #003A69, #0469BA)',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: isMobile ? '20px' : '30px',
                        minHeight: isMobile ? '400px' : '300px',
                    }}
                >
                    <h2
                        style={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '22px',
                            marginBottom: '24px',
                        }}
                    >
                        ID Card Preview
                    </h2>

                    <div
                        style={{
                            width: isMobile ? '100%' : 262,
                            maxWidth: isMobile ? 300 : 262,
                            height: isMobile ? 'auto' : 405,
                            aspectRatio: isMobile ? '3/4' : 'auto',
                            position: 'relative',
                            backgroundImage: "url('/idcard_template.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                            borderRadius: 12,
                        }}
                    >
                        {photoDataUrl ? (
                            <img
                                src={photoDataUrl}
                                alt='preview'
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    transform: 'translate(-50%, -30%)',
                                    width: 150,
                                    height: 150,
                                    borderRadius: '55%',
                                    objectFit: 'cover',
                                    border: '3px solid #fff',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    transform: 'translate(-50%, -30%)',
                                    width: 150,
                                    height: 150,
                                    borderRadius: '55%',
                                    border: '3px dashed #ccc',
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#888',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    textAlign: 'center',
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                                    <div>Photo</div>
                                    <div>Placeholder</div>
                                </div>
                            </div>
                        )}

                        <div
                            style={{
                                position: 'absolute',
                                bottom: 25,
                                left: 0,
                                width: '100%',
                                textAlign: 'center',
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#222',
                            }}
                        >
                            {name || 'Nama Lengkap'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// PDF STYLES
const styles = StyleSheet.create({
    page: {
        position: 'relative',
        backgroundColor: '#fff',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    photoWrapper: {
        position: 'absolute',
        top: '20%',
        left: '17%',
        width: 350,
        height: 350,
        borderRadius: 200,
        overflow: 'hidden',
        border: '3px solid #fff',
    },
    photo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 200,
    },
    name: {
        position: 'absolute',
        bottom: 55,
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
});
