// File: lib/mongo/store.server.ts
import { MongoDBAtlasVectorSearch } from 'llamaindex/storage/vectorStore/MongoDBAtlasVectorStore'

import {
  vectorCollectionName as collectionName,
  databaseName as dbName,
  indexName,
  client as mongodbClient,
} from '@/lib/mongo/instance.server'

export default new MongoDBAtlasVectorSearch({
  mongodbClient,
  dbName,
  indexName,
  collectionName,
})