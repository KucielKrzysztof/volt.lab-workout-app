/**
 * @fileoverview Progression Line Chart for specific exercises.
 * Visualizes session volume (tonnage) trends over time with granular set breakdown.
 * @module features/analytics/components/charts/ProgressionLineChart
 */

"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import { TransformedProgression } from "@/services/apiMoreAnalytics";

/**
 * @interface ProgressionLineChartProps
 * @description Injects raw progression datasets mapped from the analytics service.
 */
interface ProgressionLineChartProps {
	data: TransformedProgression[];
}

/**
 * ProgressionLineChart Component.
 * * @description
 * High-performance line chart calibrated to track session-specific tonnage.
 * Features an advanced diagnostic tooltip rendering exact set mechanics.
 */
export const ProgressionLineChart = ({ data }: ProgressionLineChartProps) => {
	const [mounted, setMounted] = useState(false);

	// SSR Hydration Guard
	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return <div className="h-[300px] w-full animate-pulse bg-white/5 rounded-xl" />;
	}

	// Zero-State Guard for empty datasets
	if (!data || data.length === 0) {
		return (
			<div className="h-[300px] w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
				<p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Insufficient Data</p>
				<p className="text-[8px] font-bold uppercase opacity-20 mt-1">Execute protocol to initialize chart</p>
			</div>
		);
	}

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="white" opacity={0.05} />

					<XAxis
						dataKey="date"
						fontSize={10}
						axisLine={false}
						tickLine={false}
						className="font-black italic uppercase opacity-40 fill-foreground"
						dy={10}
					/>

					<YAxis
						fontSize={10}
						axisLine={false}
						tickLine={false}
						className="font-bold opacity-40 fill-foreground"
						domain={["auto", "auto"]}
						tickFormatter={(value) => value.toLocaleString()}
					/>

					<Tooltip
						cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5 }}
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const rawVolume = payload[0].value as number;
								// Wyciągamy tablicę setsBreakdown z payloadu
								const setsBreakdown = payload[0].payload.setsBreakdown;

								return (
									<div className="bg-popover border border-border p-4 rounded-xl shadow-2xl backdrop-blur-md min-w-[160px]">
										{/* Header: Data & Global Volume */}
										<p className="text-[10px] font-black italic opacity-50 uppercase tracking-tighter">{payload[0].payload.date}</p>
										<p className="text-xl font-black text-primary italic leading-tight mt-1">{rawVolume.toLocaleString()} KG</p>
										<p className="text-[8px] font-bold uppercase tracking-widest opacity-30">Session Volume</p>

										{/* Mechanics Breakdown: Loop through sets */}
										{setsBreakdown && setsBreakdown.length > 0 && (
											<div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
												{setsBreakdown.map((set: any, idx: number) => (
													<div key={idx} className="flex justify-between items-center text-[10px] font-mono">
														<span className="font-bold">
															{set.weight}kg <span className="opacity-50 mx-1">×</span> {set.reps}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								);
							}
							return null;
						}}
					/>

					<Line
						type="monotone"
						dataKey="volume"
						stroke="var(--primary)"
						strokeWidth={4}
						dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "black" }}
						activeDot={{ r: 8, strokeWidth: 0 }}
						animationDuration={1500}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};
