/**
 * @fileoverview Progression Line Chart for specific exercises.
 * Visualizes 1RM trends over time.
 */

"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";

const MOCK_PROGRESSION = [
	{ date: "01.03", oneRepMax: 80 },
	{ date: "15.03", oneRepMax: 82.5 },
	{ date: "01.04", oneRepMax: 85 },
	{ date: "12.04", oneRepMax: 84 },
	{ date: "25.04", oneRepMax: 90 },
];

export const ProgressionLineChart = ({ exerciseId }: { exerciseId: string }) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) return <div className="h-64 animate-pulse bg-white/5 rounded-xl" />;

	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={MOCK_PROGRESSION}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="white" opacity={0.05} />
					<XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} className="font-black italic uppercase opacity-40" />
					<YAxis fontSize={10} axisLine={false} tickLine={false} className="font-bold opacity-40" domain={["dataMin - 5", "dataMax + 5"]} />
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								return (
									<div className="bg-popover border border-border p-3 rounded-xl shadow-2xl backdrop-blur-md">
										<p className="text-[10px] font-black italic opacity-50 uppercase">{payload[0].payload.date}</p>
										<p className="text-lg font-black text-primary italic">{payload[0].value} KG</p>
										<p className="text-[8px] font-bold uppercase tracking-widest opacity-30">Estimated 1RM</p>
									</div>
								);
							}
							return null;
						}}
					/>
					<Line
						type="monotone"
						dataKey="oneRepMax"
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
