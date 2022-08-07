import { expect } from '@jest/globals'
import { FluentSqlQueryBuilder } from '../src/fluentSql'

describe('', () => {
  const database = [
    {
      id: 1,
      name: 'samantha',
      category: 'developer'
    },
    {
      id: 11,
      name: 'billy',
      category: 'developer'
    },
    {
      id: 3,
      name: 'mario',
      category: 'manager'
    }
  ]

  it('#for - should return a FluentSqlQueryBuilder instance', () => {
    const result = FluentSqlQueryBuilder.for({ database })
    const expected = new FluentSqlQueryBuilder({ database })

    expect(result).toStrictEqual(expected)
  })

  it('#build - should return all the data if there is no query', () => {
    const result = FluentSqlQueryBuilder.for(database).build()
    const expected = database

    expect(result).toStrictEqual(expected)
  })

  it('#limit - should limit the results to a given amount', () => {
    const result = FluentSqlQueryBuilder.for(database).limit(1).build()
    const expected = database[0]

    expect(result).toStrictEqual([expected])
  })

  it('#where - should filter the data with the given params', () => {
    const result = FluentSqlQueryBuilder.for(database)
      .where({ category: 'developer' })
      .build()

    const expected = [database[0], database[1]]

    expect(result).toStrictEqual(expected)
  })

  it('#select - should retrieve only specified fields, if they exist', () => {
    const result = FluentSqlQueryBuilder.for(database)
      .select(['name', 'category', 'other'])
      .build()

    const expected = database.map(({ name, category }) => ({ name, category }))

    expect(result).toStrictEqual(expected)
  })

  it('#orderby - should order results by the given fields in ascending order', () => {
    const result = FluentSqlQueryBuilder.for(database).orderBy(['name']).build()

    const expected = [
      {
        id: 11,
        name: 'billy',
        category: 'developer'
      },
      {
        id: 3,
        name: 'mario',
        category: 'manager'
      },
      {
        id: 1,
        name: 'samantha',
        category: 'developer'
      }
    ]

    expect(result).toStrictEqual(expected)
  })

  it('#orderby - should order results by the given fields in descending order when specified', () => {
    const result = FluentSqlQueryBuilder.for(database)
      .orderBy(['name', 'desc'])
      .build()

    const expected = [
      {
        id: 1,
        name: 'samantha',
        category: 'developer'
      },
      {
        id: 3,
        name: 'mario',
        category: 'manager'
      },
      {
        id: 11,
        name: 'billy',
        category: 'developer'
      }
    ]

    expect(result).toStrictEqual(expected)
  })

  it('#orderby - should order results by the given fields in descending order when specified', () => {
    const result = FluentSqlQueryBuilder.for(database).orderBy(['id']).build()

    const expected = [
      {
        id: 1,
        name: 'samantha',
        category: 'developer'
      },
      {
        id: 3,
        name: 'mario',
        category: 'manager'
      },
      {
        id: 11,
        name: 'billy',
        category: 'developer'
      }
    ]

    expect(result).toStrictEqual(expected)
  })

  it('#groupCount  - should group and count results by specified field', () => {
    const result = FluentSqlQueryBuilder.for(database).groupCount('category').build()

    const expected = [
      {
        developer: 2,
        manager: 1
      }
    ]

    expect(result).toStrictEqual(expected)
  })

  it('#pipeline - should be able to chain the methods', () => {
    const result = FluentSqlQueryBuilder.for(database)
      .where({ name: /a/ })
      .select(['name', 'id'])
      .orderBy(['id', 'desc'])
      .build()

    const expected = [
      {
        id: 3,
        name: 'mario'
      },
      {
        id: 1,
        name: 'samantha'
      }
    ]

    expect(result).toStrictEqual(expected)
  })
})
