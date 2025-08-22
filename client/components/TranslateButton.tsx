"use client";

export default function TranslateButton({ lang }: { lang: string }) {
  const handleTranslate = () => {
    const selectField = document.querySelector(
      "select.goog-te-combo"
    ) as HTMLSelectElement;
    if (selectField) {
      selectField.value = lang;
      selectField.dispatchEvent(new Event("change"));
    }
  };

  return (
    <button
      onClick={handleTranslate}
      className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    >
      {lang.toUpperCase()}
    </button>
  );
}
