/**
 * @fileoverview One Rep Max (1RM) UI Component.
 * Provides a high-precision interface for strength calibration within the VOLT.LAB ecosystem.
 * Handles user input for load/reps and visualizes calculated maximums and intensity zones.
 * @module features/calculators/components/OneRepMaxCalculator
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gauge } from "lucide-react";
import { useCalculators } from "../_hooks/use-calculators";

/**
 * @interface OneRepMaxCalculatorProps
 * @description Properties for the OneRepMaxCalculator component.
 * @property {string} [description] - Optional technical overview to be displayed
 *  in the card header.
 */
interface OneRepMaxCalculatorProps {
	description?: string;
}

/**
 * OneRepMaxCalculator Component.
 * * @description
 * An interactive laboratory tool that estimates an athlete's maximum lifting capacity.
 * It functions as a specialized view for the `useCalculators` headless hook,
 * providing real-time feedback and a comprehensive intensity-to-reps mapping table.
 * * @features
 * 1. **Real-time Calibration**: Instant 1RM calculation based on Load and Repetition inputs.
 * 2. **Visual Feedback**: Large-scale display of the primary result with entry animations.
 * 3. **Intensity Mapping**: Detailed grid showing percentages (70%-95%),
 * targeted weights, and estimated repetition counts for programming.
 * * @param {OneRepMaxCalculatorProps} props - Component properties.
 * @returns {JSX.Element} The rendered 1RM Calibration Card.
 */
export const OneRepMaxCalculator = ({ description }: OneRepMaxCalculatorProps) => {
	/** * Destructured 1RM protocol data from the central calculation engine.
	 * Includes current inputs, state setters, and the derived intensity table.
	 */
	const { oneRepMax } = useCalculators();
	const { inputs, actions, result, intensityTable } = oneRepMax;

	return (
		<Card className="border-primary/20 bg-secondary/5 overflow-hidden shadow-2xl">
			{/* Header: Identity & Protocol Disclosure */}
			<CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
				<div className="space-y-1">
					<CardTitle className="text-xl uppercase italic font-black tracking-tighter">ONE REP MAX</CardTitle>
					{description && <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-none">{description}</p>}
				</div>
				<Gauge className="text-primary" size={24} />
			</CardHeader>

			<CardContent className="p-6 space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Load (kg)</Label>
						<Input
							type="number"
							placeholder="0"
							value={inputs.weight || ""}
							className="bg-background border-primary/10 text-lg font-bold italic"
							onChange={(e) => actions.setWeight(Number(e.target.value))}
						/>
					</div>
					<div className="space-y-2">
						<Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Reps</Label>
						<Input
							type="number"
							placeholder="0"
							value={inputs.reps || ""}
							className="bg-background border-primary/10 text-lg font-bold italic"
							onChange={(e) => actions.setReps(Number(e.target.value))}
						/>
					</div>
				</div>

				{/* MAIN CALIBRATION RESULT */}
				<div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center space-y-1 animate-in zoom-in-95 duration-300">
					<span className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Estimated 1RM</span>
					<span className="text-5xl font-black italic tracking-tighter text-foreground tabular-nums">
						{result} <span className="text-sm not-italic uppercase text-muted-foreground">kg</span>
					</span>
				</div>

				{/* Intensity Table with Reps */}
				<div className="space-y-2 pt-2">
					{/* Header Row */}
					<div className="grid grid-cols-3 px-2 text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">
						<span>Intensity</span>
						<span className="text-center">Load</span>
						<span className="text-right text-primary">Est. Reps</span>
					</div>

					{/* Data Rows */}
					<div className="space-y-1">
						{intensityTable.map((row) => (
							<div
								key={row.percentage}
								className="grid grid-cols-3 items-center border-b border-white/5 py-2 px-2 text-[11px] uppercase tracking-tight hover:bg-white/5 transition-colors rounded-sm"
							>
								<span className="text-muted-foreground font-bold italic">{row.percentage}%</span>
								<span className="text-center font-black text-foreground">{row.weight} kg</span>
								<div className="flex justify-end items-center gap-1">
									<span className="font-black italic text-primary">{row.reps}</span>
									<span className="text-[8px] text-muted-foreground font-bold">reps</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
