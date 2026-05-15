document.addEventListener('DOMContentLoaded', () => {
  const roadmap = {
    Arrays: [
      ['Two Sum', 'Easy', 'Hash lookup fundamentals', 'https://leetcode.com/problems/two-sum/'],
      ['Best Time to Buy and Sell Stock', 'Easy', 'Running state optimization', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'],
      ['Contains Duplicate', 'Easy', 'Set-based deduplication', 'https://leetcode.com/problems/contains-duplicate/'],
      ['Maximum Subarray', 'Medium', "Kadane's algorithm", 'https://leetcode.com/problems/maximum-subarray/'],
      ['Product of Array Except Self', 'Medium', 'Prefix/suffix decomposition', 'https://leetcode.com/problems/product-of-array-except-self/'],
      ['Rotate Array', 'Medium', 'In-place transformation', 'https://leetcode.com/problems/rotate-array/'],
      ['Merge Sorted Array', 'Easy', 'Backward pointer writing', 'https://leetcode.com/problems/merge-sorted-array/'],
      ['Container With Most Water', 'Medium', 'Greedy elimination', 'https://leetcode.com/problems/container-with-most-water/'],
      ['Majority Element', 'Easy', 'Boyer-Moore voting', 'https://leetcode.com/problems/majority-element/'],
      ['Sort Colors', 'Medium', 'Dutch National Flag', 'https://leetcode.com/problems/sort-colors/'],
      ['First Missing Positive', 'Hard', 'Index-as-hash pattern', 'https://leetcode.com/problems/first-missing-positive/'],
      ['Trapping Rain Water', 'Hard', 'Prefix + two-pointer optimization', 'https://leetcode.com/problems/trapping-rain-water/'],
      ['Candy', 'Hard', 'Bidirectional greedy constraints', 'https://leetcode.com/problems/candy/'],
      ['Jump Game II', 'Medium', 'Greedy boundary expansion', 'https://leetcode.com/problems/jump-game-ii/'],
      ['Maximum Product Subarray', 'Medium', 'Negative state tracking', 'https://leetcode.com/problems/maximum-product-subarray/'],
    ],
    'Sliding Window': [
      ['Maximum Average Subarray I', 'Easy', 'Fixed-size windows', 'https://leetcode.com/problems/maximum-average-subarray-i/'],
      ['Find All Anagrams in a String', 'Medium', 'Frequency-map sliding', 'https://leetcode.com/problems/find-all-anagrams-in-a-string/'],
      ['Longest Substring Without Repeating Characters', 'Medium', 'Expand-shrink invariant', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'],
      ['Permutation in String', 'Medium', 'Window equivalence', 'https://leetcode.com/problems/permutation-in-string/'],
      ['Minimum Size Subarray Sum', 'Medium', 'Dynamic shrinking', 'https://leetcode.com/problems/minimum-size-subarray-sum/'],
      ['Longest Repeating Character Replacement', 'Medium', 'Lazy validity windows', 'https://leetcode.com/problems/longest-repeating-character-replacement/'],
      ['Fruit Into Baskets', 'Medium', 'At-most-K distinct pattern', 'https://leetcode.com/problems/fruit-into-baskets/'],
      ['Sliding Window Maximum', 'Hard', 'Monotonic deque', 'https://leetcode.com/problems/sliding-window-maximum/'],
      ['Subarrays with K Different Integers', 'Hard', 'Inclusion-exclusion counting', 'https://leetcode.com/problems/subarrays-with-k-different-integers/'],
      ['Minimum Window Substring', 'Hard', 'Multi-condition shrinking', 'https://leetcode.com/problems/minimum-window-substring/'],
    ],
    'Two Pointers': [
      ['Valid Palindrome', 'Easy', 'Symmetric traversal', 'https://leetcode.com/problems/valid-palindrome/'],
      ['Two Sum II', 'Easy', 'Sorted elimination', 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'],
      ['Remove Duplicates from Sorted Array', 'Easy', 'Slow-fast pointers', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'],
      ['Move Zeroes', 'Easy', 'Stable movement', 'https://leetcode.com/problems/move-zeroes/'],
      ['Squares of a Sorted Array', 'Easy', 'Bidirectional merge', 'https://leetcode.com/problems/squares-of-a-sorted-array/'],
      ['3Sum', 'Medium', 'Deduplication + search', 'https://leetcode.com/problems/3sum/'],
      ['4Sum', 'Medium', 'Generalized k-sum', 'https://leetcode.com/problems/4sum/'],
      ['Sort Colors', 'Medium', 'Multi-pointer partitioning', 'https://leetcode.com/problems/sort-colors/'],
      ['Backspace String Compare', 'Medium', 'Reverse traversal', 'https://leetcode.com/problems/backspace-string-compare/'],
      ['Trapping Rain Water', 'Hard', 'Bidirectional accumulation', 'https://leetcode.com/problems/trapping-rain-water/'],
    ],
    'Binary Search': [
      ['Binary Search', 'Easy', 'Invariant mastery', 'https://leetcode.com/problems/binary-search/'],
      ['Search Insert Position', 'Easy', 'Boundary reasoning', 'https://leetcode.com/problems/search-insert-position/'],
      ['First Bad Version', 'Easy', 'Monotonic predicate', 'https://leetcode.com/problems/first-bad-version/'],
      ['Find Peak Element', 'Medium', 'Directional elimination', 'https://leetcode.com/problems/find-peak-element/'],
      ['Search in Rotated Sorted Array', 'Medium', 'Partition reasoning', 'https://leetcode.com/problems/search-in-rotated-sorted-array/'],
      ['Find Minimum in Rotated Sorted Array', 'Medium', 'Pivot search', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'],
      ['Koko Eating Bananas', 'Medium', 'Search on answer', 'https://leetcode.com/problems/koko-eating-bananas/'],
      ['Capacity To Ship Packages Within D Days', 'Medium', 'Feasibility search', 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/'],
      ['Split Array Largest Sum', 'Hard', 'Optimization via binary search', 'https://leetcode.com/problems/split-array-largest-sum/'],
      ['Median of Two Sorted Arrays', 'Hard', 'Partition mathematics', 'https://leetcode.com/problems/median-of-two-sorted-arrays/'],
    ],
    Stack: [
      ['Valid Parentheses', 'Easy', 'Stack fundamentals', 'https://leetcode.com/problems/valid-parentheses/'],
      ['Min Stack', 'Medium', 'Auxiliary state', 'https://leetcode.com/problems/min-stack/'],
      ['Evaluate Reverse Polish Notation', 'Medium', 'Expression evaluation', 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'],
      ['Daily Temperatures', 'Medium', 'Monotonic stack', 'https://leetcode.com/problems/daily-temperatures/'],
      ['Next Greater Element I', 'Easy', 'Deferred computation', 'https://leetcode.com/problems/next-greater-element-i/'],
      ['Largest Rectangle in Histogram', 'Hard', 'Boundary discovery', 'https://leetcode.com/problems/largest-rectangle-in-histogram/'],
      ['Basic Calculator II', 'Medium', 'Operator precedence', 'https://leetcode.com/problems/basic-calculator-ii/'],
      ['Decode String', 'Medium', 'Nested state tracking', 'https://leetcode.com/problems/decode-string/'],
      ['Asteroid Collision', 'Medium', 'Simulation rollback', 'https://leetcode.com/problems/asteroid-collision/'],
      ['Remove K Digits', 'Medium', 'Greedy monotonicity', 'https://leetcode.com/problems/remove-k-digits/'],
    ],
    'Queue / Monotonic Queue': [
      ['Implement Queue Using Stacks', 'Easy', 'Queue simulation', 'https://leetcode.com/problems/implement-queue-using-stacks/'],
      ['Number of Recent Calls', 'Easy', 'Rolling window queue', 'https://leetcode.com/problems/number-of-recent-calls/'],
      ['Design Circular Queue', 'Medium', 'Ring buffer reasoning', 'https://leetcode.com/problems/design-circular-queue/'],
      ['Dota2 Senate', 'Medium', 'Cyclic queue processing', 'https://leetcode.com/problems/dota2-senate/'],
      ['Rotting Oranges', 'Medium', 'BFS queue traversal', 'https://leetcode.com/problems/rotting-oranges/'],
      ['Sliding Window Maximum', 'Hard', 'Monotonic deque', 'https://leetcode.com/problems/sliding-window-maximum/'],
      ['Jump Game VI', 'Hard', 'DP + deque optimization', 'https://leetcode.com/problems/jump-game-vi/'],
      ['Shortest Subarray with Sum at Least K', 'Hard', 'Prefix + deque', 'https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/'],
      ['Open the Lock', 'Medium', 'BFS state exploration', 'https://leetcode.com/problems/open-the-lock/'],
      ['Task Scheduler', 'Medium', 'Queue + greedy scheduling', 'https://leetcode.com/problems/task-scheduler/'],
    ],
  };

  const content = document.getElementById('content');
  const chips = document.querySelectorAll('.filter-chip');
  const searchInput = document.getElementById('searchInput');
  const totals = {
    count: document.getElementById('questionCount'),
    medium: document.getElementById('mediumCount'),
    hard: document.getElementById('hardCount'),
  };

  let selectedDifficulty = 'All';

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    content.innerHTML = '';

    let total = 0;
    let medium = 0;
    let hard = 0;

    Object.entries(roadmap).forEach(([category, problems]) => {
      const filtered = problems.filter(([title, difficulty, note]) => {
        const matchesDifficulty = selectedDifficulty === 'All' || difficulty === selectedDifficulty;
        const matchesSearch = query === '' || [title, note, category].some(text => text.toLowerCase().includes(query));
        return matchesDifficulty && matchesSearch;
      });

      if (!filtered.length) return;

      total += filtered.length;
      medium += filtered.filter(([, difficulty]) => difficulty === 'Medium').length;
      hard += filtered.filter(([, difficulty]) => difficulty === 'Hard').length;

      const section = document.createElement('div');
      section.className = 'category-section';
      section.id = category.replace(/\s+/g, '-');

      section.innerHTML = `
        <div class="category-header">
          <h2>${category}</h2>
          <span class="question-count">${filtered.length} Questions</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Problem</th>
              <th>Difficulty</th>
              <th>Why It Matters</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((problem, index) => {
              const [title, difficulty, reason, url] = problem;
              const label = url.includes('leetcode') ? 'LeetCode' : url.includes('geeksforgeeks') ? 'GeeksForGeeks' : 'Open Link';
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td><strong>${title}</strong></td>
                  <td><span class="badge ${difficulty.toLowerCase()}">${difficulty}</span></td>
                  <td>${reason}</td>
                  <td><a class="open-btn" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;

      content.appendChild(section);
    });

    totals.count.textContent = total;
    totals.medium.textContent = medium;
    totals.hard.textContent = hard;
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(node => node.classList.remove('active'));
      chip.classList.add('active');
      selectedDifficulty = chip.dataset.difficulty;
      render();
    });
  });

  searchInput.addEventListener('input', render);
  render();
});
