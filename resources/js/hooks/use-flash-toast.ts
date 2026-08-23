import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type PagePropsWithFlash = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};

export function useFlashToast() {
    let flash: PagePropsWithFlash['flash'] = undefined;

    try {
        const page = usePage<PagePropsWithFlash>();
        flash = page?.props?.flash;
    } catch {
        flash = undefined;
    }

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
}
