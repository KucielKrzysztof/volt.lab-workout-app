/**
 * @fileoverview RPE (Rate of Perceived Exertion) Calibrator.
 * Part of the VOLT.LAB calculation suite, this component handles
 * the estimation of 1RM based on subjective effort levels.
 * @module features/calculators/components/RpeCalculator
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { useCalculators } from "../_hooks/use-calculators";

interface RpeCalculatorProps {
	/** * Technical summary of the RPE protocol.
	 * Usually injected from the global CALCULATOR_OPTIONS registry.
	 */
	description?: string;
}

/**
 * RpeCalculator Component.
 * * @description
 * An advanced diagnostic tool designed for autoregulated training.
 * It converts the relationship between load, volume, and perceived
 * difficulty into an Estimated 1RM (e1RM).
 * * @features
 * 1. **Adaptive Input Grid**: Implements a 2x2 to 3-column transition for mobile ergonomics.
 * 2. **e1RM Engine**: Uses reactive intensity mapping to calculate peak capacity.
 * 3. **Protocol Legend**: Provides an on-site reference for RPE/RIR values.
 * * @param {RpeCalculatorProps} props - Component properties.
 * @returns {JSX.Element} The calibrated RPE interface.
 */
export const RpeCalculator = ({ description }: RpeCalculatorProps) => {
	/** * Destructured calculator state from the headless hook.
	 * `result` represents the calculated e1RM.
	 */
	const { rpe } = useCalculators();
	const { inputs, actions, result } = rpe;

	return (
		<Card className="border-primary/20 bg-secondary/5 overflow-hidden shadow-2xl">
			<CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
				<div className="space-y-1">
					<CardTitle className="text-xl uppercase italic font-black tracking-tighter">RPE CALIBRATOR</CardTitle>
					{description && <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-none">{description}</p>}
				</div>
				<Activity className="text-primary shrink-0" size={24} />
			</CardHeader>

			<CardContent className="p-6 space-y-6">
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
					<div className="space-y-2 col-span-1">
						<Label className="uppercase text-[9px] font-black tracking-widest text-muted-foreground ml-1">Load</Label>
						<Input
							type="number"
							placeholder="kg"
							className="bg-background border-primary/10 font-bold italic h-10"
							onChange={(e) => actions.setWeight(Number(e.target.value))}
						/>
					</div>
					<div className="space-y-2 col-span-1">
						<Label className="uppercase text-[9px] font-black tracking-widest text-muted-foreground ml-1">Reps</Label>
						<Input
							type="number"
							placeholder="0"
							className="bg-background border-primary/10 font-bold italic h-10"
							onChange={(e) => actions.setReps(Number(e.target.value))}
						/>
					</div>
					<div className="space-y-2 col-span-2 sm:col-span-1">
						<Label className="uppercase text-[9px] font-black tracking-widest text-primary ml-1 text-left block">RPE</Label>
						<Select defaultValue="8" onValueChange={(v) => actions.setRpe(Number(v))}>
							<SelectTrigger className="bg-background border-primary/20 h-10 font-black italic">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-popover border-primary/20">
								{[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6].map((val) => (
									<SelectItem key={val} value={val.toString()} className="font-bold italic uppercase text-xs">
										RPE {val}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* E1RM RESULT */}
				<div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-1 animate-in zoom-in-95 duration-300">
					<span className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Estimated 1RM (e1RM)</span>
					<span className="text-6xl font-black italic tracking-tighter text-foreground tabular-nums">
						{result} <span className="text-lg not-italic text-muted-foreground">kg</span>
					</span>
				</div>

				{/* LOGIC DATA BUBBLE */}
				<div className="bg-white/5 border border-white/5 rounded-lg p-3 text-[10px] uppercase tracking-tighter italic text-muted-foreground">
					<p className="font-black text-primary mb-1 tracking-widest">RPE Legend:</p>
					<div className="grid grid-cols-2 gap-2">
						<p>• RPE 10: MAX EFFORT (0 Reps in tank)</p>
						<p>• RPE 9: 1 REP IN TANK</p>
						<p>• RPE 8: 2 REPS IN TANK</p>
						<p>• RPE 7: 3 REPS IN TANK</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
