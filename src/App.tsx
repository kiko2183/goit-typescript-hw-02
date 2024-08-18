import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from './components/ImageModal/ImageModal';
import './App.css';

interface Image {
    id: string;
    urls: {
        small: string;
        regular: string;
    };
    alt_description: string;
    description?: string;
    user: {
        name: string;
    };
}

const API_KEY = 'wbB7YEXF0pq-3PWq_kDrvmAaoaKHr6r5vdEDCtH8JK0';

const App: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    useEffect(() => {
        if (!query) return;

        const fetchImages = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get('https://api.unsplash.com/search/photos', {
                    params: {
                        query,
                        page,
                        per_page: 12,
                    },
                    headers: {
                        Authorization: `Client-ID ${API_KEY}`,
                    },
                });

                if (response.data.results.length === 0) {
                    toast.error('No images found for this query');
                } else {
                    setImages(prevImages => [...prevImages, ...response.data.results]);
                }
            } catch (error) {
                setError('Failed to fetch images');
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [query, page]);

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setImages([]);
        setPage(1);
    };

    const loadMoreImages = () => {
        setPage(prevPage => prevPage + 1);
    };

    const openModal = (image: Image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="app">
            <SearchBar onSubmit={handleSearch} />
            {error && <ErrorMessage message={error} />}
            <ImageGallery images={images} onImageClick={openModal} />
            {isLoading && <Loader />}
            {images.length > 0 && !isLoading && <LoadMoreBtn onClick={loadMoreImages} />}
            <ImageModal isOpen={!!selectedImage} onClose={closeModal} image={selectedImage} />
            <Toaster />
        </div>
    );
};

export default App;
