/**
 * NOTA:
 * Los videos, títulos, descripciones, categorías y duraciones utilizados en
 * esta página son de carácter provisional y se emplean únicamente como
 * demostración de la estructura, funcionalidad y diseño de la sección.
 *
 * Al momento del desarrollo no se contó con el material audiovisual ni la
 * información definitiva por parte de la clienta, por lo que estos datos
 * deberán ser reemplazados por contenido oficial de ACEDEMA.
 *
 * La página queda completamente funcional y preparada para que en una etapa
 * posterior se integren los videos reales y se realicen los ajustes finales.
 */
'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import styles from './videos.module.css';

type VideoCategory = 'Presentación' | 'Ensayo' | 'Testimonio';

interface VideoItem {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    url: string;      
    category: VideoCategory;
    duration?: string;
}

const mockVideos: VideoItem[] = [
    {
        id: 1,
        title: 'Desfile en San Rafael',
        description: 'Presentación de la banda en el desfile de San Rafael.',
        thumbnail: '/thumbs/desfile.jpg',
        url: 'https://www.youtube.com/embed/VIDEO_ID_1',
        category: 'Presentación',
        duration: '3:45',
    },
    {
        id: 2,
        title: 'Ensayo general de percusión',
        description: 'Sección de percusión preparando repertorio para concierto.',
        thumbnail: '/thumbs/ensayo-percusion.jpg',
        url: 'https://www.youtube.com/embed/VIDEO_ID_2',
        category: 'Ensayo',
        duration: '2:58',
    },
    {
        id: 3,
        title: 'Testimonio de estudiante',
        description: 'Estudiante cuenta su experiencia en ACEDEMA.',
        thumbnail: '/thumbs/testimonio.jpg',
        url: 'https://www.youtube.com/embed/VIDEO_ID_3',
        category: 'Testimonio',
        duration: '1:32',
    },
];

export default function VideosPage() {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem>(mockVideos[0]);

    return (
        <div>
            <Navbar />
            <main className={styles.page}>
                <div className={styles.container}>
                    {/* HERO */}
                    <section className={styles.hero}>
                        <div>
                            <p className={styles.eyebrow}>Galería</p>
                            <h1 className={styles.title}>ACEDEMA en video</h1>
                            <p className={styles.subtitle}>
                                Presentaciones, ensayos y momentos especiales que muestran el trabajo
                                y la pasión de nuestra banda.
                            </p>
                        </div>
                    </section>

                    {/* VIDEO DESTACADO */}
                    <section className={styles.playerSection}>
                        <div className={styles.playerWrapper}>
                            <iframe
                                key={selectedVideo.id}
                                src={selectedVideo.url}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className={styles.playerInfo}>
                            <h2>{selectedVideo.title}</h2>
                            <p className={styles.playerCategory}>{selectedVideo.category}</p>
                            <p className={styles.playerDescription}>{selectedVideo.description}</p>
                        </div>
                    </section>

                    {/* GRID DE VIDEOS */}
                    <section className={styles.gridSection}>
                        <h2 className={styles.sectionTitle}>Más videos</h2>
                        <div className={styles.videosGrid}>
                            {mockVideos.map((video) => (
                                <button
                                    key={video.id}
                                    type="button"
                                    className={`${styles.videoCard} ${
                                        video.id === selectedVideo.id ? styles.videoCardActive : ''
                                    }`}
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    <div className={styles.thumbWrapper}>
                                        <img src={video.thumbnail} alt={video.title} />
                                        {video.duration && (
                                            <span className={styles.duration}>{video.duration}</span>
                                        )}
                                    </div>
                                    <div className={styles.cardText}>
                                        <span className={styles.category}>{video.category}</span>
                                        <h3>{video.title}</h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
