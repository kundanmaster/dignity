import { MdDashboard } from "react-icons/md";
import { MdCollectionsBookmark } from "react-icons/md";
import { MdOutlineTask } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { IoBarChart } from "react-icons/io5";
import { TbReportMoney } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";


export const menuData = [
  {
    label: 'Dashboard',
    icon: <MdDashboard />,
    href: '/admin/dashboard',
  },
  {
    label: 'Courses',
    icon: <MdCollectionsBookmark />,
    href: '#',
    submenu: [
      { sublabel: 'Manage Courses', href: '/admin/manage-courses' },
      { sublabel: 'Add New Course', href: '/admin/add-new-course' },
      { sublabel: 'Course Category', href: '/admin/course-category' },
      { sublabel: 'Coupons', href: '/admin/coupons' },
    ],
  },
  {
    label: 'Enrollment',
    icon: <MdOutlineTask />,
    href: '#',
    submenu: [
      // { sublabel: 'Course Enrollment', href: '/admin/course-enrollment' },
      { sublabel: 'Enrollment History', href: '/admin/enrollment-history' },
    ],
  },
  {
    label: 'Reports',
    icon: <TbReport />,
    href: '#',
    submenu: [
      { sublabel: 'Admin Revenue', href: '/admin/admin-revenue' },
      { sublabel: 'Instructor Revenue', href: '/admin/instructor-revenue' },
      { sublabel: 'Sells History', href: '/admin/purchase-history' },
    ],
  },
  {
    label: 'Users',
    icon: <FaUserAlt />,
    href: '#',
    submenu: [
      {
        sublabel: 'Admin',
        submenuNested: [
          { sublabel: 'Manage Admin', href: '/admin/manage-admin' },
          { sublabel: 'Add New Admin', href: '/admin/add-new-admin' },
        ],
      },
      {
        sublabel: 'Student',
        submenuNested: [
          { sublabel: 'Manage Student', href: '/admin/manage-student' },
          { sublabel: 'Add New Student', href: '/admin/add-new-student' },
        ],
      },
      {
        sublabel: 'Instructor',
        submenuNested: [
          { sublabel: 'Manage Instructor', href: '/admin/manage-instructor' },
          { sublabel: 'Add New Instructor', href: '/admin/add-new-instructor' },
        ],
      },
      // { sublabel: 'Instructor', href: '/admin/instructor' },
    ],
  },
  {
    label: 'Messages',
    icon: <MdMessage />,
    href: '/admin/messages',
  },
  {
    label: 'Settings',
    icon: <IoSettings />,
    href: '/admin/settings',
  },
];




export const InstructorData = [
  {
    label: 'Dashboard',
    icon: <MdDashboard />,
    href: '/instructor/dashboard',
  },
  {
    label: 'Schedules',
    icon: <IoSettings />,
    href: '/instructor/schedule-card',
  },
  {
    label: 'Manage course',
    icon: <MdCollectionsBookmark />,
    href: '/instructor/course-manage',
  },
  // {
  //   label: 'Sales report',
  //   icon: <IoBarChart />,
  //   href: '/instructor/sales-report',
  // },
  {
    label: 'Enroll Class',
    icon: <TbReportMoney />,
    href: '/instructor/enroll-class',
  },
  
  {
    label: 'Messages',
    icon: <MdMessage />,
    href: '/instructor/messages',
  },
  {
    label: 'Manage Profile',
    icon: <FaUserEdit />,
    href: '/instructor/manage-profile',
  },
];
