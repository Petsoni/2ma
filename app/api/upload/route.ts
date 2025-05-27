import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import exifr from 'exifr';

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const exifData = await exifr.parse(buffer);
		const creationDate = exifData?.DateTimeOriginal || exifData?.CreateDate || new Date();

		const date = formatDateToSerbian(creationDate)

		const uploadDir = path.join(process.cwd(), 'public', 'images');
		await fs.mkdir(uploadDir, { recursive: true });

		const filename = `${Date.now()}-${file.name}`;
		const filePath = path.join(uploadDir, filename);
		await fs.writeFile(filePath, buffer);

		// Update JSON
		const jsonPath = path.join(process.cwd(), 'lib', 'image-list.json');
		let memories = [];

		try {
			const jsonData = await fs.readFile(jsonPath, 'utf-8');
			memories = JSON.parse(jsonData);
		} catch (err) {
			console.log('Creating new JSON file');
		}

		memories.push({
			id: memories[memories.length - 1].id + 1,
			path: `/images/${filename}`,
			date: date
		});

		await fs.writeFile(jsonPath, JSON.stringify(memories, null, 2));

		return NextResponse.json({ success: true, date });
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

function formatDateToSerbian(date: Date | string): string {
	const d = new Date(date);
	const day = d.getDate().toString().padStart(2, '0');
	const month = (d.getMonth() + 1).toString().padStart(2, '0');
	const year = d.getFullYear();
	return `${day}.${month}.${year}.`;
}