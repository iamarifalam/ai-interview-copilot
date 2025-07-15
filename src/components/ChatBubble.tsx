// src/components/ChatBubble.tsx
import React from 'react';
import styled from 'styled-components';

const Bubble = styled.div<{ isUser: boolean }>`
  background: ${({ isUser }) => (isUser ? '#4f8bff' : '#333')};
  color: white;
  padding: 12px 16px;
  border-radius: 20px;
  max-width: 60%;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  margin: 4px 0;
`;

interface Props {
  text: string;
  isUser: boolean;
}

const ChatBubble: React.FC<Props> = ({ text, isUser }) => {
  return <Bubble isUser={isUser}>{text}</Bubble>;
};

export default ChatBubble;
