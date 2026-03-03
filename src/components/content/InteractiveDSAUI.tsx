import { useState, useEffect, useRef } from 'react';
import { Lightbulb, CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import gsap from 'gsap';

// ─── Pure drag item — no timeline inside ─────────────────────────────────────
const SortableItem = ({ id, text }: { id: string; text: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 }}
            {...attributes}
            {...listeners}
            className={`flex items-center p-4 rounded-lg border transition-all duration-150
                cursor-grab active:cursor-grabbing touch-none select-none
                ${isDragging
                    ? 'bg-zinc-800/70 border-purple-500/60 shadow-xl opacity-90 scale-[1.02]'
                    : 'bg-[#111317] border-gray-800 hover:border-gray-700 hover:bg-zinc-800/20'
                }`}
        >
            <div className="pr-3 text-yellow-600/70 flex-shrink-0">
                <Lightbulb size={16} />
            </div>
            <div className="flex-1 text-[#D0D0E0] text-sm font-mono tracking-tight">{text}</div>
        </div>
    );
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DSAStep {
    id: string;
    text: string;
    issue_found?: string;
    hint?: string;
    concept?: string;
}

interface InteractiveDSAUIProps {
    dsaData: { type: string; steps: DSAStep[] };
    onComplete?: () => void;
    isCompleted?: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function InteractiveDSAUI({ dsaData, onComplete }: InteractiveDSAUIProps) {
    const [userSteps, setUserSteps] = useState<DSAStep[]>([]);
    const [correctSteps, setCorrectSteps] = useState<DSAStep[]>([]);
    const [feedback, setFeedback] = useState<{ issue?: string; hint?: string; concept?: string } | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasValidated, setHasValidated] = useState(false);   // did user click Validate at least once?

    // Refs for GSAP — keyed by step index
    const dotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const tickRefs = useRef<Map<number, SVGSVGElement>>(new Map());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // ── Initialise / reset when question changes ──────────────────────────────
    useEffect(() => {
        if (!dsaData?.steps?.length) return;
        const dbSteps = dsaData.steps;
        setCorrectSteps(dbSteps);

        let scrambled = shuffleArray(dbSteps);
        if (dbSteps.length > 1) {
            while (JSON.stringify(scrambled.map(s => s.id)) === JSON.stringify(dbSteps.map(s => s.id))) {
                scrambled = shuffleArray(dbSteps);
            }
        }
        setUserSteps(scrambled);
        setFeedback(null);
        setIsSuccess(false);
        setHasValidated(false);
        // Reset all dots/lines to gray immediately
        resetDotStyles();
    }, [dsaData]);

    // ── Reset dots + lines to default gray (no animation) ────────────────────
    const resetDotStyles = () => {
        dotRefs.current.forEach(el => {
            gsap.set(el, { borderColor: '#374151', backgroundColor: 'transparent', scale: 1 });
        });
        lineRefs.current.forEach(el => {
            gsap.set(el, { scaleY: 1, backgroundColor: '#1f2937' });
        });
        tickRefs.current.forEach(el => {
            gsap.set(el, { opacity: 0, scale: 0 });
        });
    };

    // ── Animate green down sequentially, stopping at `count` ─────────────────
    const animateGreenDown = (count: number, onDone?: () => void) => {
        const tl = gsap.timeline({ onComplete: onDone });
        const STEP = 0.28; // seconds per step

        for (let i = 0; i < count; i++) {
            const dot = dotRefs.current.get(i);
            const line = lineRefs.current.get(i);
            const tick = tickRefs.current.get(i);

            if (dot) {
                tl.to(dot, {
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.18)',
                    scale: 1.2,
                    duration: 0.22,
                    ease: 'back.out(2)',
                }, i * STEP);
                tl.to(dot, { scale: 1, duration: 0.15 }, i * STEP + 0.22);
            }

            // Tick icon pops in alongside dot
            if (tick) {
                tl.fromTo(tick,
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2.5)' },
                    i * STEP + 0.05
                );
            }

            // Line drops from top
            if (line && i < count - 1) {
                tl.fromTo(
                    line,
                    { scaleY: 0, transformOrigin: 'top center', backgroundColor: '#10b981' },
                    { scaleY: 1, duration: 0.2, ease: 'none' },
                    i * STEP + 0.2
                );
            }
        }

        return tl;
    };

    // ── Drag end ──────────────────────────────────────────────────────────────
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setUserSteps(items => {
                const oi = items.findIndex(x => x.id === active.id);
                const ni = items.findIndex(x => x.id === over.id);
                return arrayMove(items, oi, ni);
            });
            // After reorder, reset dots/lines back to gray
            setFeedback(null);
            setIsSuccess(false);
            setHasValidated(false);
            setTimeout(() => resetDotStyles(), 0);
        }
    };

    // ── Validate ──────────────────────────────────────────────────────────────
    const handleValidate = () => {
        setFeedback(null);
        setHasValidated(true);

        // How many leading steps are correct?
        let correctCount = 0;
        for (let i = 0; i < correctSteps.length; i++) {
            if (userSteps[i]?.id === correctSteps[i]?.id) correctCount++;
            else break;
        }

        const allCorrect = correctCount === correctSteps.length;

        if (allCorrect) {
            // Animate all steps green, then mark success
            animateGreenDown(correctCount, () => {
                setIsSuccess(true);
                if (onComplete) onComplete();
            });
        } else {
            // Animate up to the correct prefix, then show feedback
            animateGreenDown(correctCount, () => {
                const wrongStep = correctSteps[correctCount];
                setFeedback({
                    issue: wrongStep?.issue_found || 'Incorrect step order.',
                    hint: wrongStep?.hint || 'Check the logic of your algorithm.',
                    concept: wrongStep?.concept || 'Algorithmic flow',
                });
            });
        }
    };

    // ── Reveal solution ───────────────────────────────────────────────────────
    const handleRevealSolution = () => {
        setUserSteps([...correctSteps]);
        setFeedback(null);
        setHasValidated(true);
        // Animate all green after a tick (so refs are updated)
        setTimeout(() => {
            animateGreenDown(correctSteps.length, () => {
                setIsSuccess(true);
            });
        }, 50);
        // Do NOT call onComplete() — reveal should not mark as completed
    };

    // ── Retry — reshuffle, reset everything ──────────────────────────────────
    const handleRetry = () => {
        if (!dsaData?.steps?.length) return;
        const dbSteps = dsaData.steps;
        let scrambled = shuffleArray(dbSteps);
        if (dbSteps.length > 1) {
            while (JSON.stringify(scrambled.map(s => s.id)) === JSON.stringify(dbSteps.map(s => s.id))) {
                scrambled = shuffleArray(dbSteps);
            }
        }
        setUserSteps(scrambled);
        setFeedback(null);
        setIsSuccess(false);
        setHasValidated(false);
        setTimeout(() => resetDotStyles(), 0);
    };

    if (!dsaData?.steps) return null;

    return (
        <div className="flex flex-col gap-6 h-full font-sans">
            {/* ── Builder Panel ── */}
            <div className="bg-[#111317] border border-gray-800 rounded-2xl flex flex-col flex-1 shadow-2xl overflow-hidden">
                {/* Mac header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-[#14161a]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 border border-gray-600 rounded-[3px]" />
                        <div className="w-3 h-3 border border-gray-600 rounded-[3px]" />
                    </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col overflow-auto">
                    <h2 className="text-xl font-semibold text-white mb-1">Build the algorithm step by step</h2>
                    <p className="text-[#808090] text-sm mb-6">Drag and order the steps to build the algorithm.</p>

                    {/* ── Timeline + Sortable ── */}
                    <div className="flex-1">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={userSteps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                <div className="flex flex-col">
                                    {userSteps.map((step, idx) => {
                                        const isLast = idx === userSteps.length - 1;
                                        return (
                                            <div key={step.id} className="flex items-stretch gap-4">
                                                {/* ── LEFT: Timeline column ── */}
                                                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
                                                    {/* Circle dot — starts gray, animates green via GSAP */}
                                                    <div
                                                        ref={el => { if (el) dotRefs.current.set(idx, el); }}
                                                        className="w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-3.5"
                                                        style={{ borderColor: '#374151', backgroundColor: 'transparent' }}
                                                    >
                                                        <CheckCircle2
                                                            ref={el => { if (el) tickRefs.current.set(idx, el as unknown as SVGSVGElement); }}
                                                            size={12}
                                                            className="text-emerald-400"
                                                            style={{ opacity: 0, transform: 'scale(0)' }}
                                                        />
                                                    </div>
                                                    {/* Connector line — starts dark, animates green via GSAP */}
                                                    {!isLast && (
                                                        <div
                                                            ref={el => { if (el) lineRefs.current.set(idx, el); }}
                                                            className="flex-1 w-0.5"
                                                            style={{
                                                                backgroundColor: '#1f2937',
                                                                minHeight: 12,
                                                                transformOrigin: 'top center',
                                                            }}
                                                        />
                                                    )}
                                                </div>

                                                {/* ── RIGHT: Drag item ── */}
                                                <div className="flex-1 mb-3">
                                                    <SortableItem id={step.id} text={step.text} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-800/50">
                        {/* Validate / Validated */}
                        <button
                            onClick={handleValidate}
                            disabled={isSuccess}
                            className={`px-6 py-2.5 font-medium rounded-lg transition-colors shadow-lg ${isSuccess
                                ? 'bg-emerald-600/50 text-white/70 cursor-not-allowed shadow-none'
                                : 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-emerald-900/20'
                                }`}
                        >
                            {isSuccess ? 'Validated ✓' : 'Validate Steps'}
                        </button>

                        {/* Retry — icon-only button, visible after any validate attempt or success */}
                        {hasValidated && (
                            <button
                                onClick={handleRetry}
                                title="Retry"
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 bg-transparent hover:bg-zinc-800/60 text-gray-400 hover:text-white transition-colors"
                            >
                                <RotateCcw size={16} />
                            </button>
                        )}

                        {/* Reveal — always on far right */}
                        <div className="relative group ml-auto">
                            <button
                                onClick={hasValidated ? handleRevealSolution : undefined}
                                disabled={!hasValidated}
                                className={`px-5 py-2.5 border font-medium rounded-lg transition-colors flex items-center gap-2 ${hasValidated
                                    ? 'bg-transparent hover:bg-zinc-800/50 border-gray-800 text-[#D0D0E0] cursor-pointer'
                                    : 'bg-transparent border-gray-800/50 text-gray-600 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <Eye size={16} />
                                Reveal Answer
                            </button>
                            {!hasValidated && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-800 text-xs text-[#D0D0E0] rounded-md border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                                    Try to solve once
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-800" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Feedback / Success Panel ── */}
            {(feedback || isSuccess) && (
                <div className={`bg-[#111317] border rounded-2xl p-6 shadow-2xl shrink-0 ${feedback ? 'border-yellow-600/30' : 'border-emerald-600/30'
                    }`}>
                    <div className="flex items-center gap-2 mb-3">
                        {feedback ? (
                            <><Lightbulb className="w-5 h-5 text-yellow-500" /><h3 className="text-yellow-500 font-medium">Mistake Detected</h3></>
                        ) : (
                            <><CheckCircle2 className="w-5 h-5 text-emerald-500" /><h3 className="text-emerald-500 font-medium">Excellent Work!</h3></>
                        )}
                    </div>

                    {feedback ? (
                        <div className="space-y-3">
                            <p className="text-[#D0D0E0] text-sm leading-relaxed">
                                <span className="text-yellow-400/80 font-medium">Issue:</span> {feedback.issue}
                            </p>
                            {feedback.hint && (
                                <p className="text-[#A0A0B0] text-sm">
                                    <span className="text-blue-400/80 font-medium">Hint:</span> {feedback.hint}
                                </p>
                            )}
                            {feedback.concept && (
                                <div className="bg-[#16181d] rounded-xl p-4 border border-gray-800/60 mt-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-600/70" />
                                        <span className="text-yellow-600/70 text-xs font-semibold uppercase tracking-wider">Concept</span>
                                    </div>
                                    <p className="text-[#A0A0B0] text-sm">{feedback.concept}</p>
                                    <div className="flex justify-end mt-3">
                                        <button onClick={() => setFeedback(null)}
                                            className="px-4 py-1.5 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 rounded-lg text-sm font-medium transition-colors">
                                            Got it
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-[#D0D0E0] text-sm leading-relaxed">
                                You have correctly ordered all steps for the algorithm.
                            </p>
                            <div className="flex justify-end">
                                <p className="text-emerald-500 text-sm font-medium flex items-center gap-1.5">
                                    Algorithm validated <CheckCircle2 size={15} />
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
