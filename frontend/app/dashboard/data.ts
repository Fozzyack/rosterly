import { formatHours, shiftHours, type Employee, type Role, type Shift } from "@/lib/roster";

export { formatHours, shiftHours, type Employee, type Role, type Shift };

type RoleColor = { chip: string; dot: string };

export const ROLE_COLORS: Record<string, RoleColor> = {
  Manager: { chip: "bg-[#d9ff57]/50 border-[#b8dd3e]", dot: "bg-[#9dc41e]" },
  Barista: { chip: "bg-[#dbe7fe] border-[#a8c3f5]", dot: "bg-[#5b8def]" },
  Chef: { chip: "bg-[#fde2cf] border-[#f4b98a]", dot: "bg-[#e8823c]" },
  Server: { chip: "bg-[#e9dcfd] border-[#cfb2f5]", dot: "bg-[#9a6ae8]" },
  Cleaner: { chip: "bg-[#d6f3e6] border-[#9fdcbe]", dot: "bg-[#3da87a]" },
};

const neutralRoleColor: RoleColor = { chip: "bg-[#eef0e6] border-[#cfd5c6]", dot: "bg-[#8b9585]" };

export function roleColor(role: Role): RoleColor {
  return ROLE_COLORS[role] ?? neutralRoleColor;
}
