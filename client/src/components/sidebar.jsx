import { Sidebar } from 'flowbite-react';
import { HiHome, HiInboxArrowDown, HiPaintBrush, HiPhoto, HiUser, HiCamera, HiUsers } from 'react-icons/hi2';

export default function Sidebar() {
    return (
        <Sidebar>
            <Sidebar.Logo>
                Artform
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiHome}>Home</Sidebar.Item>
                    <Sidebar.Item icon={HiPhoto}>Gallery</Sidebar.Item>
                    <Sidebar.Item icon={HiPaintBrush}>Commissions</Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiInboxArrowDown}>Queue</Sidebar.Item>
                    <Sidebar.Item icon={HiCamera}>Media</Sidebar.Item>
                    <Sidebar.Item icon={HiUsers}>Accounts</Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item icon={HiUser}>Profile</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};