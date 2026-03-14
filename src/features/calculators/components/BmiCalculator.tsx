/**
 * @fileoverview BMI Diagnostic Engine.
 * Provides the interface for body mass composition analysis based on
 * World Health Organization (WHO) standards.
 * @module features/calculators/components/BmiCalculator
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Scale } from "lucide-react";
import { useCalculators } from "../_hooks/use-calculators";

/**
 * @interface BmiCalculatorProps
 * @property {string} [description] - Technical overview or versioning of the BMI protocol.
 */
interface BmiCalculatorProps {
	description?: string;
}

/**
 * BmiCalculator Component.
 * * @description
 * A high-fidelity physiological tool used to assess body mass relative to height.
 * It calculates the Body Mass Index (BMI) and provides an immediate morphological
 * classification to assist in training and health calibration.
 * * @features
 * 1. **Reactive Metrics**: Utilizes a shared headless hook to synchronize body mass across protocols.
 * 2. **Morphological Classification**: Automatic mapping of scores to WHO health categories.
 * 3. **Visual Benchmarking**: Real-time highlighting of the active classification within the reference grid.
 * 4. **Diagnostic Layout**: High-contrast result display with `tabular-nums` for precise monitoring.
 * * @param {BmiCalculatorProps} props - Component properties.
 * @returns {JSX.Element} The orchestrated BMI diagnostic interface.
 */
export const BmiCalculator = ({ description }: BmiCalculatorProps) => {
	const { bmi } = useCalculators();
	const { actions, result, category } = bmi;

	return (
		<Card className="border-primary/20 bg-secondary/5 overflow-hidden shadow-2xl">
			<CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
				<div className="space-y-1">
					<CardTitle className="text-xl uppercase italic font-black tracking-tighter">BMI INDEX</CardTitle>
					{description && <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{description}</p>}
				</div>
				<Scale className="text-primary shrink-0" size={24} />
			</CardHeader>

			<CardContent className="p-6 space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Weight (kg)</Label>
						<Input
							type="number"
							placeholder="0.0"
							className="bg-background border-primary/10 text-lg font-bold italic"
							onChange={(e) => actions.setBodyWeight(Number(e.target.value))}
						/>
					</div>
					<div className="space-y-2">
						<Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Height (cm)</Label>
						<Input
							type="number"
							placeholder="0"
							className="bg-background border-primary/10 text-lg font-bold italic border-l-2 border-l-primary/40"
							onChange={(e) => actions.setHeight(Number(e.target.value))}
						/>
					</div>
				</div>

				{/* RESULT DISPLAY */}
				<div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-1 animate-in zoom-in-95 duration-300">
					<span className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Body Mass Composition</span>
					<span className="text-6xl font-black italic tracking-tighter text-foreground tabular-nums">{result}</span>
					<span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mt-2">{category}</span>
				</div>

				{/* STANDARDS REFERENCE */}
				<div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2">
					<div className="flex items-center gap-2 mb-1">
						<Activity size={12} className="text-primary" />
						<span className="text-[10px] font-black uppercase tracking-widest text-primary">WHO Classifications</span>
					</div>
					<div className="grid grid-cols-4 gap-1 text-[8px] uppercase font-bold text-muted-foreground/80 text-center">
						<div className={`p-1 rounded ${category === "Underweight" ? "bg-primary/20 text-primary" : "bg-background/50"}`}>
							&lt; 18.5
							<br />
							Under
						</div>
						<div className={`p-1 rounded ${category === "Normal" ? "bg-primary/20 text-primary" : "bg-background/50"}`}>
							18.5-25
							<br />
							Normal
						</div>
						<div className={`p-1 rounded ${category === "Overweight" ? "bg-primary/20 text-primary" : "bg-background/50"}`}>
							25-30
							<br />
							Over
						</div>
						<div className={`p-1 rounded ${category === "Obese" ? "bg-primary/20 text-primary" : "bg-background/50"}`}>
							30+
							<br />
							Obese
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
