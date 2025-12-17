
# Algorithm Complexity Analysis

## Search Algorithms

### Linear Search (Sequential Search)
- **Time Complexity**: O(n)
  - Best Case: O(1) (Found at first index)
  - Worst Case: O(n) (Not found or at last index)
  - Average Case: O(n/2) -> O(n)
- **Space Complexity**: O(1) (Iterative approach)
- **Usage**: Used when the list is unsorted or small.

### Binary Search
- **Time Complexity**: O(log n)
  - Best Case: O(1) (Found at middle)
  - Worst Case: O(log n)
- **Space Complexity**: O(1) (Iterative) or O(log n) (Recursive stack)
- **Pre-requisite**: List must be sorted.
- **Usage**: Highly efficient for large, sorted datasets.

---

## Sort Algorithms

### Insertion Sort
- **Time Complexity**: O(n^2)
  - Best Case: O(n) (Already sorted)
  - Worst Case: O(n^2) (Reverse sorted)
- **Space Complexity**: O(1) (In-place sort)
- **Stability**: Stable.
- **Usage**: Efficient for small data sets or nearly sorted data.

### Merge Sort
- **Time Complexity**: O(n log n)
  - Consistent across Best, Average, and Worst cases.
- **Space Complexity**: O(n) (Requires auxiliary array)
- **Stability**: Stable.
- **Usage**: Efficient for large datasets; consistent performance but higher memory usage.

---

## Import/Export Operations

### JSON Import
- **Complexity**: O(n) where n is the number of records in the JSON file.
- **Validation**: Zod validation adds constant factor overhead per item O(k).
- **Total**: O(n).

### JSON Export
- **Complexity**: O(n).
- **Serialization**: `JSON.stringify` iterates over all items.
