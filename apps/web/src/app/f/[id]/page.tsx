'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

// --- TYPES ---
interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

// --- DEFAULT THEME FALLBACK ---
const defaultTheme = {
  bgColor: '#f9fafb',
  cardColor: '#ffffff',
  textColor: '#1f2937',
  btnColor: '#2563eb',
  borderColor: '#e5e7eb',
  borderRadius: 'md',
  borderStyle: 'thin',
  shadow: 'md',
};

// --- MAIN COMPONENT ---
export default function PublicFormPage() {
  const params = useParams();
  // Safe ID extraction
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Form Data
  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const res = await fetch(`http://localhost:8761/api/forms/${id}/public`);
        const data = await res.json();
        
        if (data.success) {
          setForm(data.form);
          // Apply background immediately
          const bg = data.form.theme?.bgColor || defaultTheme.bgColor;
          document.body.style.backgroundColor = bg;
        } else {
          setError('Form not found or unavailable.');
        }
      } catch (err) {
        setError('Failed to load form.');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
    
    // Cleanup bg color on exit
    return () => { document.body.style.backgroundColor = ''; };
  }, [id]);

  // 2. Handle Input Changes
  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  // 3. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:8761/api/forms/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data: answers,
          email: form.settings?.collectEmails ? email : undefined
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        if (res.status === 409) {
          setError("You have already responded to this form.");
        } else {
          setError(result.message || 'Submission failed');
        }
      }
    } catch (err) {
      setError('Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERING ---
  
  if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading Form...</div>;
  
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
          <p className="mt-2 text-gray-600">Your response has been recorded.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg border-t-4 border-red-500">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Unable to View Form</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Safety Merge Theme
  const theme = form?.theme ? { ...defaultTheme, ...form.theme } : defaultTheme;

  // Dynamic Styles
  const containerStyle = {
    backgroundColor: theme.cardColor,
    color: theme.textColor,
    borderWidth: theme.borderStyle === 'thin' ? '1px' : theme.borderStyle === 'thick' ? '3px' : theme.borderStyle === 'double' ? '4px' : '0px',
    borderColor: theme.borderColor,
    borderStyle: theme.borderStyle === 'double' ? 'double' : 'solid',
    borderRadius: theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'full' ? '24px' : `0.5rem`,
    boxShadow: theme.shadow === 'none' ? 'none' : 
               theme.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 
               theme.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 
               '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="flex min-h-screen justify-center p-4 sm:p-8" style={{ backgroundColor: theme.bgColor }}>
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 rounded-xl p-8 transition-all"
        style={containerStyle}
      >
        {/* Header */}
        <div className="border-b pb-6" style={{ borderColor: theme.borderColor + '33' }}>
          <h1 className="text-3xl font-bold">{form.name}</h1>
          {form.description && <p className="mt-2 opacity-80">{form.description}</p>}
        </div>

        {/* Email Collection Field */}
        {form.settings?.collectEmails && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:ring-blue-500 text-black"
              />
            </div>
            {form.settings.limitOneResponse && (
               <p className="mt-1 text-xs text-gray-500">Limit: 1 response per email.</p>
            )}
          </div>
        )}

        {/* Dynamic Fields */}
        <div className="space-y-6">
          {form.content?.map((field: FormField) => (
            <div key={field.id}>
              <label className="mb-2 block text-sm font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  rows={4}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select an option...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    required={field.required}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  />
                  <span className="ml-2 text-sm opacity-80">Check this box</span>
                </div>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500 text-black bg-white"
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md py-3 font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ 
              backgroundColor: theme.btnColor,
              borderRadius: theme.borderRadius === 'full' ? '9999px' : '0.5rem'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
}