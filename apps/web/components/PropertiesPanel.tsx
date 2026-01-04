'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateField, removeField } from '@/lib/redux/slices/builderSlice';
import { Trash2, Plus, X } from 'lucide-react';

export default function PropertiesPanel() {
  const dispatch = useAppDispatch();
  const { fields, selectedFieldId } = useAppSelector((state) => state.builder);
  
  const selectedField = fields.find(f => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="p-6 text-center text-gray-700">
        <p>Select a field on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    dispatch(updateField({ id: selectedField.id, changes: { [key]: value } }));
  };

  // Helper for Options (Dropdowns)
  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...(selectedField.options || [])];
    newOptions[idx] = value;
    handleChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...(selectedField.options || []), 'New Option'];
    handleChange('options', newOptions);
  };

  const removeOption = (idx: number) => {
    const newOptions = (selectedField.options || []).filter((_, i) => i !== idx);
    handleChange('options', newOptions);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-bold text-gray-700">Properties</h3>
        <button 
          onClick={() => dispatch(removeField(selectedField.id))}
          className="text-red-500 hover:bg-red-50 p-1 rounded"
          title="Delete Field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Label Input */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Label</label>
        <input 
          type="text" 
          value={selectedField.label} 
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full rounded border text-gray-700 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Placeholder Input (Not for Checkboxes) */}
      {selectedField.type !== 'checkbox' && selectedField.type !== 'select' && (
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Placeholder</label>
          <input 
            type="text" 
            value={selectedField.placeholder || ''} 
            onChange={(e) => handleChange('placeholder', e.target.value)}
            className="w-full rounded border text-gray-700 border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      )}

      {/* Required Toggle */}
      <div className="flex items-center mt-4">
        <input 
          id="req-check"
          type="checkbox" 
          checked={selectedField.required} 
          onChange={(e) => handleChange('required', e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="req-check" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
          Required Field
        </label>
      </div>

      {/* DROPDOWN OPTIONS EDITOR */}
      {selectedField.type === 'select' && (
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Dropdown Options</label>
          <div className="space-y-2">
            {selectedField.options?.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1 rounded border text-gray-700 border-gray-300 p-1.5 text-sm"
                />
                <button onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={addOption}
              className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Option
            </button>
          </div>
        </div>
      )}
    </div>
  );
}