# Balanced Multi-Task Score (BMTS) Calculator

A lightweight browser-based tool to compute and compare multi-task learning models using:

- Mean performance
- Geometric mean
- Proposed BMTS metric (entropy-balanced score)

## Features
- Multi-model comparison
- Dynamic task selection
- Radar visualization
- CSV export
- Dark mode
- LaTeX export for papers

## Live Demo
Deploy using GitHub Pages.

## Metric
BMTS:
\[
\mathrm{BMTS}=\bar{s}\cdot\frac{H(\mathbf{s})}{\ln n}
\]

where:
- \( \bar{s} \) = mean task performance  
- \( H \) = normalized entropy of task distribution  
