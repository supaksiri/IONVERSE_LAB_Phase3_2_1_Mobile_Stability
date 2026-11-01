# IONVERSE LAB Phase 3.2.1 — Mobile Stability Fix

## Changes
- Mobile and touch devices now use a built-in, independently animated SVG lab; no Three.js, CDN or WebGL dependency for the primary mobile experiment.
- Tap apparatus directly: sample/beaker prepares 4 mL, electrodes submerge, lamp switches power, battery connects circuit, rinse station cleans electrodes.
- Original chemistry engine, 12 chemicals, tests, notebook, comparison and challenge retained.
- Desktop progressively tries the original 3D scene. Failure automatically retains functional animated SVG lab, rather than a blocking message.
- Responsive header uses horizontally scrolling navigation, a single-column laboratory-first layout, and does not apply CSS transform scale to the lab.
- Mobile SVG shows conductivity-dependent lamp glow and updates with the same experiment state.

## Deployment
Upload **the contents of this directory** to the root of a new GitHub Pages repository, or replace files in the previous repo. Include all files under `src` and `tests`. Root must contain index.html.

## Limitations
The mobile view is an animated vector laboratory, not WebGL 3D. High-realism 3D still requires Three.js CDN on desktops. No physical mobile Safari device browser was available for end-to-end verification, so test on the target iPhone and use the built-in controls. The conductivity output remains an idealized educational approximation.

## Validation
Run `npm test` with Node.js. Preview via a local HTTP server rather than `file://` because JavaScript ES modules are used.
