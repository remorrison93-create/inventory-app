import { useEffect, useRef, useState } from 'react'

interface Props {
  value: Blob[]
  onChange: (photos: Blob[]) => void
}

function PhotoThumb({ photo, onRemove }: { photo: Blob; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(photo)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  return (
    <div className="multi-photo-thumb">
      {url && <img src={url} alt="" />}
      <button type="button" className="multi-photo-remove" onClick={onRemove} aria-label="Remove photo">
        ×
      </button>
    </div>
  )
}

export default function MultiPhotoInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="multi-photo-input">
      <div className="multi-photo-grid">
        {value.map((photo, index) => (
          <PhotoThumb
            key={index}
            photo={photo}
            onRemove={() => onChange(value.filter((_, i) => i !== index))}
          />
        ))}
        <button type="button" className="multi-photo-add" onClick={() => inputRef.current?.click()}>
          + Add Photo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onChange([...value, file])
          e.target.value = ''
        }}
      />
    </div>
  )
}
