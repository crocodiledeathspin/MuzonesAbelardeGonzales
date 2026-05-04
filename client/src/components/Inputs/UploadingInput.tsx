import { useCallback, useEffect, useState, type FC } from "react";
import { useDropzone } from "react-dropzone";
import RemoveButton from "../Button/RemoveButton";

interface UploadInputProps {
    label: string;
    name: string;
    value?: File | null;
    onChange?: (file: File | null) => void;
    onRemoveExistingImageUrl?: () => void;
    existingImageUrl?: string | null;
    errors?: string[];
}
const UploadInput: FC<UploadInputProps> = ({
    label,
    name,
    value,
    onChange,
    onRemoveExistingImageUrl: _onRemoveExistingImageUrl,
    existingImageUrl,
    errors
}) => {

    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setPreview(URL.createObjectURL(file));

            if (onChange) onChange(file);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            'image/png': [],
            'image/jpg': [],
            'image/jpeg': []
        }, multiple: false
    });

    useEffect(() => {
        if (value) {
            setPreview(URL.createObjectURL(value));

        } else if (existingImageUrl) {
            setPreview(existingImageUrl);
        } else {
            setPreview(null);
        }

    }, [value, existingImageUrl]);


    return (
        <>
            <div className="mb-1">
                <label htmlFor={name} className="text-blue-600">
                    {label}
                </label>
            </div>
            <div
                className={`transition border border-gray-300 border-dashed cursor-pointer rounded-lg hover:border-blue-900 ${errors
                    ? 'mb-0'
                    : 'mb-4'
                    }`}
            >
                <div
                    {...getRootProps()}
                    className={`rounded-lg border-dashed border-gray-300 p-7 lg:p-10 ${isDragActive
                        ? "border-blue-600 bg-gray-100"
                        : 'border-gray-300 bg-gray-50'
                        }`}
                >
                    <input {...getInputProps()} name={name} id={name} />
                    <div className="flex flex-col items-center m-0">
                        {preview ? (
                            <img src={preview} alt="Profile Picture Preview" className="object-cover rounded-full w-44 h-44" />
                        ) : (
                            <>
                                <div className="mb-5 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-sm">
                                        <svg
                                            className="h-8 w-8"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M12 4V16M12 4L8 8M12 4L16 8M6 18H18"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="mb-3 font-semibold text-gray-800 text-xl">
                                    {isDragActive ? "Drop File Here" : "Drag & Drop File Here"}
                                </h4>
                                <span className="text-center mb-4 block w-full max-w-72.5 text-sm text-gray-700">
                                    Drag and drop your PNG, JPG or JPEG
                                </span>
                                <span className="font-medium underline text-blue-600 text-sm">
                                    Browse File
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {errors && errors.length > 0 && (
                <div className="mb-2">
                    <span className="text-red-600 text-xs">{errors[0]}</span>
                </div>
            )}
            {preview && (
                <RemoveButton
                    label="Remove Profile Picture"
                    className="w-full"
                    onRemove={() => {
                        if (onChange) onChange(null);
                        if (_onRemoveExistingImageUrl) _onRemoveExistingImageUrl();
                        setPreview(null);
                    }} />
            )}
        </>
    );
};

export default UploadInput;