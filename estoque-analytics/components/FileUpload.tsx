'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export const FileUpload = ({ onFileUpload, loading, error }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: loading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${loading ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <div className="relative">
              <FileSpreadsheet className="w-12 h-12 text-gray-400" />
              <Upload className="w-6 h-6 text-blue-500 absolute -top-1 -right-1" />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? 'Processando arquivo...' : 'Carregar arquivo Excel'}
            </h3>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Solte o arquivo aqui...'
                : 'Arraste e solte um arquivo .xlsx ou clique para selecionar'
              }
            </p>
            <p className="text-xs text-gray-500">
              Formatos suportados: .xlsx, .xls (máx. 5.000 linhas)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-800">Erro ao processar arquivo</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <div className="text-xs text-red-600 mt-2">
              <p><strong>Dicas:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Verifique se todas as colunas necessárias estão presentes</li>
                <li>Certifique-se de que o arquivo não está corrompido</li>
                <li>Tente salvar o arquivo novamente no Excel</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};