/**
 * Engineered Native Haptic Physics Engine.
 * Safely guards against Desktop/Unsupported Webkit engines.
 * Use these standard 2026 pre-sets to guarantee premium physical feedback.
 */

export const Haptics = {
    // A micro, barely noticeable click (Best for: toggles, tiny secondary actions)
    light: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    },
    // A solid, satisfying thud (Best for: Primary buttons, adding an expense)
    medium: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(25);
        }
    },
    // A heavy, alarming shake (Best for: Delete confirmation, severe validation errors)
    heavy: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    },
    // A double tap to signify a complex operation completing (Best for: Settling balances, successful export)
    success: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([10, 40, 20]);
        }
    }
};
