'use client';
import {useEffect, useState} from 'react';
import MemoryGallery from './MemoryGallery';

interface Memory {
	id: number;
	path: string;
	date: string;
}

export default function MemoriesPage() {
	const [memories, setMemories] = useState<Memory[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/memories')
			.then(res => res.json())
			.then(data => {
				setMemories(data);
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading...</div>;

	return <MemoryGallery memories={memories}/>;
}