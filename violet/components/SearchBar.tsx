import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="hidden sm:flex items-center gap-2 rounded-md ring-1 ring-border px-2 py-1">
            <Search className="w-4 h-4 text-primary-foreground" />
            <input id="search" placeholder="Skin, Hair, ..." className="text-sm outline-0" />
        </div>
    )
}
