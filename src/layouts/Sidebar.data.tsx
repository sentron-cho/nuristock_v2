import * as Icon from 'react-feather';
import { $url } from '@/request/paths';

export const SidebarMenus = [
	{
		title: 'Dashboards',
		href: $url.apps.dashboard,
		id: 1,
		icon: <Icon.Home />,
		line: false,
	},
	{
		title: 'Recent Project',
		href: $url.apps.recent,
		icon: <Icon.Clock />,
		id: 2,
		line: false,
	},
	{
		title: 'Favorites',
		href: $url.apps.favorite,
		icon: <Icon.Star />,
		id: 3,
		line: true,
	},
	{
		title: 'Library',
		href: $url.apps.library,
		icon: <Icon.Book />,
		id: 4,
		line: false,
	},
	{
		title: 'User Templates',
		href: $url.apps.template,
		icon: <Icon.Archive />,
		id: 5,
		line: false,
	},
	{
		title: 'Request',
		href: $url.apps.request,
		icon: <Icon.ShoppingBag />,
		id: 6,
		line: true,
	},
	{
		title: 'FAQ',
		href: $url.apps.faq,
		icon: <Icon.HelpCircle />,
		id: 7,
		line: false,
	},
	{
		title: 'Contact US',
		href: $url.apps.contact,
		icon: <Icon.Edit />,
		id: 8,
		line: false,
	},
	{
		title: 'Notification',
		href: $url.apps.notice,
		icon: <Icon.Bell />,
		id: 9,
		line: true,
	},
	{
		title: 'User Management',
		href: $url.apps.users,
		icon: <Icon.Users />,
		id: 10,
		line: false,
	},
	{
		title: 'Setting',
		href: $url.apps.setting,
		icon: <Icon.Settings />,
		id: 11,
		line: true,
	},
	{
		title: 'Terms Of Service',
		href: $url.apps.terms,
		id: 12,
		line: false,
	},
	{
		title: 'Privacy Policy',
		href: $url.apps.privacy,
		id: 13,
		line: false,
	},
	{
		title: 'Version 1.0.0',
		href: $url.apps.version,
		id: 14,
		line: false,
	},
];
