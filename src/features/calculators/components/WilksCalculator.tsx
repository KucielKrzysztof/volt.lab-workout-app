/**
 * @fileoverview Wilks Score Calibration Engine.
 * Provides the interface for calculating relative strength based on the
 * International Powerlifting Federation (IPF) standard polynomial.
 * @module features/calculators/components/WilksCalculator
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Activity } from "lucide-react";
import { useCalculators, LiftType } from "../_hooks/use-calculators";

/**
 * @interface WilksCalculatorProps
 * @property {string} [description] - Optional technical overview of the Wilks protocol.
 */
interface WilksCalculatorProps {
	description?: string;
}

/**
 * WilksCalculator Component.
 * * @description
 * A high-precision diagnostic tool that normalizes strength performance across
 * different body weights and genders. It allows for the comparison of lifters
 * in different weight classes by calculating a power-to-weight ratio score.
 * * @features
 * 1. **Multi-Protocol Support**: Seamless switching between 'Total' and 'Single Lift' (S/B/D) modes.
 * 2. **Gender-Specific Calibration**: Dynamic coefficient selection for Male/Female biological classes.
 * 3. **Dynamic Scale Reference**: Real-time benchmarking against global Powerlifting standards.
 * 4. **Adaptive UI Labels**: Context-aware input descriptions based on the active protocol.
 * * @param {WilksCalculatorProps} props - Component properties.
 * @returns {JSX.Element} The orchestrated Wilks scoring interface.
 */
export const WilksCalculator = ({ description }: WilksCalculatorProps) => {
	/** * Destructured Wilks state and actions from the headless laboratory hook.
	 */
	const { wilks } = useCalculators();
	const { inputs, actions, result } = wilks;

	/**
	 * Internal heuristic to determine the active benchmarking scale.
	 * If the 'total' protocol is selected, the component displays full Powerlifting meet standards.
	 * Otherwise, it shifts to specialized single-lift benchmarks.
	 */
	const isTotal = inputs.liftType === "total";

	return (
		<Card className="border-primary/20 bg-secondary/5 overflow-hidden shadow-2xl">
			<CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
				<div className="space-y-1">
					<CardTitle className="text-xl uppercase italic font-black tracking-tighter">WILKS SCORE</CardTitle>
					{description && <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-none">{description}</p>}
				</div>
				<Trophy className="text-primary shrink-0" size={24} />
			</CardHeader>

			<CardContent className="p-6 space-y-6">
				{/* 1. Protocol Mode (Total vs Single) */}
				<div className="space-y-2">
					<Label className="uppercase text-[9px] font-black tracking-[0.2em] text-primary/70 ml-1">Measurement Protocol</Label>
					<Tabs defaultValue="total" onValueChange={(v) => actions.setLiftType(v as LiftType)}>
						<TabsList className="grid w-full grid-cols-4 bg-background border border-primary/10 h-8">
							{["total", "squat", "bench", "deadlift"].map((type) => (
								<TabsTrigger key={type} value={type} className="uppercase font-black italic text-[9px] h-6">
									{type}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{/* 2. Gender Selection */}
				<div className="space-y-2">
					<Label className="uppercase text-[9px] font-black tracking-[0.2em] text-primary/70 ml-1">Gender Class</Label>
					<Tabs defaultValue="male" onValueChange={(v) => actions.setGender(v as "male" | "female")}>
						<TabsList className="grid w-full grid-cols-2 bg-background border border-primary/10">
							<TabsTrigger value="male" className="uppercase font-black italic text-[10px]">
								Male
							</TabsTrigger>
							<TabsTrigger value="female" className="uppercase font-black italic text-[10px]">
								Female
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1">Body Weight (kg)</Label>
						<Input
							type="number"
							placeholder="0.0"
							className="bg-background border-primary/10 text-lg font-bold italic"
							onChange={(e) => actions.setBodyWeight(Number(e.target.value))}
						/>
					</div>
					<div className="space-y-2">
						<Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1">
							{isTotal ? "Total Load (kg)" : "Lift Load (kg)"}
						</Label>
						<Input
							type="number"
							placeholder="0.0"
							className="bg-background border-primary/10 text-lg font-bold italic border-l-2 border-l-primary/40"
							onChange={(e) => actions.setTotalLifted(Number(e.target.value))}
						/>
					</div>
				</div>

				{/* RESULT DISPLAY */}
				<div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-1 animate-in zoom-in-95 duration-300">
					<span className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Wilks Calibration Result</span>
					<span className="text-6xl font-black italic tracking-tighter text-foreground tabular-nums">{result}</span>
				</div>

				{/* DYNAMIC SCALE REFERENCE */}
				<div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2">
					<div className="flex items-center gap-2 mb-1">
						<Activity size={12} className="text-primary" />
						<span className="text-[10px] font-black uppercase tracking-widest text-primary">
							{isTotal ? "Total Points Standards" : "Single Lift Standards"}
						</span>
					</div>
					<div className="grid grid-cols-3 gap-2 text-[9px] uppercase font-bold text-muted-foreground/80">
						{isTotal ? (
							<>
								<div className="text-center p-1 bg-background/50 rounded">
									300
									<br />
									Solid
								</div>
								<div className="text-center p-1 bg-background/50 rounded border-x border-primary/10">
									450
									<br />
									National
								</div>
								<div className="text-center p-1 bg-background/50 rounded text-primary">
									550+
									<br />
									Elite
								</div>
							</>
						) : (
							<>
								<div className="text-center p-1 bg-background/50 rounded">
									100
									<br />
									Solid
								</div>
								<div className="text-center p-1 bg-background/50 rounded border-x border-primary/10">
									150
									<br />
									Advanced
								</div>
								<div className="text-center p-1 bg-background/50 rounded text-primary">
									200+
									<br />
									Elite
								</div>
							</>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
