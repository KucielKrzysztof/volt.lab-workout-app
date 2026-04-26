/**
 * @fileoverview Reusable Bar Chart for Training Frequency.
 * Orchestrates the visualization of workout session distribution across months.
 * Optimized for SSR environments and high-contrast theme synchronization.
 * @module features/analytics/components/charts/ActivityFrequencyChart
 */
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";

/**
 * @interface MonthlyFrequency
 * @description Contract for monthly activity data points.
 * @property {string} month - Localized month name (e.g., "Jan").
 * @property {number} count - Total number of sessions completed in that month.
 */
export interface MonthlyFrequency {
	month: string;
	count: number;
}

/**
 * @interface ActivityFrequencyChartProps
 * @description Component properties for the frequency visualization engine.
 */
interface ActivityFrequencyChartProps {
	data: MonthlyFrequency[];
}

/**
 * ActivityFrequencyChart Component.
 * * @description
 * A high-performance, responsive bar chart designed to visualize training consistency.
 * * **Key Implementation Details:**
 * 1. **SSR Hydration Guard**: Implements a mounting check to prevent 'ResponsiveContainer'
 * dimension mismatches during Next.js server-side rendering.
 * 2. **Isomorphic Theme Sync**: Utilizes 'currentColor' and Tailwind CSS variables to
 * automatically adapt visual assets between 'Midnight' and 'Light' modes.
 * 3. **Dimensional Stability**: Wraps the 'ResponsiveContainer' in a fixed-height container
 * to mitigate layout shifts and calculation errors (-1 width/height) common in
 * dynamic flex/grid layouts.
 * 4. **Custom Diagnostic Tooltip**: Employs a 'headless' content render to match the
 * laboratory's atomic design system (font-black, italic, uppercase).
 * * @param {ActivityFrequencyChartProps} props - Component properties.
 * @returns {JSX.Element} The rendered frequency chart or a pulse skeleton if unmounted.
 */
export const ActivityFrequencyChart = ({ data }: ActivityFrequencyChartProps) => {
	// --- FIX: SSR Hydration Guard ---
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	/** * Hydration Fallback:
	 * Prevents hydration mismatches by returning a placeholder of identical
	 * height to the target chart container.
	 */
	if (!mounted) {
		return <div className="h-64 w-full mt-6 bg-primary/5 rounded-xl animate-pulse" />;
	}

	return (
		<div className="w-full mt-6 animate-in fade-in duration-700">
			<div style={{ width: "100%", height: 250 }}>
				<ResponsiveContainer width="100%" height="100%" minWidth={0}>
					<BarChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
						<XAxis
							dataKey="month"
							axisLine={false}
							tickLine={false}
							fontSize={10}
							fontWeight="black"
							className="uppercase italic opacity-40"
							dy={10}
						/>
						<YAxis axisLine={false} tickLine={false} fontSize={10} className="opacity-40 font-bold" />
						<Tooltip
							cursor={{ fill: "var(--primary)", opacity: 0.05 }}
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									return (
										<div className="bg-popover border border-border p-2 rounded-lg shadow-xl backdrop-blur-md">
											<p className="text-[10px] font-black uppercase italic tracking-tighter">{payload[0].payload.month}</p>
											<p className="text-sm font-black text-primary italic">{payload[0].value} SESSIONS</p>
										</div>
									);
								}
								return null;
							}}
						/>
						<Bar dataKey="count" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} barSize={30} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
