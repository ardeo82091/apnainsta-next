"use client"

import React, { useEffect, useRef, useState } from "react"
import { FaTimes } from "react-icons/fa"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  content?: string | number | boolean
}

const AddStoriesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        return () => {
        if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    if (!isOpen) return null

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setPreview(URL.createObjectURL(file))
    }

    const handleRemoveImage = () => {
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleUpload = () => {
        if (!preview) return
        console.log("upload image")
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg h-[80%] w-1/3 flex flex-col">

                <div className="flex-1 border-2 border-dashed border-blue-300 rounded-md p-4 flex flex-col items-center justify-center gap-4">

                    {preview ? (
                        <img
                        src={preview}
                        alt="preview"
                        className="w-full max-h-60 rounded-md object-cover"
                        />
                    ) : (
                        <p className="text-gray-500 text-center">
                        Drag or choose an image to upload
                        </p>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <div className="flex gap-3">
                        {!preview ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
                            >
                                Choose Image
                            </button>
                        ) : (
                            <>
                                <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-1 rounded-md bg-gray-800 text-white hover:bg-gray-900"
                                >
                                Choose Another
                                </button>

                                <button
                                onClick={handleRemoveImage}
                                className="px-4 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-50"
                                >
                                Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleUpload}
                        disabled={!preview}
                        className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddStoriesModal