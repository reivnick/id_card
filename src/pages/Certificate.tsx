import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function Certificate() {
    const [name, setName] = useState<string>('');
    const [noLegal, setNoLegal] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Function to format date to Indonesian format
    const formatDateToIndonesian = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    };


    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDownloadPdf = async () => {
        try {
            const { pdf, Document, Page, View, Image, Text, StyleSheet } = await import('@react-pdf/renderer');

            const styles = StyleSheet.create({
                page: {
                    position: 'relative',
                    width: 651,
                    height: 460,
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
                    bottom: 130,
                    width: '100%',
                    alignItems: 'center',
                    textAlign: 'center',
                },
                noLegal: {
                    fontSize: 12,
                    color: '#55524C',
                    fontStyle: 'italic',
                },
                name: {
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#55524C',
                    marginTop: 40,
                    fontFamily: 'Times-Roman',
                },
                date: {
                    fontSize: 12,
                    color: '#55524C',
                    fontStyle: 'italic',
                    marginTop: 70,
                },
            });

            const blob = await pdf(
                <Document>
                    <Page size={[651, 460]} style={styles.page}>
                        <Image src="/{INPUT_IMAGE}" style={styles.background} />

                        <View style={styles.contentContainer}>
                            <Text style={styles.noLegal}>
                                No Legal: {noLegal || 'xx/xxx/xxxx'}
                            </Text>

                            <Text style={styles.name}>
                                {name || 'Nama Lengkap'}
                            </Text>

                            <Text style={styles.date}>
                                {formatDateToIndonesian(date) || 'tanggal sertifikat keluar'}
                            </Text>
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
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} w-full max-w-[1200px] ${isMobile ? 'min-h-auto' : 'min-h-[600px]'} rounded-2xl overflow-hidden shadow-lg`}>

                {/* LEFT SIDE - FORM INPUT */}
                <div className={`flex-1 bg-white ${isMobile ? 'p-5' : 'p-10'} flex flex-col justify-center ${isMobile ? 'min-h-auto' : 'min-h-[300px]'}`}>
                    <h2 className="text-gray-800 font-bold text-xl mb-6">
                        Buat Sertifikat
                    </h2>

                    <label className="text-sm text-black mb-2">Nama:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Masukkan nama lengkap'
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    />

                    <label className="text-sm text-black mb-2">No.Legal:</label>
                    <input
                        value={noLegal}
                        onChange={(e) => setNoLegal(e.target.value)}
                        placeholder='Masukkan nomor legal'
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    />

                    <label className="text-sm text-black mb-2">Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`rounded-md border border-gray-300 mb-4 ${isMobile ? 'text-base min-h-11 px-4 py-3.5' : 'text-sm px-3 py-2.5'}`}
                    />

                    <button
                        onClick={handleDownloadPdf}
                        className={`bg-[#008EDF] text-white border-none ${isMobile ? 'py-4 px-6' : 'py-3 px-5'} rounded-lg cursor-pointer font-semibold tracking-wide ${isMobile ? 'text-base' : 'text-sm'} ${isMobile ? 'min-h-12' : ''} w-full`}
                    >
                        Unduh Sertifikat (PDF)
                    </button>
                </div>

                {/* RIGHT SIDE - LIVE PREVIEW */}
                <div className={`flex-1 bg-[#008EDF] text-white flex flex-col justify-center items-center ${isMobile ? 'p-5' : 'p-10'} ${isMobile ? 'min-h-[600px]' : 'min-h-[600px]'}`}>
                    <h2 className="text-white font-bold text-xl mb-6">
                        Sertifikat Preview
                    </h2>

                    <div
                        className={`relative bg-cover bg-center shadow-lg rounded-xl w-[651px] h-[460px]`}
                        style={{ backgroundImage: "url('/{INPUT_IMAGE}')" }}
                    >
                        {/* Text Column Container */}
                        <div className="absolute bottom-[28%] left-0 w-full flex flex-col items-center justify-start px-7 space-y-2">
                            {/* Legal */}
                            <div className="w-full text-center">
                                <div className="text-xs text-[#55524C] italic">No Legal: {noLegal || 'xx/xxx/xxxx'}</div>
                            </div>

                            {/* Name */}
                            <div className="w-full text-center text-xl font-bold text-[#55524C] max-w-full pt-8" style={{ fontFamily: 'Times New Roman, serif' }}>
                                {name || 'Nama Lengkap'}
                            </div>

                            {/* Date */}
                            <div className="w-full text-center italic pt-14">
                                <div className="text-xs text-[#55524C]">{formatDateToIndonesian(date) || 'tanggal sertifikat keluar'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


