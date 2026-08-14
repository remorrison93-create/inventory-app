import { useState, type FormEvent } from 'react'
import MultiPhotoInput from './MultiPhotoInput'
import CustomFieldsEditor from './CustomFieldsEditor'
import PresetSelect from './PresetSelect'
import type { CustomField, MunitionsItem, MunitionsType, NewMunitionsItem } from '../types'

interface Props {
  locations: string[]
  initial?: MunitionsItem
  onSubmit: (item: NewMunitionsItem) => void
  onCancel: () => void
}

export default function MunitionsForm({ locations, initial, onSubmit, onCancel }: Props) {
  const [itemType, setItemType] = useState<MunitionsType>(initial?.itemType ?? 'Ammunition')
  const [name, setName] = useState(initial?.name ?? '')
  const [manufacturer, setManufacturer] = useState(initial?.manufacturer ?? '')
  const [caliber, setCaliber] = useState(initial?.caliber ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [bulletWeightGr, setBulletWeightGr] = useState<number | ''>(initial?.bulletWeightGr ?? '')
  const [bulletType, setBulletType] = useState(initial?.bulletType ?? '')
  const [roundsPerBox, setRoundsPerBox] = useState<number | ''>(initial?.roundsPerBox ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1)
  const [lowStockThreshold, setLowStockThreshold] = useState(initial?.lowStockThreshold ?? 1)
  const [location, setLocation] = useState(initial?.location ?? '')
  const [condition, setCondition] = useState(initial?.condition ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [photos, setPhotos] = useState<Blob[]>(initial?.photos ?? [])
  const [customFields, setCustomFields] = useState<CustomField[]>(initial?.customFields ?? [])

  const isAmmo = itemType === 'Ammunition'
  const totalRounds = isAmmo && roundsPerBox !== '' ? quantity * Number(roundsPerBox) : null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      itemType,
      name: name.trim(),
      manufacturer: manufacturer.trim(),
      caliber: caliber.trim(),
      category: isAmmo ? '' : category.trim(),
      bulletWeightGr: isAmmo && bulletWeightGr !== '' ? Number(bulletWeightGr) : null,
      bulletType: isAmmo ? bulletType.trim() : '',
      roundsPerBox: isAmmo && roundsPerBox !== '' ? Number(roundsPerBox) : null,
      quantity,
      lowStockThreshold,
      location: location.trim(),
      condition: condition.trim(),
      notes: notes.trim(),
      photos,
      customFields: customFields.filter((f) => f.key.trim() !== ''),
    })
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <MultiPhotoInput value={photos} onChange={setPhotos} />

      <div className="type-toggle">
        <button
          type="button"
          className={isAmmo ? 'active' : ''}
          onClick={() => setItemType('Ammunition')}
        >
          Ammunition
        </button>
        <button
          type="button"
          className={!isAmmo ? 'active' : ''}
          onClick={() => setItemType('Accessory')}
        >
          Accessory / Part
        </button>
      </div>

      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isAmmo ? 'e.g. Full Boar 6.8mm SPC 100gr GMX' : 'e.g. Kydex OWB Holster'}
          required
        />
      </label>

      <label>
        Manufacturer
        <input
          type="text"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          placeholder="e.g. Full Boar"
        />
      </label>

      <label>
        Caliber
        <input
          type="text"
          value={caliber}
          onChange={(e) => setCaliber(e.target.value)}
          placeholder="e.g. 6.8mm SPC"
        />
      </label>

      {isAmmo ? (
        <>
          <label>
            Bullet Weight (gr)
            <input
              type="number"
              min={0}
              value={bulletWeightGr}
              onChange={(e) => setBulletWeightGr(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 100"
            />
          </label>

          <label>
            Bullet Type
            <input
              type="text"
              value={bulletType}
              onChange={(e) => setBulletType(e.target.value)}
              placeholder="e.g. GMX, FMJ, HP"
            />
          </label>

          <label>
            Rounds per Box
            <input
              type="number"
              min={0}
              value={roundsPerBox}
              onChange={(e) => setRoundsPerBox(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 20"
            />
          </label>
        </>
      ) : (
        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Holster, Magazine, Optic, Sling"
          />
        </label>
      )}

      <label>
        {isAmmo ? 'Quantity (Boxes)' : 'Quantity'}
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
          required
        />
      </label>

      {totalRounds !== null && <p className="computed-total">Total rounds: {totalRounds}</p>}

      <label>
        Low stock warning at
        <input
          type="number"
          min={0}
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Math.max(0, Number(e.target.value)))}
          required
        />
      </label>

      <PresetSelect
        label="Location"
        value={location}
        onChange={setLocation}
        presetOptions={[]}
        customOptions={locations}
        presetGroupLabel="Common Locations"
        customGroupLabel="Your Locations"
        addLabel="+ Add new location..."
        placeholder="e.g. Safe 1, Ammo Locker"
        required={false}
      />

      <label>
        Condition
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g. New, Used, Sealed"
        />
      </label>

      <label>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else worth remembering"
          rows={3}
        />
      </label>

      <CustomFieldsEditor fields={customFields} onChange={setCustomFields} />

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary">
          {initial ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}
