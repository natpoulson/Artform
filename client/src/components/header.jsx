/* eslint-disable react/jsx-key */
import { Navbar, Dropdown } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';

// import { HiHome, HiInboxArrowDown, HiPaintBrush, HiPhoto, HiUser, HiCamera, HiUsers } from 'react-icons/hi2';

export default function Header() {
    const currentPage = useLocation().pathname;

    const topLinks = [
        { path: '/', text: 'About' },
        { path: '/gallery', text: 'Gallery' }
    ];

    const dropdownLinks = [
        { path: '/profile', text: 'My Profile' },
        { path: '/commissions', text: 'Commissions' },
        { path: '/settings', text: 'Settings' }
    ];

    return (
        <Navbar fluid rounded>
            <Navbar.Brand>
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Artform</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                arrowIcon={true}
                inline
                label={
                    <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                }
                >
                <Dropdown.Header>
                    <span className="block text-sm">Bonnie Green</span>
                    <span className="block truncate text-sm font-medium">Amount Owing: $25</span>
                </Dropdown.Header>
                    {dropdownLinks.map(link => (
                        <Dropdown.Item active={currentPage === link.path}>
                            <Link to={link.path}>{link.text}</Link>
                        </Dropdown.Item>
                    ))}
                <Dropdown.Divider />
                <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                {topLinks.map(link => (
                    <Navbar.Link active={currentPage === link.path}>
                        <Link to={link.path}>{link.text}</Link>
                    </Navbar.Link>
                    ))}
            </Navbar.Collapse>
        </Navbar>
    );
}