interface Props {
  isMobile: boolean;
  openSidebar: () => void;
}

export default function Header({ isMobile, openSidebar }: Props) {
  return (
    <header className="flex items-center justify-between bg-red-600 text-white px-4 py-3 shadow-md">
      {isMobile && (
        <button onClick={openSidebar}>
          <img
            src="/assets/img/icons/menu.svg"
            className="h-6 w-6"
            alt="Menu"
          />
        </button>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold">location dropdown</div>
        <div className="text-lg font-semibold">User</div>
      </div>
    </header>
  );
}
