import { Link } from '@inertiajs/react';
import {
    CreditCard,
    GraduationCap,
    LayoutGrid,
    PlusCircle,
    Receipt,
    Tag,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as kelasIndex } from '@/routes/kelas';
import { create as pembayaranCreate, index as pembayaranIndex } from '@/routes/pembayaran-spp';
import { index as siswaIndex } from '@/routes/siswa';
import { index as sppIndex } from '@/routes/spp';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Transaksi SPP',
        href: pembayaranIndex(),
        icon: CreditCard,
    },
    {
        title: 'Entri Pembayaran',
        href: pembayaranCreate(),
        icon: PlusCircle,
    },
    {
        title: 'Master Siswa',
        href: siswaIndex(),
        icon: Users,
    },
    {
        title: 'Master Kelas',
        href: kelasIndex(),
        icon: GraduationCap,
    },
    {
        title: 'Tarif SPP',
        href: sppIndex(),
        icon: Tag,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Riwayat Pembayaran',
        href: pembayaranIndex(),
        icon: Receipt,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
