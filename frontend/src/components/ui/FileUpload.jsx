import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { formatFileSize } from "../../utils/formatters";
import config from "../../config";

/**
 * File upload component with preview and validation
 *
 * @param {Object} props
 * @param {Function} props.onFileChange - Callback when file is selected or removed
 * @param {string} [props.label="Upload Image"] - Label for the upload button
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} [props.errorMessage] - Error message to display
 * @param {string} [props.accept="image/*"] - Accepted file types
 * @param {number} [props.maxSize] - Maximum file size in bytes
 * @param {string} [props.initialPreview] - URL of initial preview image
 * @param {string} [props.name="file"] - Input name attribute
 */
const FileUpload = ({
  onFileChange,
  label = "Upload Image",
  required = false,
  errorMessage,
  accept = "image/*",
  maxSize = config.uploads.maxImageSize,
  initialPreview = null,
  name = "file",
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (selectedFile) => {
    // Validate file
    if (!selectedFile) {
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSize) {
      const errorMsg = `File is too large. Maximum size is ${formatFileSize(
        maxSize
      )}.`;
      setError(errorMsg);
      setFile(null);
      setPreview(initialPreview);
      onFileChange(null, errorMsg);
      return;
    }

    // Validate file type
    if (
      accept !== "*" &&
      !accept.includes(selectedFile.type.split("/")[0] + "/*") &&
      !accept.includes(selectedFile.type)
    ) {
      const errorMsg = `Invalid file type. Accepted types: ${accept}`;
      setError(errorMsg);
      setFile(null);
      setPreview(initialPreview);
      onFileChange(null, errorMsg);
      return;
    }

    // Clear any previous errors
    setError(null);
    setFile(selectedFile);

    // Create preview for image files
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // Notify parent component
    onFileChange(selectedFile);
  };

  // Handle file input change
  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);

    // Clear file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onFileChange(null);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-indigo-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
              title="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="text-sm text-gray-500 mt-1">
              {file
                ? `${file.name} (${formatFileSize(file.size)})`
                : "Current image"}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-2">
              <input
                id={`file-upload-${name}`}
                name={name}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                required={required}
                className="sr-only"
                ref={fileInputRef}
              />
              <label
                htmlFor={`file-upload-${name}`}
                className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <span>{label}</span>
                <p className="text-xs text-gray-500">
                  {accept === "image/*"
                    ? "PNG, JPG, GIF up to "
                    : "Upload a file up to "}
                  {formatFileSize(maxSize)}
                </p>
              </label>
            </div>
            <p className="text-xs text-gray-500">Or drag and drop</p>
          </div>
        )}
      </div>

      {/* Show error message */}
      {(error || errorMessage) && (
        <p className="text-sm text-red-600">{error || errorMessage}</p>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  onFileChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  initialPreview: PropTypes.string,
  name: PropTypes.string,
};

export default FileUpload;
