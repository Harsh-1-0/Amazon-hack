"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * This is the inner component that handles the animation logic.
 * It uses useSearchParams, so we wrap it in a Suspense boundary.
 */
function AnimationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get the archetype name from the URL query ?name=...
    const archetype = searchParams.get('name') || "Unknown Archetype";

    // This state controls the steps of the animation
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        // --- Animation Sequence ---

        // Step 1: After 0.5s, show the intro text.
        const timer1 = setTimeout(() => {
            setAnimationStep(1);
        }, 500);

        // Step 2: After 2.5s total, show the archetype result.
        const timer2 = setTimeout(() => {
            setAnimationStep(2);
        }, 2500);

        // Step 3: After 5.5s total, redirect to the landing page.
        const timer3 = setTimeout(() => {
            // *** THIS IS THE UPDATED LINE ***
            router.push('/landing'); 
        }, 5500);

        // This is a cleanup function to prevent errors if the user navigates away early.
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [router]); // The effect depends on the router.

    return (
        <div className="text-center">
            {/* 1. Announcement Text */}
            <h1
                className={`text-4xl font-light text-slate-300 transition-all duration-1000 ${
                    animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                }`}
            >
                Your archetype is...
            </h1>

            {/* 2. Archetype Result Text */}
            <h2
                className={`text-6xl font-bold text-cyan-400 mt-4 transition-all duration-1000 delay-300 ${
                    animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
            >
                {archetype}
            </h2>
        </div>
    );
}


/**
 * This is the main page component for the /archetype route.
 */
export default function ArchetypePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
            <Suspense fallback={<div className="text-white text-2xl">Calculating...</div>}>
                <AnimationContent />
            </Suspense>
        </div>
    );
}