import React from 'react';
import ImageCard from '../ImageCard/ImageCard';
import styles from './ImageGallery.module.css';

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

interface ImageGalleryProps {
    images: Image[];
    onImageClick: (image: Image) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageClick }) => {
    return (
        <ul className={styles.gallery}>
            {images.map(image => (
                <li key={image.id}>
                    <ImageCard image={image} onClick={onImageClick} />
                </li>
            ))}
        </ul>
    );
};

export default ImageGallery;
