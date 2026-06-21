---
name: ref-remotion
description: Reference for Remotion — create videos programmatically in React (MP4/GIF) via components, frames, and a render pipeline. Use when generating or automating video with code/React.
---
# Remotion (reference)
Make real videos using React components; each frame is rendered deterministically.
- **Install:** `npm create video@latest` (scaffold) · preview: `npx remotion studio` · render: `npx remotion render <Composition> out.mp4`.
- **Core:** `<Composition>` defines fps/duration/size; use `useCurrentFrame()` + `interpolate()`/`spring()` for animation; data-driven via props.
- **Use when:** programmatic/templated video, data videos, or automated rendering pipelines.
