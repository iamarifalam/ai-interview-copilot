// src/components/MicButton.tsx
import React from 'react';
import { Microphone } from 'phosphor-react';
import styled from 'styled-components';

const Mic = styled.button`
  background: #4f8bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
  cursor: pointer;
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(79, 139, 255, 0.6); }
    70% { box-shadow: 0 0 0 15px rgba(79, 139, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(79, 139, 255, 0); }
  }
`;

interface Props {
  onClick: () => void;
}

const MicButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Mic onClick={onClick}>
      <Microphone size={24} />
    </Mic>
  );
};

export default MicButton;