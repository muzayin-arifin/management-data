
import { Student } from "@/lib/oop/Student";

/**
 * Linear Search Algorithm
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export function linearSearch(students: Student[], query: string, field: 'name' | 'email' | 'student_id'): Student[] {
  const results: Student[] = [];
  const lowerQuery = query.toLowerCase();

  for (let i = 0; i < students.length; i++) {
    const value = (students[i] as any)[field]?.toString().toLowerCase();
    if (value && value.includes(lowerQuery)) {
      results.push(students[i]);
    }
  }
  return results;
}

/**
 * Binary Search Algorithm
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 * Requirement: The array must be sorted by the target field.
 */
export function binarySearch(students: Student[], targetId: string): Student | null {
  // Assuming students are sorted by ID for this example
  let left = 0;
  let right = students.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = students[mid].student_id; // Using student_id (NIM) as generic target

    if (midVal === targetId) {
      return students[mid];
    } else if (midVal < targetId) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return null;
}
