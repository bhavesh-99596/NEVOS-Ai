
import React from 'react';

const DiseasesPage: React.FC = () => {
  const conditions = [
    {
      name: 'Melanoma',
      description: 'The most serious type of skin cancer, developing in the cells that produce melanin. Often resembles moles and can develop from existing moles.',
      riskFactors: 'UV exposure, fair skin, history of sunburn, multiple moles.'
    },
    {
      name: 'Basal Cell Carcinoma',
      description: 'The most common type of skin cancer. Often appears as a slightly transparent bump on the skin, though it can take other forms.',
      riskFactors: 'Long-term sun exposure, fair skin, older age.'
    },
    {
      name: 'Squamous Cell Carcinoma',
      description: 'The second most common form of skin cancer. Usually appears as a firm, red nodule or a flat lesion with a scaly, crusted surface.',
      riskFactors: 'Prolonged UV exposure, lighter skin, weakened immune system.'
    },
     {
      name: 'Benign Nevus (Mole)',
      description: 'A common, non-cancerous skin growth. They are usually small, dark brown spots and are caused by clusters of pigmented cells.',
      riskFactors: 'Genetics, sun exposure during childhood.'
    },
    {
      name: 'Actinic Keratosis',
      description: 'A pre-cancerous skin condition that appears as a rough, scaly patch on the skin from years of sun exposure.',
      riskFactors: 'Years of sun exposure, fair skin, tendency to freckle or burn.'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold text-brand-heading">About Skin Diseases</h1>
        <p className="text-brand-text mt-1">Learn more about common skin conditions and their characteristics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conditions.map((condition) => (
          <div key={condition.name} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-serif font-semibold text-brand-heading mb-2">{condition.name}</h2>
            <p className="text-brand-text text-sm mb-4">{condition.description}</p>
            <div className="border-t pt-3">
                <h3 className="text-sm font-semibold text-brand-text">Common Risk Factors:</h3>
                <p className="text-brand-text text-sm">{condition.riskFactors}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseasesPage;