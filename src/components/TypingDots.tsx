// src/components/TypingDots.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #aaa;
  border-radius: 50%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out;
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const TypingDots: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: 8 }}>
      <Dot /><Dot /><Dot />
    </div>
  );
};

export default TypingDots;
