import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import type { DashboardSettings } from "../types/settings";

export function OnboardingPage({ onComplete }: { onComplete: (settings: DashboardSettings) => void }) {
  return <OnboardingFlow onComplete={onComplete} />;
}
