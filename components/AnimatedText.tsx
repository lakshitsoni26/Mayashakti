import React from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  return (
    <p className={className}>
      {text.split(' ').map((word, index) => (
        <span
          key={index}
          className="inline-block opacity-0"
          style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s forwards` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
};
