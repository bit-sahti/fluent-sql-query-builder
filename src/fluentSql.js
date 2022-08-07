export class FluentSqlQueryBuilder {
  #database
  #limit
  #select = []
  #where = []
  #orderBy = []

  constructor({ database }) {
    this.#database = database
  }

  static for(database) {
    return new FluentSqlQueryBuilder({ database })
  }

  limit(max) {
    this.#limit = max

    return this
  }

  select(fields) {
    this.#select = fields

    return this
  }

  where(query) {
    for (const [field, filter] of Object.entries(query)) {
      const whereFilter = filter instanceof RegExp ? filter : new RegExp(filter)

      this.#where.push({ field, filter: whereFilter })
    }

    return this
  }

  orderBy(field) {
    this.#orderBy = field

    return this
  }

  build() {
    const results = []

    for (const item of this.#database) {
      if (!this.#performWhere(item)) continue

      const transformedItem = this.#performSelect(item)

      results.push(transformedItem)

      if (this.#limit && results.length === this.#limit) break
    }

    return this.#performOrderBy(results)
  }

  #performWhere(item) {
    for (const { field, filter } of this.#where) {
      if (!filter.test(item[field])) return null
    }

    return true
  }

  #performSelect(item) {
    if (!this.#select.length) return item

    const selectedObject = {}

    for (const field of this.#select) {
      if (!item.hasOwnProperty(field)) continue

      selectedObject[field] = item[field]
    }

    return selectedObject
  }

  #performOrderBy(results) {
    const [field, order] = this.#orderBy

    if (!field || !results.some(item => item.hasOwnProperty(field)))
      return results

    return results.sort((previous, next) => {
      const comparisonBase = order === 'desc' ? next[field] : previous[field]
      const comparedElement = order === 'desc' ? previous[field] : next[field]

      if (typeof comparisonBase === 'number')
        return comparisonBase - comparedElement

      return comparisonBase.localeCompare(comparedElement)
    })
  }
}
