import marvinFontUrl from 'assets/Marvin.ttf';

let loaded = false;

export async function loadFonts(): Promise<void> {
  if (loaded) return;

  const fontName = 'Marvin400';

  try {
    const fontFace = new FontFace(fontName, `url(${marvinFontUrl})`, {
      style: 'normal',
      weight: '400'
    });

    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);

    loaded = true;
  } catch (err) {
    console.error('Fonts Failed to load Marvin400', err);
  }
}
