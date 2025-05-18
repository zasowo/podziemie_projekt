import React from 'react';
import HeroSection from '../components/HeroSection'; 
import MainContent from '../components/MainContent'; 

const HomePage = ({ navigateTo, onOpenContributeModal }) => {
  return (
    <>
      <HeroSection navigateTo={navigateTo} onOpenContributeModal={onOpenContributeModal} />
      <MainContent navigateTo={navigateTo} />
    </>
  );
};

export default HomePage;