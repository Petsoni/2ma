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
				setTimeout(() => {
					setLoading(false);
				}, 3000)
			});
	}, []);

	if (loading) return (
		<div className="w-[100%] h-[100dvh] flex flex-col items-center justify-center">
			<h3 className={"w-full text-center"}>Samo želim da ti pokažem...</h3>
		</div>
	);

	return <MemoryGallery memories={memories}/>;
}