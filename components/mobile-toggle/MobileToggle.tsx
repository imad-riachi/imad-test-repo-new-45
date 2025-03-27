'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardNav from '@/components/dashboard-nav';

export type MobileToggleProps = {};

const MobileToggle: React.FC<MobileToggleProps> = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='md:hidden' size='icon'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mt-2 w-56' align='start'>
        <div className='px-2 py-2'>
          <DashboardNav className='flex flex-col space-y-1' />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileToggle;
