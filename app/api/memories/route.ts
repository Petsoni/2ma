import {promises as fs} from 'fs';
import path from 'path';
import {NextResponse} from 'next/server';

export async function GET() {
	const jsonPath = path.join(process.cwd(), 'lib', 'image-list.json');
	try {
		const jsonData = await fs.readFile(jsonPath, 'utf-8');
		return NextResponse.json(JSON.parse(jsonData));
	} catch (err) {
		return NextResponse.json({ error: 'Error reading data' }, { status: 500 });
	}
}