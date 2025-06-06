
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { isAuthenticated } from '@/lib/auth';

interface HeroProps {
  onProducerSignup?: () => void;
}

const Hero = ({ onProducerSignup }: HeroProps) => {
  const navigate = useNavigate();
  const userIsLoggedIn = isAuthenticated();

  const handleDiscoverProducts = () => {
    navigate('/products');
  };

  const handleBecomeProducer = () => {
    if (onProducerSignup) {
      onProducerSignup();
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Des produits locaux,<br />
            <span className="text-green-200">à votre portée</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            Découvrez les meilleurs produits de nos producteurs locaux et récupérez-les dans l'un de nos points relais partenaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleDiscoverProducts}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Découvrir les produits
            </Button>
            {!userIsLoggedIn && (
              <Button 
                onClick={handleBecomeProducer}
                variant="outline"
                className="border-2 border-white bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                Devenir producteur
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
