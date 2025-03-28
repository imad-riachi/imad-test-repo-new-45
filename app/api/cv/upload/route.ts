import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { cvData } from '@/lib/db/schema';
import { processCVFile } from '@/lib/cv/extractor';
import { getUser } from '@/lib/db/queries';

// Define error types for better error handling
enum ErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Custom error class for API errors
class APIError extends Error {
  type: ErrorType;
  statusCode: number;

  constructor(message: string, type: ErrorType, statusCode: number) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getUser();
    if (!user) {
      throw new APIError(
        'You must be logged in to upload a CV',
        ErrorType.UNAUTHORIZED,
        401,
      );
    }

    console.log('User authenticated:', user.id);

    // Handle file upload
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new APIError('No file uploaded', ErrorType.BAD_REQUEST, 400);
    }

    // Validate file type
    const validFileTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.google-apps.document',
    ];

    if (!validFileTypes.includes(file.type)) {
      throw new APIError(
        'Invalid file type. Only Word and Google Doc files are supported.',
        ErrorType.BAD_REQUEST,
        400,
      );
    }

    console.log('File received:', file.name, file.type, file.size);

    try {
      // Process the CV file
      const cvDataResult = await processCVFile(file, user.id.toString());

      console.log('CV processed, extracted data:', {
        fileName: cvDataResult.fileName,
        fileSize: cvDataResult.fileSize,
        contentLength: cvDataResult.content.length,
        jsonKeys: Object.keys(cvDataResult.jsonContent),
      });

      try {
        // Save to database
        const result = await db
          .insert(cvData)
          .values({
            userId: user.id,
            fileName: cvDataResult.fileName,
            fileSize: cvDataResult.fileSize,
            fileType: cvDataResult.fileType,
            content: cvDataResult.content,
            jsonContent: cvDataResult.jsonContent,
          })
          .returning();

        console.log('CV saved to database with ID:', result[0].id);

        return NextResponse.json({
          message: 'CV uploaded and processed successfully',
          cvId: result[0].id,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        throw new APIError(
          'Failed to save CV to database',
          ErrorType.DATABASE_ERROR,
          500,
        );
      }
    } catch (processingError) {
      console.error('Error processing CV file:', processingError);
      throw new APIError(
        'Failed to process CV file',
        ErrorType.PROCESSING_ERROR,
        500,
      );
    }
  } catch (error) {
    console.error('Error in CV upload API:', error);

    // Handle APIError with type and status code
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: error.message,
          type: error.type,
        },
        { status: error.statusCode },
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: 'Failed to process CV',
        type: ErrorType.UNKNOWN_ERROR,
      },
      { status: 500 },
    );
  }
}
