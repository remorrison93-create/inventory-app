import { useEffect, useRef, useState } from 'react'

interface Props {
  value: Blob | null
  onChange: (blob: Blob | null) => void
}

export default function PhotoInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  return (
    <div className="photo-input">
      {previewUrl ? (
        <img src={previewUrl} alt="Item preview" className="photo-preview" />
      ) : (
        <div className="photo-placeholder">No photo</div>
      )}
      <div className="photo-buttons">
        <button
          type="button"
          className="secondary"
          onClick={() => inputRef.current?.click()}
        >
          {previewUrl ? 'Retake Photo' : 'Take Photo'}
        </button>
        {previewUrl && (
          <button type="button" className="secondary danger" onClick={() => onChange(null)}>
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onChange(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
