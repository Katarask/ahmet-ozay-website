import { type SchemaTypeDefinition } from 'sanity'
import article from '../schemas/article'
import comment from '../schemas/comment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, comment],
}
