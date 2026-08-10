import React from 'react';
import ReceiptScannerScreen, { ReceiptSaveResult } from './RecipetPicker';

export default function AddExpense() {
  const handleSave = ({ imageUri, total }: ReceiptSaveResult) => {
    // Save to your expenses store/DB here
    console.log('Saving expense:', { imageUri, total });
  };

  return <ReceiptScannerScreen onSave={handleSave} />;
}
