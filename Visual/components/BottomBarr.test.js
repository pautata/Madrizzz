import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomBar from './BottomBar';

describe('BottomBar', () => {
  it('Llama a handlePassPress cuando se presiona el botón de la cruz', () => {
    const mockPass = jest.fn();
    const { getByTestId } = render(
      <BottomBar 
        handleLikePress={() => {}} 
        handlePassPress={mockPass} 
      />
    );
    
    // Encuentra el botón por su testID
    fireEvent.press(getByTestId('pass-button'));
    expect(mockPass).toHaveBeenCalled();
  });

  it('Llama a handleLikePress cuando se presiona el botón del corazón', () => {
    const mockLike = jest.fn();
    const { getByTestId } = render(
      <BottomBar 
        handleLikePress={mockLike} 
        handlePassPress={() => {}} 
      />
    );
    fireEvent.press(getByTestId('like-button'));
    expect(mockLike).toHaveBeenCalled();
  });
});