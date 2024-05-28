// File: app/api/train/route.ts
import { Document, VectorStoreIndex, storageContextFromDefaults } from 'llamaindex'
import { NextRequest, NextResponse } from 'next/server'
import { client, databaseName, vectorCollectionName } from '@/lib/mongo/instance.server'
import vectorStore from '@/lib/mongo/store.server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request to /api/train')

    // Get MongoDB database and collection
    const db = client.db(databaseName)
    const collection = db.collection(vectorCollectionName)
    console.log('Connected to MongoDB database:', databaseName)
    console.log('Using collection:', vectorCollectionName)

    // Fetch all documents from the collection
    const resorts = await collection.find().toArray()
    console.log('Fetched resorts from MongoDB:', resorts.length)

    // Create LlamaIndex Text Documents containing resort data as Metadata
    const documents = resorts.map((resort: Record<any, any>) => {
      const { geoJsonData, lifts, location, weather, snowBase, lastUpdated, runs, snowfall, createdBy, updatedBy, imageUrl,  ...metadata } = resort;
      return new Document({
        text: `${resort.name}\n${resort.information}`,
        metadata: JSON.parse(JSON.stringify(metadata)),
      });
    });
    console.log('Created LlamaIndex documents:', documents.length)

    // Index all the Text Documents in MongoDB Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore })
    console.log('Created storage context')
    await VectorStoreIndex.fromDocuments(documents, { storageContext })
    console.log('Indexed documents in MongoDB Atlas')

    return NextResponse.json({ code: 1 })
  } catch (e) {
    console.error('Error in /api/train:', e)
    return NextResponse.json({ code: 0 })
  }
}