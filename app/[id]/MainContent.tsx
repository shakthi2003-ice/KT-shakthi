// app/MainContent.tsx
export default function MainContent({
  groupedBlocks,
}: {
  groupedBlocks: JSX.Element[];
}) {
  return (
    <div className="flex flex-col md:flex-row pl-4 pr-4">
      <div className="flex flex-col h-full">
        <div className="w-full">{groupedBlocks}</div>
      </div>
    </div>
  );
}
