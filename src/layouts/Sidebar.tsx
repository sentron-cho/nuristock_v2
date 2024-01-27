import { Nav, NavItem } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { NavLink } from 'react-router-dom';
import { SidebarMenus } from './Sidebar.data';

const Sidebar = () => {
	return (
		<div className={`sidebarBox shadow bg-white fixedSidebar`}>
			<SimpleBar style={{ height: '100%' }}>
				<div className='p-3'>
					<Nav vertical className={''}>
						{SidebarMenus.map((navi) => {
							return (
								<NavItem
									key={navi.id}
									className={
										location.pathname === navi.href ? 'activeLink' : ''
									}
								>
									<NavLink to={navi.href} className='gap-3 nav-link'>
										<span className='sidebarIcon d-flex align-items-center'>
											{navi.icon}
										</span>
										<span className='hide-mini w-100'>
											<div className='d-flex align-items-center'>
												<span>{navi.title}</span>
											</div>
										</span>
									</NavLink>
									{navi.line && <div className='nav-line' />}
								</NavItem>
							);
						})}
					</Nav>
				</div>
			</SimpleBar>
		</div>
	);
};

export default Sidebar;
