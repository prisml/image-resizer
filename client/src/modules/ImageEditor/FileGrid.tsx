import React from 'react';
import { ImageFile } from '../../store/imageStore';

interface FileGridProps {
    files: ImageFile[];
    checked: number[];
    onToggleChecked: (id: number) => void;
}

export default function FileGrid({ files, checked, onToggleChecked }: FileGridProps) {
    return (
        <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                파일 목록 ({checked.length}/{files.length})
            </h2>
            <div className="grid grid-cols-3 gap-4">
                {files.map((fileObj) => (
                    <div
                        key={fileObj.id}
                        onClick={() => onToggleChecked(fileObj.id)}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                            checked.includes(fileObj.id)
                                ? 'ring-2 ring-indigo-600 shadow-lg'
                                : 'hover:shadow-md'
                        }`}
                    >
                        <div className="bg-gray-200 aspect-square flex items-center justify-center overflow-hidden">
                            <img
                                src={fileObj.preview}
                                alt={fileObj.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="bg-white p-3">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {fileObj.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {(fileObj.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        {checked.includes(fileObj.id) && (
                            <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                ✓
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
