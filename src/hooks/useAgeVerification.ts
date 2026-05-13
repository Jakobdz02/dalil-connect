export type AgeRole = "seeker" | "guide";

export function useAgeVerification() {
  function calculateAge(dob: string): number {
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return -1;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function minAge(_role: AgeRole): number {
    // Both clients (seekers) and guides/mentors must be at least 18.
    return 18;
  }

  function isAgeValid(dob: string, role: AgeRole): boolean {
    const age = calculateAge(dob);
    if (age < 0) return false;
    return age >= minAge(role);
  }

  function isFutureDate(dob: string): boolean {
    const d = new Date(dob);
    return !isNaN(d.getTime()) && d.getTime() > Date.now();
  }

  return { calculateAge, isAgeValid, minAge, isFutureDate };
}
