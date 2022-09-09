# Weird Vue Hydration Bug Reproduction

1. `npm install`.
2. `npm run dev`.
3. Go to `/`. Open devtools.
4. Note the hydration error.
5. Comment the "WTF" element in `src/App.vue` on line 6.
6. Refresh the page.
7. Note that the hydration error is gone.
8. WTF.
