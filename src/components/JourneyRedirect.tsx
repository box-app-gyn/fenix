// src/components/JourneyRedirect.tsx
import { useUserJourney } from '../hooks/useUserJourney';
import LoadingScreen from './LoadingScreen';

export default function JourneyRedirect() {
  useUserJourney();
  return <LoadingScreen message="Preparando sua jornada..." />;
}
