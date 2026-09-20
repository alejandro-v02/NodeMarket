import { useEffect, useState } from 'react'
import { listCategories } from '../api/categories'
import { ApiError } from '../api/client'
import type { Category } from '../api/types'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar'))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold">Categorías</h1>
      {error && <p className="text-red-600">{error}</p>}
      {!categories && !error && <p>Cargando...</p>}
      {categories && categories.length === 0 && <p>No hay categorías todavía.</p>}
      <ul className="mt-4 flex flex-col gap-2">
        {categories?.map((category) => (
          <li key={category.id} className="border p-2">
            <p className="font-bold">{category.name}</p>
            {category.description && <p>{category.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
