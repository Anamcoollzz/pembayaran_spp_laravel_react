import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    className?: string;
};

export default function PaginationLinks({ links, className }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-1', className)}>
            {links.map((link, key) => {
                const label = link.label
                    .replace('&laquo; Previous', '« Sebelumnya')
                    .replace('Next &raquo;', 'Selanjutnya »')
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»');

                if (link.url === null) {
                    return (
                        <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            disabled
                            className="opacity-50"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Button
                        key={key}
                        asChild
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                    >
                        <Link
                            href={link.url}
                            preserveScroll
                            preserveState
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    </Button>
                );
            })}
        </div>
    );
}
