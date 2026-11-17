import { memo } from 'react';
import { BookOpen, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MenuItem { label: string; href: string; children?: MenuItem[] }

function containsPath(item: MenuItem, pathname: string): boolean {
  return item.href === pathname || (item.children?.some(child => containsPath(child, pathname)) ?? false);
}

export function activeBranch(items: MenuItem[], pathname: string): number[] {
  const index = items.findIndex(item => item.children && containsPath(item, pathname));
  const item = items[index];
  return item?.children ? [index, ...activeBranch(item.children, pathname)] : [];
}

interface NavTreeProps {
  items: MenuItem[];
  pathname: string;
  openPath: number[];
  branchPath?: number[];
  onToggle: (path: number[]) => void;
  onNavigate: () => void;
}

export const NavTree = memo(function NavTree({ items, pathname, openPath, branchPath = [], onToggle, onNavigate }: NavTreeProps) {
  const depth = branchPath.length;
  return <ul className={`library-menu-list library-menu-depth-${Math.min(depth, 3)}`}>
    {items.map((item, index) => <MenuEntry key={`${item.href}-${index}`} item={item} pathname={pathname} openPath={openPath} branchPath={[...branchPath, index]} onToggle={onToggle} onNavigate={onNavigate} />)}
  </ul>;
});

function MenuEntry({ item, pathname, openPath, branchPath, onToggle, onNavigate }: Omit<NavTreeProps, 'items' | 'branchPath'> & { item: MenuItem; branchPath: number[] }) {
  const depth = branchPath.length - 1;
  // Native disclosure: opens at 0ms without waiting for the app to load. openPath only seeds the initial state.
  const expanded = branchPath.every((index, level) => openPath[level] === index);
  return <li>
    {item.children ? <details className="library-menu-branch" data-native-dropdown name={`library-menu-${branchPath.slice(0, -1).join('-') || 'root'}`} open={expanded} suppressHydrationWarning>
      <summary className="library-menu-control" data-native-dropdown>
        {depth === 0 && <BookOpen aria-hidden="true" />}<span>{item.label}</span><ChevronRight className="library-menu-chevron" aria-hidden="true" />
      </summary>
      <NavTree items={item.children} pathname={pathname} openPath={openPath} branchPath={branchPath} onToggle={onToggle} onNavigate={onNavigate} />
    </details> : <Button asChild variant="source" size="source" className={`library-menu-control ${item.href === pathname ? 'library-menu-active' : ''}`}>
      <a href={item.href} onClick={onNavigate} aria-current={item.href === pathname ? 'page' : undefined} {...(item.href.endsWith('.apk') ? { download: true } : {})}>
        {depth === 0 && <Download aria-hidden="true" />}<span>{item.label}</span>
      </a>
    </Button>}
  </li>;
}
