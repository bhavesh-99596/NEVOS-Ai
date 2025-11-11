import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { CameraFocusIcon } from './icons/CameraFocusIcon';
import { FrameIcon } from './icons/FrameIcon';

const ImageGuidelines: React.FC = () => {
  const guidelines = [
    {
      icon: <SunIcon className="h-6 w-6 text-brand-primary" />,
      title: "Use Good Lighting",
      text: "Take the photo in a brightly lit area, preferably with natural daylight. Avoid harsh shadows.",
    },
    {
      icon: <CameraFocusIcon className="h-6 w-6 text-brand-primary" />,
      title: "Ensure Sharp Focus",
      text: "Make sure the image is clear and not blurry. Tap your screen to focus directly on the lesion.",
    },
    {
      icon: <FrameIcon className="h-6 w-6 text-brand-primary" />,
      title: "Frame the Subject",
      text: "Be close enough to capture details, but also include some surrounding skin for context.",
    },
  ];

  return (
    <div className="bg-brand-primary/5 border border-brand-secondary rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-serif font-bold text-brand-heading">Tips for a Better Analysis</h3>
      <ul className="space-y-3">
        {guidelines.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{item.icon}</div>
            <div>
              <p className="font-semibold text-brand-text">{item.title}</p>
              <p className="text-sm text-brand-text/80">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageGuidelines;