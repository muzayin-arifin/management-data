
import { Student } from "@/lib/oop/Student";

type SortField = 'name' | 'student_id' | 'semester';
type SortDirection = 'asc' | 'desc';

/**
 * Insertion Sort Algorithm
 * Time Complexity: O(n^2)
 * Space Complexity: O(1)
 */
export function insertionSort(students: Student[], field: SortField, direction: SortDirection = 'asc'): Student[] {
  const arr = [...students]; 
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && compare(arr[j], key, field, direction) > 0) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

/**
 * Merge Sort Algorithm
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
export function mergeSort(students: Student[], field: SortField, direction: SortDirection = 'asc'): Student[] {
  if (students.length <= 1) return students;

  const mid = Math.floor(students.length / 2);
  const left = mergeSort(students.slice(0, mid), field, direction);
  const right = mergeSort(students.slice(mid), field, direction);

  return merge(left, right, field, direction);
}

function merge(left: Student[], right: Student[], field: SortField, direction: SortDirection): Student[] {
  let resultArray = [], leftIndex = 0, rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex], field, direction) <= 0) {
      resultArray.push(left[leftIndex]);
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return resultArray
          .concat(left.slice(leftIndex))
          .concat(right.slice(rightIndex));
}

/**
 * Shell Sort Algorithm
 * Time Complexity: O(n log n) to O(n^2) depending on gap sequence
 * Space Complexity: O(1)
 */
export function shellSort(students: Student[], field: SortField, direction: SortDirection = 'asc'): Student[] {
    const arr = [...students];
    let n = arr.length;
    
    // Start with a big gap, then reduce the gap
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // Do a gapped insertion sort for this gap size.
        for (let i = gap; i < n; i += 1) {
            let temp = arr[i];
            
            let j;
            for (j = i; j >= gap && compare(arr[j - gap], temp, field, direction) > 0; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
    return arr;
}

// Helper to compare students based on field and direction
function compare(a: Student, b: Student, field: SortField, direction: SortDirection): number {
  const valA = (a as any)[field];
  const valB = (b as any)[field];

  let result = 0;
  if (typeof valA === 'string' && typeof valB === 'string') {
    result = valA.localeCompare(valB);
  } else {
    if (valA < valB) result = -1;
    else if (valA > valB) result = 1;
  }

  return direction === 'asc' ? result : -result;
}
