/**
 * @fileoverview Radar Chart for Muscular Balance Analysis.
 * Visualizes the weekly set distribution across anatomical muscle groups.
 * @module features/analytics/components/charts/MuscleRadarChart
 */

"use client";

import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { RadarDistribution } from "@/services/apiMoreAnalytics";

/**
 * @interface MuscleRadarChartProps
 * @description Injects structural bio-distribution data calculated by the analytics engine.
 */
interface MuscleRadarChartProps {
	data: RadarDistribution[];
}

/**
 * MuscleRadarChart Component.
 * * @description
 * High-precision radar visualization tracking structural training balance.
 * Dynamically scales based on the athlete's maximum weekly volume.
 */
export const MuscleRadarChart = ({ data }: MuscleRadarChartProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// SSR Hydration Guard
	if (!mounted) {
		return <div className="h-[300px] w-full bg-primary/5 rounded-xl animate-pulse" />;
	}

	// Zero-State Guard for empty datasets
	if (!data || data.length === 0) {
		return (
			<div className="h-[300px] w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
				<p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Insufficient Data</p>
				<p className="text-[8px] font-bold uppercase opacity-20 mt-1">Complete workouts to map distribution</p>
			</div>
		);
	}

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer width="100%" height="100%">
				<RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
					{/* Polar Grid: Hexagonal technical layout guides */}
					<PolarGrid stroke="currentColor" className="opacity-10" gridType="polygon" />

					{/* Polar Angle Axis: Outer labels mapped to muscle groups */}
					<PolarAngleAxis
						dataKey="subject"
						tick={{
							fill: "currentColor",
							fontSize: 10,
							fontWeight: "900",
							className: "uppercase italic opacity-40 tracking-tighter",
						}}
					/>

					{/* Dynamic Radius: auto-scales to the highest volume group + buffer */}
					<PolarRadiusAxis angle={30} domain={[0, "dataMax + 2"]} tick={false} axisLine={false} />

					{/* Diagnostic Tooltip for active vertex hover state */}
					<Tooltip
						cursor={false}
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								return (
									<div className="bg-popover border border-border p-2 rounded-lg shadow-xl backdrop-blur-md">
										<p className="text-[10px] font-black uppercase italic tracking-tighter">{payload[0].payload.subject}</p>
										<p className="text-sm font-black text-primary italic">{payload[0].value} WORKING SETS</p>
										<p className="text-[8px] font-bold uppercase tracking-widest opacity-30">Last 7 Days</p>
									</div>
								);
							}
							return null;
						}}
					/>

					{/* Radar Layer: High-contrast footprint visualization */}
					<Radar
						name="Weekly Volume"
						dataKey="value"
						stroke="var(--primary)"
						fill="var(--primary)"
						fillOpacity={0.15}
						strokeWidth={3}
						animationDuration={1500}
					/>
				</RadarChart>
			</ResponsiveContainer>
		</div>
	);
};
