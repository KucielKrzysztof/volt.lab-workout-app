/**
 * @fileoverview Horizontal Bar Chart for Muscular Workload Distribution.
 * Visualizes the total set volume partitioned by physiological muscle groups.
 * @module features/analytics/components/charts/MuscleWeeklySetsBarChart
 */

"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * @interface MuscleWeeklySets
 * @description Contract for tracking sets metrics per muscle category.
 */
export interface MuscleWeeklySets {
	muscleGroup: string;
	count: number;
}

/**
 * Mock data structured exactly like the provided laboratory blueprint.
 * Sorted descending to ensure the heaviest trained group sits at the vertex.
 */
const MOCK_DATA: MuscleWeeklySets[] = [
	{ muscleGroup: "CHEST", count: 24 },
	{ muscleGroup: "BICEPS", count: 18 },
	{ muscleGroup: "BACK", count: 12 },
	{ muscleGroup: "TRICEPS", count: 6 },
];

/**
 * MuscleWeeklySetsBarChart Component.
 * * @description
 * Renders a high-contrast horizontal bar chart tracking weekly sets allocation.
 */
export const MuscleWeeklySetsBarChart = () => {
	const [mounted, setMounted] = useState(false);

	// SSR Hydration Guard to stabilize structural calculations
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-48 w-full bg-primary/5 rounded-xl animate-pulse" />;
	}

	return (
		<div style={{ width: "100%", height: 200 }}>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={MOCK_DATA} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
					{/* XAxis becomes the numerical engine (hidden for raw diagnostic aesthetics) */}
					<XAxis type="number" hide />

					{/* YAxis maps the text labels on the left edge */}
					<YAxis
						dataKey="muscleGroup"
						type="category"
						axisLine={false}
						tickLine={false}
						fontSize={10}
						fontWeight="black"
						className="uppercase italic opacity-50 fill-foreground"
						width={70}
					/>

					<Tooltip
						cursor={{ fill: "var(--primary)", opacity: 0.03 }}
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								return (
									<div className="bg-popover border border-border p-2 rounded-lg shadow-xl backdrop-blur-md">
										<p className="text-[10px] font-black uppercase italic tracking-tighter">{payload[0].payload.muscleGroup}</p>
										<p className="text-sm font-black text-primary italic">{payload[0].value} SETS</p>
									</div>
								);
							}
							return null;
						}}
					/>

					{/* Horizontal Bar: Radius on the right side only [top-right, bottom-right] */}
					<Bar dataKey="count" fill="currentColor" className="fill-primary" radius={[0, 4, 4, 0]} barSize={14} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
