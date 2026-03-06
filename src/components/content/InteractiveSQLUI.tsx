import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

// ─── Data Interfaces ──────────────────────────────────────────────
export interface SQLConstructData {
    type: 'sql_construct';
    queryLines: string[][];       // 2D: each sub-array = one line of tokens
    distractors: string[];        // extra wrong tokens
    tableSchema?: {
        tableName: string;
        columns: string[];
        rows: (string | number)[][];
    };
    expectedOutput?: {
        columns: string[];
        rows: (string | number)[][];
    };
}

interface InteractiveSQLUIProps {
    sqlData: SQLConstructData;
    onComplete?: () => void;
    isCompleted?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────

/** Classify a token as a "symbol" (yellow) or "keyword" (gray) */
const isSymbolToken = (token: string): boolean => {
    const symbols = new Set([
        ';', ',', '(', ')', '*', '+', '-', '/', '=', '<', '>',
        '<=', '>=', '<>', '!=', ':=', '<-', '||', '&&', '.', ':',
    ]);
    return symbols.has(token.trim());
};

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Component ────────────────────────────────────────────────────

export default function InteractiveSQLUI({ sqlData, onComplete, isCompleted: initialCompleted }: InteractiveSQLUIProps) {
    // Flatten the correct tokens (order-preserved) and build slot model
    const allCorrectTokens = sqlData.queryLines.flat();
    const totalSlots = allCorrectTokens.length;

    // "slots" holds user-placed token text (empty string = unfilled)
    const [slots, setSlots] = useState<string[]>(Array(totalSlots).fill(''));
    // pool of available tokens (starts shuffled, shrinks as user places them)
    const [pool, setPool] = useState<string[]>([]);
    // validation feedback per slot: null = unchecked, true = correct, false = wrong
    const [feedback, setFeedback] = useState<(boolean | null)[]>(Array(totalSlots).fill(null));
    const [isSuccess, setIsSuccess] = useState(false);
    const [shakeSlots, setShakeSlots] = useState<Set<number>>(new Set());
    const [hasAttempted, setHasAttempted] = useState(false);

    // Drag state — which token is currently being dragged
    const [dragSource, setDragSource] = useState<{ type: 'pool' | 'slot'; index: number; token: string } | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
    const [dragOverPool, setDragOverPool] = useState(false);

    // Refs for GSAP animations
    const slotRefs = useRef<Map<number, HTMLElement>>(new Map());
    const poolAreaRef = useRef<HTMLDivElement>(null);

    // ── Initialise pool ──
    useEffect(() => {
        const correct = sqlData.queryLines.flat();
        const distractors = sqlData.distractors || [];
        setPool(shuffle([...correct, ...distractors]));
        setSlots(Array(totalSlots).fill(''));
        setFeedback(Array(totalSlots).fill(null));
        setIsSuccess(false);
        setHasAttempted(false);
    }, [sqlData, initialCompleted]);

    // ── Find the first empty slot index ──
    const firstEmptySlot = useCallback(() => {
        return slots.findIndex(s => s === '');
    }, [slots]);

    // ── GSAP pop-in animation for a slot ──
    const animateSlotFill = (slotIdx: number) => {
        const el = slotRefs.current.get(slotIdx);
        if (el) {
            gsap.fromTo(el,
                { scale: 0.7, opacity: 0.5 },
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    };

    // ── GSAP pop-out animation for a slot clearing ──
    const animateSlotClear = (slotIdx: number, callback?: () => void) => {
        const el = slotRefs.current.get(slotIdx);
        if (el) {
            gsap.to(el, {
                scale: 0.8, opacity: 0, duration: 0.2, ease: 'power2.in',
                onComplete: () => {
                    gsap.set(el, { scale: 1, opacity: 1 });
                    callback?.();
                }
            });
        } else {
            callback?.();
        }
    };

    // ── Place a token into a specific slot ──
    const placeTokenInSlot = (token: string, poolIndex: number, targetSlot: number) => {
        if (isSuccess) return;
        if (slots[targetSlot] !== '') return; // slot occupied

        setSlots(prev => {
            const next = [...prev];
            next[targetSlot] = token;
            return next;
        });
        setPool(prev => {
            const next = [...prev];
            next.splice(poolIndex, 1);
            return next;
        });
        setFeedback(Array(totalSlots).fill(null));
        // Animate
        requestAnimationFrame(() => animateSlotFill(targetSlot));
    };

    // ── Click a pool token → place in next empty slot ──
    const handlePoolTokenClick = (token: string, poolIndex: number) => {
        if (isSuccess) return;
        const emptyIdx = firstEmptySlot();
        if (emptyIdx === -1) return;
        placeTokenInSlot(token, poolIndex, emptyIdx);
    };

    // ── Click a filled slot → remove token back to pool ──
    const handleSlotClick = (slotIdx: number) => {
        if (isSuccess) return;
        const token = slots[slotIdx];
        if (!token) return;

        animateSlotClear(slotIdx, () => {
            setSlots(prev => {
                const next = [...prev];
                next[slotIdx] = '';
                return next;
            });
            setPool(prev => [...prev, token]);
            setFeedback(Array(totalSlots).fill(null));
        });
    };

    // ── Move token from one slot to another ──
    const moveSlotToSlot = (fromIdx: number, toIdx: number) => {
        if (isSuccess) return;
        if (fromIdx === toIdx) return;
        const token = slots[fromIdx];
        if (!token) return;
        if (slots[toIdx] !== '') return; // target not empty

        setSlots(prev => {
            const next = [...prev];
            next[toIdx] = token;
            next[fromIdx] = '';
            return next;
        });
        setFeedback(Array(totalSlots).fill(null));
        requestAnimationFrame(() => animateSlotFill(toIdx));
    };

    // ── Move token from slot back to pool ──
    const moveSlotToPool = (slotIdx: number) => {
        if (isSuccess) return;
        const token = slots[slotIdx];
        if (!token) return;

        animateSlotClear(slotIdx, () => {
            setSlots(prev => {
                const next = [...prev];
                next[slotIdx] = '';
                return next;
            });
            setPool(prev => [...prev, token]);
            setFeedback(Array(totalSlots).fill(null));
        });
    };

    // ═══════════════════════════════════════════════════════
    // HTML5 Drag & Drop Handlers
    // ═══════════════════════════════════════════════════════

    // -- Pool token drag start --
    const onPoolDragStart = (e: React.DragEvent, token: string, poolIndex: number) => {
        setDragSource({ type: 'pool', index: poolIndex, token });
        e.dataTransfer.effectAllowed = 'move';
        // Make the drag ghost slightly transparent
        const el = e.currentTarget as HTMLElement;
        requestAnimationFrame(() => {
            gsap.to(el, { opacity: 0.4, scale: 0.95, duration: 0.15 });
        });
    };

    // -- Slot token drag start --
    const onSlotDragStart = (e: React.DragEvent, slotIdx: number) => {
        const token = slots[slotIdx];
        if (!token || isSuccess) { e.preventDefault(); return; }
        setDragSource({ type: 'slot', index: slotIdx, token });
        e.dataTransfer.effectAllowed = 'move';
        const el = e.currentTarget as HTMLElement;
        requestAnimationFrame(() => {
            gsap.to(el, { opacity: 0.4, scale: 0.95, duration: 0.15 });
        });
    };

    // -- Generic drag end (cleanup) --
    const onDragEnd = (e: React.DragEvent) => {
        const el = e.currentTarget as HTMLElement;
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.2 });
        setDragSource(null);
        setDragOverSlot(null);
        setDragOverPool(false);
    };

    // -- Slot drag over --
    const onSlotDragOver = (e: React.DragEvent, slotIdx: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverSlot(slotIdx);
    };

    const onSlotDragLeave = () => {
        setDragOverSlot(null);
    };

    // -- Drop on a slot --
    const onSlotDrop = (e: React.DragEvent, slotIdx: number) => {
        e.preventDefault();
        setDragOverSlot(null);

        if (!dragSource) return;

        if (dragSource.type === 'pool') {
            // Pool → Slot
            if (slots[slotIdx] === '') {
                placeTokenInSlot(dragSource.token, dragSource.index, slotIdx);
            }
        } else if (dragSource.type === 'slot') {
            // Slot → Slot
            if (slots[slotIdx] === '') {
                moveSlotToSlot(dragSource.index, slotIdx);
            }
        }

        setDragSource(null);
    };

    // -- Pool area drag over --
    const onPoolDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverPool(true);
    };

    const onPoolDragLeave = () => {
        setDragOverPool(false);
    };

    // -- Drop on pool area (return a slot token) --
    const onPoolDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverPool(false);

        if (!dragSource) return;

        if (dragSource.type === 'slot') {
            moveSlotToPool(dragSource.index);
        }
        // If pool → pool, ignore

        setDragSource(null);
    };

    // ═══════════════════════════════════════════════════════
    // Validate / Reveal / Reset (unchanged logic)
    // ═══════════════════════════════════════════════════════

    const handleValidate = () => {
        const allFilled = slots.every(s => s !== '');
        if (!allFilled) return;

        setHasAttempted(true);

        const newFeedback: (boolean | null)[] = [];
        const wrong = new Set<number>();
        let allCorrect = true;

        for (let i = 0; i < totalSlots; i++) {
            const correct = slots[i] === allCorrectTokens[i];
            newFeedback.push(correct);
            if (!correct) {
                allCorrect = false;
                wrong.add(i);
            }
        }

        setFeedback(newFeedback);

        if (allCorrect) {
            console.log('[InteractiveSQLUI] All slots correct. Triggering onComplete()');
            setIsSuccess(true);
            // Animate all slots green pulse
            slotRefs.current.forEach((el) => {
                gsap.fromTo(el,
                    { boxShadow: '0 0 0px rgba(16,185,129,0)' },
                    { boxShadow: '0 0 12px rgba(16,185,129,0.4)', duration: 0.4, yoyo: true, repeat: 1 }
                );
            });
            onComplete?.();
        } else {
            setShakeSlots(wrong);
            const removedTokens = Array.from(wrong).map(idx => slots[idx]).filter(Boolean);

            setTimeout(() => {
                setShakeSlots(new Set());
                setSlots(prev => {
                    const next = [...prev];
                    wrong.forEach(idx => { next[idx] = ''; });
                    return next;
                });
                setPool(prev => [...prev, ...removedTokens]);
                setFeedback(Array(totalSlots).fill(null));
            }, 600);
        }
    };

    const handleReveal = () => {
        setSlots([...allCorrectTokens]);
        const correctCopy = [...allCorrectTokens];
        setPool(prev => {
            const remaining = [...prev];
            const currentSlotTokens = slots.filter(s => s !== '');
            const allAvailable = [...remaining, ...currentSlotTokens];
            const result = [...allAvailable];
            correctCopy.forEach(tok => {
                const idx = result.indexOf(tok);
                if (idx !== -1) result.splice(idx, 1);
            });
            return result;
        });
        setFeedback(allCorrectTokens.map(() => true));
        setIsSuccess(true);
        setHasAttempted(true);
        // Animate reveal
        requestAnimationFrame(() => {
            slotRefs.current.forEach((el, idx) => {
                gsap.fromTo(el,
                    { scale: 0.6, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.35, delay: idx * 0.04, ease: 'back.out(1.4)' }
                );
            });
        });
        // NOTE: We do NOT call onComplete() here so reveal doesn't mark as completed
    };

    const handleReset = () => {
        const correct = sqlData.queryLines.flat();
        const distractors = sqlData.distractors || [];
        setPool(shuffle([...correct, ...distractors]));
        setSlots(Array(totalSlots).fill(''));
        setFeedback(Array(totalSlots).fill(null));
        setHasAttempted(false);
        setIsSuccess(false);
        setShakeSlots(new Set());
    };

    // ── Compute slot width from the expected answer length ──
    const slotWidth = (token: string) => {
        const chars = token.length;
        return Math.max(40, Math.min(200, chars * 12 + 24));
    };

    // ── Build slot line mapping ──
    let slotIndex = 0;
    const queryLineSlots: { lineIdx: number; tokenIdx: number; globalIdx: number; expectedToken: string }[][] = [];
    sqlData.queryLines.forEach((line, lineIdx) => {
        const lineSlots: typeof queryLineSlots[0] = [];
        line.forEach((token, tokenIdx) => {
            lineSlots.push({ lineIdx, tokenIdx, globalIdx: slotIndex, expectedToken: token });
            slotIndex++;
        });
        queryLineSlots.push(lineSlots);
    });

    return (
        <div className="flex flex-col gap-5 h-full font-sans">
            {/* Main Builder Panel */}
            <div className="bg-[#111317] border border-gray-800 rounded-2xl flex flex-col flex-1 shadow-2xl overflow-hidden">
                {/* Mac-style header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-[#14161a]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-pink-400">SQL</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 border border-gray-600 rounded-[3px]" />
                        <div className="w-3 h-3 border border-gray-600 rounded-[3px]" />
                    </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col overflow-auto">
                    <h2 className="text-lg font-semibold text-white mb-1">Construct the SQL Query</h2>
                    <p className="text-[#808090] text-sm mb-6">Drag tokens into the blanks or click to auto-place.</p>

                    {/* ── Query Slot Area ── */}
                    <div className="flex-1 space-y-3 mb-6">
                        {queryLineSlots.map((line, lineIdx) => (
                            <div key={lineIdx} className="flex items-center gap-2 flex-wrap">
                                {line.map(({ globalIdx, expectedToken }) => {
                                    const filled = slots[globalIdx] !== '';
                                    const fb = feedback[globalIdx];
                                    const shaking = shakeSlots.has(globalIdx);
                                    const width = slotWidth(expectedToken);
                                    const isDragTarget = dragOverSlot === globalIdx && !filled;

                                    return (
                                        <div
                                            key={globalIdx}
                                            ref={(el) => { if (el) slotRefs.current.set(globalIdx, el); }}
                                            draggable={filled && !isSuccess}
                                            onDragStart={(e) => onSlotDragStart(e, globalIdx)}
                                            onDragEnd={onDragEnd}
                                            onDragOver={(e) => onSlotDragOver(e, globalIdx)}
                                            onDragLeave={onSlotDragLeave}
                                            onDrop={(e) => onSlotDrop(e, globalIdx)}
                                            onClick={() => handleSlotClick(globalIdx)}
                                            style={{ minWidth: width }}
                                            className={`
                                                h-9 rounded-md border-2 font-mono text-sm px-2
                                                flex items-center justify-center transition-all duration-200
                                                ${shaking ? 'animate-shake' : ''}
                                                ${isDragTarget
                                                    ? 'border-[#a855f7] bg-[#a855f7]/10 border-solid scale-105'
                                                    : filled
                                                        ? fb === true
                                                            ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300 border-solid'
                                                            : fb === false
                                                                ? 'bg-red-600/20 border-red-500/60 text-red-300 border-solid'
                                                                : isSymbolToken(slots[globalIdx])
                                                                    ? 'bg-yellow-600/15 border-yellow-600/40 text-yellow-400 border-solid cursor-grab active:cursor-grabbing hover:border-yellow-400/60'
                                                                    : 'bg-zinc-800/50 border-gray-600/50 text-[#d0d0e0] border-solid cursor-grab active:cursor-grabbing hover:border-gray-400/60'
                                                        : 'bg-zinc-900/40 border-gray-700/40 text-transparent border-dashed'
                                                }
                                                ${!filled && !isDragTarget ? 'cursor-default' : ''}
                                            `}
                                        >
                                            {filled ? slots[globalIdx] : '\u00A0'}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* ── Separator ── */}
                    <div className="border-t border-gray-800/50 mb-5" />

                    {/* ── Token Pool ── */}
                    <div
                        ref={poolAreaRef}
                        onDragOver={onPoolDragOver}
                        onDragLeave={onPoolDragLeave}
                        onDrop={onPoolDrop}
                        className={`flex flex-wrap gap-2 mb-6 min-h-[48px] p-2 -m-2 rounded-lg transition-colors duration-200 ${dragOverPool ? 'bg-zinc-800/40 ring-1 ring-gray-600/50' : ''
                            }`}
                    >
                        {pool.map((token, idx) => {
                            const sym = isSymbolToken(token);
                            return (
                                <button
                                    key={`${token}-${idx}`}
                                    draggable={!isSuccess}
                                    onDragStart={(e) => onPoolDragStart(e, token, idx)}
                                    onDragEnd={onDragEnd}
                                    onClick={() => handlePoolTokenClick(token, idx)}
                                    disabled={isSuccess || firstEmptySlot() === -1}
                                    className={`
                                        px-3.5 py-1.5 text-sm
                                        rounded-md font-mono font-medium border transition-all duration-150 select-none
                                        ${isSuccess || firstEmptySlot() === -1
                                            ? 'opacity-40 cursor-not-allowed'
                                            : 'cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95'
                                        }
                                        ${sym
                                            ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/30'
                                            : 'bg-zinc-800/60 text-[#c8c8d8] border-gray-700/60 hover:bg-zinc-700/60'
                                        }
                                    `}
                                >
                                    {token}
                                </button>
                            );
                        })}
                        {pool.length === 0 && !isSuccess && (
                            <span className="text-[#808090] text-sm italic">All tokens placed. Click "Check Query" or click/drag a slot to remove.</span>
                        )}
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-800/50">
                        <button
                            onClick={handleValidate}
                            disabled={isSuccess || slots.some(s => s === '')}
                            className={`px-6 py-2.5 font-medium rounded-lg transition-colors shadow-lg ${isSuccess
                                ? 'bg-emerald-600/50 text-white/70 cursor-not-allowed shadow-none'
                                : slots.some(s => s === '')
                                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-emerald-900/20'
                                }`}
                        >
                            {isSuccess ? '✓ Correct!' : 'Check Query'}
                        </button>

                        {!isSuccess && (
                            <div className="relative group">
                                <button
                                    onClick={hasAttempted ? handleReveal : undefined}
                                    disabled={!hasAttempted}
                                    className={`px-5 py-2.5 border font-medium rounded-lg transition-colors flex items-center gap-2 ${hasAttempted
                                        ? 'bg-transparent hover:bg-zinc-800/50 border-gray-800 text-[#D0D0E0] cursor-pointer'
                                        : 'bg-transparent border-gray-800/50 text-gray-600 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    <Eye size={16} />
                                    Reveal
                                </button>
                                {!hasAttempted && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-800 text-xs text-[#D0D0E0] rounded-md border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                                        Try to solve once
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-800" />
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleReset}
                            className="px-5 py-2.5 bg-transparent hover:bg-zinc-800/50 border border-gray-800 text-[#D0D0E0] font-medium rounded-lg transition-colors flex items-center gap-2 ml-auto"
                        >
                            <RotateCcw size={16} />
                            Retry
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Success / Feedback Panel ── */}
            {isSuccess && (
                <div className="bg-[#111317] border border-emerald-600/30 rounded-2xl p-5 shadow-2xl shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-emerald-500 font-medium">Query Correct!</h3>
                    </div>
                    <p className="text-[#D0D0E0] text-sm leading-relaxed">
                        You've successfully constructed the SQL query. Well done!
                    </p>
                </div>
            )}

            {/* Shake animation */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                    20%, 40%, 60%, 80% { transform: translateX(6px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    );
}
