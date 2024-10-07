import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface Medication {
  id: number
  name: string
  category: string
  administrationRoute: string
  prescription: boolean
  activeIngredient: string
  medicalCondition: string
  sideEffects: string[]
  insuranceCoverage: boolean
  availability: 'In Stock' | 'Out of Stock' | 'Limited'
  price: number
}

interface Filters {
  category: string[]
  administrationRoute: string[]
  prescription: string
  medicalCondition: string[]
  sideEffects: string[]
  insuranceCoverage: string
  availability: string[]
  priceRange: string
}

const Catalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filters>({
    category: [],
    administrationRoute: [],
    prescription: '',
    medicalCondition: [],
    sideEffects: [],
    insuranceCoverage: '',
    availability: [],
    priceRange: '',
  })
  const [medications, setMedications] = useState<Medication[]>([])
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([])

  // Mock data for demonstration
  useEffect(() => {
    const mockMedications: Medication[] = [
      {
        id: 1,
        name: 'Ibuprofen',
        category: 'Pain Relief',
        administrationRoute: 'Oral',
        prescription: false,
        activeIngredient: 'Ibuprofen',
        medicalCondition: 'Pain',
        sideEffects: ['Stomach upset', 'Dizziness'],
        insuranceCoverage: true,
        availability: 'In Stock',
        price: 9.99
      },
      {
        id: 2,
        name: 'Amoxicillin',
        category: 'Antibiotics',
        administrationRoute: 'Oral',
        prescription: true,
        activeIngredient: 'Amoxicillin',
        medicalCondition: 'Bacterial Infections',
        sideEffects: ['Nausea', 'Rash'],
        insuranceCoverage: true,
        availability: 'In Stock',
        price: 15.99
      },
      {
        id: 3,
        name: 'Loratadine',
        category: 'Allergy',
        administrationRoute: 'Oral',
        prescription: false,
        activeIngredient: 'Loratadine',
        medicalCondition: 'Allergies',
        sideEffects: ['Drowsiness', 'Dry mouth'],
        insuranceCoverage: false,
        availability: 'Limited',
        price: 12.99
      },
      {
        id: 4,
        name: 'Insulin Glargine',
        category: 'Diabetes',
        administrationRoute: 'Injection',
        prescription: true,
        activeIngredient: 'Insulin Glargine',
        medicalCondition: 'Diabetes',
        sideEffects: ['Hypoglycemia', 'Weight gain'],
        insuranceCoverage: true,
        availability: 'In Stock',
        price: 89.99
      },
      {
        id: 5,
        name: 'Salbutamol Inhaler',
        category: 'Respiratory',
        administrationRoute: 'Inhalation',
        prescription: true,
        activeIngredient: 'Salbutamol',
        medicalCondition: 'Asthma',
        sideEffects: ['Tremor', 'Headache'],
        insuranceCoverage: true,
        availability: 'In Stock',
        price: 25.99
      }
    ]
    setMedications(mockMedications)
    setFilteredMedications(mockMedications)
  }, [])

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, filterName: keyof Filters) => {
    const options = Array.from(e.target.selectedOptions, option => option.value)
    setFilters(prev => ({ ...prev, [filterName]: options }))
  }

  const handleSingleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const removeFilter = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].filter((item: string) => item !== value)
    }))
  }

  useEffect(() => {
    let result = medications

    if (searchTerm) {
      result = result.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.category.length > 0) {
      result = result.filter(med => filters.category.includes(med.category))
    }

    if (filters.administrationRoute.length > 0) {
      result = result.filter(med => filters.administrationRoute.includes(med.administrationRoute))
    }

    if (filters.prescription) {
      result = result.filter(med => med.prescription === (filters.prescription === 'true'))
    }

    if (filters.medicalCondition.length > 0) {
      result = result.filter(med => filters.medicalCondition.includes(med.medicalCondition))
    }

    if (filters.sideEffects.length > 0) {
      result = result.filter(med => 
        filters.sideEffects.some(effect => med.sideEffects.includes(effect))
      )
    }

    if (filters.insuranceCoverage) {
      result = result.filter(med => med.insuranceCoverage === (filters.insuranceCoverage === 'true'))
    }

    if (filters.availability.length > 0) {
      result = result.filter(med => filters.availability.includes(med.availability))
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      result = result.filter(med => med.price >= min && med.price <= max)
    }

    setFilteredMedications(result)
  }, [searchTerm, filters, medications])

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Medication Catalog</h2>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 pl-10 border rounded-md"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            multiple
            value={filters.category}
            onChange={(e) => handleMultiSelectChange(e, 'category')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Pain Relief">Pain Relief</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Allergy">Allergy</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Respiratory">Respiratory</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Administration Route</label>
          <select
            multiple
            value={filters.administrationRoute}
            onChange={(e) => handleMultiSelectChange(e, 'administrationRoute')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Oral">Oral</option>
            <option value="Injection">Injection</option>
            <option value="Inhalation">Inhalation</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Prescription</label>
          <select
            name="prescription"
            value={filters.prescription}
            onChange={handleSingleSelectChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="true">Required</option>
            <option value="false">Not Required</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Medical Condition</label>
          <select
            multiple
            value={filters.medicalCondition}
            onChange={(e) => handleMultiSelectChange(e, 'medicalCondition')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Pain">Pain</option>
            <option value="Bacterial Infections">Bacterial Infections</option>
            <option value="Allergies">Allergies</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Asthma">Asthma</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Side Effects</label>
          <select
            multiple
            value={filters.sideEffects}
            onChange={(e) => handleMultiSelectChange(e, 'sideEffects')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Stomach upset">Stomach upset</option>
            <option value="Dizziness">Dizziness</option>
            <option value="Nausea">Nausea</option>
            <option value="Rash">Rash</option>
            <option value="Drowsiness">Drowsiness</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Insurance Coverage</label>
          <select
            name="insuranceCoverage"
            value={filters.insuranceCoverage}
            onChange={handleSingleSelectChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="true">Covered</option>
            <option value="false">Not Covered</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Availability</label>
          <select
            multiple
            value={filters.availability}
            onChange={(e) => handleMultiSelectChange(e, 'availability')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited">Limited</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Price Range</label>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleSingleSelectChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Prices</option>
            <option value="0-10">$0 - $10</option>
            <option value="10-25">$10 - $25</option>
            <option value="25-50">$25 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-1000">&gt; $100</option>
          </select>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            return value.map((item) => (
              <span key={`${key}-${item}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {item}
                <button onClick={() => removeFilter(key as keyof Filters, item)} className="ml-1 focus:outline-none">
                  <X size={14} />
                </button>
              </span>
            ))
          }
          return null
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMedications.map(med => (
          <div key={med.id} className="bg-white p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold">{med.name}</h3>
            <p><strong>Category:</strong> {med.category}</p>
            <p><strong>Active Ingredient:</strong> {med.activeIngredient}</p>
            <p><strong>Administration:</strong> {med.administrationRoute}</p>
            <p><strong>Prescription:</strong> {med.prescription ? 'Required' : 'Not Required'}</p>
            <p><strong>Condition:</strong> {med.medicalCondition}</p>
            <p><strong>Side Effects:</strong> {med.sideEffects.join(', ')}</p>
            <p><strong>Insurance:</strong> {med.insuranceCoverage ? 'Covered' : 'Not Covered'}</p>
            <p><strong>Availability:</strong> {med.availability}</p>
            <p><strong>Price:</strong> ${med.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Catalog