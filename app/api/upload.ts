// pages/api/upload.ts
import {promises as fs} from 'fs';
import {NextApiRequest, NextApiResponse} from 'next';
import path from 'path';
import {File, IncomingForm} from 'formidable';

export const config = {
	api: {
		bodyParser: false,
	},
};

interface FormDataFields {
	month: string[];
	description: string[];
}

interface FormDataFiles {
	file: File[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({error: 'Method not allowed'});
	}

	try {
		// Parse form data
		const {file, fields} = await parseForm(req);

		// Create upload directory if it doesn't exist
		const uploadDir = path.join(process.cwd(), 'public', 'uploads');
		await fs.mkdir(uploadDir, {recursive: true});

		// Save the file
		const filename = `${Date.now()}-${file.originalFilename}`;
		const filePath = path.join(uploadDir, filename);
		await fs.writeFile(filePath, await fs.readFile(file.filepath));

		// Update JSON
		const jsonPath = path.join(process.cwd(), 'data', 'memories.json');
		let memories = [];

		try {
			const jsonData = await fs.readFile(jsonPath, 'utf-8');
			memories = JSON.parse(jsonData);
		} catch (err) {
			console.log('Creating new JSON file');
		}

		memories.push({
			month: fields.month[0],
			description: fields.description[0],
			imageUrl: `/uploads/${filename}`,
			createdAt: new Date().toISOString()
		});

		await fs.writeFile(jsonPath, JSON.stringify(memories, null, 2));

		return res.status(200).json({success: true});
	} catch (error) {
		console.error('Upload error:', error);
		return res.status(500).json({error: 'Upload failed'});
	}
}

const parseForm = (req: NextApiRequest): Promise<{ file: any; fields: any }> => {
	return new Promise((resolve, reject) => {
		const form = new IncomingForm();
		form.parse(req, (err, fields, files) => {
			if (err) return reject(err);
			resolve({
				file: files.file![0],
				fields: {
					month: fields.month![0],
					description: fields.description![0]
				}
			});
		});
	});
};