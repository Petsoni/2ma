'use client';

import {useEffect, useRef} from "react";
import {motion, useAnimation, useInView} from "framer-motion";

interface Memory {
	id: number;
	path: string;
	date: string;
}

export default function MemoryGallery({memories}: { memories: Memory[] }) {
	// Group memories by date
	const groupedMemories = memories.reduce((acc, memory) => {
		const date = memory.date;
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(memory);
		return acc;
	}, {} as Record<string, Memory[]>);

	// Convert to sorted array
	const memoriesSorted = Object.entries(groupedMemories)
		.map(([date, memories]) => ({date, memories}))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const galleryRef = useRef<HTMLDivElement>(null)
	const isInView = useInView(galleryRef, {once: false, margin: "0px 0px -100px 0px"})
	const controls = useAnimation()

	useEffect(() => {
		if (isInView) {
			controls.start("visible")
		} else {
			controls.start("hidden")
		}
	}, [isInView, controls])

	// Animation variants
	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
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

	const itemVariants = {
		hidden: {opacity: 0, scale: 0.9},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.5,
				ease: "backOut"
			}
		}
	}

	return (
		<div className="p-4 pb-16 flex flex-col items-center">
			<motion.h1
				className="text-2xl font-bold mb-6 text-center"
				initial={{opacity: 0, y: -20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.5}}
			>
				Najlepše uspomene s tobom u poslednjih 2 meseca ❤️
			</motion.h1>

			<motion.div
				ref={galleryRef}
				className="grid gap-16 w-full"
				initial="hidden"
				animate={controls}
				variants={containerVariants}
			>
				{memoriesSorted.map((group) => (
					<motion.div
						key={group.date}
						className="border p-8 rounded-4xl bg-white shadow-sm w-full"
						variants={groupVariants}
					>
						<motion.h2
							className="text-xl font-semibold mb-4 text-gray-800"
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							transition={{delay: 0.3}}
						>
							{group.date}
						</motion.h2>

						<div className="grid w-full grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-4">
							{group.memories.map((memory) => (
								<motion.img
									key={memory.id}
									src={memory.path}
									alt="Memory image"
									className="w-full h-full object-cover rounded-3xl"
									loading="lazy"
									initial={{opacity: 0}}
									animate={{opacity: 1}}
									transition={{duration: 0.5}}
								/>
							))}
						</div>
					</motion.div>
				))}
			</motion.div>
		</div>
	)
}