/*
  PROJECT AURA — MEDIA CONFIGURATION

  PHOTOS: Add entries to `photos`; category is 'making' or 'prototype'.
  EXPERT VIDEO: When supplied, set expertVideo to ONE of these forms:
    { type: 'file', url: 'assets/media/expert-meet.mp4', title: 'AURA expert conversation' }
    { type: 'youtube', url: 'https://www.youtube.com/watch?v=VIDEO_ID', title: 'AURA expert conversation' }
  PROJECT VIDEO: Use the same format for `video` if a build walkthrough is supplied.

  The website includes privacy-edited letter scans and a combined PDF. Direct
  contacts/signatures are masked; no unredacted original has been copied here.
  The owner has confirmed permission to use the letters and checked their dates.
  Review any separate permissions for photos and logos before publishing.
  No expert or walkthrough video has been supplied yet.
*/
window.AURA_CONTENT = {
  photos: [
    { category: 'making', src: 'assets/media/circuit-04.webp', title: 'Hands-on electronics', caption: 'Assembling the prototype circuit.', alt: 'Armaan soldering an electronics board at the workbench.' },
    { category: 'making', src: 'assets/media/printing-05.webp', title: 'Printing the enclosure', caption: 'The orange wearable housing takes shape.', alt: 'A 3D printer producing an orange AURA enclosure.' },
    { category: 'making', src: 'assets/media/design-02.webp', title: 'Planning the connections', caption: 'Working through the circuit layout.', alt: 'Armaan examining a circuit diagram beside a workbench.' },
    { category: 'making', src: 'assets/media/coding-03.webp', title: 'Bringing it to life', caption: 'Programming and testing at the workbench.', alt: 'Armaan using a laptop beside the electronics prototype.' },
    { category: 'making', src: 'assets/media/workbench-01.webp', title: 'Learning by making', caption: 'A closer look at the electronics work.', alt: 'Armaan working on electronics at a bench.' },
    { category: 'making', src: 'assets/media/enclosure-06.webp', title: 'Building the details', caption: 'Preparing a component for the project.', alt: 'Armaan working with a drill at a bench.' },
    { category: 'prototype', src: 'assets/media/prototype-closeup.webp', title: 'AURA up close', caption: 'The display, touch control and orange housing.', alt: 'Close-up of the orange AURA prototype.' },
    { category: 'prototype', src: 'assets/media/prototype-test.webp', title: 'Prototype on the bench', caption: 'Exploring how the wearable responds.', alt: 'The AURA prototype on a workbench near a handheld light.' }
  ],
  video: null,
  expertVideo: null,
  documents: []
};
