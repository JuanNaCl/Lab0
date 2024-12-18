import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoSectionProps {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    align?: 'left' | 'right';
}

export function InfoSection({ icon: Icon, title, children, align = 'left' }: InfoSectionProps) {
    return (
        <section className={`py-12 scroll-fade ${align === 'right' ? 'ml-auto' : ''}`}>
            <div className={`max-w-2xl ${align === 'right' ? 'ml-auto' : ''}`}>
                <div className={`flex items-center space-x-3 mb-8 ${align === 'right' ? 'justify-end' : ''}`}>
                    <Icon className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-3xl font-light text-gray-800">{title}</h2>
                </div>
                <div className="hover:transform hover:scale-102 transition-all duration-300">
                    {children}
                </div>
            </div>
        </section>
    );
}