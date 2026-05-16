/**
 * @fileoverview Radar Chart for Muscular Balance Analysis.
 * Visualizes the weekly set distribution across anatomical muscle groups.
 * @module features/analytics/components/charts/MuscleRadarChart
 */

"use client";

import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

/**
 * @interface MuscularBalance
 * @description Weekly aggregate set data for muscular targeting.
 * @property {string} subject - The uppercase name of the physiological muscle group.
 * @property {number} value - Total number of working sets completed per week.
 */
interface MuscularBalance {
	subject: string;
	value: number;
}

/**
 * Mock data representing weekly set distribution for an advanced lifter.
 * Calibrated for direct integer scaling instead of a percentage base.
 */
const MOCK_DATA: MuscularBalance[] = [
	{ subject: "CHEST", value: 16 },
	{ subject: "BACK", value: 18 },
	{ subject: "LEGS", value: 22 },
	{ subject: "SHOULDERS", value: 12 },
	{ subject: "ARMS", value: 14 },
	{ subject: "CORE", value: 6 },
];

/**
 * MuscleRadarChart Component.
 * * @description
 * High-precision radar visualization tracking structural training balance.
 */
export const MuscleRadarChart = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-64 w-full bg-primary/5 rounded-xl animate-pulse" />;
	}

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer width="100%" height="100%">
				<RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_DATA}>
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
										<p className="text-[8px] font-bold uppercase tracking-widest opacity-30">Weekly Allocation</p>
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
