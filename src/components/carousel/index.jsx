import React, { useState } from 'react';
import styled from 'styled-components';

const ReportImagesContainer = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
`;

const ReportImage = styled.img`
    display: flex;
    width: 100%;
    object-fit: contain;
    min-height: 300px;
    max-height: 300px;
    height: 100%;
`;

const CarouselWrapper = styled.div`
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
`;

const NavigationButton = styled.button`
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
`;

const PrevButton = styled(NavigationButton)`
    left: 0;
`;

const NextButton = styled(NavigationButton)`
    right: 0;
`;

export const Carousel = ({ report }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === report.images.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? report.images.length - 1 : prevIndex - 1));
    };

    return (
        <CarouselWrapper>
            <PrevButton onClick={handlePrev}>Previous</PrevButton>
            <NextButton onClick={handleNext}>Next</NextButton>
            <ReportImagesContainer>
                {report.images.map((image, index) => (
                    <ReportImage 
                        key={index} 
                        src={image} 
                        alt={`Imagem ${index + 1}`} 
                        style={{ display: currentIndex === index ? 'block' : 'none' }}
                    />
                ))}
            </ReportImagesContainer>
        </CarouselWrapper>
    );
};
