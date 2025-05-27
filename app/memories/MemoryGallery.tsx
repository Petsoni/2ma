'use client';

import {Fragment, useEffect, useRef, useState} from "react";
import {motion, useAnimation, useInView} from "framer-motion";
import "./MemoryGallery.style.css"

interface Memory {
	id: number;
	path: string;
	date: string;
}

export default function MemoryGallery({memories}: { memories: Memory[] }) {

	const groupedMemories = memories.reduce((acc, memory) => {
		const date = memory.date;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(memory);
		return acc;
	}, {} as Record<string, Memory[]>);

	const memoriesSorted = Object.entries(groupedMemories)
		.map(([date, memories]) => ({date, memories}))
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const galleryRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(galleryRef, {once: false, margin: "0px 0px -100px 0px"})
	const controls = useAnimation()

	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('date', new Date().toISOString().split('T')[0]);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) throw new Error('Upload failed');
			window.location.reload();
		} catch (error) {
			console.error('Upload error:', error);
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};

	useEffect(() => {
		if (isInView) {
			controls.start("visible")
		} else {
			controls.start("hidden")
		}
	}, [isInView, controls])

	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			background: "transparent",
			transition: {
				staggerChildren: 0.15,
				when: "beforeChildren"
			}
		}
	}

	const groupVariants = {
		hidden: {opacity: 0, y: 20},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut"
			}
		}
	}

	return (
		<div className="p-4 pb-16 flex flex-col items-center">
			<motion.h3
				className="mb-6 text-center"
				initial={{opacity: 0, y: -20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.5}}
			>
				Najlepše uspomene s tobom u poslednjih
				<br/>
				✨ 2 meseca ✨
			</motion.h3>


			<motion.div
				ref={galleryRef}
				className="grid gap-12 w-full"
				initial="hidden"
				animate={controls}
				variants={containerVariants}
			>
				{memoriesSorted.map((group) => (
					<Fragment key={group.date}>
						<motion.div
							key={group.date}
							className="rounded-xl w-full"
							variants={groupVariants}
						>
							<motion.h4
								className="font-semibold mb-4 text-gray-800 text-center"
								initial={{opacity: 0}}
								animate={{opacity: 1}}
								transition={{delay: 0.3}}
							>
								{group.date}
							</motion.h4>

							<div className="grid w-full grid grid-cols-[repeat(auto-fit, minmax(300px, 1fr))] gap-4">
								{group.memories.map((memory) => (
									<motion.img
										key={memory.id}
										src={memory.path}
										alt="Memory image"
										className="w-full h-full object-cover rounded-lg"
										loading="lazy"
										initial={{opacity: 0}}
										animate={{opacity: 1}}
										transition={{duration: 0.5}}
									/>
								))}
							</div>
						</motion.div>
						<hr className={"border"}/>
					</Fragment>
				))}
			</motion.div>
			<h3 className={"text-center p-4 bg-white rounded-2xl w-full mt-4 text-[#2c9298]"}>Love you more ❤️</h3>
			{/*<input*/}
			{/*	type="file"*/}
			{/*	ref={fileInputRef}*/}
			{/*	onChange={handleUpload}*/}
			{/*	accept="image/*"*/}
			{/*	className="hidden"*/}
			{/*/>*/}

			{/*/!* Upload button *!/*/}
			{/*<Button*/}
			{/*	variant={'outline'}*/}
			{/*	className="w-full mt-4"*/}
			{/*	onClick={handleButtonClick}*/}
			{/*	disabled={isUploading}*/}
			{/*>*/}
			{/*	{isUploading ? 'Uploading...' : 'Dodaj sliku koju želiš'}*/}
			{/*</Button>*/}
		</div>
	)
}